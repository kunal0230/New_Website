import React from 'react';
import profileData from '../data/profile.json';
import visionData from '../data/vision.json';

const Hero = () => {
    return (
        <section className="section" id="about" style={{
            paddingTop: '100px',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center'
        }}>
            <div style={{ maxWidth: '1200px', width: '100%' }}>
                <p className="physics-obstacle" style={{
                    color: 'var(--accent-primary)',
                    marginBottom: '1rem',
                    fontSize: '1rem',
                    fontFamily: 'monospace'
                }}>
                    Hi, my name is
                </p>
                <h1 className="physics-obstacle" style={{
                    marginBottom: '0.5rem',
                    fontSize: 'clamp(3rem, 5vw, 5rem)'
                }}>
                    {profileData.name}
                </h1>
                <h2 className="physics-obstacle" style={{
                    color: 'var(--text-secondary)',
                    marginBottom: '2rem',
                    fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>
                    {profileData.title}
                </h2>

                {/* Content Container - uses hero-content class for mobile width override */}
                <div className="hero-content" style={{
                    position: 'relative',
                    zIndex: 2,
                    width: '55%',
                    paddingRight: '2rem',
                    transform: 'translateY(-20px)'
                }}>
                    <p className="physics-obstacle" style={{
                        fontSize: '1.2rem',
                        lineHeight: '1.6',
                        color: 'var(--text-secondary)',
                        marginBottom: '2.5rem',
                        maxWidth: '850px'
                    }}>
                        {visionData.content}
                    </p>

                    <div className="availability-box physics-obstacle" style={{
                        color: 'var(--accent-primary)',
                        padding: '1rem 2rem',
                        border: '1px solid var(--accent-primary)',
                        borderRadius: '4px',
                        fontFamily: 'monospace',
                        fontSize: '1rem',
                        lineHeight: '1.6',
                        width: '100%',
                        background: 'rgba(15, 118, 110, 0.02)'
                    }}>
                        <p style={{ margin: 0 }}>{profileData.availability}</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
