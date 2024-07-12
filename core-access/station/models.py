from django.db import models
from django.apps import apps


class StationFuelBalance(models.Model):
    station = models.ForeignKey('access.Station', on_delete=models.CASCADE)
    fuel_type = models.ForeignKey('refinery.FuelType', on_delete=models.CASCADE)
    balance = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.station.name} - {self.fuel_type.name}: {self.balance} liters"


class Pump(models.Model):
    code = models.CharField(max_length=50)
    station = models.ForeignKey('access.Station', on_delete=models.CASCADE)
    fuel_type = models.ForeignKey('refinery.FuelType', on_delete=models.CASCADE)

    def __str__(self):
        return f"Pump {self.code} at Station {self.station.name} dispensing {self.fuel_type.name}"


class Sale(models.Model):
    seller = models.ForeignKey('access.Member', on_delete=models.CASCADE)
    invoice_name = models.CharField(max_length=255)
    invoice_nit = models.CharField(max_length=50)
    customer_email = models.EmailField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    current_product_price = models.DecimalField(
        max_digits=10, decimal_places=2)
    product_quantity = models.DecimalField(max_digits=10, decimal_places=2)
    product_type = models.ForeignKey('refinery.FuelType', on_delete=models.CASCADE)
    pump_used = models.ForeignKey(Pump, on_delete=models.CASCADE)
    date_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Sale by {self.seller.user.username} at Pump {self.pump_used.code}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update fuel balance
        station_fuel_balance = StationFuelBalance.objects.get(
            station=self.pump_used.station,
            fuel_type=self.product_type
        )
        station_fuel_balance.balance -= self.product_quantity
        station_fuel_balance.save()
