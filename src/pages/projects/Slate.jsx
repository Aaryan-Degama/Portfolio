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
  ExternalLink,
  ChainDiagram,
} from "../../components/project/ProjectKit";
import {
  TEXT,
  SURFACE,
  ON_ACCENT,
  SUBTLE,
  BOUNDARY,
  BASELINE,
  OUTLINE,
  GREEN,
  AMBER,
  RED,
  NEON,
} from "../../theme/palette";

const ACCENT = NEON.ember;

const LIVE_URL = "https://main.dosqfo1xoqa7l.amplifyapp.com";
const REPO_URL = "https://github.com/Aaryan-Degama/slate";

const platformTags = ["React + TypeScript", "AWS Amplify Gen 2", "Lambda", "DynamoDB", "Cedar"];

const statTiles = [
  { label: "Students loaded", value: 1801, suffix: "", format: "int" },
  { label: "Course offerings", value: 104, suffix: "", format: "int" },
  { label: "Registrations", value: 4821, suffix: "", format: "int" },
  { label: "Month-to-date AWS cost", value: 0, prefix: "$", suffix: "", format: "decimal" },
];

const roles = [
  {
    who: "Any student",
    what: "Their own week: the courses they're actually registered in, including electives, minors and courses taken with another batch. Cancelled classes stay on the grid, struck through, naming who cancelled them. Up next names the next class, the room, and how long you have.",
  },
  {
    who: "Class representative",
    what: "One per section, claimed in the app. Cancel a class on a date, add an extra one, move it, or shorten it. Every change carries their roll number.",
  },
  {
    who: "CR planning a makeup",
    what: "Pick the course; Slate finds dated slots free for every registered student and the professor, ranked with the reason spelled out and a free room attached. When nothing fits, it names who blocks it.",
  },
  {
    who: "Admin",
    what: "Upload the institute's own spreadsheets, review exactly what would change, and apply it. Manage CRs and see every change made across batches.",
  },
];

const architecture = [
  {
    title: "Amplify Hosting",
    file: "scripts/deploy-frontend.sh",
    blurb: "Serves the React app at a public URL from a built artifact, so deploys take seconds.",
  },
  {
    title: "Cognito",
    file: "amplify/auth",
    blurb: "A preSignUp trigger restricts sign-up to @iiita.ac.in; an ADMIN group unlocks the upload screens.",
  },
  {
    title: "AppSync + DynamoDB",
    file: "amplify/data/resource.ts",
    blurb: "Schema-generated GraphQL over 12 tables, with secondary indexes for hot reads and TTL on changes.",
  },
  {
    title: "S3 uploads",
    file: "amplify/storage",
    blurb: "Holds the uploaded workbooks, so a 16,000-row sheet never passes through a browser.",
  },
  {
    title: "parse-timetable",
    file: "amplify/functions/parse-timetable",
    blurb: "Reads the real .xlsx files, merged cells and all, and reports every row it can't place.",
  },
  {
    title: "import-data",
    file: "amplify/functions/import-data",
    blurb: "Validates and diffs an upload; nothing is written until an admin confirms the diff.",
  },
  {
    title: "find-slots",
    file: "amplify/functions/find-slots",
    blurb: "Interval intersection across every registered student and the professor, with a free room.",
  },
  {
    title: "section-changes",
    file: "amplify/functions/section-changes",
    blurb: "Every write that changes a timetable, guarded by policy.cedar and logged to CloudWatch.",
  },
];

const offeringChain = [
  { label: "IML", detail: "one course code on the noticeboard" },
  { label: "3 offerings", detail: "Sec A, B and C, each with its own professor" },
  { label: "109 students", detail: "a cancellation reaches exactly this offering" },
];

const slotChain = [
  { label: "109 students", detail: "everyone registered in the offering" },
  { label: "5 profiles", detail: "students with identical weeks, checked once" },
  { label: "Ranked slots", detail: "free for all, plus the professor and a room" },
];

const parserResults = [
  { metric: "Classes read from the 7th-semester elective sheet", before: "3", after: "60" },
  { metric: "Classes read from ECE Semester 3", before: "11", after: "35" },
  { metric: "Registration rows matched to no class", before: "5,690", after: "2,121" },
];

