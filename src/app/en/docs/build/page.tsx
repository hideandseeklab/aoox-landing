import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import {
  Callout,
  Code,
  DocLink,
  DocPage,
  H2,
  H3,
  P,
  Pre,
  Table,
  Ul,
} from "@/components/docs/prose"
import { cn } from "@/lib/utils"

export const metadata: Metadata = { title: "How builds work" }

const SUMMARY = [
  { k: "Options", v: "Dockerfile · Nixpacks · Railpack · Static site, per application" },
  { k: "Runs on", v: "Docker daemon (classic builder); Railpack via its own BuildKit" },
  { k: "Result", v: "Image <registry>/<project>/<app>:<id>" },
]

const DECISION = [
  { q: "Is the output just HTML/CSS/JS files (Vite, CRA, Astro, Hugo, docs site)?", yes: "Static site", no: null },
  { q: "Does the repo already have a Dockerfile?", yes: "Dockerfile", no: null },
  { q: "Need fast rebuilds / layer caching?", yes: "Dockerfile or Railpack", no: null },
  { q: "Want zero config and caching between deploys (host only, not remote servers)?", yes: "Railpack", no: null },
  { q: "Want zero config and can accept a slow build every time?", yes: "Nixpacks", no: "Dockerfile" },
]

const NIXPACKS_FLOW = [
  { s: "helper", d: "the aoox-nixpacks image is built once (debian + git + the nixpacks CLI)" },
  { s: "clone", d: "a one-shot container runs git clone --depth 1 (credentials never leave the helper)" },
  { s: "plan", d: "nixpacks build → writes .nixpacks/Dockerfile" },
  { s: "build", d: "the source is tarred → POST /build with the generated Dockerfile" },
]

const RAILPACK_FLOW = [
  { s: "helper", d: "the aoox-railpack image is built once (docker CLI + git + the railpack binary)" },
  { s: "buildkit", d: "an aoox-buildkit container (moby/buildkit) starts once, with its own cache volume" },
  { s: "clone", d: "the helper does git clone --depth 1, then railpack build --cache-key <project>/<app>" },
  { s: "cache", d: "dependency layers are kept in the BuildKit volume — the next deploy reuses them" },
]

const NEXT = [
  { title: "Deploy & rollback", description: "What happens once the image is ready.", href: "/en/docs/deploy" },
  { title: "Environment variables", description: "Runtime values — where secrets belong.", href: "/en/docs/environment" },
  { title: "Registry", description: "Where images live; delete old tags, GC.", href: "/en/docs/registry" },
  { title: "Compose stacks", description: "For multi-service repos with a docker-compose.yml.", href: "/en/docs/compose" },
]

