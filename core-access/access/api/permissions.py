from rest_framework.permissions import BasePermission

class IsAdminRole(BasePermission):
  def has_permission(self, request, view):
    return request.user and hasattr(request.user, 'member') and request.user.member.role == 'Admin'
