export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  tags: string[];
  status: 'active' | 'completed' | 'archived';
  year: string;
  stars: number;
  forks: number;
  githubUrl: string;
  size: 'large' | 'medium' | 'small';
  color: string;
  highlights: string[];
}

export const projects: Project[] = [
  {
    id: 'vanta',
    title: 'Vanta',
    subtitle: 'On-Device Semantic Search Engine',
    description: 'Privacy-first Android app for semantic photo & file search — 100% on-device, zero cloud.',
    longDescription: 'Built a fully on-device semantic photo & file search app for Android. Engineered retrieval architecture combining CLIP ViT-B/32 (visual embeddings), InsightFace buffalo_l (face identity), and BERT-tiny (NER) via ONNX Runtime, with sqlite-vec for vector search and a SQLite-backed property graph for people and relationship queries.',
    tags: ['Android', 'C++', 'ONNX Runtime', 'CLIP', 'BERT', 'SQLite', 'React Native'],
    status: 'active',
    year: '2025',
    stars: 48,
    forks: 6,
    githubUrl: 'https://github.com',
    size: 'large',
    color: 'from-emerald-900/40 to-teal-900/40',
    highlights: [
      '~280ms avg end-to-end search latency',
      'BERT-tiny fine-tuned on 5,600-sample IOB2 NER dataset',
      'Shared C++ core (libvanta) via JNI for Android/iOS portability',
      'SymSpell → NER → entity resolution → CLIP re-ranking pipeline',
    ],
  },
  {
    id: 'lilcv',
    title: 'LilCV',
    subtitle: 'C++ Computer Vision Library',
    description: 'Lightweight, dependency-light C++ CV toolkit from scratch — no OpenCV.',
    longDescription: 'Built a lightweight C++ computer vision toolkit covering grayscale, Gaussian blur, color inversion, resizing, and PPM image I/O. Integrated ONNX Runtime inference for MiDaS-Small monocular depth model to implement depth-aware portrait blur.',
    tags: ['C++17', 'ONNX Runtime', 'MiDaS', 'Computer Vision'],
    status: 'completed',
    year: '2025',
    stars: 31,
    forks: 3,
    githubUrl: 'https://github.com',
    size: 'medium',
    color: 'from-blue-900/40 to-indigo-900/40',
    highlights: [
      'Zero OpenCV dependency — built from scratch',
      'Depth-aware portrait blur via MiDaS-Small',
      'Pure C++ ML model portability validation',
    ],
  },
  {
    id: 'traffic-forecast',
    title: 'Traffic Forecast',
    subtitle: 'ML Competition — Demand Forecasting',
    description: 'Ensemble ML system reaching ~90 score in Flipkart-associated challenge.',
    longDescription: 'Iterated through multiple ensemble strategies (LightGBM, CatBoost, XGBoost, FT-Transformer) with Optuna hyperparameter tuning for traffic demand forecasting.',
    tags: ['Python', 'LightGBM', 'CatBoost', 'XGBoost', 'FT-Transformer', 'Optuna'],
    status: 'completed',
    year: '2025',
    stars: 14,
    forks: 2,
    githubUrl: 'https://github.com',
    size: 'small',
    color: 'from-orange-900/40 to-red-900/40',
    highlights: [
      '~90 competition score (Flipkart-associated)',
      'Optuna hyperparameter tuning across 4 model families',
    ],
  },
];

export const skills = {
  languages: ['C++', 'C', 'Python', 'Kotlin', 'JavaScript'],
  mlDl: ['PyTorch', 'ONNX Runtime', 'Transformers', 'CLIP', 'InsightFace', 'BERT'],
  systems: ['Linux', 'Git', 'CMake', 'JNI', 'Docker'],
  databases: ['SQLite', 'sqlite-vec', 'MySQL'],
  webApis: ['Node.js', 'Express', 'FastAPI', 'React', 'REST'],
};

export const achievements = [
  { label: 'Codeforces Rating', value: '1411', sub: 'Competitive Programming' },
  { label: 'Terranent50 TensorFlow', value: '#30', sub: 'of 150 participants' },
  { label: 'IIIT Allahabad OSS', value: '#16', sub: 'of 350 participants' },
  { label: 'CGPA', value: '7.35', sub: 'B.Tech IT – IIIT Allahabad' },
];
