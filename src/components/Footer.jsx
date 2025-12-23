import React from 'react';
import profileData from '../data/profile.json';

const Footer = () => {
    return (
        <footer className="section" style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', padding: '2rem 0' }}>
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem' }}>
                {Object.entries(profileData.contact)
                    .filter(([key]) => key !== 'phone')
                    .map(([key, value]) => (
                        <a key={key} href={value.startsWith('http') ? value : `mailto:${value}`} target="_blank" rel="noopener noreferrer" style={{ textTransform: 'capitalize' }}>
                            {key}
                        </a>
                    ))}
            </div>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                Available for academic collaboration and research-focused master’s programmes.
            </p>
        </footer>
    );
};

export default Footer;
