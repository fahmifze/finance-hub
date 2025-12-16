# Finance Hub

A full-stack personal finance application built with React, TypeScript, Express, and MySQL.

---

## Features

**Core**
- User authentication with JWT tokens
- Expense tracking with category assignment
- Income tracking with source categories
- Budget planning with spending alerts
- Dark/Light mode theme toggle

**Financial Tools**
- Recurring transactions (expenses and income)
- Smart insights and spending analysis
- Net savings calculation
- Multi-currency support (10 currencies)
- Live exchange rates with currency converter

**Stock Market**
- Real-time stock quotes (via Finnhub API)
- Stock watchlist management
- Portfolio tracking with P/L calculation
- Price alerts (above/below thresholds)
- Interactive price charts with time ranges
- Stock detail pages with company info

**Financial News**
- Live financial news feed (via Marketaux API)
- Filter by category and sentiment
- Save articles for later reading
- News widget on dashboard

**Currency Exchange**
- Live exchange rates (via Open Exchange Rates API)
- Currency converter with 10+ currencies
- Exchange rates table with base currency selection
- Quick reference rate cards

**Visualization**
- Monthly spending trends
- Category breakdown charts
- Daily spending patterns
- Budget progress tracking
- Stock price charts (area/candlestick)

**Data Management**
- Search and filter by date, category, amount
- Export to CSV and PDF
- Paginated lists with sorting

---

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, React Query, Recharts |
| Backend | Node.js, Express, TypeScript, MySQL, JWT, Zod |
| Database | MySQL 8+ with raw SQL |
| APIs | Finnhub (stocks), Marketaux (news), Open Exchange Rates (currency) |

---

## Project Structure

```
expense-tracker/
├── client/
│   └── src/
│       ├── components/
│       │   ├── budget/
│       │   ├── charts/
│       │   ├── currency/
│       │   ├── expenses/
│       │   ├── income/
│       │   ├── insights/
│       │   ├── layout/
│       │   ├── news/
│       │   ├── recurring/
│       │   ├── stocks/
│       │   └── ui/
│       ├── context/
│       ├── hooks/
│       ├── pages/
│       ├── services/
│       ├── types/
│       └── utils/
├── server/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── services/
│       ├── validators/
│       └── utils/
└── database/
    ├── schema.sql
    ├── migrations/
    └── seed.sql
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL 8+

### Installation

```bash
# Clone and install
git clone https://github.com/fahmifze/expense-tracker.git
cd expense-tracker
npm install
```

### Environment Setup

Create `.env` in the project root:

```env
# Server
NODE_ENV=development
PORT=3001

# Database (MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=expense_tracker

# JWT (use strong random strings in production)
JWT_ACCESS_SECRET=your-access-secret-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# CORS
CLIENT_URL=http://localhost:5174

# Exchange Rate API (https://openexchangerates.org/signup)
EXCHANGE_RATE_API_KEY=your-api-key-here

# Financial News API (https://www.marketaux.com/)
MARKETAUX_API_KEY=your-api-key-here

# Stock Market API (https://finnhub.io/)
FINNHUB_API_KEY=your-api-key-here
```

### Database Setup

```bash
mysql -u root -p -e "CREATE DATABASE expense_tracker"
mysql -u root -p expense_tracker < database/schema.sql
mysql -u root -p expense_tracker < database/migrations/001_add_new_features.sql
```

### Seed Demo Data (Optional)

```bash
npm run seed
```

Demo credentials:
- Email: `demo@example.com`
- Password: `password123`

### Run

```bash
# Both frontend and backend
npm run dev

# Separately
npm run dev:server    # localhost:3001
npm run dev:client    # localhost:5174
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| POST | /api/auth/refresh | Refresh token |
| POST | /api/auth/logout | Logout |

### Expenses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/expenses | List expenses |
| GET | /api/expenses/stats | Statistics |
| POST | /api/expenses | Create |
| PATCH | /api/expenses/:id | Update |
| DELETE | /api/expenses/:id | Delete |

### Income
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/incomes | List income |
| GET | /api/incomes/stats | Statistics |
| GET | /api/incomes/categories | Income categories |
| POST | /api/incomes | Create |
| PATCH | /api/incomes/:id | Update |
| DELETE | /api/incomes/:id | Delete |

