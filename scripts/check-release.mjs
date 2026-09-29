#!/usr/bin/env node
// Manual pre-release reminder — NOT wired into `build` or CI on purpose (it would
// block deploys between a feature commit and `npm version`). Run it before
// `npm version <x>`: it compares package.json's version with the newest entry in
// src/content/changelog.ts (the product changelog + homepage badge).
//
//   npm run check-release            # expects them to match
//   npm run check-release -- 0.1.0-alpha.4   # or: check a version you are ABOUT to release
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"

const root = new URL("../", import.meta.url)
const read = (p) => readFileSync(fileURLToPath(new URL(p, root)), "utf8")

const pkgVersion = JSON.parse(read("package.json")).version
const source = read("src/content/changelog.ts")
const match = /RELEASES:\s*Release\[\]\s*=\s*\[\s*\{\s*version:\s*"([^"]+)"/.exec(source)
if (!match) {
  console.error("check-release: could not find the newest entry in src/content/changelog.ts")
  process.exit(2)
}

const changelogVersion = match[1]
const target = process.argv[2]?.replace(/^v/, "") ?? pkgVersion

if (target === changelogVersion) {
  console.log(`OK: ${target} matches the newest entry in src/content/changelog.ts`)
  process.exit(0)
}

console.error(
  `MISMATCH: ${target === pkgVersion ? "package.json" : "target"} is ${target}, ` +
    `but the newest entry in src/content/changelog.ts is ${changelogVersion}.\n` +
    `Add/adjust the entry for ${target} in src/content/changelog.ts (see RELEASING.md), then re-run.`,
)
process.exit(1)
