# AHRN Platform

Autonomous Home Reliability Network (AHRN) with a full-stack architecture.

## Structure

- `/frontend`: Vite + React + Tailwind + Framer Motion
- `/backend`: Node.js + Express + MongoDB + Mongoose

## How to Run

### 1. Prerequisites
- Node.js installed
- MongoDB installed and running locally on `mongodb://localhost:27017/ahrn`

### 2. Run Backend
```bash
cd backend
npm install
npm run dev
```
The backend will seed initial data into MongoDB and start a simulation loop that periodically adds bids to active jobs.

### 3. Run Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Run with Docker (Recommended for Demo)
If you have Docker installed, you can launch the entire stack (Frontend, Backend, and MongoDB) with a single command:
```bash
docker-compose up --build
```
- **Frontend**: http://localhost
- **Backend**: http://localhost:5000
- **MongoDB**: Used internally by the backend.

## Features

- **Role-Based Access**: Choose between Homeowner, Technician, and Admin roles.
- **Dynamic Routing**: Protected routes ensure users only see content relevant to their role.
- **Simulated Backend**: Real MongoDB integration with a simulation loop that mimics a living autonomous network.
- **AI-Powered Analysis**: Diagnostic intelligence briefs powered by Gemini.
- **Componentized UI**: Refactored for scalability and maintainability.
- **Docker Ready**: Fully containerized environment for consistent deployment.
