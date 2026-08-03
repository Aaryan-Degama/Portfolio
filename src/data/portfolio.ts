export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  tags: string[];
  status: 'active' | 'completed' | 'archived';
  year: string;
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
    description: 'Private Android gallery that searches local photos and documents in natural language — no uploads or cloud.',
    longDescription: 'Built a privacy-first React Native Android app that indexes local media entirely on-device. Vanta combines CLIP ViT-B/32 for visual-semantic retrieval, ArcFace face recognition, custom-trained DistilBERT NER for photo queries, and SQLite with sqlite-vec to support natural-language, people, and relationship searches without sending personal media to the cloud.',
    tags: ['Android', 'C++', 'ONNX Runtime', 'CLIP', 'BERT', 'SQLite', 'React Native'],
    status: 'active',
    year: '2025',
    githubUrl: 'https://github.com',
    size: 'large',
    color: 'from-emerald-900/40 to-teal-900/40',
    highlights: [
      '~280ms avg end-to-end search latency',
      'Custom NER model for people, relationships, and photo-query intent',
      'Shared C++ core (libvanta) via JNI for Android/iOS portability',
      'SymSpell → NER → entity resolution → CLIP re-ranking pipeline',
    ],
  },
  {
    id: 'lilcv',
    title: 'LilCV',
    subtitle: 'C++ Computer Vision Library',
    description: 'A dependency-light C++17 vision toolkit built from scratch, including ML-powered depth-aware portrait blur.',
    longDescription: 'Built a minimal C++17 computer vision toolkit without OpenCV or runtime Python dependencies. LilCV implements grayscale, Gaussian blur, inversion, resizing, and PPM image I/O, then integrates the MiDaS Small depth model through ONNX Runtime to create a depth-aware portrait blur pipeline.',
    tags: ['C++17', 'ONNX Runtime', 'MiDaS', 'Computer Vision'],
    status: 'completed',
    year: '2025',
    githubUrl: 'https://github.com',
    size: 'medium',
    color: 'from-blue-900/40 to-indigo-900/40',
    highlights: [
      'Zero OpenCV dependency — built from scratch',
      'Depth-aware portrait blur via MiDaS-Small',
      'Python-to-ONNX-to-C++ workflow with no Python required at runtime',
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
];
