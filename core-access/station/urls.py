from django.urls import path, include
from rest_framework import routers

from station.api import StationManagerViewSet

router = routers.DefaultRouter()
router.register(r'station-manager', StationManagerViewSet, basename='station-manager')

urlpatterns = [
		path('', include(router.urls)),
]
