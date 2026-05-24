# 🎯 Focus App — Backend API

Node.js + Express + MongoDB backend for a Pomodoro-based focus/productivity app.

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Start development server
npm run dev

# Start production server
npm start
```

## 📁 Project Structure

```
focus-backend/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   ├── authController.js  # Register, login, profile
│   ├── taskController.js  # Task CRUD
│   └── sessionController.js # Pomodoro sessions
├── middleware/
│   ├── auth.js            # JWT protection
│   └── errorHandler.js    # Global error handling
├── models/
│   ├── User.js            # User schema
│   ├── Task.js            # Task schema
│   └── Session.js         # Pomodoro session schema
├── routes/
│   ├── auth.js
│   ├── tasks.js
│   └── sessions.js
├── .env.example
├── server.js              # Entry point
└── package.json
```

## 🔑 Auth Endpoints

| Method | Endpoint             | Description         | Auth |
|--------|----------------------|---------------------|------|
| POST   | /api/auth/register   | Register new user   | No   |
| POST   | /api/auth/login      | Login               | No   |
| GET    | /api/auth/me         | Get profile         | Yes  |
| PUT    | /api/auth/settings   | Update timer settings | Yes |

## ✅ Task Endpoints

| Method | Endpoint         | Description        | Auth |
|--------|------------------|--------------------|------|
| GET    | /api/tasks       | Get all tasks      | Yes  |
| POST   | /api/tasks       | Create task        | Yes  |
| GET    | /api/tasks/:id   | Get single task    | Yes  |
| PUT    | /api/tasks/:id   | Update task        | Yes  |
| DELETE | /api/tasks/:id   | Delete task        | Yes  |

Query params: `?status=todo|in_progress|completed`, `?priority=low|medium|high`, `?sort=-createdAt`

## ⏱️ Session Endpoints

| Method | Endpoint               | Description             | Auth |
|--------|------------------------|-------------------------|------|
| POST   | /api/sessions/start    | Start a session         | Yes  |
| PUT    | /api/sessions/:id/end  | End/abandon session     | Yes  |
| GET    | /api/sessions          | Get session history     | Yes  |
| GET    | /api/sessions/stats    | Get focus stats         | Yes  |

## 🔐 Authentication

All protected routes require: `Authorization: Bearer <token>`

## 📊 Example Requests

### Register
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Task
```json
POST /api/tasks
{
  "title": "Write project proposal",
  "priority": "high",
  "estimatedPomodoros": 3,
  "dueDate": "2024-12-31"
}
```

### Start Focus Session
```json
POST /api/sessions/start
{
  "taskId": "<task_id>",
  "type": "focus"
}
```

### End Session
```json
PUT /api/sessions/:id/end
{
  "status": "completed",
  "notes": "Got a lot done!"
}
```
