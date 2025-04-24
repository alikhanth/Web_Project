# Bus Ticket Booking System 🚌🎫

![System Architecture Diagram](docs/system-architecture.png)  
*Figure 1: High-level system architecture*
## Creators 

Tursynkhan Alikhan, 2nd year student(KBTU)

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Development](#development)
- [License](#license)

## Features ✨

### Core Functionality
- **Journey Management**:
  - Browse available bus routes
  - View station details (departure/arrival)
  - Real-time seat availability

- **Booking System**:
  - Secure ticket reservation
  - Automatic price calculation
  - Instant booking confirmation
  - Prevention of overbooking

### User Experience
- Responsive design 
- Form validation
- Booking history

## Tech Stack 💻

### Frontend
![Angular](https://img.shields.io/badge/Angular-16-red?logo=angular)
- Reactive Forms
- RxJS for state management
- Bootstrap 5 for UI components

### Backend
![Django](https://img.shields.io/badge/Django-4.2-green?logo=django)
- Django REST Framework
- JWT Authentication
- PostgreSQL database
- Redis caching (optional)

### DevOps
- Docker containerization
- GitHub Actions CI/CD
- AWS EC2 deployment (sample configs included)

### Setup
1. **Backend**:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate  # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 

API Endpoints 🌐
Endpoint	Method	Description
/api/journeys/	GET	List available journeys
/api/journeys/{id}/	GET	Journey details
/api/bookings/	POST	Create new booking
/api/bookings/	GET	User's booking history