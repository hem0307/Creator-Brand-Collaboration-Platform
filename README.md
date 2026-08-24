# CreatorSync

CreatorSync is a full-stack MERN application that helps **brands and content creators discover each other, manage campaigns, collaborate, and track activity**.

## Features

- Role-based authentication for creators and brands
- Creator and brand profiles
- Campaign creation and discovery
- Campaign applications and collaboration workflows
- Messaging and notifications
- Reviews and workspace management
- Dashboard and analytics views
- Protected API routes with JWT authentication
- Local MongoDB support

## Tech Stack

**Frontend:** React, Vite, React Router, Axios, Bootstrap, Chart.js

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs

## Project Structure

```text
CreatorSync/
├── frontend/        # React + Vite application
├── server/          # Express + MongoDB API
├── landing/         # Static landing-page assets
├── package.json
└── README.md
```

## Prerequisites

Install:

- Node.js 18+ (LTS recommended)
- MongoDB Community Server
- MongoDB Compass (optional, for viewing the database)

## Local MongoDB Setup

Start MongoDB Community Server, then connect Compass to:

```text
mongodb://127.0.0.1:27017
```

CreatorSync uses this database by default:

```text
creatorsync
```

## Environment Variables

Create `server/.env` from `server/.env.example`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/creatorsync
JWT_SECRET=replace_with_a_long_random_secret
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Optionally create `frontend/.env` from `frontend/.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
```

> Never commit `.env` files or real secrets to GitHub.

## Installation

From the project root:

```bash
npm install
npm run install-all
```

## Run in Development

Start frontend and backend together:

```bash
npm run dev
```

Or run them separately:

```bash
cd server
npm run dev
```

```bash
cd frontend
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- API base: `http://localhost:5000/api`

## Build for Production

```bash
npm run build
```

## Before Pushing to GitHub

- [ ] Confirm `server/.env` is not tracked
- [ ] Use a strong private JWT secret
- [ ] Run `npm run build`
- [ ] Test signup, login, logout, and protected pages
- [ ] Confirm MongoDB Community Server is running

## License

This project is intended for educational and portfolio use.
