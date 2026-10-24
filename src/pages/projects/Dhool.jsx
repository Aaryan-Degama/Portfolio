import React from "react";
import {
  ProjectPage,
  Section,
  StatRow,
  StatTile,
  Bullet,
  BulletList,
  CARD,
  CardTrim,
  ChainDiagram,
  ExternalLink,
} from "../../components/project/ProjectKit";

const REPO_URL = "https://github.com/Aaryan-Degama/Dhool_aws";
const LIVE_URL = "https://main.d18fp2anb76xgh.amplifyapp.com";
const DEMO_URL = "https://youtu.be/dhPpbfy7boc";

const platformTags = ["AWS SAM", "Lambda", "API Gateway", "Cognito", "DynamoDB", "pvlib", "Open-Meteo", "React PWA"];

const statTiles = [
  { label: "Lambda functions", value: 5 },
  { label: "Simulated homes in Delhi", value: 33 },
  { label: "Verdict accuracy, best case", value: 84, suffix: "percent, 29 neighbours and exact weather" },
  { label: "Demo screen values read", value: 93, suffix: "of 93, none invented" },
];

const verdictChain = [
  { label: "Readings", detail: "inverter API key, a screenshot, or a typed number" },
  { label: "Expected output", detail: "pvlib physics on that day's Open-Meteo weather" },
  { label: "Roof's own normal", detail: "learnt from its size, tilt and history" },
  { label: "Plain rules", detail: "no model makes the verdict, every one has a reason" },
  { label: "One verdict", detail: "wash, call the vendor, wait, or working" },
];

const verdicts = [
  {
    title: "Call your vendor",
    blurb: "A sunny day with almost nothing made, a drop that stayed down and the neighbours did not share, or repeated shutdowns. The WhatsApp message to the vendor is written with the figures.",
  },
  {
    title: "Wash the panels",
    blurb: "A slow slide since the last rain, and only when the wash pays: what the dust costs before the next forecast rain must beat what one wash costs that household.",
  },
  {
    title: "Wait",
    blurb: "Rain is coming and will wash them for free, a dust storm is coming, the dust isn't costing enough yet, or it's haze and washing won't help.",
  },
  {
    title: "Your solar is working",
    blurb: "And afterwards it checks: report a wash or a vendor visit and Dhool compares the week before with the clear days after.",
  },
];

const services = [
  { title: "Lambda", blurb: "The API, the pvlib analysis, the screenshot reader, the vendor-reply reader and the demo inverter cloud." },
  { title: "API Gateway + Cognito", blurb: "Every route behind a JWT authorizer with throttling; the caller's identity comes only from the token." },
  { title: "DynamoDB", blurb: "One on-demand table for homes, members, readings, verdicts and invite codes. Query only, never Scan." },
  { title: "EventBridge", blurb: "The nightly analysis, one run per home, then Web Push to the family's phones." },
  { title: "S3", blurb: "Uploaded screenshots behind signed URLs issued after an access check, deleted after 30 days." },
  { title: "CloudWatch + X-Ray", blurb: "Every access decision logged as one JSON line, alarms on errors and on the failure queue." },
];

export default function Dhool() {
  return (
    <ProjectPage
      slug="dhool"
      tagline="Is your rooftop solar actually working? Dhool tells a household what its roof should have made in that weather, and what to do when it falls short."
      tags={platformTags}
    >
      <Section label="Overview" className="max-w-3xl">
        <p className="max-w-[64ch] text-lg leading-8 text-bone [&+p]:mt-5">
          Over 50 lakh Indian households now have rooftop solar under PM
          Surya Ghar, most of them families with no technical background.
          Their inverter app shows the units made today, not the units the
          roof should have made, so a cloudy day, a dusty panel and a dead
          string all look the same: a low number.
        </p>
        <p className="max-w-[64ch] text-lg leading-8 text-bone [&+p]:mt-5">
          Dhool tells them apart. It works out the expected output from the
          roof and the day's real weather, then gives one verdict with the
          reason and the money. Built for WeMakeDevs × AWS Environmental
          Hacks, Waste and Energy track, in English and Hindi.
        </p>
      </Section>

      <Section>
        <StatRow>
          {statTiles.map((tile) => (
            <StatTile key={tile.label} {...tile} />
          ))}
        </StatRow>
        <p className="mt-6 max-w-2xl text-sm leading-6 text-bone/80">
          Scores are in simulation, on a hidden test set of three other
          cities. With no neighbours and noisy weather the rules score 56%,
          which is the honest number for a household typing its own readings.
        </p>
      </Section>

      <Section label="How a verdict is made">
        <ChainDiagram steps={verdictChain} />
      </Section>

      <Section label="The four verdicts">
        <div className="grid gap-4 sm:grid-cols-2">
          {verdicts.map((item) => (
            <div key={item.title} className={CARD}>
              <CardTrim />
              <h3 className="text-sm font-medium tracking-tight">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-bone">{item.blurb}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section label="Built on AWS">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((item) => (
            <div key={item.title} className={CARD}>
              <CardTrim />
              <h3 className="text-sm font-medium tracking-tight">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-bone">{item.blurb}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-bone/80">
          One SAM template, all serverless, deployed to ap-south-1.
        </p>
      </Section>

      <Section label="Engineering notes" className="max-w-3xl">
        <BulletList>
          <Bullet>
            Bedrock and Textract were unavailable on the account, so the two
            models are small open ones hosted on Lambda: Tesseract OCR first,
            then Qwen3-VL-2B through llama.cpp on CPU for screenshots, and a
            fine-tuned Laya on ONNX Runtime for sorting vendor replies.
          </Bullet>
          <Bullet>
            Screenshots of three real inverter apps: 8 of 11 values read,
            none invented. The homeowner confirms every number before it is
            saved.
          </Bullet>
          <Bullet>
            Paste the vendor's WhatsApp reply in Hinglish, Hindi or English
            and Dhool sorts it into coming, wants something first, refusing
            or unclear, with the next step.
          </Bullet>
          <Bullet>
            The weather and physics are real; the homes behind the demo
            inverter are simulated, following the real sun, cloud and rain
            of the past year, with dust and faults planted in code.
          </Bullet>
        </BulletList>
        <div className="mt-10 flex flex-wrap gap-3">
          <ExternalLink href={LIVE_URL} primary>
            Open the app
          </ExternalLink>
          <ExternalLink href={DEMO_URL}>Watch the demo</ExternalLink>
          <ExternalLink href={REPO_URL}>Read the code</ExternalLink>
        </div>
      </Section>
    </ProjectPage>
  );
}
