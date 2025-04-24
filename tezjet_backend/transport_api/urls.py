# transport_api/urls.py
from django.urls import path
from .views import (
    register_user,
    user_login,
    user_logout,
    StationList,
    JourneyList,
    BookingView, 
    BookingDetailView
)

urlpatterns = [
    path('register/', register_user, name='register'),
    path('login/', user_login, name='login'),
    path('logout/', user_logout, name='logout'),
    path('stations/', StationList.as_view(), name='station-list'),
    path('journeys/', JourneyList.as_view(), name='journey-list'), 
    path('journeys/<int:pk>/', JourneyList.as_view(), name='journey-detail'),
    path('bookings/', BookingView.as_view(), name='booking-list'),
    path('bookings/<int:pk>/', BookingDetailView.as_view(),name='booking-detail'),
]