# Ashutosh Ranjan Portfolio (Full Project)

## Summary (Short Answer to Your Questions)
- Frontend: Next.js 14 (React 18) in `frontend/`
- Backend: Node.js + Express in `backend/`
- Database: MongoDB (Mongoose)
- GitHub or local: Local workspace only. No `.git` folder found here, so no GitHub remote detected.

---

## Project Overview
This is a full-stack portfolio website with:
- Modern Next.js frontend (App Router)
- Express API backend
- MongoDB database for contacts, newsletter, analytics, and inquiries
- Admin panel for viewing submissions and analytics
- GA4 analytics + Sentry (client-side) integrated
- Built-in PDF resume generation

---

## Tech Stack
Frontend:
- Next.js 14.2.3
- React 18.3.1
- CSS (global styles + extra styles)

Backend:
- Node.js
- Express 5.2.1
- Mongoose 9.2.1
- Nodemailer (email)
- PDFKit (resume)
- CORS + dotenv

Database:
- MongoDB (local or Atlas)

Analytics & Monitoring:
- Google Analytics (GA4)
- Sentry (client-side browser SDK)

---

## Repository Layout
```
Project_02/
  frontend/                # Next.js app
  backend/                 # Express API server
  README.md
  TODO.md
```

Frontend key paths:
- `frontend/app/` (Next.js App Router pages)
- `frontend/app/components/` (UI components)
- `frontend/app/api/` (Next.js route handlers)
- `frontend/app/sitemap.js` and `frontend/app/robots.js`
- `frontend/app/layout.js` (SEO, GA4, Sentry init)
- `frontend/globals.css`

Backend key paths:
- `backend/server.js` (Express server)
- `backend/models/` (Mongoose models)
- `backend/utils/` (mailer)
- `backend/.env` (local env)
- `backend/.env.example`

---

## Features
Frontend:
- Landing page, About, Services, Projects, Contact
- Animated hero, strong UI/UX polish
- AI Chatbot widget
- Contact and newsletter forms
- SEO metadata, sitemap, robots
- GA4 events + Sentry client monitoring

Backend:
- Contact form API
- Newsletter subscription
- Service inquiry API
- Analytics tracking API
- Admin panel APIs
- Resume download API (PDF generated)

Admin:
- Login, analytics view, submission view, delete submissions

---

## Environment Variables
Frontend (`frontend/.env.example`):
```
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=
```

Backend (`backend/.env.example`):
```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/portfolio_db
ADMIN_EMAIL=hello@ashutoshranjan.com
ADMIN_PASSWORD=admin123
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
OWNER_EMAIL=hello@ashutoshranjan.com
ALLOWED_ORIGIN=*
```

---

## How to Run Locally
Frontend:
```
cd frontend
npm install
npm run dev
```
Build:
```
npm run build
npm start
```

Backend:
```
cd backend
npm install
npm run dev
```

---

## API Endpoints (Backend)
Public:
- `POST /api/contact`
- `POST /api/newsletter/subscribe`
- `POST /api/services/inquire`
- `POST /api/analytics/track`
- `GET /api/resume/download`

Admin:
- `POST /api/admin/login`
- `POST /api/admin/logout`
- `GET /api/admin/check`
- `GET /api/admin/submissions`
- `GET /api/admin/analytics`
- `DELETE /api/admin/submission/:type/:id`

---

## Deployment Notes
1. Set production env values in both frontend and backend.
2. Use MongoDB Atlas for production DB.
3. Update `ALLOWED_ORIGIN` to your production domain.
4. Make sure GA4 ID and Sentry DSN are set in frontend.
5. Run `npm run build` in `frontend/` before hosting.

---

## Current Build Status
Frontend builds successfully with `npm run build`.

---

## Maintenance Tips
- Keep `.env` secure and never commit real secrets.
- Regularly update dependencies and run `npm audit`.
- Monitor GA4 + Sentry dashboards after launch.

---

## Notes About GitHub
I could not find a `.git` folder in this workspace. That means:
- This looks like a local-only project copy.
- If you want GitHub, we should initialize git and add a remote.

If you want, I can:
1. Initialize git
2. Create `.gitignore`
3. Add remote and push
4. Generate a production checklist
