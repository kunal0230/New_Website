import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'About', href: '#about' },
    { name: 'Publications', href: '#publications' }, /* Replaced Vision with Publications or just added it? User said remove Vision, add Pubs section. I should probably add Pubs to nav too? User didn't explicitly ask to add Pubs to NAV, just "add a new section... named publicatin". Usually sections are in nav. I'll add it to nav for good UX. */
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
    { name: 'Skills', href: '#skills' },
    { name: 'Photography', href: '#photography' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 999,
      background: isScrolled ? 'rgba(53, 53, 53, 0.95)' : 'transparent',
      backdropFilter: isScrolled ? 'blur(10px)' : 'none',
      borderBottom: isScrolled ? '1px solid var(--border-color)' : 'none',
      transition: 'all 0.3s ease',
      padding: '1.5rem 0'
    }}>
      <div className="container navbar-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href="#" style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          fontFamily: 'var(--font-display)',
          color: isScrolled ? 'var(--white)' : 'var(--text-primary)',
          textDecoration: 'none'
        }}>
          KC
        </a>

        <ul style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {navItems.filter(item => item.name !== 'Skills').map((item, idx) => (
            <li key={idx}>
              <a
                href={item.href}
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  color: isScrolled ? 'var(--white)' : 'var(--text-primary)',
                  position: 'relative'
                }}
              >
                <span style={{ color: 'var(--accent-primary)', marginRight: '0.25rem', fontSize: '0.85rem' }}>
                  {String(idx + 1).padStart(2, '0')}.
                </span>
                {item.name}
              </a>
            </li>
          ))}
          <li>
            <a href="/resume.pdf" target="_blank" style={{
              border: '1px solid var(--accent-primary)',
              color: 'var(--accent-primary)',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              fontSize: '0.9rem',
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'all 0.3s ease'
            }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(42, 157, 143, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
              }}
            >
              CV
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
