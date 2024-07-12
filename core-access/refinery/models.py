from django.db import models
from access.models import Member, Station
from station.models import StationFuelBalance


class FuelType(models.Model):
  name = models.CharField(max_length=50)

  def __str__(self):
    return self.name


class Truck(models.Model):
  code = models.CharField(max_length=50)
  driver = models.OneToOneField(
    Member, on_delete=models.SET_NULL, null=True, blank=True)

  def __str__(self):
    return f"Truck {self.code} driven by {self.driver.user.username if self.driver else 'No driver assigned'}"


class Route(models.Model):
  date = models.DateField()
  name = models.CharField(max_length=255)
  truck = models.ForeignKey(Truck, on_delete=models.CASCADE)
  fuel_type = models.ForeignKey(FuelType, on_delete=models.CASCADE)
  price_per_liter = models.DecimalField(max_digits=10, decimal_places=2)

  def __str__(self):
    return f"Route {self.name} on {self.date} by Truck {self.truck.code} delivering {self.fuel_type.name}"


class RouteStop(models.Model):
  route = models.ForeignKey(
    Route, related_name='stops', on_delete=models.CASCADE)
  station = models.ForeignKey(Station, on_delete=models.CASCADE)
  liters = models.DecimalField(max_digits=10, decimal_places=2)

  def __str__(self):
    return f"{self.liters} liters to {self.station.name} on {self.route.name}"

  def save(self, *args, **kwargs):
    super().save(*args, **kwargs)
    station_fuel_balance, created = StationFuelBalance.objects.get_or_create(
      station=self.station,
      fuel_type=self.route.fuel_type,
      defaults={'balance': 0}
    )
    station_fuel_balance.balance += self.liters
    station_fuel_balance.save()
