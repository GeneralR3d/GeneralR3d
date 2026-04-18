export const socialLinks = {
  github: "",
  linkedin: "",
  substack: "",
  email: "tdrdingren@gmail.com",
};

export type Experience = {
  company: string;
  role: string;
  period: string;
  location: string;
  bullets: string[];
  tags: string[];
  gradient: string;
};

export const experiences: Experience[] = [
  {
    company: "Sky9 Capital",
    role: "Full Stack Software Engineer Intern",
    period: "Jul – Dec 2025",
    location: "San Francisco Bay Area",
    bullets: [
      "Sole engineer across the full lifecycle of multiple consumer web apps — from product discovery and Figma wireframing to full-stack production deployment.",
      "Architected proprietary LLM data pipelines for automated credit card analysis; a multi-step context engine strategy lifted transaction recognition accuracy to 90%.",
      "Configured automated deployment across AWS, Vercel, and Render, achieving 99.9% uptime.",
      "Led GTM technical strategy integrating Google Analytics to drive data-informed iteration and early customer acquisition.",
      "Contributed architectural and design recommendations for an AI-based browser control agent.",
    ],
    tags: ["React", "TypeScript", "Vite", "NestJS", "PostgreSQL", "Prisma", "Nginx", "AWS"],
    gradient: "from-sky-500 via-blue-600 to-indigo-500",
  },
  {
    company: "Synapxe",
    role: "AI Engineer Intern",
    period: "Jan – Jul 2025",
    location: "Singapore",
    bullets: [
      "Built ADAPT end-to-end — an LLM-powered education platform for healthcare professionals; successful UAT across 5 public hospitals with >75% satisfaction rate.",
      "Led architecture migration of an internal RAG chatbot to LangGraph with metadata filtering and DuckDB structured-data querying, improving response quality by >30%.",
      "Developed automated testing pipelines for RAG chatbots using the RAGAS framework (contextual recall, faithfulness, relevancy, factual correctness).",
      "Engineered adversarial testing against prompt injection and jailbreaking using LLM-as-judge and Project Moonshot datasets.",
    ],
    tags: ["LangGraph", "LangChain", "RAG", "DuckDB", "RAGAS", "Python", "LLMs"],
    gradient: "from-teal-500 via-emerald-500 to-green-600",
  },
  {
    company: "P.T. Superbank",
    role: "Software Engineering (AI) Intern",
    period: "Jun – Aug 2024",
    location: "Jakarta, Indonesia",
    bullets: [
      "Contributed to a centralized AI platform for customer service interactions, targeting 40% faster response times and 35% higher satisfaction.",
      "Spearheaded evaluation of 50+ text embedding models to inform RAG development strategy.",
      "Leveraged AWS Bedrock to support RAG application infrastructure and deployment.",
      "Gained hands-on experience with Kubernetes, CI/CD pipelines, and Golang microservice development.",
    ],
    tags: ["AWS Bedrock", "RAG", "Python", "Golang", "Kubernetes", "CI/CD"],
    gradient: "from-amber-500 via-orange-500 to-red-500",
  },
  {
    company: "NTU",
    role: "Undergrad Student Researcher",
    period: "Aug 2023 – Jun 2024",
    location: "Singapore",
    bullets: [
      "Established research methodologies for pre-processing trajectory data and training an ML model to predict badminton shuttlecock flight paths mid-air.",
      "Developed a Python control system for a robot to intercept and return the shuttlecock, forming the foundation of an AI-powered robotic sports assistant.",
    ],
    tags: ["Python", "Machine Learning", "Computer Vision", "Robotics"],
    gradient: "from-red-500 via-rose-500 to-pink-500",
  },
  {
    company: "Grab",
    role: "Field Operations Specialist",
    period: "Feb – Jun 2022",
    location: "Singapore",
    bullets: [
      "Co-developed an employee performance and incentive tracking system — a small-scale web database for part-timers.",
      "Accelerated testing and launch of a pilot autonomous robot delivery service at Siloso Beach, a 4-way partnership between Grab, Sentosa Development Corp, NCS Technologies, and Singtel.",
      "Ensured safe operation of the autonomous delivery robot and engaged public and tourists on the future of autonomous logistics.",
    ],
    tags: ["Web Development", "Autonomous Robotics", "Operations"],
    gradient: "from-green-400 via-emerald-500 to-teal-500",
  },
];

export type Project = {
  name: string;
  description: string;
  gradient: string;
};

export const projects: Project[] = [
  {
    name: "Project One",
    description: "Placeholder description. What it does and why it matters.",
    gradient: "from-violet-500 via-indigo-500 to-blue-500",
  },
  {
    name: "Project Two",
    description: "Placeholder description. What it does and why it matters.",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
  },
  {
    name: "Project Three",
    description: "Placeholder description. What it does and why it matters.",
    gradient: "from-pink-500 via-rose-500 to-red-500",
  },
  {
    name: "Project Four",
    description: "Placeholder description. What it does and why it matters.",
    gradient: "from-yellow-500 via-amber-500 to-orange-500",
  },
];
