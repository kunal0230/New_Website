import React from 'react';
import profileData from '../data/profile.json';

const Contact = () => {
    return (
        <section className="section" id="contact" style={{
            padding: '1rem 0',
            paddingBottom: '2rem',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
        }}>
            <div className="physics-obstacle" style={{
                maxWidth: '100%',
                margin: '0 auto',
                background: 'rgba(255, 255, 255, 0.4)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '4rem',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '4rem',
                alignItems: 'start',
                width: '100%'
            }}>
                {/* Left Column: Get in Touch */}
                <div>
                    <h3 style={{
                        fontSize: '2rem',
                        marginBottom: '1.5rem',
                        color: 'var(--text-primary)',
                        borderBottom: '2px solid var(--accent-primary)',
                        display: 'inline-block',
                        paddingBottom: '0.25rem'
                    }}>
                        Get in Touch
                    </h3>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.8' }}>
                        Open to research internships,thesis collaborations, and research-focused master’s programmes.
                    </p>
                    <div style={{ marginBottom: '1rem' }}>
                        <a href={`mailto:${profileData.contact.email}`} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 600, fontSize: '1.5rem', display: 'block', marginBottom: '0.5rem' }}>
                            {profileData.contact.email}
                        </a>
                    </div>
                </div>

                {/* Right Column: Connect */}
                <div>
                    <h3 style={{
                        fontSize: '2rem',
                        marginBottom: '1.5rem',
                        color: 'var(--text-primary)',
                        borderBottom: '2px solid var(--accent-primary)',
                        display: 'inline-block',
                        paddingBottom: '0.25rem'
                    }}>
                        Connect
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {profileData.contact.linkedin && (
                            <a href={profileData.contact.linkedin} target="_blank" rel="noopener noreferrer"
                                style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}
                                onMouseEnter={(e) => e.target.style.color = 'var(--accent-primary)'}
                                onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>
                                <span>↗</span> LinkedIn
                            </a>
                        )}
                        {profileData.contact.github && (
                            <a href={profileData.contact.github} target="_blank" rel="noopener noreferrer"
                                style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}
                                onMouseEnter={(e) => e.target.style.color = 'var(--accent-primary)'}
                                onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>
                                <span>↗</span> GitHub
                            </a>
                        )}
                        <a href="/resume.pdf" target="_blank" rel="noopener noreferrer"
                            style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}
                            onMouseEnter={(e) => e.target.style.color = 'var(--accent-primary)'}
                            onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>
                            <span>↗</span> Resume (CV)
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
