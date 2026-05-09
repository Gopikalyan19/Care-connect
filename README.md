# NAU Care Connect

Functional full-stack starter project for the NAU Care Connect student wellbeing platform.

## Stack

- Frontend: HTML, Tailwind CSS, JavaScript
- Backend: Node.js, Express.js
- Database/Auth: Supabase

## Folder Structure

```txt
nau-care-connect/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── database/
│   ├── schema.sql
│   └── setup_database.sql
├── docs/
└── frontend/
    ├── assets/js/
    ├── dashboard/
    ├── pages/
    └── index.html
```

## Setup Steps

### 1. Setup Supabase Database

Open Supabase Dashboard -> SQL Editor -> New Query.

Paste and run:

```txt
database/schema.sql
```

This creates all required tables:

- profiles
- support_requests
- appointments
- session_notes
- selfcare_plans
- resources
- feedback

### 2. Configure Backend Environment

Inside `backend`, create a new file named `.env`.

Copy from `.env.example` and add your real Supabase values:

```env
PORT=5000
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_anon_public_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_secret_key
JWT_SECRET=change_this_to_a_long_secret_value
FRONTEND_URL=http://127.0.0.1:5500
```

Important: never share your service role key publicly.

### 3. Install Backend Packages

```bash
cd backend
npm install
```

### 4. Start Backend

```bash
npm run dev
```

Open this in browser:

```txt
http://localhost:5000
```

Expected response:

```json
{
  "success": true,
  "message": "NAU Care Connect API is running"
}
```

### 5. Start Frontend

Open `frontend/index.html` using VS Code Live Server.

Recommended frontend URL:

```txt
http://127.0.0.1:5500/frontend/index.html
```

### 6. Test Flow

1. Register account
2. Login
3. Submit support request from user dashboard
4. Register/login as admin
5. View requests in admin dashboard

## API Base URL

Frontend API URL is configured in:

```txt
frontend/assets/js/config.js
```

Default:

```js
const API_BASE_URL = 'http://localhost:5000/api';
```

Change only if your backend runs on another URL.

## Notes

- Frontend design was kept unchanged.
- JavaScript integration was improved.
- Backend controllers, routes, CORS and Supabase integration were rebuilt for stable local development.
- If you already exposed your Supabase service role key, rotate it from Supabase Project Settings before using this project.
"# Care-connect" 
