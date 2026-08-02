/* ============================================================
   PROJECTS DATA
   ============================================================
   Each object here becomes one card in the "Selected work" grid
   and feeds the project detail modal. To add a new project, add
   another object to this array — js/components/cards.js takes
   care of turning it into the same markup the cards already use.

   Field reference:
     mark        - short monogram shown on the card / modal banner
     img         - optional cover photo path; leave "" to keep the
                   gradient poster background
     title       - full name, used in the modal and data-title
     cardTitle   - optional shorter name shown on the card itself
                   (falls back to `title` if omitted)
     type        - category shown as a pill in the modal (e.g. "Web App")
     tags        - full tech/keyword list, used for the modal tag
                   pills AND for matching against the skills dock
     desc        - full description shown in the modal
     cardDesc    - one-line summary shown directly on the card
     github      - repo URL for the "View on GitHub" modal button
     status      - "done" | "in-progress" -> drives the status pill
     icons       - curated list of tech names (must exist in
                   TECH_ICONS) shown as icons in the card footer
     personIcon  - "team" | "solo" -> which footer icon to show
   ============================================================ */
window.PROJECTS_DATA = [
  {
    mark: "KS",
    img: "",
    title: "Kaligandaki Suppliers",
    type: "Web App",
    tags: ["Django", "Python", "PostgreSQL"],
    desc: "A web-based inventory management system built for a real supplier business — Kaligandaki Suppliers. Handles inventory tracking, billing support, product management, and a few practical workflows that make daily operations easier.",
    cardDesc: "Inventory management system for a real supplier business.",
    github: "https://github.com/divya-ay/KaligandakiSuppliers-inventory-Management.git",
    status: "done",
    icons: ["Django", "Python", "PostgreSQL", "Figma", "Docker", "GitHub"],
    personIcon: "team"
  },
  {
    mark: "QH",
    img: "",
    title: "QuizHub",
    type: "Web App",
    tags: ["React", "Realtime", "JavaScript", "Python", "Django"],
    desc: "A multiplayer quiz platform inspired by Kahoot. This project is a bit special because I am trying to build a platform where me and my long distance cousin can play games/ quizzes together. Also, Players may join live rooms and compete on shared questions as scores update instantly.",
    cardDesc: "Multiplayer quiz platform, Kahoot-inspired.",
    github: "https://github.com/divya-ay/QuizHub.git",
    status: "in-progress",
    icons: ["Django", "Python", "Docker", "GitHub"],
    personIcon: "solo"
  },
  {
    mark: "WS",
    img: "",
    title: "Water Sampler",
    type: "Mobile App",
    tags: ["React Native", "Node.js", "Express", "TypeScript"],
    desc: "A mobile application focused on monitoring and control workflows for water sampling, built with a simple, practical interface so field data stays easy to capture and review.",
    cardDesc: "Mobile app for water sampling monitoring.",
    github: "https://github.com/Bibek2442B/WaterSampler.git",
    status: "done",
    icons: ["React", "Express", "TypeScript", "Figma", "GitHub"],
    personIcon: "team"
  },
  {
    mark: "NS",
    img: "",
    title: "Netflix Stock Prediction",
    type: "Data / ML",
    tags: ["Python", "Pandas", "Scikit-Learn"],
    desc: "A machine learning project comparing Linear Regression and K-Nearest Neighbors models to predict Netflix stock prices from historical data, with an emphasis on data cleaning and model evaluation.",
    cardDesc: "ML models predicting Netflix stock price.",
    github: "https://github.com/divya-ay/NETFLIX-NFLX-STOCK-CLOSING-PRICE-PREDICTION.git",
    status: "done",
    icons: ["Python", "Pandas", "Scikit-Learn", "NumPy", "Jupyter", "Matplotlib"],
    personIcon: "team"
  },
  {
    mark: "PT",
    img: "",
    title: "Portfolio Website",
    cardTitle: "Portfolio",
    type: "Web App",
    tags: ["HTML", "CSS", "JavaScript"],
    desc: "My personal portfolio website, built to showcase projects, skills, and contact details with a clean responsive design.",
    cardDesc: "This site showing my work and skills.",
    github: "https://github.com/divya-ay/myPortfolio",
    status: "in-progress",
    icons: ["HTML", "CSS", "JavaScript", "GitHub"],
    personIcon: "solo"
  }
];
