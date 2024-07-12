from django.contrib.auth.models import User
from django.db import models
from .station import Station

class Member(models.Model):
  user = models.OneToOneField(User, on_delete=models.CASCADE)
  role = models.CharField(max_length=50)
  station = models.ForeignKey(Station, on_delete=models.SET_NULL, null=True, blank=True)
  
  def __str__(self):
    if self.station:
      return f"{self.user.username}, {self.user.first_name} {self.user.last_name} - {self.role} at Station: {self.station.id}|{self.station.name}"
    else:
      return f"{self.user.username}, {self.user.first_name} {self.user.last_name} - {self.role}"
