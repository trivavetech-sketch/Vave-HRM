# 🚀 Vave HRM - Deployment & Local Setup Guide (Non-Docker)

This guide walks you through running the Vave HRM application locally without Docker, and deploying it to **Render** (Backend), **Vercel** (Frontend), and **Supabase** (Database).

---

## 🛠️ Local Setup (No Docker)

To run the application locally without Docker, follow these steps:

### Prerequisites
1. **Node.js** (v18 or higher)
2. **PostgreSQL** (running locally or using a remote Supabase instance)
3. **Redis** (running locally or using a free Upstash Redis instance)

---

### 1. Database Setup (Supabase or Local PostgreSQL)

#### Option A: Using Supabase (Recommended)
1. Go to [Supabase](https://supabase.com) and create a free project.
2. In your project dashboard, navigate to **Project Settings > Database**.
3. Under **Connection string**, select **URI** and copy the URL (make sure to replace `[YOUR-PASSWORD]` with your actual database password).
4. Save this URL for the Backend environment configuration.

#### Option B: Using Local PostgreSQL
1. Start your local PostgreSQL service.
2. Create a database named `vave_hrm` (e.g. `CREATE DATABASE vave_hrm;`).

---

### 2. Backend Setup (`/backend`)

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Open `.env` and update the variables:
   * Set `DATABASE_URL` to your Supabase connection URI or local Postgres connection URI.
   * If using a remote/Supabase DB, set `DB_SSL=true` (our code automatically configures TypeORM to handle SSL if `DB_SSL` or a remote URL is present).
   * Set `REDIS_URL` to your Redis connection string (e.g. `redis://localhost:6379`).
5. Run the database seed script to initialize schemas and default tenants:
   ```bash
   npm run seed
   ```
6. Start the backend NestJS server in watch/development mode:
   ```bash
   npm run start:dev
   ```
   The backend will be running at: `http://localhost:4000/api/v1`

---

### 3. Frontend Setup (`/frontend`)

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file based on `.env.example`:
   ```bash
   cp .env.example .env.local
   ```
4. Open `.env.local` and set your API base URL:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
   ```
5. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   The frontend will be running at: `http://localhost:3000`

---

## ☁️ Cloud Deployment

Here is how you can deploy the complete stack to the cloud using free/hobby tiers.

### 1. Database (Supabase)
Your database is hosted on Supabase. Keep the **Transaction Pooler Connection URI** handy from the Supabase settings page.

### 2. Backend API (Render)
1. Sign in to [Render](https://render.com).
2. Click **New +** and select **Web Service**.
3. Connect your Git repository.
4. Set the following settings:
   * **Name:** `vave-hrm-backend`
   * **Root Directory:** `backend`
   * **Runtime:** `Node`
   * **Build Command:** `npm install && npm run build`
   * **Start Command:** `npm run start:prod`
5. Click **Advanced** and add the following Environment Variables:
   * `NODE_ENV`: `production`
   * `PORT`: `10000` (Render binds this port automatically)
   * `DATABASE_URL`: *(Your Supabase Connection URI)*
   * `REDIS_URL`: *(Your Redis connection URI - e.g. Upstash free Redis)*
   * `JWT_SECRET`: *(A long secure random string)*
   * `CORS_ORIGINS`: `https://your-frontend-domain.vercel.app` (You can update this after deploying the frontend)
6. Click **Deploy Web Service**.

### 3. Frontend (Vercel)
1. Sign in to [Vercel](https://vercel.com).
2. Click **Add New > Project** and import your Git repository.
3. In the configure project screen:
   * **Framework Preset:** `Next.js`
   * **Root Directory:** `frontend`
4. Expand **Environment Variables** and add:
   * **Key:** `NEXT_PUBLIC_API_URL`
   * **Value:** `https://vave-hrm-backend.onrender.com/api/v1` (Replace with your actual Render API service URL)
5. Click **Deploy**.
6. Once deployed, copy your Vercel URL and add it to the backend `CORS_ORIGINS` environment variable in Render so that requests are authorized.
