# Finance Dashboard Backend

A cleanly structured Node.js + Express + MongoDB backend for a Finance Dashboard application.

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- Zod validation
- Role-based access control (viewer, analyst, admin)

## Architecture

```text
/src
  /config
  /controllers
  /middlewares
  /models
  /routes
  /utils
  /validators
server.js
```

Flow follows API layers:

- Routes: request mapping + middleware composition
- Controllers: request handling + business logic
- Models: MongoDB schemas and indexing

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment:

```bash
cp .env.example .env
```

3. Run in development:

```bash
npm run dev
```

4. Run in production mode:

```bash
npm start
```

## Data Models

### User

- name (string)
- email (unique, indexed)
- password (hashed with bcrypt)
- role: viewer | analyst | admin (indexed)
- status: active | inactive (indexed)
- timestamps

### FinancialRecord

- amount (number)
- type: income | expense (indexed)
- category (indexed)
- date (indexed)
- notes
- createdBy (ObjectId reference to User, indexed)
- isDeleted (soft delete flag)
- timestamps

Additional indexes:

- Compound index on date + category
- Compound index on type + date
- Text index on notes + category for search

## RBAC Rules

- Viewer: read-only records access
- Analyst: read-only records + dashboard analytics
- Admin: full CRUD on records + user management

## API Endpoints

Base URL: `/api`

### Auth

- `POST /auth/bootstrap-admin` (create first admin only when no users exist)
- `POST /auth/login`

### Users (Admin only)

- `POST /users`
- `GET /users`
- `GET /users/:id`
- `PATCH /users/:id`
- `DELETE /users/:id`

### Financial Records

- `POST /records` (Admin)
- `GET /records` (Viewer/Analyst/Admin)
- `GET /records/:id` (Viewer/Analyst/Admin)
- `PATCH /records/:id` (Admin)
- `DELETE /records/:id` (Admin, soft delete)

Supported query filters for `GET /records`:

- startDate
- endDate
- type
- category
- search
- page
- limit
- sortBy (date, amount, category, createdAt)
- sortOrder (asc, desc)

### Dashboard

- `GET /dashboard/summary` (Analyst/Admin)

Supported query params:

- startDate
- endDate
- category
- recentLimit

Dashboard aggregation includes:

- Total income
- Total expenses
- Net balance
- Category-wise aggregation
- Monthly trends
- Recent transactions

## Validation and Error Handling

- Zod-based request validation with `400 Bad Request`
- JWT auth failures return `401 Unauthorized`
- RBAC failures return `403 Forbidden`
- Not found resources return `404 Not Found`
- Duplicate unique values return `409 Conflict`
- Centralized error middleware for consistent responses

## Security and Reliability Enhancements

- Helmet for secure headers
- CORS enabled
- Rate limiting enabled globally
- Soft delete for records
- Input sanitation via Zod object parsing

## Assumptions

- Analytics are organization-wide (not user-scoped)
- User management is strictly admin-controlled
- First admin is bootstrapped once using `/auth/bootstrap-admin`
- Viewer cannot access analytics endpoints

## Example Auth Header

```http
Authorization: Bearer <jwt-token>
```