const cellNotations = [
  { cell: "IML (L) - Sec A (CC3-5404)", meaning: "the one shape the first parser understood" },
  { cell: "MDM-3 EF (CC3-5107)", meaning: "a minor degree module" },
  { cell: "EBE (CC3-5255)", meaning: "an elective, no session type" },
  { cell: "IF Sec(A) (CC3- 5106)", meaning: "an HSS course with its own groups" },
  { cell: "DDM (L) -LT-3113", meaning: "a room written without brackets" },
];

const lessons = [
  {
    title: "Get the real file before you design the schema.",
    body: "Not a sample, not three rows typed by hand. The best design decision came from a file we didn't have until day four.",
  },
  {
    title: "When you add a third exception, the rule is wrong.",
    body: "Sub-sections, electives and repeating students were three patches for one disease: a section is not a timetable.",
  },
  {
    title: "Silence is the expensive failure mode.",
    body: "A crash gets fixed in ten minutes. A parser that skips a line cost three days. Every skipped row is now counted and shown to the admin.",
  },
];

const FLOW_COLORS = {
  allow: GREEN,
  deny: RED,
  log: AMBER,
};

function FlowNode({ x, y, w, h, title, sub, condition, variant = "solid", dot }) {
  const isAccent = variant === "accent";
  const isOutline = variant === "outline";
  const textY = condition ? y + 22 : sub ? y + h / 2 - 4 : y + h / 2 + 4;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="2"
        fill={isAccent ? ACCENT : isOutline ? "none" : SURFACE}
        stroke={isAccent ? ACCENT : isOutline ? OUTLINE : SUBTLE}
        strokeWidth="1"
        strokeDasharray={isOutline ? "4 3" : undefined}
      />

      {dot && <circle cx={x + 14} cy={textY - 4} r="4" fill={dot} />}

      <text
        x={dot ? x + 22 : x + w / 2}
        y={textY}
        textAnchor={dot ? "start" : "middle"}
        fontSize="12.5"
        fontWeight="600"
        fill={isAccent ? ON_ACCENT : TEXT}
      >
        {title}
      </text>

      {sub && (
        <text
          x={x + w / 2}
          y={textY + 15}
          textAnchor="middle"
          fontFamily="JetBrains Mono, ui-monospace, monospace"
          fontSize="9.5"
          fill={isAccent ? ON_ACCENT : TEXT}
          opacity={isAccent ? 0.85 : 0.5}
        >
          {sub}
        </text>
      )}

      {condition && (
        <text
          x={x + w / 2}
          y={textY + 30}
          textAnchor="middle"
          fontSize="9.5"
          fontStyle="italic"
          fill={dot || TEXT}
          opacity="0.75"
        >
          {condition}
        </text>
      )}
    </g>
  );
}

function FlowArrow({ x1, y1, x2, y2 }) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={BASELINE}
      strokeWidth="1.5"
      markerEnd="url(#slate-flow-arrowhead)"
    />
  );
}

function FlowArrowHeadDef() {
  return (
    <defs>
      <marker
        id="slate-flow-arrowhead"
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="7"
        markerHeight="7"
        orient="auto-start-reverse"
      >
        <path d="M0,0 L10,5 L0,10 z" fill={BASELINE} />
      </marker>
    </defs>
  );
}

function FlowLegend() {
  const items = [
    { color: FLOW_COLORS.allow, label: "Allowed → dated change written" },
    { color: FLOW_COLORS.deny, label: "Denied → nothing written" },
    { color: FLOW_COLORS.log, label: "Every decision logged" },
  ];
  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-bone/80">
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
          {item.label}
        </span>
      ))}
    </div>
  );
}

