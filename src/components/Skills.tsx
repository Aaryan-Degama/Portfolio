import { Reveal } from "./Reveal";

const groups = [
  {
    label: "Systems / C++",
    items: ["C++17", "Rust", "JNI", "CMake", "Android NDK"],
  },
  {
    label: "ML / on-device inference",
    items: ["ONNX Runtime", "CLIP", "ArcFace", "Embeddings", "Model quantization"],
  },
  {
    label: "Backend / infra",
    items: ["Kafka", "Redis", "gRPC", "Docker", "FastAPI", "AWS (Amplify, Lambda, DynamoDB)"],
  },
];

export function Skills() {
  return (
    <section id="skills" className="px-6 sm:px-12 py-28 sm:py-36 max-w-4xl">
      <Reveal>
        <h2 className="font-[var(--font-display)] text-sm tracking-[0.3em] uppercase text-[var(--fg-muted)] mb-16">
          Skills
        </h2>
      </Reveal>

      <div className="grid sm:grid-cols-3 gap-10">
        {groups.map((g, i) => (
          <Reveal key={g.label} delay={i * 0.08}>
            <h3 className="text-sm text-[var(--fg-muted)] mb-4">{g.label}</h3>
            <ul className="flex flex-col gap-2">
              {g.items.map((item) => (
                <li key={item} className="text-[var(--fg)]">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
