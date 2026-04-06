# Backend Assignment API

Node.js + Express + MongoDB backend for finance record management, role-based access control, and dashboard analytics.

## Features

- JWT-based authentication
- Role-based authorization (`viewer`, `analyst`, `admin`)
- Zod request validation (body and query)
- Financial record CRUD with soft delete
- Dashboard summary with aggregation pipelines
- Global rate limiting
- Centralized error handling

## Tech Stack

- Node.js (ES Modules)
- Express
- MongoDB + Mongoose
- Zod
- JSON Web Token (`jsonwebtoken`)
- `bcryptjs` for password hashing

## Project Structure

```text
.
|-- server.js
|-- src
|   |-- app.js
|   |-- config
|   |   `-- db.js
|   |-- controllers
|   |-- middlewares
|   |-- models
|   |-- routes
|   |-- utils
|   `-- validators
`-- .env.example
```

## Prerequisites

- Node.js 18+
- MongoDB instance (local or cloud)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

3. Update `.env` values.

4. Run in development:

```bash
npm run dev
```

5. Run in production mode:

```bash
npm start
```

## Environment Variables

Defined in `.env.example`:

- `PORT` (default in code: `8080` when not set)
- `NODE_ENV`
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN` (default in code: `1d`)

## Runtime Behavior

- Health check endpoint: `GET /health`
- API base path: `/api`
- Global request limit: 300 requests per 15 minutes
- JSON body size limit: 1 MB

## Authentication and Authorization

1. Bootstrap the system once with `POST /api/auth/create-default-admin`.
2. Login with `POST /api/auth/login` to receive a JWT.
3. Send token in header:

```http
Authorization: Bearer <jwt-token>
```

### Role Access Matrix

- `viewer`: read records only
- `analyst`: read records + dashboard summary
- `admin`: full access to users and records

## Data Models

### User

- `name`: string (2-100)
- `email`: unique, indexed, lowercase
- `password`: hashed (`bcrypt`, 12 salt rounds), excluded by default
- `role`: `viewer | analyst | admin`
- `status`: `active | inactive`
- `createdAt`, `updatedAt`

### FinancialRecord

- `amount`: positive number
- `type`: `income | expense`
- `category`: string (max 100)
- `date`: Date
- `notes`: optional string (max 500)
- `createdBy`: reference to `User`
- `isDeleted`: boolean (soft delete)
- `createdAt`, `updatedAt`

Indexes:

- `date + category`
- `type + date`
- text index on `notes + category`

## API Endpoints

All routes below are prefixed with `/api`.

### Auth

- `POST /auth/create-default-admin`
  - Public endpoint
  - Works only when there are no users in the system
  - Body: `{ "name", "email", "password" }`
- `POST /auth/login`
  - Public endpoint
  - Body: `{ "email", "password" }`

### Users (Admin only)

- `POST /users`
- `GET /users`
- `GET /users/:id`
- `PATCH /users/:id`
- `DELETE /users/:id`

Create body:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "role": "viewer",
  "status": "active"
}
```

Update body accepts any of:

- `name`
- `role`
- `status`

### Records

- `POST /records` (admin)
- `GET /records` (viewer, analyst, admin)
- `GET /records/:id` (viewer, analyst, admin)
- `PATCH /records/:id` (admin)
- `DELETE /records/:id` (admin, soft delete)

Create body:

```json
{
  "amount": 2500,
  "type": "income",
  "category": "Salary",
  "date": "2026-04-01",
  "notes": "April salary"
}
```

List query params:

- `startDate`, `endDate`
- `type` (`income` or `expense`)
- `category`
- `search` (text search over `notes` and `category`)
- `page` (default `1`)
- `limit` (default `10`, max `100`)
- `sortBy` (`date`, `amount`, `category`, `createdAt`)
- `sortOrder` (`asc`, `desc`)

### Dashboard

- `GET /dashboard/summary` (analyst, admin)

Query params:

- `startDate`, `endDate`
- `category`
- `recentLimit` (default `5`, max `20`)

Response includes:

- `totalIncome`
- `totalExpenses`
- `netBalance`
- `categoryWise`
- `monthlyTrends`
- `recentTransactions`

## Validation and Error Handling

- Zod validation errors return `400` with details.
- Invalid or missing auth token returns `401`.
- Role violations return `403`.
- Invalid MongoDB id format returns `400`.
- Missing resources return `404`.
- Duplicate unique values return `409`.

Typical error format:

```json
{
  "message": "Invalid input",
  "details": ["email: Invalid email address"]
}
```
