# transport_api/serializers.py
from rest_framework import serializers
from .models import User, Station, Journey, Booking
from django.contrib.auth import authenticate

class UserRegistrationSerializer(serializers.Serializer):  # Serializer (1/2)
    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    #phone = serializers.CharField()

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            #phone=validated_data['phone']
        )
        return user

class LoginSerializer(serializers.Serializer):  # Serializer (2/2)
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")

class StationSerializer(serializers.ModelSerializer):  # ModelSerializer (1/2)
    class Meta:
        model = Station
        fields = '__all__'

class JourneySerializer(serializers.ModelSerializer):
    departure_station = StationSerializer()
    arrival_station = StationSerializer()
    
    class Meta:
        model = Journey
        fields = '__all__'
class JourneyCreateSerializer(serializers.ModelSerializer):
    departure_station = serializers.PrimaryKeyRelatedField(queryset=Station.objects.all())
    arrival_station = serializers.PrimaryKeyRelatedField(queryset=Station.objects.all())

    class Meta:
        model = Journey
        fields = '__all__' 

class BookingSerializer(serializers.ModelSerializer):
    journey = JourneySerializer()

    class Meta:
        model = Booking
        fields = '__all__'


class BookingPostSerializer(serializers.ModelSerializer):
    journey = serializers.PrimaryKeyRelatedField(queryset=Journey.objects.all())

    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ('user', 'total_price')

    def create(self, validated_data):
        journey = validated_data['journey']  # Already a Journey instance 
        validated_data['total_price'] = journey.price * validated_data['seats']
        booking = Booking.objects.create(**validated_data)
        return booking