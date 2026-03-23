/**
 * Portfolio Website - Server Entry Point
 * 
 * This is the main server file. Run with: node server.js
 * For development with auto-restart: npm run dev
 * 
 * ===========================================
 * DEPLOYMENT NOTES:
 * ===========================================
 * 
 * 1. For production, configure your .env file:
 *    - Copy .env.example to .env
 *    - Update MONGODB_URI with your database connection
 *    - Set secure ADMIN_EMAIL and ADMIN_PASSWORD
 *    - Configure SMTP settings for email notifications
 * 
 * 2. To start the server:
 *    - Development: npm run dev (requires nodemon)
 *    - Production: node server.js
 * 
 * 3. The server serves:
 *    - Frontend SPA at: http://localhost:5000
 *    - Admin panel at: http://localhost:5000/#/admin
 *    - API endpoints at: http://localhost:5000/api/*
 * 
 */

require("dotenv").config({ path: __dirname + "/.env" });
const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const PDFDocument = require("pdfkit");
const crypto = require("crypto");
const ContactSubmission = require("./models/ContactSubmission");
const Newsletter = require("./models/Newsletter");
const Analytics = require("./models/Analytics");
const ServiceInquiry = require("./models/ServiceInquiry");
const { createTransporter } = require("./utils/mailer");

const app = express();
app.set("trust proxy", 1);
app.disable("x-powered-by");
const PORT = Number(process.env.PORT || 5000);
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/portfolio_db";
const FRONTEND_URL = process.env.FRONTEND_URL || "";

// ============================================================
// ADMIN CONFIGURATION - FOR PRODUCTION DEPLOYMENT
// ============================================================
// To set your admin credentials, add these to your .env file:
// ADMIN_EMAIL=your-email@example.com
// ADMIN_PASSWORD=your-secure-password

let adminCredentials = {
  email: process.env.ADMIN_EMAIL || "helloashutosh1@outlook.com",
  password: process.env.ADMIN_PASSWORD || "admin123"
};

if (process.env.NODE_ENV === "production") {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD === "admin123") {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set to secure values in production.");
  }
}

let adminSession = null;
const adminSessions = new Map();
const SESSION_TTL_MS = 1000 * 60 * 60 * 12;

// Security + rate limiting
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false
});

const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false
});

const newsletterLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false
});

const allowedOrigins = (process.env.ALLOWED_ORIGIN || "*")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Accept", "Authorization"]
}));

// Enhanced middleware
app.use("/api", limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const parseCookies = (cookieHeader = "") => {
  const out = {};
  cookieHeader.split(";").forEach((part) => {
    const [k, ...v] = part.split("=");
    if (!k) return;
    out[k.trim()] = decodeURIComponent(v.join("=").trim() || "");
  });
  return out;
};

const sanitize = (value, max = 200) => {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
};

const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

const createSession = (email) => {
  const token = crypto.randomBytes(24).toString("hex");
  adminSessions.set(token, { email, exp: Date.now() + SESSION_TTL_MS });
  return token;
};

const getSession = (req) => {
  const cookies = parseCookies(req.headers.cookie || "");
  const token = cookies.admin_session;
  if (!token) return null;
  const entry = adminSessions.get(token);
  if (!entry) return null;
  if (entry.exp < Date.now()) {
    adminSessions.delete(token);
    return null;
  }
  return { token, ...entry };
};

const setAdminCookie = (res, token) => {
  const isProd = process.env.NODE_ENV === "production";
  const secure = isProd ? "Secure; " : "";
  const sameSite = isProd ? "Strict" : "Lax";
  res.setHeader(
    "Set-Cookie",
    `admin_session=${token}; Path=/; HttpOnly; ${secure}SameSite=${sameSite}; Max-Age=${Math.floor(
      SESSION_TTL_MS / 1000
    )}`
  );
};

const clearAdminCookie = (res) => {
  res.setHeader(
    "Set-Cookie",
    "admin_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0"
  );
};


// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });

// ============ NEWSLETTER API ============
app.post("/api/newsletter/subscribe", newsletterLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    const safeEmail = sanitize(email, 254);
    if (!safeEmail || !isValidEmail(safeEmail)) {
      return res.status(400).json({ success: false, message: "Please provide a valid email address." });
    }

    const existing = await Newsletter.findOne({ email: safeEmail.toLowerCase() });
    if (existing && existing.status === 'active') {
      return res.status(409).json({ success: false, message: "This email is already subscribed!" });
    }

    if (existing) {
      existing.status = 'active';
      await existing.save();
    } else {
      await Newsletter.create({ email: safeEmail.toLowerCase() });
    }

    return res.status(201).json({ success: true, message: "Successfully subscribed!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unable to subscribe right now." });
  }
});

// Health check (Render)
app.get("/health", (_req, res) => {
  return res.status(200).json({ status: "ok", time: new Date().toISOString() });
});

