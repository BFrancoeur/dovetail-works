import { Hero } from '@/components/organisms/Hero/Hero'
import { ProblemSection } from '@/components/organisms/ProblemSection/ProblemSection'
import { HowItWorks } from '@/components/organisms/HowItWorks/HowItWorks'
import { BetterLeads } from '@/components/organisms/BetterLeads/BetterLeads'
import { Process } from '@/components/organisms/Process/Process'
import { FinalCTA } from '@/components/organisms/FinalCTA/FinalCTA'
import { SiteFooter } from '@/components/organisms/SiteFooter/SiteFooter'

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProblemSection />
      <HowItWorks />
      <BetterLeads />
      <Process />
      <FinalCTA />
      <SiteFooter />
    </>
  )
}
