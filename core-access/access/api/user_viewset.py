from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from rest_framework import serializers, viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ..models import Station, Member
from .permissions import IsAdminRole


class UserSerializer(serializers.ModelSerializer):
  role = serializers.CharField(source='member.role')
  station = serializers.PrimaryKeyRelatedField(queryset=Station.objects.all(), allow_null=True)
  password = serializers.CharField(write_only=True)
  
  class Meta:
    model = User
    fields = ['id', 'username', 'first_name', 'last_name', 'email', 'password', 'role', 'station']
    extra_kwargs = {
        'username': {'required': True},
        'email': {'required': True},
        'first_name': {'required': True},
        'last_name': {'required': True}
    }
    
  def create(self, validated_data):
    member_data = validated_data.pop('member', {})    
    password = validated_data.pop('password')
    hashed_password = make_password(password)
        
    user = User.objects.create(
      username=validated_data.get('username'),
      email=validated_data.get('email'),
      first_name=validated_data.get('first_name'),
      last_name=validated_data.get('last_name'),
      password=hashed_password
    )
    
    Member.objects.create(
      user=user,
      role=member_data.get('role'),
      station=member_data.get('station')
    )
    
    return user
  
  def update(self, instance, validated_data):
    member_data = validated_data.pop('member', {})
    role = member_data.get('role')
    station = member_data.get('station')

    instance = super().update(instance, validated_data)

    member = instance.member
    if role is not None:
      member.role = role
    if station is not None:
      member.station = station
    member.save()

    return instance
  
  
class UserViewSet(viewsets.ModelViewSet):
  queryset = User.objects.all()
  serializer_class = UserSerializer
  permission_classes = [IsAuthenticated]
  
  def get_permissions(self):
    if self.action in ['create', 'update', 'destroy', 'list']:
      self.permission_classes = [IsAuthenticated, IsAdminRole]
    elif self.action == 'get_user_info':
      self.permission_classes = [IsAuthenticated]
    return super().get_permissions()
  
  def get_object(self):
    queryset = self.get_queryset()
    obj = queryset.get(id=self.kwargs['pk'])
    self.check_object_permissions(self.request, obj)
    return obj
  
  def destroy(self, request, *args, **kwargs):
    instance = self.get_object()
    self.perform_destroy(instance)
    return Response(status=status.HTTP_204_NO_CONTENT)
  
  def list(self, request, *args, **kwargs):
    queryset = self.filter_queryset(self.get_queryset())
    page = self.paginate_queryset(queryset)
    if page is not None:
      serializer = self.get_serializer(page, many=True)
      return self.get_paginated_response(serializer.data)
    
    serializer = self.get_serializer(queryset, many=True)
    return Response(serializer.data)
  
  @action(detail=False, methods=['get'], url_path='me', url_name='me')
  def get_user_info(self, request):
      user = request.user
      serializer = self.get_serializer(user)
      return Response(serializer.data)