### Budget
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/budgets | List budgets |
| GET | /api/budgets/status | Budgets with spending |
| GET | /api/budgets/alerts | Budget alerts |
| POST | /api/budgets | Create |
| PATCH | /api/budgets/:id | Update |
| DELETE | /api/budgets/:id | Delete |

### Recurring
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/recurring | List rules |
| GET | /api/recurring/upcoming | Upcoming transactions |
| POST | /api/recurring | Create |
| PATCH | /api/recurring/:id | Update |
| PATCH | /api/recurring/:id/toggle | Toggle active |
| DELETE | /api/recurring/:id | Delete |

### Insights
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/insights | Get insights |
| GET | /api/insights/summary | Financial summary |

### Stocks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/stocks/quote/:symbol | Get stock quote |
| GET | /api/stocks/quotes | Get multiple quotes |
| GET | /api/stocks/search | Search stocks |
| GET | /api/stocks/profile/:symbol | Company profile |
| GET | /api/stocks/candles/:symbol | Price history |
| GET | /api/stocks/market-status | Market open/closed |
| GET | /api/stocks/market-overview | Top stocks |

### Watchlist
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/stocks/watchlist | Get watchlist |
| POST | /api/stocks/watchlist | Add to watchlist |
| DELETE | /api/stocks/watchlist/:symbol | Remove from watchlist |

### Portfolio
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/stocks/portfolio | Get holdings |
| GET | /api/stocks/portfolio/summary | Portfolio summary |
| POST | /api/stocks/portfolio/transaction | Add transaction |
| GET | /api/stocks/portfolio/:holdingId/transactions | Transaction history |

### Price Alerts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/stocks/alerts | List alerts |
| POST | /api/stocks/alerts | Create alert |
| PATCH | /api/stocks/alerts/:id/toggle | Toggle alert |
| DELETE | /api/stocks/alerts/:id | Delete alert |

### News
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/news | Get news feed |
| GET | /api/news/saved | Get saved articles |
| POST | /api/news/saved | Save article |
| DELETE | /api/news/saved/:uuid | Remove saved |

### Exchange Rates
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/exchange-rates | Get latest rates |
| GET | /api/exchange-rates/convert | Convert currency |
| GET | /api/exchange-rates/status | Rate limit status |

### Other
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/categories | Expense categories |
| GET | /api/users/profile | User profile |
| GET | /api/export/csv | Export CSV |
| GET | /api/export/pdf | Export PDF |
| GET | /api/health | Health check |

---

## Currency Support

USD, EUR, GBP, JPY, MYR, SGD, AUD, CAD, INR, CNY

---

## Scripts

| Command | Description |
|---------|-------------|
| npm run dev | Start development |
| npm run dev:client | Frontend only |
| npm run dev:server | Backend only |
| npm run build | Production build |
| npm run seed | Seed demo data |

---

## API Rate Limits & Caching

| API | Free Tier | App Caching |
|-----|-----------|-------------|
| Open Exchange Rates | 1,000 req/month | 1 hour cache, 30 req/day limit |
| Marketaux | 100 req/day | 15 min cache |
| Finnhub | 60 req/min | 1 min quotes, 5 min candles, 24h profiles |

---

## Security Considerations

This is an open-source project. When deploying or forking:

**Environment Variables**
- Never commit `.env` files (already in `.gitignore`)
- Use strong, unique JWT secrets (32+ characters)
- Rotate API keys if exposed

**Production Deployment**
- Use HTTPS only
- Set `NODE_ENV=production`
- Use environment variables for all secrets
- Consider rate limiting for API endpoints
- Enable CORS only for your domain

**API Keys**
- Get free API keys from the respective providers
- The app implements caching to minimize API usage
- Rate limiting is built-in to stay within free tiers

**Database**
- Use a non-root MySQL user in production
- Enable MySQL SSL for remote connections
- Regular backups recommended

**Authentication**
- Passwords are hashed with bcrypt
- JWT tokens expire (access: 15m, refresh: 7d)
- Refresh tokens are stored securely

---

## License

MIT
