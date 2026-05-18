import type { LucideIcon } from 'lucide-react';
import { BarChart3, BriefcaseBusiness, Compass, ShieldCheck, Users } from 'lucide-react';

export type SectionId = 'landing' | 'about' | 'capabilities' | 'philosophy' | 'contact';

export const sections: ReadonlyArray<{ id: SectionId; label: string }> = [
  { id: 'landing', label: 'Landing' },
  { id: 'about', label: 'About Us' },
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'philosophy', label: 'Our Philosophy' },
  { id: 'contact', label: 'Contact Us' },
] as const;

/** Header nav omits Landing; logo still scrolls to landing. Dot nav uses full `sections` order. */
export const headerNavSections = sections.slice(1);

export const capabilityCards: ReadonlyArray<{
  title: string;
  text: string;
  icon: LucideIcon;
}> = [
  {
    title: 'Public Equity Markets',
    text: 'Deploying proprietary capital across the United Kingdom, Western Europe, and United States with a disciplined reading of public-market momentum.',
    icon: BarChart3,
  },
  {
    title: 'Momentum Strategies',
    text: 'Identifying durable price action, liquidity shifts, and market structure signals before conviction is scaled.',
    icon: Compass,
  },
  {
    title: 'Risk Management',
    text: 'Position sizing, drawdown discipline, and portfolio controls remain central to every allocation decision.',
    icon: ShieldCheck,
  },
  {
    title: 'Global Market Insight',
    text: 'Combining macro context, regional market intelligence, and sector-level research into practical investor judgment.',
    icon: BriefcaseBusiness,
  },
  {
    title: 'Mentorship & Internship',
    text: 'Passing forward experience, technical guidance, and professional standards to the next generation of investors.',
    icon: Users,
  },
];

export const philosophyPillars = [
  'Integrity',
  'Measured conviction',
  'Strong relationships',
  'Mentorship'
] as const;
