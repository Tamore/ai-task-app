# AI Task Processing Platform (Application Code)

This repository contains the application source code for the AI Task Processing Platform.

## Architecture
- **Frontend**: Next.js (App Router), Tailwind CSS
- **Backend**: Node.js, Express, MongoDB
- **Worker**: Python, Redis
- **Message Broker**: Redis
- **Database**: MongoDB

## Local Development (Docker Compose)
The easiest way to run the entire stack locally is via Docker Compose.

1. Ensure Docker Desktop is running.
2. Run the following command from the root directory:
   ```bash
   docker-compose up -d --build
   ```
3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

## Manual Local Setup
If you want to run the components manually:

### 1. Start Infrastructure
Start Redis and MongoDB via Docker:
```bash
docker-compose up -d redis mongo
```

### 2. Run Backend (Node.js)
```bash
cd backend
npm install
npm run dev
```

### 3. Run Worker (Python)
```bash
cd worker
pip install -r requirements.txt
python main.py
```

### 4. Run Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```

## CI/CD Pipeline
A GitHub Actions workflow is provided in `.github/workflows/ci-cd.yml` which automatically builds and pushes the Docker images to Docker Hub when pushing to the `main` branch.
Ensure you set the `DOCKER_USERNAME` and `DOCKER_PASSWORD` secrets in your GitHub repository settings.