// ============ ANALYTICS API ============
app.post("/api/analytics/track", async (req, res) => {
  try {
    const { eventType, page, projectId } = req.body;
    const validEvents = ['page_view', 'project_view', 'download_resume', 'contact_click', 'external_link'];
    if (!eventType || !validEvents.includes(eventType)) {
      return res.status(400).json({ success: false, message: "Invalid event type." });
    }

    await Analytics.create({
      eventType,
      page: sanitize(page || '/', 200),
      projectId: sanitize(projectId || "", 80) || null,
      referrer: req.get('referer') || null,
      userAgent: req.get('user-agent') || null
    });

    return res.status(201).json({ success: true });
  } catch (error) {
    return res.status(201).json({ success: true });
  }
});

// ============ SERVICE INQUIRY API ============
app.post("/api/services/inquire", contactLimiter, async (req, res) => {
  try {
    const { name, email, company, serviceType, projectScope, budget, timeline, requirements } = req.body;

    const safeName = sanitize(name, 100);
    const safeEmail = sanitize(email, 254);
    const safeService = sanitize(serviceType, 80);
    const safeReq = sanitize(requirements, 2000);

    if (!safeName || !safeEmail || !isValidEmail(safeEmail) || !safeService || !safeReq) {
      return res.status(400).json({ success: false, message: "Name, email, service type, and requirements are required." });
    }

    const inquiry = await ServiceInquiry.create({
      name: safeName,
      email: safeEmail,
      company: sanitize(company || "", 120),
      serviceType: safeService,
      projectScope: sanitize(projectScope || "medium", 40),
      budget: sanitize(budget || "", 40),
      timeline: sanitize(timeline || "", 40),
      requirements: safeReq
    });

    return res.status(201).json({ success: true, message: "Your inquiry has been submitted!", id: inquiry._id });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unable to submit inquiry." });
  }
});

// ============ CONTACT API ============
app.post("/api/contact", contactLimiter, async (req, res) => {
  try {
    const { name, email, projectType, budget, message } = req.body;
    const safeName = sanitize(name, 100);
    const safeEmail = sanitize(email, 254);
    const safeMessage = sanitize(message, 2000);
    const safeProjectType = sanitize(projectType || "", 80);
    const safeBudget = sanitize(budget || "", 40);

    if (!safeName || !safeEmail || !isValidEmail(safeEmail) || !safeMessage) {
      return res.status(400).json({ success: false, message: "Name, email, and message are required." });
    }

    const submission = await ContactSubmission.create({
      name: safeName,
      email: safeEmail,
      projectType: safeProjectType,
      budget: safeBudget,
      message: safeMessage
    });

    return res.status(201).json({ success: true, message: "Your message has been submitted successfully.", id: submission._id });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unable to submit your message right now." });
  }
});

// ============ RESUME DOWNLOAD ============
app.get("/api/resume/download", (_req, res) => {
  const fileName = "Ashutosh-Ranjan-Resume.pdf";
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(res);

  doc.fontSize(26).fillColor("#0a8f6a").text("Ashutosh Ranjan", { continued: true }).fillColor("#112031").text("  |  Full Stack Developer");
  doc.moveDown(0.5);
  doc.fontSize(11).fillColor("#4b6078").text("Email: helloashutosh1@outlook.com  |  GitHub: github.com/webdevashu123  |  LinkedIn: linkedin.com/in/ashutosh-ranjan-dev/");
  doc.moveDown();

  doc.fontSize(14).fillColor("#112031").text("Professional Summary");
  doc.moveDown(0.2);
  doc.fontSize(11).fillColor("#334e68").text("Full stack developer focused on building production-grade software products with scalable backend architecture and polished frontend experiences.");

  doc.moveDown();
  doc.fontSize(14).fillColor("#112031").text("Skills");
  doc.moveDown(0.2);
  doc.fontSize(11).fillColor("#334e68").text("Frontend: HTML, CSS, JavaScript, React, Next.js, Tailwind").text("Backend: Node.js, Express, REST APIs, Authentication").text("Database: MongoDB, PostgreSQL").text("Tools: Git, Docker, AWS basics");

  doc.moveDown();
  doc.fontSize(14).fillColor("#112031").text("Projects");
  doc.moveDown(0.2);
  doc.fontSize(11).fillColor("#334e68").text("- ServiGo: Multi-role appliance service platform with role-based access").text("- IMC Billing System: Billing, inventory, and analytics dashboard").text("- HR Operations Dashboard: Attendance and payroll workflow automation");

  doc.moveDown();
  doc.fontSize(14).fillColor("#112031").text("Availability");
  doc.moveDown(0.2);
  doc.fontSize(11).fillColor("#334e68").text("Open for full-time roles and freelance projects.");
  doc.moveDown(0.5);
  doc.fontSize(10).fillColor("#6b7d90").text(`Generated on ${new Date().toDateString()}`);

  doc.end();
});

// ============ ADMIN LOGIN ============
app.post("/api/admin/login", authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    const safeEmail = sanitize(email, 254);
    const safePassword = sanitize(password, 200);
    
    if (!safeEmail || !safePassword) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    if (safeEmail === adminCredentials.email && safePassword === adminCredentials.password) {
      adminSession = { email: safeEmail, loginTime: new Date().toISOString() };
      const token = createSession(safeEmail);
      setAdminCookie(res, token);
      return res.status(200).json({ 
        success: true, 
        message: "Login successful",
        admin: { email: safeEmail }
      });
    } else {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Login error" });
  }
});

