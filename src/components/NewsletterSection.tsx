import { newsletterCards } from '../data/siteContent';
import { SectionFrame } from './SectionFrame';

type NewsletterSectionProps = {
  prefersReducedMotion: boolean;
};

export function NewsletterSection({ prefersReducedMotion }: NewsletterSectionProps) {
  return (
    <SectionFrame id="newsletter" kicker="" title="Newsletter" prefersReducedMotion={prefersReducedMotion}>
      <p className="newsletter-subtitle">
        Exploring market trends, investment strategies, and economic insights for informed financial decision-making
        and growth.
      </p>
      <div className="newsletter-grid">
        {newsletterCards.map((card, index) => (
          <a
            className="newsletter-card"
            href={card.pdf}
            key={card.title}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open newsletter PDF: ${card.title}`}
          >
            <div className={`newsletter-card-image newsletter-card-image-${index + 1}`} aria-hidden="true" />
            <p>{card.text}</p>
          </a>
        ))}
      </div>
    </SectionFrame>
  );
}
