# RentEase — Full Stack Rental Platform

> A production-grade Java Full Stack rental web platform for property owners and tenants to discover, verify, book, and manage **Residential Properties**, **Vehicles**, **Commercial Workspaces**, and **Event Venues**.

---

## 🗂️ Project Structure

The project is structured into two dedicated directories:

```
RentEase/
├── frontend/                 # React 19 + TypeScript + Vite + Tailwind CSS
│   ├── src/                  # Components, Pages, State, and API client
│   ├── public/               # Public icons and static assets
│   ├── Dockerfile            # Container image for React SPA with Nginx
│   ├── package.json          # Frontend dependencies and scripts
│   ├── tsconfig.json         # TypeScript configuration
│   ├── vite.config.ts        # Vite configuration
│   └── README.md             # Frontend specific documentation
│
├── backend/                  # Java 17 + Spring Boot 3 + PostgreSQL
│   ├── src/main/java/        # Controllers, Services, Entities, Repositories, Security
│   ├── src/main/resources/   # application.yml & Flyway migration scripts (V1, V2)
│   ├── Dockerfile            # Multi-stage container build for Java 17 JAR
│   ├── pom.xml               # Maven configuration with Spring Boot 3.3.3
│   └── README.md             # Backend architecture, Swagger UI & API docs
│
└── docker-compose.yml        # Orchestration for PostgreSQL, Backend, and Frontend
```

---

## 🚀 Quick Start with Docker Compose

To launch the full stack (PostgreSQL + Spring Boot Backend + React Frontend):

```bash
docker compose up --build
```

- **Web Application**: [http://localhost:3000](http://localhost:3000)
- **Spring Boot API**: [http://localhost:8080/api/v1](http://localhost:8080/api/v1)
- **Interactive Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **OpenAPI JSON Spec**: [http://localhost:8080/api-docs](http://localhost:8080/api-docs)

---

## 💻 Local Development Without Docker

### 1. Backend (Spring Boot 3)
Ensure Java 17+ and Maven are installed, and PostgreSQL is running:
```bash
cd backend
mvn clean spring-boot:run
```

### 2. Frontend (React 19)
In a separate terminal window:
```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Demo Accounts (Pre-seeded)

| Role | Email | Password | Scope |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@rentease.com` | `Password@123` | Compliance desk, verification approval, disputes |
| **Property Owner** | `karthik.reddy@gmail.com` | `Password@123` | Direct rental listings, calendar slot management |
| **Broker** | `ananya.iyer@brokerage.com` | `Password@123` | Commercial spaces & residential leases |
| **Tenant / User** | `priya.sharma@gmail.com` | `Password@123` | Search, compare, reservation booking, escrow payments |
