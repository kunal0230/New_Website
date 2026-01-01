import React from 'react';
import experienceData from '../data/experience.json';

const Experience = () => {
    return (
        <section className="section" id="experience" style={{ padding: '1rem 0' }}>
            <div className="section-header">
                <h3>Experience</h3>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem',
                width: '100%'
            }}>
                {experienceData.map((exp, idx) => (
                    <div key={exp.id} className="card" style={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%'
                    }}>
                        <div style={{ marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                                <span style={{
                                    color: 'var(--accent-primary)',
                                    fontSize: '1rem',
                                    fontWeight: 500
                                }}>
                                    {exp.company}
                                </span>
                                <span style={{
                                    color: 'var(--text-muted)',
                                    fontSize: '0.8rem',
                                    fontFamily: 'monospace',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {exp.period}
                                </span>
                            </div>
                            <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.3 }}>{exp.role}</h4>
                        </div>

                        <p style={{
                            color: 'var(--text-secondary)',
                            lineHeight: 1.6,
                            fontSize: '0.95rem',
                            marginBottom: '1.5rem',
                            flex: 1
                        }}>
                            {exp.description}
                        </p>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: 'auto' }}>
                            {exp.technologies.slice(0, 4).map((tech, i) => (
                                <span key={i} style={{
                                    background: 'var(--bg-tertiary)',
                                    color: 'var(--text-secondary)',
                                    padding: '0.2rem 0.6rem',
                                    fontSize: '0.8rem',
                                    borderRadius: '4px',
                                    border: '1px solid var(--border-color)',
                                }}>
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Experience;
