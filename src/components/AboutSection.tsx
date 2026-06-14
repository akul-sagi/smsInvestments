import { SectionFrame } from './SectionFrame';

type AboutSectionProps = {
  prefersReducedMotion: boolean;
};

export function AboutSection({ prefersReducedMotion }: AboutSectionProps) {
  return (
    <SectionFrame id="about" kicker="" title="About Us" hideTitle prefersReducedMotion={prefersReducedMotion}>
      <div className="about-layout">
        <div className="about-copy">
          <h2 id="about-title" className="about-title">
            About Us
          </h2>
          <div className="about-text">
            <p>
            SMS Investments is a London-based private family office and proprietary trading firm focused on
            momentum-driven strategies across public equity markets in the United Kingdom, Western Europe, and the
            United States. Leveraging internal capital, we combine disciplined execution, rigorous risk management, and
            global market expertise to identify high-conviction opportunities.
          </p>
          <p>
            Originally founded as Suraj Mal Shah (SMS) Investments, the firm evolved from its roots in management and
            investment consulting into the family office it is today. Guided by integrity, discipline, and a commitment
            to knowledge-sharing, we actively support the next generation of investors through mentorship, internships,
            and practical market education.
          </p>
          <p>Our legacy is built on experience, strong relationships, and a passion for excellence in global capital markets.</p>
          </div>
        </div>
        <figure className="about-portrait">
          <img
            src="/assets/about-building.jpeg"
            alt=""
            onError={(event) => {
              event.currentTarget.src = '/assets/london-unsplash-hero.jpg';
            }}
          />
        </figure>
      </div>
    </SectionFrame>
  );
}
