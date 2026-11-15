export interface ServiceDetail {
  letter: string;
  includes: string[];
  for: string;
  stages: string[];
  deliverables: string[];
  cta: string;
}

// These are practical descriptions of the published service categories, not
// claims about completed projects, clients, certifications or guarantees.
export const serviceDetails: ServiceDetail[] = [
  {
    letter: "A",
    includes: ["Engineering consultancy", "Infrastructure planning", "Civil works coordination"],
    for: "Clients with an infrastructure, civil works or technical delivery brief.",
    stages: ["Discover", "Plan", "Design", "Build", "Deliver"],
    deliverables: ["Defined technical scope", "Design coordination", "Delivery support"],
    cta: "Discuss an infrastructure brief",
  },
  {
    letter: "B",
    includes: ["Building construction", "Built-environment delivery", "Site and programme coordination"],
    for: "Residential, commercial and institutional building requirements.",
    stages: ["Discover", "Plan", "Design", "Build", "Deliver"],
    deliverables: ["Project delivery plan", "Construction coordination", "Handover support"],
    cta: "Discuss a construction project",
  },
  {
    letter: "C",
    includes: ["Eco-conscious design", "Architecture coordination", "Engineering design"],
    for: "Projects that need design decisions informed by environmental responsibility.",
    stages: ["Discover", "Plan", "Design", "Review", "Deliver"],
    deliverables: ["Design brief", "Concept coordination", "Technical design inputs"],
    cta: "Discuss a design brief",
  },
  {
    letter: "D",
    includes: ["Quantity surveying", "Cost planning", "Project management"],
    for: "Clients who need clearer cost, programme and delivery control across a project lifecycle.",
    stages: ["Discover", "Plan", "Cost", "Manage", "Deliver"],
    deliverables: ["Cost plan", "Programme inputs", "Project coordination"],
    cta: "Discuss project controls",
  },
  {
    letter: "E",
    includes: ["Green construction", "Renewable energy solutions", "Lower-impact development planning"],
    for: "Projects seeking practical sustainability and renewable energy pathways.",
    stages: ["Assess", "Plan", "Design", "Implement", "Review"],
    deliverables: ["Sustainability priorities", "Solution options", "Implementation inputs"],
    cta: "Discuss a sustainability brief",
  },
  {
    letter: "F",
    includes: ["Environmental solutions", "Climate resilience", "Nature-based solutions"],
    for: "Organizations and projects addressing environmental, climate or ecosystem considerations.",
    stages: ["Understand", "Assess", "Plan", "Act", "Learn"],
    deliverables: ["Environmental priorities", "Resilience options", "Action planning inputs"],
    cta: "Discuss an environmental brief",
  },
  {
    letter: "G",
    includes: ["AI-enabled applications", "Data analysis", "Digital and modern technology"],
    for: "Engineering and infrastructure teams looking to apply digital tools to practical problems.",
    stages: ["Define", "Explore", "Prototype", "Apply", "Improve"],
    deliverables: ["Use-case definition", "Digital solution options", "Implementation pathway"],
    cta: "Discuss a technology need",
  },
  {
    letter: "H",
    includes: ["Procurement", "Supply chain support", "General supplies"],
    for: "Projects and institutions that need organized sourcing and supply support.",
    stages: ["Understand", "Source", "Evaluate", "Coordinate", "Deliver"],
    deliverables: ["Procurement brief", "Sourcing options", "Supply coordination"],
    cta: "Discuss a procurement requirement",
  },
];