function ChangeFlowchartDesktop() {
  const midY = 150;
  const apiX = 165,
    apiW = 150;
  const fnX = 355,
    fnW = 170;
  const fanX = 580,
    fanW = 170,
    fanH = 70;
  const fanYs = [20, 115, 210];
  const endX = 820,
    endW = 150;

  const boundary = {
    x1: 150,
    y1: fanYs[0] - 14,
    x2: fanX + fanW + 14,
    y2: fanYs[2] + fanH + 14,
  };

  return (
    <svg
      viewBox="0 0 980 310"
      className="hidden h-auto w-full sm:block"
      role="img"
      aria-label="How a class change flows: the class representative's browser calls AppSync with a Cognito access token; AppSync invokes the section-changes Lambda, which resolves the user from the user pool and asks the Cedar policy; an allowed change is written to DynamoDB as a dated change on one offering and appears on every registered student's grid, a denied one writes nothing, and every decision is logged to CloudWatch"
    >
      <FlowArrowHeadDef />

      <rect
        x={boundary.x1}
        y={boundary.y1}
        width={boundary.x2 - boundary.x1}
        height={boundary.y2 - boundary.y1}
        rx="3"
        fill="none"
        stroke={BOUNDARY}
        strokeWidth="1"
        strokeDasharray="5 4"
      />
      <text x={boundary.x1 + 14} y={boundary.y1 + 18} fontSize="9.5" letterSpacing="1.5" fill={TEXT} opacity="0.4">
        AWS
      </text>

      <FlowArrow x1={130} y1={midY} x2={apiX} y2={midY} />
      <FlowArrow x1={apiX + apiW} y1={midY} x2={fnX} y2={midY} />

      {fanYs.map((y) => (
        <path
          key={`out-${y}`}
          d={`M${fnX + fnW},${midY} L${fnX + fnW + 35},${y + fanH / 2} L${fanX},${y + fanH / 2}`}
          fill="none"
          stroke={BASELINE}
          strokeWidth="1.5"
          markerEnd="url(#slate-flow-arrowhead)"
        />
      ))}

      <path
        d={`M${fanX + fanW},${fanYs[0] + fanH / 2} L${endX - 30},${midY} L${endX},${midY}`}
        fill="none"
        stroke={FLOW_COLORS.allow}
        strokeWidth="1.5"
        markerEnd="url(#slate-flow-arrowhead)"
      />

      <FlowNode x={10} y={122} w={120} h={56} title="CR's browser" sub="React · access token" variant="outline" />
      <FlowNode x={apiX} y={122} w={apiW} h={56} title="AppSync" sub="GraphQL · Cognito auth" />
      <FlowNode x={fnX} y={122} w={fnW} h={56} title="section-changes" sub="Lambda · policy.cedar" variant="accent" />

      <FlowNode x={fanX} y={fanYs[0]} w={fanW} h={fanH} title="Allow" sub="DynamoDB · TTL" condition="dated change on one offering" dot={FLOW_COLORS.allow} />
      <FlowNode x={fanX} y={fanYs[1]} w={fanW} h={fanH} title="Deny" sub="error to client" condition="not a CR of this offering" dot={FLOW_COLORS.deny} />
      <FlowNode x={fanX} y={fanYs[2]} w={fanW} h={fanH} title="Log" sub="CloudWatch" condition="who asked, what, and the verdict" dot={FLOW_COLORS.log} />

      <FlowNode x={endX} y={122} w={endW} h={56} title="Students' grids" sub="struck through, with roll no." variant="outline" />
    </svg>
  );
}

