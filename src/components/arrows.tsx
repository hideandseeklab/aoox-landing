import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react"

/**
 * The arrow between the steps of a navigation path or a flow written in
 * running text ("Settings → Audit log", "Clone → build → push"), drawn as a
 * small chevron on the text baseline instead of a `→` glyph (whose shape and
 * spacing depend on the font).
 *
 * A visually hidden "→" travels with it: `sr-only` text is still read by
 * screen readers and still ends up in the clipboard when the sentence is
 * selected and copied (a copied path reads "Settings → Audit log", not
 * "SettingsAudit log"). "→" rather than ">" (which reads as "greater than"):
 * it is what the rest of the site's plain text uses. The component brings its
 * own spaces — those separate the chevron from the words on screen and keep the
 * copied text spaced — so write a path without spaces around it:
 * `Settings<PathArrow />Audit log`.
 *
 * Not for code: monospace blocks (`Pre`, inline `Code`) and terminal-style
 * mockups keep the plain `→` character.
 */
// The `relative` wrapper is load-bearing: `sr-only` is `position: absolute`, and an
// absolutely positioned box is only clipped by a scrolling ancestor (a table
// wrapper with `overflow-x-auto`) when that ancestor is its containing block —
// otherwise a hidden arrow in a wide table cell sat far off to the right and
// made the whole page scroll sideways.
export function PathArrow() {
  return (
    <>
      {" "}
      <span className="relative">
        <span className="sr-only">→</span>
        <ChevronRight
          aria-hidden="true"
          className="inline-block size-[0.9em] shrink-0 align-[-0.1em]"
        />
      </span>{" "}
    </>
  )
}

/**
 * The trailing arrow of a link or button ("Berikutnya →"): decorative (the label
 * already says where it goes). It nudges right when the surrounding
 * `group/arrow` (put the class on the link) is hovered.
 */
export function LinkArrow({ dir = "right" }: { dir?: "left" | "right" }) {
  return dir === "left" ? (
    <ArrowLeft
      aria-hidden="true"
      className="mr-1 inline-block size-[1em] shrink-0 align-[-0.125em] transition-transform group-hover/arrow:-translate-x-0.5"
    />
  ) : (
    <ArrowRight
      aria-hidden="true"
      className="ml-1 inline-block size-[1em] shrink-0 align-[-0.125em] transition-transform group-hover/arrow:translate-x-0.5"
    />
  )
}
