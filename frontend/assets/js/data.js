const projects = [
  {
    id: "servigo-platform",
    title: "ServiGo",
    category: "software",
    description:
      "On-demand appliance service platform with multi-role operations for customer booking, technician lifecycle, admin governance, and support-led caller booking.",
    stack: ["React (CRA)", "React Router", "Node.js", "Express", "MongoDB", "JWT", "Firebase OTP"],
    features: [
      "Role-based platform for Customer, Technician, Admin, and Support/Service Desk",
      "Service booking flow for AC, Fridge, and Geyser with booking timeline and notifications",
      "Technician dashboard for skills, availability, and job state transitions",
      "Support caller booking with mobile lookup, history, and optional service time",
      "Admin approvals for technician onboarding and protected management actions",
      "JWT auth + protected routes + Firebase OTP reset flow"
    ],
    liveUrl: "#",
    githubUrl: "#",
    screenshots: [
      "assets/media/projects/hr-1.svg",
      "assets/media/projects/hr-2.svg",
      "assets/media/projects/hr-3.svg"
    ],
    adminPreview: {
      title: "Operations & Admin Preview",
      images: [
        "assets/media/projects/front-1.svg",
        "assets/media/projects/front-2.svg"
      ],
      videoUrl: "#",
      architectureDiagram: "assets/media/projects/servigo-architecture.svg",
      notes: [
        "Service Desk-created technicians remain pending until Admin approval",
        "Support role is restricted from user blocking and elevated admin actions",
        "Customer 360 lookup by mobile/email enables booking history and operational resolution"
      ]
    }
  },
  {
    id: "ecommerce",
    title: "Multi-Vendor E-commerce Platform",
    category: "fullstack",
    description:
      "Scalable marketplace with vendor onboarding, catalog management, order tracking, and secure payment processing.",
    stack: ["React", "Node.js", "MongoDB", "Stripe API"],
    features: [
      "Vendor dashboard and approval flow",
      "Product management with stock tracking",
      "Secure checkout and order lifecycle",
      "Search and category-based discovery"
    ],
    liveUrl: "#",
    githubUrl: "#",
    screenshots: [
      "assets/media/projects/ecom-1.svg",
      "assets/media/projects/ecom-2.svg",
      "assets/media/projects/ecom-3.svg"
    ]
  },
  {
    id: "hr-dashboard",
    title: "HR Operations Dashboard",
    category: "fullstack",
    description:
      "Internal enterprise dashboard for attendance, payroll workflows, shift tracking, and employee analytics reports.",
    stack: ["Next.js", "Express", "PostgreSQL", "Prisma"],
    features: [
      "Attendance and leave lifecycle",
      "Payroll workflow with approval states",
      "Department-wise reporting dashboards",
      "CSV export for audit and compliance"
    ],
    liveUrl: "#",
    githubUrl: "#",
    screenshots: [
      "assets/media/projects/hr-1.svg",
      "assets/media/projects/hr-2.svg",
      "assets/media/projects/hr-3.svg"
    ]
  },
  {
    id: "portfolio-builder",
    title: "Portfolio Builder",
    category: "frontend",
    description:
      "Interactive portfolio generator with templates, drag-and-drop blocks, theme presets, and export-ready output.",
    stack: ["React", "TypeScript", "Tailwind", "Vite"],
    features: [
      "Template switch with live preview",
      "Drag-drop section management",
      "Theme and font customization",
      "Single-click deploy export"
    ],
    liveUrl: "#",
    githubUrl: "#",
    screenshots: [
      "assets/media/projects/front-1.svg",
      "assets/media/projects/front-2.svg",
      "assets/media/projects/front-3.svg"
    ]
  }
];

const skillCategories = {
  frontend: [
    { name: "HTML / CSS", value: 95, detail: "Semantic structure, responsive systems, and modern UI styling." },
    { name: "JavaScript", value: 90, detail: "ES6+, async patterns, API integration, and performance tuning." },
    { name: "React / Next.js", value: 88, detail: "Component architecture, hooks, routing, and SSR fundamentals." }
  ],
  backend: [
    { name: "Node.js", value: 88, detail: "REST APIs, auth flow, middleware structure, and service logic." },
    { name: "MongoDB", value: 84, detail: "Schema design, aggregations, and indexing for scalable queries." },
    { name: "PostgreSQL", value: 80, detail: "Relational modeling, joins, migrations, and transactional operations." }
  ],
  core: [
    { name: "DSA (C++)", value: 82, detail: "Problem solving with arrays, trees, graphs, and optimization patterns." },
    { name: "System Design", value: 76, detail: "Scalable architecture basics, caching, queues, and data flow." },
    { name: "Testing & Debugging", value: 85, detail: "Issue isolation, regression prevention, and release stability." }
  ]
};

const aboutStats = [
  { label: "Projects Delivered", value: 32, suffix: "+", detail: "Academic + freelance + product builds" },
  { label: "Production Features", value: 120, suffix: "+", detail: "Auth, dashboard, payments, operations modules" },
  { label: "Tech Stack Coverage", value: 20, suffix: "+", detail: "Frontend, backend, database, deployment tools" },
  { label: "Coding Journey", value: 4, suffix: "+ yrs", detail: "Continuous full stack development practice" },
  { label: "Client / Team Collaborations", value: 14, suffix: "+", detail: "Founder, operations, and dev-team delivery cycles" },
  { label: "Average Delivery Reliability", value: 96, suffix: "%", detail: "Milestones shipped on planned timeline" }
];

globalThis.projects = projects;
globalThis.skillCategories = skillCategories;
globalThis.aboutStats = aboutStats;
