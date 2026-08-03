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
  releaseUrl?: string;
  size: 'large' | 'medium' | 'small';
  color: string;
  highlights: string[];
}

export const projects: Project[] = [
  {
    id: 'vanta',
    title: 'Vanta',
    subtitle: 'On-Device Semantic Search Engine',
    description: 'Semantic search for your photos, without giving up your privacy.',
    longDescription: 'Vanta is an on-device search engine for Android that lets you find photos and files by describing them in plain language — “the trip with Priya at the lake,” not just filenames or dates. Everything runs locally: a dependency-light C++ core fuses CLIP for visual understanding, ArcFace for face recognition, and a custom fine-tuned BERT-tiny NER model to parse who and what you are looking for, all resolved against an entity-relation knowledge graph built entirely from your own data. No images, embeddings, or queries ever leave the device.',
    tags: ['Android', 'C++', 'ONNX Runtime', 'CLIP', 'BERT', 'SQLite', 'React Native'],
    status: 'active',
    year: '2025',
    githubUrl: 'https://github.com/Aaryan-Degama/Vanta',
    releaseUrl: 'https://github.com/Aaryan-Degama/Vanta/releases/tag/v0.1.1',
    size: 'large',
    color: 'from-emerald-900/40 to-teal-900/40',
    highlights: [
      'Multi-space vector search — CLIP, ArcFace, and text — with score fusion',
      'Custom NER model trained and fine-tuned from scratch for query understanding',
      'SQLite + sqlite-vec vector store',
      'Shared C++ core built for cross-platform portability',
    ],
  },
  {
    id: 'lilcv',
    title: 'LilCV',
    subtitle: 'C++ Computer Vision Library',
    description: 'Computer vision without the OpenCV tax.',
    longDescription: 'LilCV is a dependency-light C++ library for running vision models without dragging OpenCV into your build. Inference runs on ONNX Runtime, with monocular depth estimation via MiDaS-Small as the first capability — built for anyone who wants a CV pipeline that is small enough to read end to end, not just link against.',
    tags: ['C++17', 'ONNX Runtime', 'MiDaS', 'Computer Vision'],
    status: 'completed',
    year: '2025',
    githubUrl: 'https://github.com',
    size: 'medium',
    color: 'from-blue-900/40 to-indigo-900/40',
    highlights: [
      'OpenCV-free',
      'ONNX Runtime inference',
      'MiDaS-Small depth estimation',
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
