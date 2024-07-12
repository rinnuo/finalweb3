from rest_framework import serializers, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


from ..models import Station
from .permissions import IsAdminRole


class StationSerializer(serializers.ModelSerializer):
  class Meta:
    model = Station
    fields = ['id', 'name', 'latitude', 'longitude']
    read_only_fields = ['id']
    
class StationViewSet(viewsets.ModelViewSet):
  queryset = Station.objects.all()
  serializer_class = StationSerializer
  permission_classes = [IsAuthenticated]
  
  def get_permissions(self):
    if self.action in ['create', 'update', 'destroy', 'list']:
      self.permission_classes = [IsAuthenticated, IsAdminRole]
    return super().get_permissions()
  
  def get_object(self):
      queryset = self.get_queryset()
      obj = queryset.get(id=self.kwargs['pk'])
      self.check_object_permissions(self.request, obj)
      return obj
  
  def create(self, request, *args, **kwargs):
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=status.HTTP_201_CREATED)
    
  def update(self, request, *args, **kwargs):
    instance = self.get_object()
    serializer = self.get_serializer(instance, data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)
  
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

