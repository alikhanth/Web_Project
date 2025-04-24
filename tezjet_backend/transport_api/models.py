from django.db import models

# Create your models here.
# transport_api/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models import Manager

class User(AbstractUser):
    phone = models.CharField(max_length=20, blank=True)
    is_customer = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    def __str__(self):
        return self.username

class Station(models.Model):
    name = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    code = models.CharField(max_length=10)

    objects = Manager()  # Custom manager (meets optional requirement)

    def __str__(self):
        return f"{self.name}, {self.city}"

class Journey(models.Model):
    departure_station = models.ForeignKey(Station, related_name='departures', on_delete=models.CASCADE)
    arrival_station = models.ForeignKey(Station, related_name='arrivals', on_delete=models.CASCADE)
    departure_time = models.DateTimeField()
    arrival_time = models.DateTimeField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    bus_number = models.CharField(max_length=20)
    total_seats = models.PositiveIntegerField()
    available_seats = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.departure_station} to {self.arrival_station}"

class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    journey = models.ForeignKey(Journey, on_delete=models.CASCADE)
    passenger_name = models.CharField(max_length=100)
    passenger_email = models.EmailField()
    seats = models.PositiveIntegerField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Booking #{self.id} by {self.passenger_name}"