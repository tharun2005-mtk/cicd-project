# 🚀 GitHub Actions CI/CD — Full-Stack App

> DevOps Project | React + Node.js/Express + Docker + GitHub Actions

---

## 📁 Project Structure

```
.
├── .github/
│   └── workflows/
│       ├── ci-cd.yml         # Main pipeline (test → build → push → deploy)
│       └── pr-checks.yml     # Auto-checks on every Pull Request
│
├── frontend/                 # React + Vite app
│   ├── src/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── backend/                  # Node.js + Express API
│   ├── src/
│   ├── tests/
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml        # Production orchestration
└── README.md
```

---

## 🔄 CI/CD Pipeline Flow

```
Code Push (main branch)
        │
        ▼
┌───────────────────┐     ┌───────────────────┐
│  Test Backend     │     │  Build Frontend   │
│  (Jest + Supertest│     │  (Vite build)     │
└────────┬──────────┘     └────────┬──────────┘
         │                         │
         └──────────┬──────────────┘
                    ▼
         ┌─────────────────────┐
         │  Docker Build & Push │
         │  → GHCR (backend)   │
         │  → GHCR (frontend)  │
         └──────────┬──────────┘
                    ▼
         ┌─────────────────────┐
         │   Deploy to VPS     │
         │   SSH + docker      │
         │   compose pull/up   │
         └──────────┬──────────┘
                    ▼
         ┌─────────────────────┐
         │  Health Check ✅    │
         │  curl /health       │
         └─────────────────────┘
```

---

## ⚙️ GitHub Secrets Required

Go to your repo → **Settings → Secrets and variables → Actions** and add:

| Secret Name   | Description                              |
|---------------|------------------------------------------|
| `VPS_HOST`    | Your VPS IP or domain (e.g. `1.2.3.4`)  |
| `VPS_USER`    | SSH username (e.g. `ubuntu`)             |
| `VPS_SSH_KEY` | Private SSH key (contents of `~/.ssh/id_rsa`) |

> `GITHUB_TOKEN` is automatically provided by GitHub Actions — no setup needed.

---

## 🖥️ VPS Setup (One-Time)

SSH into your VPS and run:

```bash
# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Install Docker Compose plugin
sudo apt-get install docker-compose-plugin -y

# Create app directory
mkdir -p ~/cicd-app
```

---

## 🏃 Running Locally

```bash
# Backend
cd backend
npm install
npm run dev     # starts on :5000

# Frontend
cd frontend
npm install
npm run dev     # starts on :3000

# Both with Docker
docker compose up --build
```

---

## 🐳 Docker Commands

```bash
# Build images locally
docker build -t cicd-backend ./backend
docker build -t cicd-frontend ./frontend

# Run with compose
IMAGE_TAG=latest GITHUB_REPOSITORY=your-user/your-repo docker compose up
```

---

## 🧪 Running Tests

```bash
# Backend tests (Jest + Supertest)
cd backend && npm test

# Frontend build check
cd frontend && npm run build
```

---

## 📌 Key Concepts Demonstrated

| Concept | Implementation |
|--------|---------------|
| CI (Continuous Integration) | Tests run on every push & PR |
| CD (Continuous Deployment) | Auto-deploy to VPS on merge to main |
| Containerization | Multi-stage Dockerfiles for both services |
| Image Registry | GitHub Container Registry (GHCR) |
| Orchestration | Docker Compose with health checks |
| Security | Non-root Docker users, SSH key auth |
| Caching | GitHub Actions cache for npm + Docker layers |
