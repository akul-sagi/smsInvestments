import type { LucideIcon } from 'lucide-react';
import { BarChart3, BriefcaseBusiness, Compass, GraduationCap, ShieldCheck } from 'lucide-react';

export type SectionId = 'landing' | 'about' | 'capabilities' | 'internship' | 'newsletter' | 'contact';

export const sections: ReadonlyArray<{ id: SectionId; label: string }> = [
  { id: 'landing', label: 'Landing' },
  { id: 'about', label: 'About' },
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'internship', label: 'Internship' },
  { id: 'newsletter', label: 'Newsletter' },
  { id: 'contact', label: 'Get in touch' },
] as const;

/** Header nav omits Landing and Internship; logo still scrolls to landing. Dot nav uses full `sections` order. */
export const headerNavSections = sections.filter(({ id }) => id !== 'landing' && id !== 'internship');

export const capabilityCards: ReadonlyArray<{
  title: string;
  text: string;
  icon: LucideIcon;
}> = [
  {
    title: 'Investment Strategy',
    text: 'We deploy proprietary capital through a structured investment process that combines technical analysis, market trends, and risk-adjusted decision making.',
    icon: BarChart3,
  },
  {
    title: 'Momentum Strategies',
    text: 'Disciplined, conviction-driven capital allocation focused on momentum, market structure, and high-conviction public equity opportunities.',
    icon: Compass,
  },
  {
    title: 'Risk Management',
    text: 'Position sizing, drawdown discipline, and portfolio controls remain central to each allocation decision.',
    icon: ShieldCheck,
  },
  {
    title: 'Global Market Insight',
    text: 'We combine macro context, regional intelligence, and sector-level research into practical investor judgment.',
    icon: BriefcaseBusiness,
  },
  {
    title: 'Mentorship & Internship',
    text: 'We support the next generation of investors through mentorship, internships, and practical market education.',
    icon: GraduationCap,
  },
];

export const newsletterCards = [
  {
    title: 'Global Macro & Policy',
    text: 'Analysis on global financial trends, market conditions, and economic policies affecting the US, China, Russia, India, and Europe.',
    pdf: '/assets/newsletters/Global_Financial_Trends.pdf',
  },
  {
    title: 'Geopolitical Market Signals',
    text: "China's threats over Taiwan, India's market leverage, US economic stability, Russian warships in Cuba, and technical analysis of stocks and commodities.",
    pdf: '/assets/newsletters/Geopolitics_Markets.pdf',
  },
  {
    title: 'Technical Market Briefings',
    text: 'BOJ interventions, rising U.S. yields, NIFTY symmetry, corporate governance, S&P 500 tech dominance, and key technical market views.',
    pdf: '/assets/newsletters/Global_Market_Views.pdf',
  },
] as const;

export const contactDetails = {
  phone: '+44 7903 734457',
  email: 'admin@smsinvestments.co.uk',
  ukAddress: ['UK:', '20b Selsdon Road', 'South Croydon, CR2 5PH'],
  indiaAddress: ['India:', '7, 7th West Cross St,', 'Bharathi Puram, Villivakkam', 'Chennai, Tamil Nadu 600030'],
  ukMapQuery: '20b Selsdon Road, South Croydon, CR2 5PH, UK',
} as const;
