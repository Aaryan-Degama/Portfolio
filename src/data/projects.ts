export type Project = {
  name: string;
  tagline: string;
  problem: string;
  approach: string;
  stack: string[];
  url: string;
  collaborators?: string;
};

export const projects: Project[] = [
  {
    name: "Vanta",
    tagline: "On-device semantic search for your entire photo library",
    problem:
      "Cloud photo search means your photos and metadata leave your phone. Vanta indexes and searches everything locally — no uploads, no accounts, no compromise.",
    approach:
      "A C++ core (libvanta) exposed over JNI runs CLIP ViT-B/32 for visual-semantic search, InsightFace (ArcFace) for face detection and recognition, and a custom fine-tuned BERT-tiny NER model to parse natural-language queries like \"me and mom at the beach.\" Embeddings are stored and queried through SQLite with the sqlite-vec extension, all wrapped in a React Native frontend.",
    stack: ["C++", "JNI", "ONNX Runtime", "CLIP", "ArcFace", "BERT-tiny", "SQLite / sqlite-vec", "React Native"],
    url: "https://github.com/Aaryan-Degama/Vanta",
    collaborators: "with Divy Vaghasiya",
  },
  {
    name: "Slate",
    tagline: "The real timetable at IIIT Allahabad — including the class that just got cancelled",
    problem:
      "Timetable changes travel by WhatsApp — a cancellation reaches whoever hasn't muted the group. And no printed grid shows one student's actual week once electives and backlog courses across sections and batches are mixed in.",
    approach:
      "A registration + offering data model answers \"what is this student's week\" exactly, no section guesswork. A Cedar policy engine governs who can cancel, move, or add a class, and a slot-finder runs interval intersection across every registered student and professor to find valid makeup-class times. Built end-to-end in a 4-day hackathon.",
    stack: ["React", "TypeScript", "AWS Amplify Gen 2", "Cognito", "AppSync / GraphQL", "DynamoDB", "Lambda", "Cedar"],
    url: "https://github.com/Aaryan-Degama/slate",
  },
  {
    name: "LilCV",
    tagline: "A dependency-light computer vision library, built without OpenCV",
    problem:
      "Most CV tooling means pulling in OpenCV's full surface area for a handful of operations. LilCV explores how far you can get with a minimal, from-scratch C++ toolkit instead.",
    approach:
      "Core image operations (grayscale, blur, resize, invert, PPM I/O) are hand-written in C++. Depth-based portrait blur runs MiDaS-Small through ONNX Runtime for neural depth estimation, then applies per-pixel blur strength from the depth map — near objects stay sharp, background falls away naturally.",
    stack: ["C++17", "ONNX Runtime", "MiDaS-Small"],
    url: "https://github.com/Aaryan-Degama/LilCV",
  },
];
