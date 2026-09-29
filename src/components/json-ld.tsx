/**
 * Renders a `<script type="application/ld+json">` block. `<` is escaped so a
 * string value containing `</script>` (or any other tag) can't break out of
 * the script element — the JSON itself is still valid once parsed, since
 * `<` decodes back to `<` inside a JSON string.
 */
export function JsonLd({ data }: { data: object }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c")
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}
