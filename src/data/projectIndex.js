import { NEON } from "../theme/palette";

// Every project page reads from here: the category listings, the hero facts
// and the "next project" link at the foot of each detail page.

export const categories = {
  "on-device-ml": {
    title: "On-Device ML",
    lines: ["On-Device", "ML"],
    crumb: "On-device ML",
    path: "/projects/on-device-ml",
    intro:
      "Models that run where the data already is. Semantic photo search on a phone and neural depth blur in plain C++, with no cloud and no OpenCV.",
  },
  "shipped-systems": {
    title: "Shipped Systems",
    lines: ["Shipped", "Systems"],
    crumb: "Shipped systems",
    path: "/projects/shipped-systems",
    intro:
      "Software with real users on real data: a serverless timetable for 1,801 IIIT Allahabad students, built and deployed in four days.",
  },
};

export const projects = [
  {
    slug: "vanta",
    name: "Vanta",
    category: "on-device-ml",
    neon: NEON.magenta,
    kind: "Personal project, with Divy Vaghasiya",
    summary:
      "Search your photo library in plain sentences, entirely on an Android phone. CLIP, ArcFace and a fine-tuned BERT-tiny behind one C++ core.",
    stack: ["C++", "JNI", "ONNX Runtime", "sqlite-vec"],
    repo: "https://github.com/Aaryan-Degama/Vanta",
  },
  {
    slug: "lilcv",
    name: "LilCV",
    category: "on-device-ml",
    neon: NEON.cyan,
    kind: "Personal project",
    summary:
      "A computer vision toolkit written from scratch in C++17, with portrait blur driven by MiDaS depth through ONNX Runtime.",
    stack: ["C++17", "ONNX Runtime", "MiDaS"],
    repo: "https://github.com/Aaryan-Degama/LilCV",
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
