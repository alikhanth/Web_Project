from django.shortcuts import render

# Create your views here.
# transport_api/views.py 
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import logout
from .models import Station, Journey, Booking
from .serializers import (
    UserRegistrationSerializer, 
    LoginSerializer,
    StationSerializer,
    JourneySerializer, 
    BookingSerializer , 
    BookingPostSerializer,
    JourneyCreateSerializer
) 
from rest_framework.permissions import AllowAny

@api_view(['POST'])  
@permission_classes([AllowAny])
def register_user(request):
    if request.method == 'POST':
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)  
            return Response({
                'token': token.key,
                'user': {
                    'username': user.username,
                    'email': user.email
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])  # FBV (2/2) 
@permission_classes([AllowAny])
def user_login(request):
    if request.method == 'POST':
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': {
                    'username': user.username,
                    'email': user.email
                }
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def user_logout(request): 
    request.user.auth_token.delete()  
    logout(request)  
    return Response({'message': 'Successfully logged out.'}, status=status.HTTP_200_OK)

class StationList(APIView):  
    def get(self, request):
        stations = Station.objects.all()
        serializer = StationSerializer(stations, many=True)
        return Response(serializer.data)
    def post(self, request):
        """Handle POST requests - Create new station"""
        serializer = StationSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class JourneyList(APIView):  
    def get(self, request):
        departure_station = request.query_params.get('departure_station')
        arrival_station = request.query_params.get('arrival_station')
        date = request.query_params.get('date')
        
        journeys = Journey.objects.all()
        
        if departure_station:
            journeys = journeys.filter(departure_station=departure_station)
        if arrival_station:
            journeys = journeys.filter(arrival_station=arrival_station)
        if date:
            journeys = journeys.filter(departure_time__date=date)
            
        serializer = JourneySerializer(journeys, many=True)
        return Response(serializer.data) 
    def post(self, request):
        serializer = JourneyCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 
    def get_object(self, pk):
        try:
            return Journey.objects.get(pk=pk)
        except Journey.DoesNotExist:
            raise Http404

    def get(self, request, pk=None):  
        if pk is not None:
            journey = self.get_object(pk)
            serializer = JourneySerializer(journey)
            return Response(serializer.data)
        else:
            departure_station = request.query_params.get('departure_station')
            arrival_station = request.query_params.get('arrival_station')
            date = request.query_params.get('date')
            
            journeys = Journey.objects.all()
            
            if departure_station:
                journeys = journeys.filter(departure_station=departure_station)
            if arrival_station:
                journeys = journeys.filter(arrival_station=arrival_station)
            if date:
                journeys = journeys.filter(departure_time__date=date)
                
            serializer = JourneySerializer(journeys, many=True)
            return Response(serializer.data)

class JourneyCreateList(APIView):  
    
    def post(self, request):
        serializer = JourneyCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 
    

class BookingView(APIView):  
    permission_classes = [IsAuthenticated]

    def get(self, request):
        bookings = Booking.objects.filter(user=request.user)
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = BookingPostSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            booking = serializer.save(user=request.user)
            return Response(BookingPostSerializer(booking).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            booking = Booking.objects.get(pk=pk, user=request.user)
            booking.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Booking.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND) 
        
class BookingDetailView(APIView):
    def get(self, request, pk):
        try:
            booking = Booking.objects.get(pk=pk)
            serializer = BookingSerializer(booking)
            return Response(serializer.data)
        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found'}, status=404)
    def delete(self, request, pk):
        try:
            booking = Booking.objects.get(pk=pk)
            booking.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)
