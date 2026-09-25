import { cn } from "@/lib/utils"

function Section({
  id,
  className,
  children,
}: {
  id?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className={cn("border-b border-border", className)}>
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        {children}
      </div>
    </section>
  )
}

function SectionHeading({
  label,
  title,
  description,
}: {
  label: string
  title: string
  description?: string
}) {
  return (
    <div className="mb-10 flex max-w-2xl flex-col gap-3 sm:mb-14">
      <span className="text-xs text-primary-foreground dark:text-primary">
        <span className="select-none">## </span>
        {label}
      </span>
      <h2 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  )
}

export { Section, SectionHeading }