function ChangeFlowchartMobile() {
  const boxW = 290,
    x0 = 20;
  const fanBoxW = 92,
    fanGap = 7;
  const fanY = 250;
  const fanH = 84;
  const endY = 390;
  const boundary = { x1: 8, y1: 78, x2: 322, y2: fanY + fanH + 14 };
  const fanTitles = ["Allow", "Deny", "Log"];
  const fanSubs = ["DynamoDB", "no write", "CloudWatch"];
  const fanConditions = ["dated change", "not this CR", "every decision"];
  const fanDots = [FLOW_COLORS.allow, FLOW_COLORS.deny, FLOW_COLORS.log];
  const allowCx = x0 + fanBoxW / 2;

  return (
    <svg
      viewBox="0 0 340 460"
      className="h-auto w-full sm:hidden"
      role="img"
      aria-label="How a class change flows: the class representative's browser calls AppSync, which invokes the section-changes Lambda; its Cedar policy either allows the change, which is written to DynamoDB and shown on every registered student's grid, or denies it; every decision is logged to CloudWatch"
    >
      <FlowArrowHeadDef />

      <rect
        x={boundary.x1}
        y={boundary.y1}
        width={boundary.x2 - boundary.x1}
        height={boundary.y2 - boundary.y1}
        rx="3"
        fill="none"
        stroke={BOUNDARY}
        strokeWidth="1"
        strokeDasharray="5 4"
      />
      <text x={boundary.x1 + 12} y={boundary.y1 + 16} fontSize="9" letterSpacing="1.5" fill={TEXT} opacity="0.4">
        AWS
      </text>

      <FlowArrow x1={165} y1={66} x2={165} y2={90} />
      <FlowArrow x1={165} y1={140} x2={165} y2={164} />

      {[0, 1, 2].map((i) => {
        const fx = x0 + i * (fanBoxW + fanGap);
        return (
          <path
            key={`out-${i}`}
            d={`M165,214 L165,228 L${fx + fanBoxW / 2},228 L${fx + fanBoxW / 2},${fanY}`}
            fill="none"
            stroke={BASELINE}
            strokeWidth="1.5"
            markerEnd="url(#slate-flow-arrowhead)"
          />
        );
      })}

      <path
        d={`M${allowCx},${fanY + fanH} L${allowCx},${fanY + fanH + 26} L165,${fanY + fanH + 26} L165,${endY}`}
        fill="none"
        stroke={FLOW_COLORS.allow}
        strokeWidth="1.5"
        markerEnd="url(#slate-flow-arrowhead)"
      />

      <FlowNode x={x0} y={16} w={boxW} h={50} title="CR's browser" sub="React · access token" variant="outline" />
      <FlowNode x={x0} y={90} w={boxW} h={50} title="AppSync" sub="GraphQL · Cognito auth" />
      <FlowNode x={x0} y={164} w={boxW} h={50} title="section-changes" sub="Lambda · policy.cedar" variant="accent" />

      {[0, 1, 2].map((i) => (
        <FlowNode
          key={i}
          x={x0 + i * (fanBoxW + fanGap)}
          y={fanY}
          w={fanBoxW}
          h={fanH}
          title={fanTitles[i]}
          sub={fanSubs[i]}
          condition={fanConditions[i]}
          dot={fanDots[i]}
        />
      ))}

      <FlowNode x={x0} y={endY} w={boxW} h={50} title="Every registered student's grid" sub="struck through, with the CR's roll no." variant="outline" />
    </svg>
  );
}

