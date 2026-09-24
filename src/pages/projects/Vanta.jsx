import React from "react";
import {
  ProjectPage,
  Section,
  StatRow,
  StatTile,
  Code,
  Bullet,
  BulletList,
  CARD,
  CardTrim,
  ChainDiagram,
  ExternalLink,
} from "../../components/project/ProjectKit";

const REPO_URL = "https://github.com/Aaryan-Degama/Vanta";

const platformTags = ["C++ (libvanta)", "JNI", "ONNX Runtime", "CLIP", "InsightFace", "BERT-tiny", "sqlite-vec", "React Native"];

const statTiles = [
  { label: "Average search latency", value: 280, suffix: "milliseconds, end to end" },
  { label: "NER training samples", value: 5600 },
  { label: "Rare peak latency", value: 450, suffix: "milliseconds" },
  { label: "Bytes uploaded", value: 0 },
];

const queryChain = [
  { label: "SymSpell", detail: "fixes typos before anything reads the query" },
  { label: "NER", detail: "BERT-tiny tags people, relations and places" },
  { label: "Entity resolution", detail: "\"mom\" becomes a face cluster in the graph" },
  { label: "CLIP re-ranking", detail: "the rest of the sentence scores the pixels" },
];

const architecture = [
  {
    title: "libvanta",
    file: "vanta_app/modules/vanta-bridge/cpp",
    blurb: "One C++ core for indexing, search and the graph, written to be shared by Android and iOS.",
  },
  {
    title: "JNI bridge",
    file: "vanta-bridge/android",
    blurb: "Kotlin service and Expo module that hand work to the C++ engine and results back to TypeScript.",
  },
  {
    title: "CLIP ViT-B/32",
    file: "produce_model/get_onnx_CLIP.py",
    blurb: "Image and text embeddings in one space, so a sentence can be compared with a photo.",
  },
  {
    title: "InsightFace buffalo_l",
    file: "Reads/04-Face-Recognition-Pipeline.md",
    blurb: "Detects and embeds faces, then clusters them into people you name once.",
  },
  {
    title: "BERT-tiny NER",
    file: "ONNX, opset 18",
    blurb: "Fine-tuned on a 5,600-sample IOB2 set with hard vocabulary splits, small enough for the phone.",
  },
  {
    title: "sqlite-vec",
    file: "DBschema.sql",
    blurb: "Vector search inside SQLite, next to the files, faces and entities it indexes.",
  },
  {
    title: "Property graph",
    file: "Reads/06-Graph-Database.md",
    blurb: "Entities and relations as an adjacency model in SQLite, so \"my brother\" means a person.",
  },
  {
    title: "React Native app",
    file: "vanta_app/screens",
    blurb: "Search, People, entity detail and settings screens in Expo and TypeScript.",
  },
];

export default function Vanta() {
  return (
    <ProjectPage
      slug="vanta"
      tagline="Search your photos the way you remember them, “me and mom at the beach”, with every model running on the phone and nothing uploaded."
      tags={platformTags}
    >
      <Section label="Overview" className="max-w-3xl">
        <p className="max-w-[64ch] text-lg leading-8 text-bone [&+p]:mt-5">
          Cloud photo search works by sending your photos, and everything
          about who is in them, to someone else's server. Vanta does the
          same job on the phone. It indexes the gallery locally, groups
          faces into people, and answers sentences like &ldquo;me and dad
          at the temple&rdquo; without a network connection.
        </p>
        <p className="max-w-[64ch] text-lg leading-8 text-bone [&+p]:mt-5">
          The hard part is that a query mixes two kinds of question. &ldquo;Mom&rdquo;
          is about identity and relationships. &ldquo;At the beach&rdquo; is
          about what the picture looks like. Vanta answers the first with a
          graph and the second with CLIP, and scores both together.
        </p>
      </Section>

      <Section>
        <StatRow>
          {statTiles.map((tile) => (
            <StatTile key={tile.label} {...tile} />
          ))}
        </StatRow>
        <p className="mt-6 max-w-2xl text-sm leading-6 text-bone/80">
          Latency is averaged across short and long queries, entity and
          relation queries, and spell-corrected ones.
        </p>
      </Section>

      <Section label="How a query runs">
        <p className="mb-8 max-w-[62ch] text-lg leading-8 text-bone">
          Every search goes through the same four steps inside libvanta,
          then graph and visual similarity are combined into one score.
        </p>
        <ChainDiagram steps={queryChain} />
      </Section>

      <Section label="Architecture">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {architecture.map((item) => (
            <div key={item.title} className={CARD}>
              <CardTrim />
              <h3 className="text-sm font-medium tracking-tight">{item.title}</h3>
              <code className="mt-1 block break-words text-xs text-dust">{item.file}</code>
              <p className="mt-3 text-sm leading-6 text-bone">{item.blurb}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-bone/80">
          Models ship inside the APK and are extracted on first launch. The
          first build compiles the engine with CMake and the Android NDK.
        </p>
      </Section>

      <Section label="Engineering notes" className="max-w-3xl">
        <BulletList>
          <Bullet>
            The engine is C++ behind JNI, not Kotlin, so the same{" "}
            <Code>libvanta</Code> can back an iOS app later without
            rewriting search.
          </Bullet>
          <Bullet>
            People and relations live in a property graph in the same
            SQLite file as the vectors. A query like &ldquo;me and my
            brother&rdquo; is a graph lookup first and an image search second.
          </Bullet>
          <Bullet>
            The NER model is BERT-tiny rather than a larger BERT, fine-tuned
            on generated photo queries with hard vocabulary splits so it
            generalises to names it never saw, then exported to ONNX for
            Android.
          </Bullet>
          <Bullet>
            PDFs, Word documents and text files are chunked and embedded
            too, so the same search box finds files as well as photos.
          </Bullet>
        </BulletList>
        <div className="mt-10 flex flex-wrap gap-3">
          <ExternalLink href={REPO_URL} primary>
            Read the code
          </ExternalLink>
        </div>
      </Section>
    </ProjectPage>
  );
}
