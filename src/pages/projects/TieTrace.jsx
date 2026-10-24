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

const REPO_URL = "https://github.com/Aaryan-Degama/TieTrace";

const platformTags = ["Python", "MCP", "FalkorDB", "Cypher", "OpenAlex", "Claude Code"];

const statTiles = [
  { label: "MCP tools", value: 13 },
  { label: "Known GEBN leaders found", value: 4, suffix: "of 4, with DOIs" },
  { label: "Topic works loaded", value: 30140, suffix: "obesity case" },
  { label: "Golden tests passing", value: 15, suffix: "of 15" },
];

const checkChain = [
  { label: "Story", detail: "the journalist pastes it into Claude Code" },
  { label: "Resolve", detail: "names become OpenAlex author IDs, a human picks when ambiguous" },
  { label: "Research graph", detail: "read-only Cypher over authors, papers and funders" },
  { label: "Verifier", detail: "no DOI, no scope or a banned word means rejected" },
  { label: "Sourcing note", detail: "approved by a human, every DOI a link" },
];

const tiers = [
  { title: "A1", blurb: "Authored a small paper funded by the company, or listed a company affiliation on one. Direct evidence, with DOIs." },
  { title: "A2", blurb: "A foundation grant, a bottler affiliation, or only a large multi-author paper. Direct evidence, with the reason." },
  { title: "B and C", blurb: "Recent co-authorship with, or two to three hops from, a Tier A person. Shown as network context only: it failed validation." },
  { title: "None", blurb: "\"No tie found in the research record\", always with its scope: hops, years and how much of the data records funders at all." },
];

const parts = [
  { title: "server.py", file: "MCP server, stdio", blurb: "13 tools, no LLM calls and no API key. Reads use GRAPH.RO_QUERY with a timeout and a row cap." },
  { title: "Research graph", file: "research:<case>", blurb: "Person, Work, Funder, Org and Topic nodes from OpenAlex, built aside by loader.py and swapped in." },
  { title: "Memory graph", file: "newsroom:<id>", blurb: "Sessions, every tool call, cases and saved checks, so a fresh session remembers earlier ones." },
  { title: "verifier.py", file: "plain code", blurb: "Rejects a tie claim without a stored DOI and a no-tie claim without its scope." },
];

export default function TieTrace() {
  return (
    <ProjectPage
      slug="tietrace"
      tagline="How connected is the expert in a story to the company it covers? TieTrace answers from the research record, with evidence instead of opinions."
      tags={platformTags}
    >
      <Section label="Overview" className="max-w-3xl">
        <p className="max-w-[64ch] text-lg leading-8 text-bone [&+p]:mt-5">
          TieTrace helps a journalist check an expert quoted in a story. It
          looks them up in a research graph built from OpenAlex and stored
          in FalkorDB: every tie comes with the paper and its DOI, and every
          &ldquo;no tie found&rdquo; comes with its scope.
        </p>
        <p className="max-w-[64ch] text-lg leading-8 text-bone [&+p]:mt-5">
          It never calls anyone &ldquo;independent&rdquo; or
          &ldquo;conflicted&rdquo;, because OpenAlex is incomplete and a
          missing tie is not proof. Built with Abdul Azeem for FalkorDB Graph
          Hacks, on two cases: Coca-Cola × obesity and Philip Morris × lung
          cancer.
        </p>
      </Section>

      <Section>
        <StatRow>
          {statTiles.map((tile) => (
            <StatTile key={tile.label} {...tile} />
          ))}
        </StatRow>
        <p className="mt-6 max-w-2xl text-sm leading-6 text-bone/80">
          Only 56.3% of the loaded works list any funder, so every no-tie
          answer quotes that share. Pass rules were fixed before the runs.
        </p>
      </Section>

      <Section label="How a check runs">
        <ChainDiagram steps={checkChain} />
      </Section>

      <Section label="What it finds">
        <div className="grid gap-4 sm:grid-cols-2">
          {tiers.map((item) => (
            <div key={item.title} className={CARD}>
              <CardTrim />
              <h3 className="text-sm font-medium tracking-tight">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-bone">{item.blurb}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section label="Architecture">
        <div className="grid gap-4 sm:grid-cols-2">
          {parts.map((item) => (
            <div key={item.title} className={CARD}>
              <CardTrim />
              <h3 className="text-sm font-medium tracking-tight">{item.title}</h3>
              <code className="mt-1 block break-words text-xs text-dust">{item.file}</code>
              <p className="mt-3 text-sm leading-6 text-bone">{item.blurb}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section label="Engineering notes" className="max-w-3xl">
        <BulletList>
          <Bullet>
            Claude Code is the agent and the MCP client; the server itself
            makes no model calls. <Code>record_verdict</Code> and{" "}
            <Code>approve_note</Code> are never allowlisted, so Claude
            Code&rsquo;s permission prompt is the human gate.
          </Bullet>
          <Bullet>
            The co-author tiers and the score failed their own tests (placebo
            lift 0.96x, and the score did not beat plain publication volume),
            so only Tier A is reported as a finding.
          </Bullet>
          <Bullet>
            Each newsroom gets its own memory graph, picked by an environment
            variable and never a tool argument. All 13 tools tried with
            another newsroom&rsquo;s ids saw nothing.
          </Bullet>
          <Bullet>
            Experts appear as &ldquo;Expert #n&rdquo;; names show only in a
            case whose experts are all on a public, documented list.
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
