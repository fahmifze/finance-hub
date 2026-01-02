# Finance Hub - Personal Finance Management System

A full-stack personal finance application built with React, TypeScript, Spring Boot, and MySQL.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start Guide](#quick-start-guide)
- [Detailed Setup Instructions](#detailed-setup-instructions)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)

---

## Features

### Core Features
- User authentication with JWT tokens
- Expense tracking with category assignment
- Income tracking with source categories
- Budget planning with spending alerts
- Dark/Light mode theme toggle

### Financial Tools
- Recurring transactions (expenses and income)
- Smart insights and spending analysis
- Net savings calculation
- Multi-currency support (10 currencies)
- Live exchange rates with currency converter

### Stock Market
- Real-time stock quotes (via Finnhub API)
- Stock watchlist management
- Portfolio tracking with P/L calculation
- Price alerts (above/below thresholds)

### Financial News
- Live financial news feed (via Marketaux API)
- Filter by category and sentiment
- Save articles for later reading

### Visualization
- Monthly spending trends
- Category breakdown charts
- Daily spending patterns
- Budget progress tracking

### Data Management
- Search and filter by date, category, amount
- Export to CSV and PDF
- Paginated lists with sorting

---

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, React Query, Recharts |
| Backend | Java 17, Spring Boot 3.2, Spring Security, Spring Data JPA |
| Database | MySQL 8+ |
| APIs | Finnhub (stocks), Marketaux (news), Open Exchange Rates (currency) |

---

## Project Structure

```
finance-hub/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # UI Components
│   │   ├── context/        # React Context (Auth, Theme)
│   │   ├── hooks/          # Custom React Hooks
│   │   ├── pages/          # Page Components
│   │   ├── services/       # API Service Layer
│   │   ├── types/          # TypeScript Types
│   │   └── utils/          # Utility Functions
│   └── package.json
├── server-spring/          # Spring Boot Backend
│   ├── src/main/java/com/financehub/
│   │   ├── config/         # Configuration Classes
│   │   ├── controller/     # REST Controllers
│   │   ├── dto/            # Data Transfer Objects
│   │   ├── entity/         # JPA Entities
│   │   ├── exception/      # Exception Handling
│   │   ├── repository/     # Data Repositories
│   │   ├── security/       # JWT & Security
│   │   └── service/        # Business Logic
│   ├── src/main/resources/
│   │   └── application.yml # Configuration
│   ├── pom.xml             # Maven Dependencies
│   └── run.cmd             # Windows Start Script
├── database/               # SQL Scripts
│   ├── schema.sql
│   └── seed.sql
├── .env.example            # Environment Template
└── README.md
```

---

## Quick Start Guide

### Prerequisites

| Software | Version | Download Link |
|----------|---------|---------------|
| Java JDK | 17+ | https://adoptium.net/ |
| Maven | 3.9+ | https://maven.apache.org/download.cgi |
| Node.js | 18+ | https://nodejs.org/ |
| MySQL | 8+ | https://dev.mysql.com/downloads/ (or use Laragon/XAMPP) |

### Step 1: Create Database

```bash
# Using MySQL command line
mysql -u root -e "CREATE DATABASE IF NOT EXISTS finance_hub;"
```

Or create `finance_hub` database using phpMyAdmin/MySQL Workbench.

### Step 2: Start Backend (Spring Boot)

```bash
cd server-spring
mvn spring-boot:run -DskipTests
```

**Windows shortcut:** Double-click `server-spring/run.cmd`

Backend runs at: **http://localhost:3001**

> First run will download dependencies (2-3 minutes). Database tables are created automatically.

### Step 3: Start Frontend (React)

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**

### Step 4: Access the Application

1. Open http://localhost:5173
2. Register a new account
3. Start tracking your finances!

---

## Detailed Setup Instructions

### Environment Variables (Optional)

The backend uses default values, but you can customize by setting environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| DB_HOST | localhost | MySQL host |
| DB_PORT | 3306 | MySQL port |
| DB_USER | root | MySQL username |
| DB_PASSWORD | (empty) | MySQL password |
| DB_NAME | finance_hub | Database name |
| JWT_SECRET | (default) | JWT signing key |
| PORT | 3001 | Server port |
| CLIENT_URL | http://localhost:5173 | Frontend URL (CORS) |

**Windows:** Set in `server-spring/run.cmd` or system environment variables.

**Linux/Mac:**
```bash
export DB_PASSWORD=yourpassword
export JWT_SECRET=your-secret-key
```

### Optional API Keys

For full functionality, get free API keys:

| Feature | API | Sign Up |
|---------|-----|---------|
| Exchange Rates | Open Exchange Rates | https://openexchangerates.org/signup/free |
| Financial News | Marketaux | https://www.marketaux.com/ |
| Stock Quotes | Finnhub | https://finnhub.io/ |

---

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd server-spring
mvn spring-boot:run -DskipTests
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### Verify Everything Works

1. **Check Backend Health:**
   ```bash
   curl http://localhost:3001/api/health
   ```
   Expected: `{"status":"ok","service":"finance-hub-api",...}`

2. **View API Documentation:**
   Open http://localhost:3001/swagger-ui.html

3. **Access Frontend:**
   Open http://localhost:5173

---

## API Documentation

Interactive API docs available at: **http://localhost:3001/swagger-ui.html**

### Main Endpoints

| Category | Method | Endpoint | Description |
|----------|--------|----------|-------------|
| **Auth** | POST | /api/auth/register | Register user |
| | POST | /api/auth/login | Login |
| | POST | /api/auth/refresh | Refresh token |
| | POST | /api/auth/logout | Logout |
| **Expenses** | GET | /api/expenses | List expenses |
| | POST | /api/expenses | Create expense |
| | PUT | /api/expenses/{id} | Update expense |
| | DELETE | /api/expenses/{id} | Delete expense |
| **Income** | GET | /api/incomes | List income |
| | POST | /api/incomes | Create income |
| | PUT | /api/incomes/{id} | Update income |
| | DELETE | /api/incomes/{id} | Delete income |
| **Budgets** | GET | /api/budgets | List budgets |
| | GET | /api/budgets/status | Budget status |
| | POST | /api/budgets | Create budget |
| **Categories** | GET | /api/categories | Expense categories |
| | GET | /api/income-categories | Income categories |
| **Other** | GET | /api/insights | Financial insights |
| | GET | /api/recurring | Recurring transactions |
| | GET | /api/exchange-rates | Currency rates |
| | GET | /api/export/csv | Export to CSV |
| | GET | /api/export/pdf | Export to PDF |
| | GET | /api/health | Health check |

---

## Troubleshooting

### "Unknown database 'finance_hub'"

Create the database first:
```bash
mysql -u root -e "CREATE DATABASE finance_hub;"
```

### "Port 3001 already in use"

**Windows:**
```bash
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

**Linux/Mac:**
```bash
lsof -i :3001
kill -9 <PID>
```

### "mvn: command not found"

1. Download Maven from https://maven.apache.org/download.cgi
2. Extract to a folder (e.g., `C:\Program Files\apache-maven-3.9.12`)
3. Add to PATH:
   - Windows: Add `C:\Program Files\apache-maven-3.9.12\bin` to System PATH
   - Linux/Mac: `export PATH=$PATH:/path/to/maven/bin`

### "JAVA_HOME not set"

1. Download Java 17 from https://adoptium.net/
2. Set JAVA_HOME:
   - Windows: Set `JAVA_HOME` to `C:\Program Files\Java\jdk-17`
   - Linux/Mac: `export JAVA_HOME=/path/to/jdk-17`

### VS Code shows red errors but code compiles

The code is correct. VS Code needs to reload:
1. Press `Ctrl+Shift+P`
2. Type `Java: Clean Java Language Server Workspace`
3. Click **Restart and delete**

### Frontend can't connect to backend

- Ensure backend is running on port 3001
- Check CORS: `CLIENT_URL` should match frontend URL
- Try: `curl http://localhost:3001/api/health`

---

## Currency Support

USD, EUR, GBP, JPY, MYR, SGD, AUD, CAD, INR, CNY

---

## License

MIT