export default function Slate() {
  return (
    <ProjectPage
      slug="slate"
      tagline="The real timetable of every IIIT Allahabad student, including the class that just got cancelled, and a proper way for class representatives to change it."
      tags={platformTags}
    >

        <Section label="Overview" className="max-w-3xl">
          <p className="max-w-[64ch] text-lg leading-8 text-bone [&+p]:mt-5">
            At IIIT Allahabad a timetable change travels by WhatsApp. The
            professor tells the class representative, the CR forwards it to a
            group of two hundred, and whoever muted that group walks to an
            empty room. Worse, "the timetable" isn't one thing: a
            fifth-semester student takes core courses with their section, an
            elective with three other sections, and maybe a backlog course
            with the junior batch. No printed grid shows that week.
          </p>
          <p className="max-w-[64ch] text-lg leading-8 text-bone [&+p]:mt-5">
            Slate reads the institute's own spreadsheets, works out each
            student's real week from the registration list, and gives the CR
            a server instead of a group chat. We set out to build a scheduling
            tool for professors and shipped a change log for class
            representatives. The gap between those is four days, 112 commits,
            and three pivots, each one forced by a spreadsheet.
          </p>
        </Section>

        <Section label="Try it">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <p className="max-w-[56ch] text-lg leading-8 text-bone">
                Sign-up is limited to institute emails, so demo accounts are
                ready on the live site. Start with a real student's week:
              </p>
              <dl className="mt-6 max-w-md border-b border-paper/10">
                <div className="grid grid-cols-[6rem_minmax(0,1fr)] gap-3 border-t border-paper/10 py-3">
                  <dt className="font-code text-[11px] uppercase tracking-[0.22em] text-dust">Email</dt>
                  <dd className="break-all font-code text-sm text-paper">iit2024059@iiita.ac.in</dd>
                </div>
                <div className="grid grid-cols-[6rem_minmax(0,1fr)] gap-3 border-t border-paper/10 py-3">
                  <dt className="font-code text-[11px] uppercase tracking-[0.22em] text-dust">Password</dt>
                  <dd className="font-code text-sm text-paper">SlateDemo#2026</dd>
                </div>
              </dl>
            </div>
            <ExternalLink href={LIVE_URL} primary>
              Open Slate
            </ExternalLink>
          </div>
          <p className="mt-8 max-w-[56ch] text-sm leading-6 text-bone/80">
            Built in four days for First Commit (WeMakeDevs × AWS), Sept 17–20,
            2026, on the Ship It track.
          </p>
        </Section>

        <Section>
          <StatRow>
            {statTiles.map((tile) => (
              <StatTile key={tile.label} {...tile} />
            ))}
          </StatRow>
        </Section>

        <Section label="Who gets what">
          <div className="grid gap-4 sm:grid-cols-2">
            {roles.map((r) => (
              <div
                key={r.who}
                className={CARD}
              >
<CardTrim />
                <h3 className="text-sm font-medium tracking-tight">{r.who}</h3>
                <p className="mt-3 text-sm leading-6 text-bone">{r.what}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-bone/80">
            Deliberately not built: voting or polls, chat, recurring changes,
            student-editable timetables. Each was suggested and each would
            have turned a tool that does one thing into one nobody finishes.
          </p>
        </Section>

        <Section label="How a class change flows">
          <p className="mb-8 max-w-[62ch] text-lg leading-8 text-bone">
            Every write that changes a timetable goes through one Lambda. The
            glowing box is where Cedar decides whether this person may change
            this class.
          </p>
          <div className="mt-6 rounded-[2px] border border-paper/10 bg-carbon p-6">
            <ChangeFlowchartDesktop />
            <ChangeFlowchartMobile />
            <FlowLegend />
          </div>
        </Section>

        <Section label="Architecture">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {architecture.map((item) => (
              <div
                key={item.title}
                className={CARD}
              >
<CardTrim />
                <h3 className="text-sm font-medium tracking-tight">
                  {item.title}
                </h3>
                <code className="mt-1 block break-words text-xs text-dust">
                  {item.file}
                </code>
                <p className="mt-3 text-sm leading-6 text-bone">
                  {item.blurb}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-bone/80">
            No NAT gateway, no EC2, no idle database. Everything scales to
            zero between classes, which is why month-to-date spend is $0.00.
          </p>
        </Section>

        <Section label="The data model">
          <p className="mb-8 max-w-[62ch] text-lg leading-8 text-bone">
            A section is not a timetable. The unit that works is the offering:
            one course, one professor, one audience.
          </p>
          <div className="mt-6 grid gap-10">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.3em] text-dust">
                One code, three classes
              </p>
              <ChainDiagram steps={offeringChain} />
            </div>
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.3em] text-dust">
                Finding an hour that works
              </p>
              <ChainDiagram steps={slotChain} />
            </div>
          </div>
        </Section>

        <Section className="max-w-3xl">
          <BulletList>
            <Bullet>
              The first model was "a student belongs to a section". It leaked
              three ways (lab sub-sections, electives, repeating students) and
              got three patches, until the institute's 16,483-row examinee
              list said exactly who takes what, from whom.
            </Bullet>
            <Bullet>
              Offerings made every special case ordinary. A repeating student
              is just registered in another batch's offering, and a
              cancellation reaches the 109 students in that offering and
              nobody else. The rewrite deleted more code than it added.
            </Bullet>
            <Bullet>
              <Code>find-slots</Code>{" "}
              asks which <em>people</em> are free, not which sections.
              Students with identical registrations collapse into one
              profile, so 109 timetables become five checks. Results come
              with the reason in words: "free for all 109 registered
              students · Dr. Shiv Ram Dubey is free · avoids the lunch hours".
            </Bullet>
            <Bullet>
              When nothing fits, it names the obstacle: "Without IT Sem 5
              Sec B, 1 slot works for everyone else, e.g. Tue 09:00–11:00,
              when Sec B has IML."
            </Bullet>
          </BulletList>
        </Section>

        <Section label="Reading real spreadsheets">
          <p className="mb-8 max-w-[62ch] text-lg leading-8 text-bone">
            On day four a classmate asked why his Entrepreneurial Finance
            class was missing. The parser had silently skipped it for three
            days. The same workbooks write "this class meets here" in at
            least five ways:
          </p>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="overflow-x-auto rounded-[2px] border border-paper/10 bg-carbon">
              <table className="w-full min-w-[380px] text-left text-sm">
                <thead>
                  <tr className="border-b border-paper/10 text-xs uppercase tracking-[0.25em] text-dust">
                    <th className="px-6 py-4 font-medium">Cell</th>
                    <th className="px-4 py-4 font-medium">Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  {cellNotations.map((c, i) => (
                    <tr
                      key={c.cell}
                      className={i !== cellNotations.length - 1 ? "border-b border-paper/5" : ""}
                    >
                      <td className="whitespace-nowrap px-6 py-3">
                        <code className="text-xs">{c.cell}</code>
                      </td>
                      <td className="px-4 py-3 text-bone">{c.meaning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="overflow-x-auto rounded-[2px] border border-paper/10 bg-carbon">
              <table className="w-full min-w-[380px] text-left text-sm">
                <thead>
                  <tr className="border-b border-paper/10 text-xs uppercase tracking-[0.25em] text-dust">
                    <th className="px-6 py-4 font-medium">After the fix</th>
                    <th className="px-4 py-4 text-right font-medium">Before</th>
                    <th className="px-4 py-4 text-right font-medium">After</th>
                  </tr>
                </thead>
                <tbody>
                  {parserResults.map((r, i) => (
                    <tr
                      key={r.metric}
                      className={i !== parserResults.length - 1 ? "border-b border-paper/5" : ""}
                    >
                      <td className="px-6 py-3 text-bone">{r.metric}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-bone/80">{r.before}</td>
                      <td className="px-4 py-3 text-right font-semibold tabular-nums">{r.after}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Section>

        <Section label="Engineering notes" className="max-w-3xl">
          <BulletList>
            <Bullet>
              Every authorization test passed while every CR action failed
              on the live site. The app calls AppSync with Cognito{" "}
              <em>access</em> tokens, which carry no email claim, and the
              tests had built an identity that helpfully included one. The
              fix: look the user up in the pool by verified username and
              derive their section from the admin-uploaded roll list, never
              from the client.
            </Bullet>
            <Bullet>
              The Cedar policy was correct the whole time; it was reasoning
              flawlessly about a user who didn't exist. A policy engine is
              only as good as the facts you hand it. Because every allow and
              deny lands in CloudWatch, the bug was visible at all.
            </Bullet>
            <Bullet>
              Ingestion reads{" "}
              <Code>.xlsx</Code>{" "}
              directly rather than Textract over PDFs: the institute's files
              were spreadsheets, so this is both more accurate and cheaper.
              The Bedrock normalisation experiment stays in the repo, off the
              live path.
            </Bullet>
            <Bullet>
              Registrations that match nothing are reported, never guessed.
              About 2,100 rows (institute-wide courses in no timetable sheet)
              are shown to the admin instead of being invented onto a grid.
            </Bullet>
          </BulletList>
          <pre className="mt-6 overflow-x-auto rounded-[2px] border border-paper/10 bg-carbon p-6 text-xs leading-6 text-bone">
{`// Cancel / add / move a class of an offering: a CR of a section
// that offering is taught to.
permit (
  principal,
  action in [Slate::Action::"Cancel", Slate::Action::"AddExtra", Slate::Action::"Move"],
  resource is Slate::Offering
)
when { resource.crs.contains(principal) };`}
          </pre>
        </Section>

        <Section label="What I'd tell myself on day one">
          <div className="grid gap-4 lg:grid-cols-3">
            {lessons.map((l) => (
              <div
                key={l.title}
                className={CARD}
              >
<CardTrim />
                <h3 className="text-sm font-medium tracking-tight">{l.title}</h3>
                <p className="mt-3 text-sm leading-6 text-bone">{l.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <ExternalLink href={LIVE_URL} primary>
              Open Slate
            </ExternalLink>
            <ExternalLink href={REPO_URL}>Read the code</ExternalLink>
          </div>
        </Section>

    </ProjectPage>
  );
}
