# Deployment Guide (Vercel + Render + MongoDB Atlas)

This guide is the single source of truth for putting the project live.

---

## 1) Architecture

- Frontend: **Vercel** (deploys `frontend/`)
- Backend: **Render** (deploys `backend/`)
- Database: **MongoDB Atlas**

---

## 2) MongoDB Atlas

1. Create a cluster in Atlas.
2. Create a database user (username + password).
3. Add your Render IP to **Network Access** (or allow all IPs `0.0.0.0/0` for quick setup).
4. Get your connection string and save it as `MONGODB_URI`.

Example:
```
mongodb+srv://<user>:<password>@cluster.mongodb.net/portfolio_db
```

---

## 3) Backend (Render)

### Build & Start
Render settings:
- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`

### Environment Variables (Render)
```
NODE_ENV=production
PORT=5000
MONGODB_URI=your_atlas_connection_string
ADMIN_EMAIL=your_email
ADMIN_PASSWORD=your_strong_password
ALLOWED_ORIGIN=https://your-frontend.vercel.app,https://yourdomain.com

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=your_email@gmail.com
OWNER_EMAIL=helloashutosh1@outlook.com
```

### Health Check
```
https://your-backend.onrender.com/health
```

---

## 4) Frontend (Vercel)

### Build
Vercel auto-detects Next.js.

### Environment Variables (Vercel)
```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=
```

---

## 5) Resume Upload (Live)

Your site serves resume from:
```
/resume.pdf
```

To update:
1. Replace file locally at `frontend/public/resume.pdf`
2. Redeploy Vercel

---

## 6) CORS & Security

Backend uses:
- Helmet (security headers)
- Rate limiting
- CORS allowlist (via `ALLOWED_ORIGIN`)

Ensure `ALLOWED_ORIGIN` includes your Vercel domain.

---

## 7) Quick Test Checklist

Frontend:
- `https://yourdomain.com`
- `https://yourdomain.com/resume.pdf`

Backend:
- `https://your-backend.onrender.com/health`
- `/api/contact`
- `/api/newsletter/subscribe`

Admin:
- `/api/admin/login`

---

## 8) Local Dev (Optional)

Frontend:
```
cd frontend
npm install
npm run dev
```

Backend:
```
cd backend
npm install
npm run dev
```

---

If you want a production checklist, CI/CD, or auto‑upload resume, say the word.