export default function Page() {
  return (
    <DocPage
      href="/en/docs/build"
      title="How builds work"
      lang="en"
      description="Three ways to turn a repo into an image: your own Dockerfile, automatic detection by Nixpacks, or a static site served by nginx."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <Callout>
        This page is about applications <strong>built from a Git repo</strong>.
        Applications whose source is a ready-made image skip the build stage
        entirely — see{" "}
        <DocLink href="/en/docs/aplikasi#sumber">Two application sources</DocLink>.
      </Callout>

      <H2 id="memilih">Which one should I pick?</H2>
      <div className="border border-border text-xs">
        {DECISION.map((row, i) => (
          <div
            key={row.q}
            className={cn(
              "grid gap-2 px-4 py-3 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-6",
              i > 0 && "border-t border-border"
            )}
          >
            <span className="text-foreground">{row.q}</span>
            <span className="text-muted-foreground">
              yes → <span className="text-primary-foreground dark:text-primary">{row.yes}</span>
            </span>
            <span className="text-muted-foreground">
              {row.no ? (
                <>
                  no → <span className="text-foreground">{row.no}</span>
                </>
              ) : (
                "no → keep going"
              )}
            </span>
          </div>
        ))}
      </div>
      <Table
        head={["", "Dockerfile", "Nixpacks", "Railpack", "Static site"]}
        rows={[
          ["Setup", "Write your own Dockerfile", "Zero config", "Zero config", "Build command + output folder"],
          ["Rebuilds", "Docker layer cache", "Always from scratch (--no-cache)", "BuildKit cache between deploys", "Always from scratch"],
          ["First build", "Depends on the base image", "Slow: base ± 350 MB + nix-env", "284 seconds (helper + BuildKit, once)", "Fast: node alpine + nginx alpine"],
          ["Later builds", "Fast if layers are unchanged", "Still slow, re-downloads dependencies", "±8 seconds — dependencies from cache", "Always from scratch"],
          ["Image control", "Full", "Limited to nixpacks options", "Limited to railpack options", "None — nginx :80"],
          ["Remote server", "Yes", "Yes", "No — host only", "Yes"],
          ["Best for", "Production, lean images", "Prototypes, repos without a Dockerfile", "Repeated deploys without a Dockerfile", "SPAs, landing pages, docs sites"],
        ]}
      />

      <H2 id="dockerfile">Dockerfile</H2>
      <P>
        Choose <strong>Build method → Dockerfile</strong> and set the{" "}
        <strong>Dockerfile path in the repo</strong> (default <Code>Dockerfile</Code> at
        the root). The build runs directly on the Docker daemon from the Git URL
        (<Code>POST /build?remote=…</Code>) — the daemon does the cloning, the API
        doesn&apos;t need git.
      </P>
      <Pre title="Minimal example (Node.js)">{`FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "server.js"]`}</Pre>
      <Ul>
        <li>
          <strong>Classic builder</strong>, not BuildKit: syntax like{" "}
          <Code>RUN --mount</Code>, <Code>COPY --link</Code>, and heredocs isn&apos;t
          supported.
        </li>
        <li>
          Layer caching applies between builds as long as the base image and
          early steps don&apos;t change — put <Code>COPY package*.json</Code> +{" "}
          <Code>npm ci</Code> before <Code>COPY . .</Code>.
        </li>
        <li>
          Include <Code>wget</Code> or <Code>curl</Code> in the image if you use a
          health check (alpine already ships busybox&apos;s <Code>wget</Code>).
        </li>
      </Ul>

      <H2 id="nixpacks">Nixpacks</H2>
      <P>
        Choose <strong>Build method → Nixpacks</strong> for repos without a
        Dockerfile. There&apos;s no nixpacks binary on the host or in the API image —
        everything runs in a container:
      </P>
      <ol className="grid gap-px border border-border bg-border text-xs sm:grid-cols-4">
        {NIXPACKS_FLOW.map((item, i) => (
          <li key={item.s} className="flex flex-col gap-1 bg-background px-3 py-3">
            <span className="text-[0.6rem] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
            <span className="font-medium text-foreground">{item.s}</span>
            <span className="text-muted-foreground">{item.d}</span>
          </li>
        ))}
      </ol>
      <Callout kind="warn" title="Trade-offs to know about">
        <Ul>
          <li>
            <strong>First build is slow</strong>: the nixpacks base image (± 350 MB)
            is pulled and the helper image is built once; aoox pins the nixpacks
            version.
          </li>
          <li>
            <strong>No dependency cache between builds</strong> —{" "}
            <Code>--no-cache</Code> is required because nixpacks&apos; cache mounts need
            BuildKit. Every deploy re-downloads dependencies.
          </li>
          <li>
            The source tree is held in the API&apos;s memory during the build (without{" "}
            <Code>.git</Code>) — very large repos are better off with a Dockerfile.
          </li>
        </Ul>
      </Callout>
      <H3>Steering Nixpacks</H3>
      <P>
        Nixpacks reads <Code>NIXPACKS_*</Code> variables. Set them via{" "}
        <strong>Build args</strong>:
      </P>
      <Pre title="Build args">{`NIXPACKS_NODE_VERSION=22
NIXPACKS_BUILD_CMD=npm run build
NIXPACKS_START_CMD=node server.js`}</Pre>
      <P>
        Alternatively, put a <Code>nixpacks.toml</Code> in the repo — it&apos;s read
        automatically during <Code>plan</Code>.
      </P>

      <H2 id="railpack">Railpack</H2>
      <P>
        Choose <strong>Build method → Railpack</strong> for repos without a
        Dockerfile that get deployed repeatedly and where you want dependency
        caching to stick around. Unlike Nixpacks, Railpack executes its build
        plan through a long-lived <Code>moby/buildkit</Code> container with its
        own volume — dependency layers survive between deploys.
      </P>
      <ol className="grid gap-px border border-border bg-border text-xs sm:grid-cols-4">
        {RAILPACK_FLOW.map((item, i) => (
          <li key={item.s} className="flex flex-col gap-1 bg-background px-3 py-3">
            <span className="text-[0.6rem] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
            <span className="font-medium text-foreground">{item.s}</span>
            <span className="text-muted-foreground">{item.d}</span>
          </li>
        ))}
      </ol>
      <Callout kind="warn" title="Host only">
        Railpack runs BuildKit alongside the registry on aoox&apos;s own host —
        there&apos;s no per-remote-server BuildKit yet. Applications with a{" "}
        <strong>remote server</strong> must use Dockerfile or Nixpacks.
      </Callout>
      <Ul>
        <li>
          Images produced by Railpack listen on <Code>$PORT</Code> (Railway&apos;s
          convention). aoox automatically fills <Code>PORT</Code> with the
          configured <strong>container port</strong>, unless the application
          already sets its own <Code>PORT</Code> in env.
        </li>
        <li>
          <strong>Build args</strong> are passed through as <Code>--env</Code> to
          railpack — same as Nixpacks, they also affect its provider detection.
        </li>
        <li>
          Cache is scoped per <Code>project/application</Code>, so other
          applications never share layers by accident. The BuildKit volume is
          pruned automatically by the nightly maintenance job — Docker&apos;s own
          prune doesn&apos;t reach it.
        </li>
      </Ul>

      <H2 id="static">Static site (nginx)</H2>
      <P>
        Choose <strong>Build method → Static site (nginx)</strong> for repos
        whose final output is just static files. aoox builds a two-stage
        Dockerfile: an (optional) build stage on <Code>node:22-alpine</Code>, then{" "}
        <Code>nginx:1.27-alpine</Code> serving the output folder on port 80.
      </P>
      <Table
        head={["Field", "Details"]}
        rows={[
          [
            "Build command",
            <>
              E.g. <Code>npm ci &amp;&amp; npm run build</Code>. Leave empty if the
              files already exist in the repo (no Node stage).
            </>,
          ],
          [
            "Output folder",
            <>
              Relative to the repo root: <Code>dist</Code> (default), <Code>build</Code>,{" "}
              <Code>out</Code>, or <Code>.</Code> for the whole repo.
            </>,
          ],
          [
            "SPA mode",
            <>
              On (default): unknown paths are served <Code>index.html</Code>{" "}
              (client-side routing). Off: a normal 404 for multi-page sites.
            </>,
          ],
        ]}
      />
      <Pre title="Generated Dockerfile (illustration)">{`FROM node:22-alpine AS build
WORKDIR /src
COPY . .
RUN npm ci && npm run build

FROM nginx:1.27-alpine
COPY --from=build /src/dist/ /usr/share/nginx/html/
COPY .aoox/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80`}</Pre>
      <Ul>
        <li>
          The <strong>container port</strong> must be <Code>80</Code>. A health
          check path of <Code>/</Code> is enough (nginx alpine has{" "}
          <Code>wget</Code>).
        </li>
        <li>
          The build runs through the same helper as Nixpacks (clone in a
          container, tar context) — private repos are safe, but there&apos;s no cache
          between builds.
        </li>
        <li>
          Runtime env is useless for static files, and <strong>Build args aren&apos;t
          yet passed</strong> to the static build stage. Build-time values (e.g.{" "}
          <Code>VITE_API_URL</Code>) currently need to live in the repo
          (<Code>.env.production</Code>) or in the build command:{" "}
          <Code>VITE_API_URL=https://api.example.com npm run build</Code>.
        </li>
        <li>
          The Node version is pinned to 22 by aoox; not yet changeable from the UI.
        </li>
      </Ul>

      <H2 id="build-args">Build args</H2>
      <P>
        The <strong>Build args</strong> field (Settings tab) uses{" "}
        <Code>KEY=VALUE</Code> per line and is passed as{" "}
        <Code>--build-arg</Code>. For Nixpacks and Railpack, the values also
        become env during plan/build. Not yet applied to static sites.
      </P>
      <Pre title="Dockerfile that uses it">{`ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run build`}</Pre>
      <Callout kind="warn">
        Build args do <strong>not</strong> support{" "}
        <Code>{"${{…}}"}</Code> references, and they end up baked into the
        pushed image. Don&apos;t put secrets here — use{" "}
        <DocLink href="/en/docs/environment">environment variables</DocLink>,
        which are applied at runtime.
      </Callout>

      <H2 id="image">The resulting image</H2>
      <Pre>{`<registry.url>/<project-slug>/<app-slug>:<12-character deployment id>
# example: localhost:5000/toko/shop:a1b2c3d4e5f6`}</Pre>
      <Ul>
        <li>
          Old tags stay in the registry until deleted from the{" "}
          <DocLink href="/en/docs/registry">Registry</DocLink> page — that&apos;s what
          makes rollback possible. Delete + garbage collect to reclaim disk.
        </li>
        <li>
          On a remote server the image isn&apos;t pushed; it stays on that server&apos;s
          daemon with ref <Code>{"aoox/<project>/<app>:<tag>"}</Code>.
        </li>
      </Ul>

      <H2 id="jebakan">Common pitfalls</H2>
      <Table
        head={["Symptom", "Cause & fix"]}
        rows={[
          ["Build fails: unknown flag / --mount", "BuildKit syntax in the Dockerfile. Replace it with a plain step."],
          ["Nixpacks: build hangs", <>Shouldn&apos;t happen — aoox forces <Code>--no-cache</Code>. Check the helper log on the Deploy tab.</>],
          ["Nixpacks picks the wrong Node/Python version", <>Set <Code>NIXPACKS_NODE_VERSION</Code> / <Code>NIXPACKS_PYTHON_VERSION</Code> in Build args, or engines in package.json.</>],
          ["Env is empty during the build", "Env genuinely isn't available at build time. Use Build args (non-secret) or read env at runtime."],
          ["Railpack: \"run on the aoox host only\"", "This application has a remote server. Switch to Dockerfile/Nixpacks, or remove its server placement."],
          ["Railpack: application doesn't accept connections", <>Check the application reads <Code>process.env.PORT</Code> instead of a hardcoded port. aoox fills it in automatically from the container port.</>],
        ]}
      />

      <H2 id="berikutnya">Next steps</H2>
      <div className="grid gap-px border border-border bg-border sm:grid-cols-2">
        {NEXT.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-start justify-between gap-3 bg-background p-4 transition-colors hover:bg-muted/60"
          >
            <span className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">{item.title}</span>
              <span className="text-xs text-muted-foreground">{item.description}</span>
            </span>
            <ArrowRight className="mt-1 size-3 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
          </Link>
        ))}
      </div>
    </DocPage>
  )
}
