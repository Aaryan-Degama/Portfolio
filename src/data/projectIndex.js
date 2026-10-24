import { NEON } from "../theme/palette";

// Every project page reads from here: the category listings, the hero facts
// and the "next project" link at the foot of each detail page.

export const categories = {
  "information-retrieval": {
    title: "Information Retrieval",
    lines: ["Information", "Retrieval"],
    crumb: "Information retrieval",
    path: "/projects/information-retrieval",
    intro:
      "Finding the right thing in data you already have: plain-sentence search over a phone's photo library with nothing uploaded, and expert ties traced through a research graph with a DOI behind every one.",
  },
  "low-level-systems": {
    title: "Low-Level Systems",
    lines: ["Low-Level", "Systems"],
    crumb: "Low-level systems",
    path: "/projects/low-level-systems",
    intro:
      "Written from the pixel buffer up: a computer vision toolkit in plain C++17, with portrait blur from a MiDaS depth map and no OpenCV.",
  },
  "shipped-systems": {
    title: "Shipped Systems",
    lines: ["Shipped", "Systems"],
    crumb: "Shipped systems",
    path: "/projects/shipped-systems",
    intro:
      "Software deployed on real data: a serverless timetable for 1,801 IIIT Allahabad students, and a rooftop-solar checker on real weather.",
  },
};

export const projects = [
  {
    slug: "vanta",
    name: "Vanta",
    category: "information-retrieval",
    neon: NEON.magenta,
    kind: "Personal project, with Divy Vaghasiya",
    summary:
      "Search your photo library in plain sentences, entirely on an Android phone. CLIP, ArcFace and a fine-tuned BERT-tiny behind one C++ core.",
    stack: ["C++", "JNI", "ONNX Runtime", "sqlite-vec"],
    repo: "https://github.com/Aaryan-Degama/Vanta",
  },
  {
    slug: "tietrace",
    name: "TieTrace",
    category: "information-retrieval",
    neon: NEON.violet,
    kind: "Hackathon project, with Abdul Azeem",
    summary:
      "Checks how connected an expert in a story is to the company it covers, from an OpenAlex research graph in FalkorDB, with a DOI behind every tie.",
    stack: ["Python", "MCP", "FalkorDB", "OpenAlex"],
    repo: "https://github.com/Aaryan-Degama/TieTrace",
  },
  {
    slug: "slate",
    name: "Slate",
    category: "shipped-systems",
    neon: NEON.ember,
    kind: "Hackathon project, team of three",
    summary:
      "The real timetable of 1,801 IIIT Allahabad students on serverless AWS, with class changes guarded by a Cedar policy.",
    stack: ["AWS Amplify", "Lambda", "DynamoDB", "Cedar"],
    repo: "https://github.com/Aaryan-Degama/slate",
    live: "https://main.dosqfo1xoqa7l.amplifyapp.com",
  },
  {
    slug: "dhool",
    name: "Dhool",
    category: "shipped-systems",
    neon: NEON.lime,
    kind: "Solo hackathon project, WeMakeDevs × AWS",
    summary:
      "Tells a rooftop-solar household what its roof should have made in today's weather, and whether to wash the panels, call the vendor or wait.",
    stack: ["AWS SAM", "Lambda", "pvlib", "DynamoDB", "React"],
    repo: "https://github.com/Aaryan-Degama/Dhool_aws",
    live: "https://main.d18fp2anb76xgh.amplifyapp.com",
  },
  {
    slug: "lilcv",
    name: "LilCV",
    category: "low-level-systems",
    neon: NEON.cyan,
    kind: "Personal project",
    summary:
      "A computer vision toolkit written from scratch in C++17, with portrait blur driven by MiDaS depth through ONNX Runtime.",
    stack: ["C++17", "ONNX Runtime", "MiDaS"],
    repo: "https://github.com/Aaryan-Degama/LilCV",
  },
];

// Work described on a category page without a page of its own.
export const notes = {};

export const projectBySlug = (slug) => projects.find((p) => p.slug === slug);

export const projectsIn = (category) => projects.filter((p) => p.category === category);

// The next project in the same category, wrapping around.
export function nextProject(slug) {
  const current = projectBySlug(slug);
  const siblings = projectsIn(current.category);
  if (siblings.length < 2) return null;
  return siblings[(siblings.indexOf(current) + 1) % siblings.length];
}
