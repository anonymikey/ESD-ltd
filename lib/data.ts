// ---------------------------------------------------------------------------
// Site content, sourced from EcoStruct Dynamics Limited's official 19-page
// company profile. Do not add facts (clients, projects, stats, certifications,
// awards) that are not present in that source document.
// ---------------------------------------------------------------------------

export const site = {
  name: "EcoStruct Dynamics Limited",
  shortName: "EcoStruct Dynamics",
  tagline: "Engineering Sustainable Solutions for People and Planet",
  domain: "ecostructdynamicsltd.com",
  url: "https://ecostructdynamicsltd.com",
  emails: {
    website: "info@ecostructdynamicsltd.com",
    official: "econstructdynamicsltd@gmail.com",
    direct: "tony@ecostructdynamicsltd.com",
  },
  phone: "+254 718 222 758",
  registeredOffice: {
    line1: "Hilltop Plaza, Kwashibu Road",
    line2: "Mwembe Tayari, Mombasa, Kenya",
  },
  postalAddress: {
    line1: "P.O. Box 87347-80100",
    line2: "Mombasa G.P.O., Kenya",
  },
  registration: {
    number: "PVT-3B1V88V3",
    date: "6 May 2025",
  },
  description:
    "EcoStruct Dynamics Limited is a multidisciplinary engineering, infrastructure and sustainability company delivering integrated solutions in construction, technology, procurement and environmental sectors.",
};

export const vision =
  "To become a leading African company delivering innovative, sustainable, and commercially successful engineering, infrastructure, technology, procurement, and development solutions.";

export const mission =
  "To provide high-quality, innovative, efficient, and sustainable products, services, and project solutions that create value for clients, generate economic opportunity, and contribute to resilient communities and a healthier planet.";

export const coreValues = [
  "Integrity",
  "Excellence",
  "Innovation",
  "Sustainability",
  "Safety",
  "Inclusion",
  "Customer Value",
];

export const navLinks = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Sustainability", href: "/#sustainability" },
  { label: "Contact", href: "/#contact" },
];

// The seven integrated capability areas featured prominently on the
// homepage, per the official company profile's "one company, multiple
// capabilities" positioning.
export const capabilities = [
  { name: "Engineering", description: "Technical design and engineering across disciplines." },
  { name: "Construction", description: "Building and civil works delivery." },
  { name: "Infrastructure", description: "Infrastructure planning and development." },
  { name: "Procurement", description: "Procurement, supply chain and general supplies." },
  { name: "Technology", description: "AI-enabled and digital solutions." },
  { name: "Sustainability", description: "Green and blue economy solutions." },
  { name: "Enterprise", description: "Advisory, healthcare supply, and inclusive business support." },
];

// The company profile describes a broader operating footprint than the
// seven core capabilities above. Presented as a compact tag list rather
// than expanded sections, to communicate breadth without overwhelming.
export const operatingAreas = [
  "Engineering",
  "Construction",
  "Infrastructure",
  "Procurement",
  "Supply",
  "Project Management",
  "Technology",
  "Sustainability",
  "Renewable Energy",
  "Environmental Solutions",
  "Green Economy",
  "Blue Economy",
  "AI",
  "Digital Solutions",
  "Healthcare Supplies",
  "Humanitarian Support",
  "Agriculture",
  "Professional Advisory",
  "Marketing & Commercial Spaces",
  "Inclusive Business",
];

// Eight strategic service categories grouping the company's full service
// portfolio. Descriptions are concise summaries derived from the category
// titles in the official profile — full detail lives on the /services page.
export const serviceCategories = [
  {
    letter: "A",
    name: "Engineering, Infrastructure & Civil Works",
    description:
      "Technical engineering and civil works supporting infrastructure from design through delivery.",
  },
  {
    letter: "B",
    name: "Building Construction & Built Environment",
    description:
      "Construction and built-environment delivery across residential, commercial and institutional works.",
  },
  {
    letter: "C",
    name: "Eco Design, Architecture & Engineering",
    description:
      "Architectural and engineering design informed by sustainable, ecologically responsible principles.",
  },
  {
    letter: "D",
    name: "Quantity Surveying, Cost & Project Management",
    description:
      "Cost planning, quantity surveying and project management across the project lifecycle.",
  },
  {
    letter: "E",
    name: "Green Construction & Renewable Energy",
    description:
      "Sustainable construction methods and renewable energy solutions for lower-impact development.",
  },
  {
    letter: "F",
    name: "Environmental, Climate & Nature-Based Solutions",
    description:
      "Environmental management, climate resilience and nature-based solutions for lasting impact.",
  },
  {
    letter: "G",
    name: "AI, Digital & Modern Technology",
    description:
      "AI-enabled applications and modern digital tools applied to engineering and infrastructure work.",
  },
  {
    letter: "H",
    name: "Procurement, Supply Chain & General Supplies",
    description:
      "Procurement and supply chain services, including general supplies for projects and institutions.",
  },
];

export const greenEconomy = [
  "Green construction",
  "Renewable energy",
  "Climate resilience",
  "Sustainable agriculture",
  "Agroforestry",
  "Circular economy",
];

export const blueEconomy = [
  "Coastal infrastructure",
  "Blue carbon",
  "Mangrove restoration",
  "Marine biodiversity",
  "Coastal resilience",
];

export const techCapabilities = [
  "AI-enabled applications",
  "Data analysis",
  "Predictive analytics",
  "Automation",
  "CAD",
  "3D modelling",
  "GIS",
  "Smart infrastructure",
  "IoT",
  "Digital transformation",
];

export const impactGroups = [
  {
    name: "Youth",
    description: "Creating pathways for young people into engineering and technical work.",
  },
  {
    name: "Women",
    description: "Supporting the participation of women across project and business roles.",
  },
  {
    name: "Persons with disabilities",
    description: "Working toward accessible, inclusive participation in our projects.",
  },
  {
    name: "Marginalized communities",
    description: "Directing attention to communities that are often left out of development.",
  },
  {
    name: "Local enterprises",
    description: "Engaging local businesses as partners within our supply chain.",
  },
];

export const qualitySafety = [
  "Quality assurance",
  "Occupational health and safety",
  "Environmental responsibility",
  "Responsible procurement",
  "Risk management",
  "Ethical business practices",
  "Transparent reporting",
  "Professional accountability",
  "Continuous improvement",
];

export const valueProposition = {
  statement: "One Company. Multiple Capabilities. Integrated Solutions.",
  focusAreas: [
    "Quality",
    "Efficiency",
    "Innovation",
    "Sustainability",
    "Inclusion",
    "Safety",
    "Value for Money",
  ],
};

// Generic project workflow — not a company-specific claim, just the stages a
// project moves through. Wording is editable here without touching layout.
export const processSteps = [
  { number: "01", title: "Discover", description: "Understand the brief, the site, and the constraints that will shape the work." },
  { number: "02", title: "Plan", description: "Set a clear technical and programme plan before any ground is broken." },
  { number: "03", title: "Design", description: "Develop the engineering and architectural detail behind the plan." },
  { number: "04", title: "Build", description: "Execute against spec, safety standards and programme, closely managed." },
  { number: "05", title: "Deliver", description: "Hand over with documentation, and quality verified against the brief." },
];
