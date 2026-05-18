import type { SectionId } from '../data/siteContent';
import { sections } from '../data/siteContent';

type DotNavProps = {
  activeSection: SectionId;
  onJump: (id: SectionId) => void;
};

export function DotNav({ activeSection, onJump }: DotNavProps) {
  return (
    <aside className="dot-nav" aria-label="Section navigation">
      {sections.map((section) => (
        <button
          key={section.id}
          type="button"
          className={activeSection === section.id ? 'active' : ''}
          onClick={() => onJump(section.id)}
          aria-label={`Go to ${section.label}`}
          aria-current={activeSection === section.id ? 'true' : undefined}
          title={section.label}
        />
      ))}
    </aside>
  );
}
