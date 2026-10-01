# PulsePilot

**PulsePilot** is a full-stack healthcare platform built with a microservices architecture. It connects patients, doctors, hospitals, payments, AI assistance, and an ML-based adverse drug reaction analysis module in one system.

## Objective

- Make doctor discovery and appointment booking simple for patients.
- Give hospitals tools to manage doctors, appointments, bookings and analytics.
- Add AI assistance for doctor discovery and appointment management.
- Add an ML-based safety analysis module for patient-reported drug reactions.
- Build the system using scalable, independently deployable microservices.

## What I Implemented

### Patient Features
- Registration and login with role-based authentication
- Doctor search and doctor profiles
- Appointment booking, rescheduling and cancellation
- Booking management
- Razorpay payment integration
- Patient profile
- AI healthcare assistant

### Hospital Features
- Create and manage doctors
- Doctor CRUD operations
- View hospital appointments and bookings
- Hospital analytics dashboard
- Booking, completion, cancellation and revenue statistics

### AI Assistant
Built a conversational AI assistant using:

- Google Gemini
- LangChain
- LangGraph
- Socket.IO

It helps patients:
- Find doctors
- Compare doctors
- Create appointments
- View appointments

Custom input/output guardrails were also added for safer AI interactions.

## ML-Based ADR Analysis

A new **Adverse Drug Reaction (ADR) analysis module** was added to PulsePilot.

### Flow

```text
Patient Report
      ↓
TF-IDF
      ↓
Logistic Regression
      ↓
ADR / Non-ADR
      ↓
Confidence Score
```

### Dataset
- **ADE Corpus V2**
- Hugging Face: `SetFit/ade_corpus_v2_classification`
- Used for Adverse Drug Event classification
- Approximately 17.6k training and 5.9k test samples

### ML Stack
- Scikit-learn — TF-IDF + Logistic Regression
- Joblib — model saving/loading
- FastAPI — ML API
- Uvicorn — ML service

The purpose is **not to diagnose patients**. It helps hospitals identify patient reports that may contain potential ADR patterns and may require clinical review.

```text
Patient → Reports symptoms
Hospital → Gets structured report + ML analysis
Doctor → Makes the actual medical decision
```

## Microservices

| Service | Purpose |
|---|---|
| **Auth** | Authentication, JWT and user roles |
| **Doctor** | Doctor profiles, search and management |
| **Appointment** | Appointment lifecycle |
| **Booking** | Confirmed booking management |
| **Payment** | Razorpay payment processing |
| **Notification** | Notifications and email workflows |
| **AI Buddy** | AI-powered healthcare assistance |
| **Hospital Dashboard** | Hospital analytics and management data |
| **ML / ADR Service** | ADR classification from patient reports |

## Tech Stack

**Frontend:** React, Vite, React Router, Recharts, Socket.IO Client

**Backend:** Node.js, Express.js, MongoDB, Mongoose, REST APIs, Socket.IO

**Messaging & Storage:** RabbitMQ, Redis, MongoDB

**AI:** Google Gemini, LangChain, LangGraph, AI Guardrails

**ML:** Python, Scikit-learn, TF-IDF, Logistic Regression, Joblib, FastAPI, Uvicorn

**Payments:** Razorpay

**DevOps:** Docker, GitHub Actions, AWS ECR, AWS ECS

## Architecture

```text
                    React + Vite
                         |
        ┌────────────────┼────────────────┐
        ↓                ↓                ↓
   Auth Service     Doctor Service     AI Buddy
        |                |                |
        ↓                ↓             Gemini
 Appointment ───────→ Booking
                         |
                      Payment
                         |
                      Razorpay

       RabbitMQ → Async communication
       Redis    → Fast data / token storage
       MongoDB  → Persistent data

                  Hospital Dashboard
                         |
                    Analytics

              Patient Report
                    ↓
              ML / ADR Service
                    ↓
           ADR / Non-ADR + Confidence
```

## Deployment

The services are containerized using **Docker** and prepared for deployment on **AWS using ECR and ECS**.

## Final Goal

PulsePilot combines:

**Healthcare + Microservices + AI + ML + Payments + Real-time Communication + Cloud Deployment**

into one complete healthcare platform.
