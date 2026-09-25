import { BuildOptionsSection } from "@/components/sections/build-options-section"
import { CtaSection } from "@/components/sections/cta-section"
import { FaqSection } from "@/components/sections/faq-section"
import { FeaturesSection } from "@/components/sections/features-section"
import { HeroSection } from "@/components/sections/hero-section"
import { HowItWorksSection } from "@/components/sections/how-it-works-section"
import { SelfHostSection } from "@/components/sections/self-host-section"
import { TeamSection } from "@/components/sections/team-section"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import type { Lang } from "@/lib/lang"

/** Shared by app/page.tsx (id) and app/en/page.tsx (en) so the section list lives in one place. */
function LandingPage({ lang }: { lang: Lang }) {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection lang={lang} />
        <FeaturesSection lang={lang} />
        <HowItWorksSection lang={lang} />
        <BuildOptionsSection lang={lang} />
        <TeamSection lang={lang} />
        <SelfHostSection lang={lang} />
        <FaqSection lang={lang} />
        <CtaSection lang={lang} />
      </main>
      <SiteFooter />
    </>
  )
}

export { LandingPage }
