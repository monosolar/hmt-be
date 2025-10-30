# Backend API - Meeting Scheduler

Express.js backend server with PostgreSQL database using Prisma ORM.

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)

## Setup

```bash
cd hmt-be
npm install
```

### Database Setup

1. **Create PostgreSQL database:**

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE meeting_scheduler;

# Exit psql
\q
```

2. **Configure environment variables:**

Update the `.env` file with your PostgreSQL credentials:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA"
```

Example:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/meeting_scheduler?schema=public"
```

3. **Run database migrations:**

```bash
npm run prisma:migrate
```

4. **Generate Prisma Client:**

```bash
npm run prisma:generate
```

5. **(Optional) Seed the database with sample data:**

```bash
npm run db:seed
```

## Run

```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

## Prisma Commands

```bash
# Generate Prisma Client
npm run prisma:generate

# Create and run migrations
npm run prisma:migrate

# Open Prisma Studio (database GUI)
npm run prisma:studio

# Push schema changes without migrations
npm run db:push

# Seed database
npm run db:seed
```

## Endpoints

### GET /hello

Returns a greeting message.

**Query Parameters:**

- `name` (optional) - Name to greet. Default: "World"

**Example:**

```bash
curl "http://localhost:3001/hello?name=testName"
```

**Response:**

```json
{
  "message": "Hello, testName"
}
```

### GET /health

Health check endpoint with database connection status.

**Example:**

```bash
curl "http://localhost:3001/health"
```

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2025-10-31T12:00:00.000Z",
  "database": "connected"
}
```

### User Endpoints

#### GET /users

Get all users with their meetings.

```bash
curl "http://localhost:3001/users"
```

#### POST /users

Create a new user.

```bash
curl -X POST "http://localhost:3001/users" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "name": "User Name"}'
```

#### GET /users/:id

Get a specific user by ID.

```bash
curl "http://localhost:3001/users/{userId}"
```

### Meeting Endpoints

#### GET /meetings

Get all meetings with user information.

```bash
curl "http://localhost:3001/meetings"
```

#### POST /meetings

Create a new meeting.

```bash
curl -X POST "http://localhost:3001/meetings" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Team Meeting",
    "description": "Weekly sync",
    "startTime": "2025-11-01T10:00:00Z",
    "endTime": "2025-11-01T11:00:00Z",
    "location": "Conference Room",
    "userId": "{userId}"
  }'
```

#### GET /meetings/:id

Get a specific meeting by ID.

```bash
curl "http://localhost:3001/meetings/{meetingId}"
```

## Database Schema

### User Model

- `id`: UUID (Primary Key)
- `email`: String (Unique)
- `name`: String
- `createdAt`: DateTime
- `updatedAt`: DateTime
- `meetings`: Meeting[] (Relation)

### Meeting Model

- `id`: UUID (Primary Key)
- `title`: String
- `description`: String (Optional)
- `startTime`: DateTime
- `endTime`: DateTime
- `location`: String (Optional)
- `userId`: String (Foreign Key)
- `user`: User (Relation)
- `createdAt`: DateTime
- `updatedAt`: DateTime

```bash
curl "http://localhost:3001/health"
```

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2025-10-30T..."
}
```

## Configuration

- Default port: 3001
- Can be changed via `PORT` environment variable
