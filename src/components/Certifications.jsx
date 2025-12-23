import React from 'react';
import certData from '../data/certifications.json';

const Certifications = () => {
    return (
        <section className="section" id="certifications" style={{ padding: '1rem 0' }}>
            <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
                Certifications
            </h3>

            <div>
                {certData.map((cert) => (
                    <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <div>
                            <span style={{ fontWeight: 500 }}>{cert.title}</span>
                            <span style={{ margin: '0 0.5rem', color: 'var(--border-color)' }}>|</span>
                            <span className="text-muted">{cert.organization}</span>
                        </div>
                        <span className="text-muted" style={{ fontVariantNumeric: 'tabular-nums' }}>{cert.date}</span>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Certifications;
