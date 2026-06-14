import { SectionFrame } from './SectionFrame';

type InternshipSectionProps = {
  prefersReducedMotion: boolean;
};

export function InternshipSection({ prefersReducedMotion }: InternshipSectionProps) {
  return (
    <SectionFrame id="internship" kicker="" title="Internship" prefersReducedMotion={prefersReducedMotion}>
      <div className="internship-layout">
        <p className="internship-lead">
          We actively support the next generation of investors through mentorship, internships, and practical market
          education.
        </p>
        <div className="internship-panel">
          <h3>Practical market education</h3>
          <p>
            SMS Investments shares experience, technical guidance, and professional standards with emerging investors
            who want to understand disciplined capital markets work.
          </p>
        </div>
      </div>
    </SectionFrame>
  );
}
