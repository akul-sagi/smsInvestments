import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { SectionId } from '../data/siteContent';
import { headerNavSections } from '../data/siteContent';

type HeaderProps = {
  activeSection: SectionId;
  onJump: (id: SectionId) => void;
};

export function Header({ activeSection, onJump }: HeaderProps) {
  const [logoMissing, setLogoMissing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };

    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (headerRef.current && !headerRef.current.contains(t)) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('pointerdown', onPointerDown, true);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('pointerdown', onPointerDown, true);
      document.body.style.overflow = prevOverflow;
    };
  }, [menuOpen]);

  const go = (id: SectionId) => {
    onJump(id);
    setMenuOpen(false);
  };

  return (
    <header ref={headerRef} className={`site-header ${menuOpen ? 'site-header--menu-open' : ''}`}>
      {menuOpen ? (
        <div
          className="site-header-scrim"
          aria-hidden
          onClick={() => setMenuOpen(false)}
        />
      ) : null}
      <div className="site-header-bar">
        <button
          type="button"
          className="brand-lockup"
          onClick={() => go('landing')}
          aria-label="Go to landing page"
        >
          <span className="brand-mark">
            {!logoMissing ? (
              <img src="/assets/logo.png" alt="" decoding="async" onError={() => setLogoMissing(true)} />
            ) : (
              <span>SMS</span>
            )}
          </span>
          <span>
            <strong>SMS Investments</strong>
          </span>
        </button>

        <button
          type="button"
          className="site-header-menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="primary-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} strokeWidth={2} aria-hidden="true" /> : <Menu size={22} strokeWidth={2} aria-hidden="true" />}
          <span className="visually-hidden">{menuOpen ? 'Close menu' : 'Open menu'}</span>
        </button>
      </div>

      <nav id="primary-nav" className="site-header-nav" aria-label="Primary navigation">
        {headerNavSections.map((section) => (
          <button
            key={section.id}
            type="button"
            className={activeSection === section.id ? 'active' : ''}
            onClick={() => go(section.id)}
            aria-current={activeSection === section.id ? 'page' : undefined}
          >
            {section.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
