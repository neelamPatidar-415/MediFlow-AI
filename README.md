# PulsePilot

PulsePilot is a full-stack healthcare platform designed to simplify doctor discovery, appointment booking, online payments, and hospital-side management through a scalable microservices architecture.

The project combines traditional healthcare workflows with AI-powered assistance to make finding doctors and managing appointments easier for patients, while giving hospitals tools to manage doctors, bookings, appointments, and analytics.

## Objective

The main objective of PulsePilot is to build a complete healthcare ecosystem where:

- Patients can discover doctors based on their requirements.
- Patients can view doctor details and availability.
- Patients can book and manage appointments.
- Online appointment payments are handled securely through Razorpay.
- An AI assistant helps users find doctors, compare options, and manage appointments conversationally.
- Hospitals can create and manage their doctors.
- Hospitals can view appointments, bookings, revenue, and operational analytics.
- The entire backend is separated into independent microservices for scalability and maintainability.

## Key Features

### Patient Side

- User registration and login
- Role-based authentication
- Doctor discovery and search
- Doctor profile and availability details
- Appointment creation and rescheduling
- Appointment cancellation
- Booking management
- Online payment through Razorpay
- Patient profile
- Real-time AI healthcare assistant

### Hospital Side

Hospital administrators have a separate dashboard with:

- Create doctor
- Manage doctors
- Update doctor information
- Delete doctors
- Hospital appointments
- Hospital bookings
- Hospital analytics
- Doctor availability information
- Booking and revenue statistics

## Microservices Architecture

PulsePilot follows a microservices architecture where major responsibilities are separated into independent services.

| Service | Responsibility |
|---|---|
| **Auth Service** | User registration, login, authentication, JWT-based authorization and user roles |
| **Doctor Service** | Doctor creation, doctor profiles, availability, search and doctor management |
| **Appointment Service** | Appointment creation, retrieval, rescheduling and cancellation |
| **Booking Service** | Confirmed booking records and booking management |
| **Payment Service** | Razorpay payment creation and payment verification |
| **Notification Service** | Notification and email-related workflows |
| **AI Buddy Service** | AI-powered doctor discovery, comparison and appointment assistance |
| **Hospital Dashboard Service** | Hospital statistics, doctors, bookings and revenue analytics |

## AI Assistant

PulsePilot includes a conversational AI assistant built using:

- Google Gemini
- LangGraph
- LangChain
- Socket.IO

The assistant can help users:

- Find suitable doctors
- Compare doctors
- Create appointments
- View appointments
- Interact with the healthcare platform conversationally

The AI service also uses custom input and output guardrails to validate user requests and AI-generated responses.

## Backend Communication

The microservices communicate through a combination of:

- REST APIs for synchronous operations
- RabbitMQ for asynchronous workflows
- Redis for token/session-related storage
- MongoDB for persistent data storage

RabbitMQ is used to decouple services and handle asynchronous events such as booking, payment, and notification workflows.

## Hospital Analytics

The hospital dashboard provides operational insights such as:

- Total doctors
- Total bookings
- Today's bookings
- Completed bookings
- Cancelled bookings
- Total revenue
- Recent bookings
- Hospital doctors

The frontend analytics dashboard visualizes this information using **Recharts**.

## Frontend

The frontend is built with:

- React
- Vite
- React Router
- Recharts
- Socket.IO Client
- CSS

The application provides separate experiences for patients and hospital administrators using role-aware navigation and routes.

## Technology Stack

### Frontend
- React
- Vite
- React Router
- Recharts
- Socket.IO Client

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- REST APIs
- Socket.IO
- RabbitMQ
- Redis

### AI
- Google Gemini
- LangChain
- LangGraph
- Vector-based AI components
- AI Guardrails

### Payments
- Razorpay

### DevOps & Cloud
- Docker
- AWS ECR
- AWS ECS
- AWS
- GitHub Actions

## Architecture

```text
                         ┌─────────────────────┐
                         │   React Frontend    │
                         │      Vite           │
                         └──────────┬──────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
           Auth Service       Doctor Service      AI Buddy
                 │                  │                  │
                 ▼                  ▼                  ▼
        Appointment Service   Booking Service      Gemini
                 │                  │
                 └──────────┬───────┘
                            ▼
                     Payment Service
                            │
                         Razorpay

          RabbitMQ ──► Async Service Communication
          Redis    ──► Token / Fast Data Storage
          MongoDB  ──► Persistent Data Storage

                    Hospital Dashboard
                            │
          ┌─────────────────┼─────────────────┐
          ▼                 ▼                 ▼
       Doctors          Bookings          Analytics
```

## Security & Reliability

- JWT-based authentication
- HTTP-only cookie based authentication flow
- Role-based authorization
- Service-level authentication middleware
- Input validation
- AI input/output guardrails
- Asynchronous communication using RabbitMQ
- Redis-based token storage
- Dockerized services

## Deployment

The project is containerized using Docker and structured for cloud deployment on AWS using **Amazon ECR** for container images and **Amazon ECS** for running the backend services.

The architecture is designed so individual microservices can be deployed and managed independently.

## Project Goal

PulsePilot was built to demonstrate how a real-world healthcare application can combine:

**Microservices + REST APIs + Event-driven communication + AI + Payments + Real-time communication + Cloud deployment**

into one complete full-stack system.

