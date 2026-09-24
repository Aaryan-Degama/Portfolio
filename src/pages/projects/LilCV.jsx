import React from "react";
import {
  ProjectPage,
  Section,
  Code,
  Bullet,
  BulletList,
  ChainDiagram,
  ExternalLink,
} from "../../components/project/ProjectKit";

const REPO_URL = "https://github.com/Aaryan-Degama/LilCV";

const platformTags = ["C++17", "ONNX Runtime", "MiDaS Small", "PPM"];

const depthChain = [
  { label: "Resize", detail: "input scaled to 256×256" },
  { label: "MiDaS", detail: "ONNX Runtime returns a depth map" },
  { label: "Normalise", detail: "depth scaled back to full size" },
  { label: "Blur levels", detail: "several strengths computed once" },
  { label: "Per pixel", detail: "near stays sharp, far falls away" },
];

const commands = [
  { cmd: "bw", does: "Grayscale" },
  { cmd: "blur --intensity 2.5", does: "Gaussian blur, adjustable strength" },
  { cmd: "depthblur --intensity 3.0", does: "Portrait blur from neural depth" },
  { cmd: "negative", does: "Invert every RGB channel" },
  { cmd: "resize --width 512 --height 512", does: "Resize, 256×256 when no size is given" },
];

export default function LilCV() {
  return (
    <ProjectPage
      slug="lilcv"
      tagline="How far a computer vision toolkit gets without OpenCV: image operations written by hand in C++, and portrait blur from a neural depth map."
      tags={platformTags}
    >
      <Section label="Overview" className="max-w-3xl">
        <p className="max-w-[64ch] text-lg leading-8 text-bone [&+p]:mt-5">
          Most computer vision code starts by pulling in all of OpenCV for a
          handful of operations. LilCV starts from a pixel buffer instead:
          grayscale, Gaussian blur, resize, invert and PPM input and output
          are all written from scratch.
        </p>
        <p className="max-w-[64ch] text-lg leading-8 text-bone [&+p]:mt-5">
          It began as an attempt at portrait blur and turned into a study of
          how a model trained in Python actually runs inside a C++ program.
          Python is used once, to export MiDaS to ONNX. After that the
          binary needs nothing but ONNX Runtime.
        </p>
      </Section>

      <Section label="How depth blur works">
        <p className="mb-8 max-w-[62ch] text-lg leading-8 text-bone">
          Blur strength comes from how far away each pixel is, so the
          subject stays sharp and the background softens gradually.
        </p>
        <ChainDiagram steps={depthChain} />
        <p className="mt-4 max-w-2xl text-sm leading-6 text-bone/80">
          MiDaS gives relative depth, not metric depth, which is all a blur
          needs.
        </p>
      </Section>

      <Section label="Commands">
        <div className="overflow-x-auto rounded-[2px] border border-paper/10 bg-carbon">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead>
              <tr className="border-b border-paper/10 text-xs uppercase tracking-[0.25em] text-dust">
                <th className="px-6 py-4 font-medium">Command</th>
                <th className="px-4 py-4 font-medium">What it does</th>
              </tr>
            </thead>
            <tbody>
              {commands.map((c, i) => (
                <tr key={c.cmd} className={i !== commands.length - 1 ? "border-b border-paper/5" : ""}>
                  <td className="whitespace-nowrap px-6 py-3">
                    <code className="font-code text-xs text-paper">{c.cmd}</code>
                  </td>
                  <td className="px-4 py-3 text-bone">{c.does}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <pre className="mt-6 overflow-x-auto rounded-[2px] border border-paper/10 bg-carbon p-6 font-code text-xs leading-6 text-bone">
{`g++ -O3 -std=c++17 lilcv.cpp image_import.cpp -lonnxruntime -o lilcv
./lilcv input.ppm out.ppm depthblur --intensity 3.0`}
        </pre>
      </Section>

      <Section label="Engineering notes" className="max-w-3xl">
        <BulletList>
          <Bullet>
            No OpenCV, no heavy framework and no Python at runtime. The only
            dependency is ONNX Runtime for the CPU.
          </Bullet>
          <Bullet>
            Blur levels are precomputed once, then each pixel picks its level
            from the depth map. That keeps <Code>depthblur</Code> to a lookup
            per pixel instead of a blur per pixel.
          </Bullet>
          <Bullet>
            Images are read and written as plain-text P3 PPM, which keeps the
            I/O code short enough to read in one sitting.
          </Bullet>
          <Bullet>
            Next: quantised ONNX inference, edge-aware blur from depth
            gradients, SIMD, and a real-time webcam pipeline.
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