// ============ ADMIN LOGOUT ============
app.post("/api/admin/logout", (req, res) => {
  const session = getSession(req);
  if (session?.token) {
    adminSessions.delete(session.token);
  }
  adminSession = null;
  clearAdminCookie(res);
  return res.status(200).json({ success: true, message: "Logged out" });
});

// ============ ADMIN CHECK ============
app.get("/api/admin/check", (req, res) => {
  const session = getSession(req);
  if (session || adminSession) {
    return res.status(200).json({ 
      success: true, 
      authenticated: true,
      admin: { email: session?.email || adminSession?.email }
    });
  }
  return res.status(200).json({ success: true, authenticated: false });
});

// Middleware to check admin authentication
const requireAdmin = (req, res, next) => {
  const session = getSession(req);
  if (!session && !adminSession) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  next();
};

// ============ ADMIN: GET ALL SUBMISSIONS ============
app.get("/api/admin/submissions", requireAdmin, async (_req, res) => {
  try {
    const contacts = await ContactSubmission.find().sort({ createdAt: -1 }).limit(100);
    const serviceInquiries = await ServiceInquiry.find().sort({ createdAt: -1 }).limit(100);
    const newsletters = await Newsletter.find().sort({ createdAt: -1 }).limit(100);
    
    return res.status(200).json({
      success: true,
      data: {
        contacts,
        serviceInquiries,
        newsletters,
        stats: {
          totalContacts: contacts.length,
          totalInquiries: serviceInquiries.length,
          totalSubscribers: newsletters.filter(n => n.status === 'active').length
        }
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching data" });
  }
});

// ============ ADMIN: GET ANALYTICS ============
app.get("/api/admin/analytics", requireAdmin, async (_req, res) => {
  try {
    const pageViews = await Analytics.find({ eventType: 'page_view' }).sort({ createdAt: -1 }).limit(100);
    const projectViews = await Analytics.find({ eventType: 'project_view' }).sort({ createdAt: -1 }).limit(50);
    const downloads = await Analytics.find({ eventType: 'download_resume' }).sort({ createdAt: -1 }).limit(50);
    
    const uniqueVisitors = await Analytics.distinct('userAgent');
    
    return res.status(200).json({
      success: true,
      data: {
        pageViews,
        projectViews,
        downloads,
        stats: {
          totalPageViews: pageViews.length,
          totalProjectViews: projectViews.length,
          totalResumeDownloads: downloads.length,
          uniqueVisitors: uniqueVisitors.length
        }
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching analytics" });
  }
});

// ============ ADMIN: DELETE SUBMISSION ============
app.delete("/api/admin/submission/:type/:id", requireAdmin, async (req, res) => {
  try {
    const { type, id } = req.params;
    let Model;
    
    switch (type) {
      case 'contact':
        Model = ContactSubmission;
        break;
      case 'inquiry':
        Model = ServiceInquiry;
        break;
      case 'newsletter':
        Model = Newsletter;
        break;
      default:
        return res.status(400).json({ success: false, message: "Invalid type" });
    }
    
    await Model.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error deleting" });
  }
});

// ============ ADMIN: UPDATE CREDENTIALS ============
app.post("/api/admin/update-credentials", requireAdmin, async (req, res) => {
  try {
    const { email, password } = req.body;

    const safeEmail = sanitize(email, 254);
    const safePassword = sanitize(password, 200);

    if (safeEmail) adminCredentials.email = safeEmail;
    if (safePassword) adminCredentials.password = safePassword;
    
    return res.status(200).json({ success: true, message: "Credentials updated. Restart server for changes to take effect." });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error updating credentials" });
  }
});

// ============ RESUME PDF ============
// Place your resume.pdf in the frontend folder and it will be accessible at /resume.pdf
app.get("/resume.pdf", (_req, res) => {
  if (process.env.NODE_ENV === "production" && FRONTEND_URL) {
    return res.redirect(`${FRONTEND_URL.replace(/\/$/, "")}/resume.pdf`);
  }
  return res.redirect("/api/resume/download");
  return res.sendFile(resumePath, (err) => {
    if (err) {
      res.redirect("/api/resume/download");
    }
  });
});

// ============ FALLBACK ROUTES ============
app.get("/", (_req, res) => {
  return res.status(200).json({
    status: "ok",
    service: "portfolio-backend",
    time: new Date().toISOString()
  });
});

// Global error handler
app.use((err, _req, res, _next) => {
  if (err && err.message && err.message.includes("CORS")) {
    return res.status(403).json({ success: false, message: "CORS blocked for this origin." });
  }
  console.error("Unhandled error:", err);
  return res.status(500).json({ success: false, message: "Server error." });
});

// ============ START SERVER ============
app.listen(PORT, () => {
  console.log(`\n🌐 Server running on http://localhost:${PORT}`);
  console.log(`📝 Admin Panel: http://localhost:${PORT}/#/admin`);
  console.log(`📄 Resume: http://localhost:${PORT}/resume.pdf\n`);
});


