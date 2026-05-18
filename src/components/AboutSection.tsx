import { SectionFrame } from './SectionFrame';

type AboutSectionProps = {
  prefersReducedMotion: boolean;
};

export function AboutSection({ prefersReducedMotion }: AboutSectionProps) {
  return (
    <SectionFrame
      id="about"
      kicker="About Us"
      title="Discipline with institutional memory"
      prefersReducedMotion={prefersReducedMotion}
    >
      <div className="copy-grid">
        <p className="lead">
          SMS Investments is a single family office deploying proprietary capital through disciplined momentum
          strategies, underpinned by rigorous risk management and global market insight.
        </p>
        <div className="text-stack">
          <p>
            Suraj Mal Shah Investments began as a management and investment consulting firm before being absorbed by
            the KISNA Group in India as part of a strategic restructuring plan.
          </p>
          <p>
            Today, its legacy continues from London through capital markets capability, trusted relationships, and
            mentorship for emerging investors.
          </p>
        </div>
      </div>
    </SectionFrame>
  );
}
