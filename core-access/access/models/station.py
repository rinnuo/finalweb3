from django.db import models

class Station(models.Model):
  name = models.CharField(max_length=255)
  latitude = models.DecimalField(max_digits=9, decimal_places=6)
  longitude = models.DecimalField(max_digits=9, decimal_places=6)
  
  def __str__(self):
    return self.name