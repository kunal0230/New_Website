
import React from 'react';
import skillsData from '../data/skills.json';

const Skills = () => {
    return (
        <section className="section" id="skills" style={{ padding: '1rem 0' }}>
            <div className="section-header">
                <h3>Skills & Methods</h3>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
                width: '100%'
            }}>
                {/* Card 1: Research & Core */}
                <div className="card">
                    <h4 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--accent-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Research & Architectures</h4>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <h5 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Core Domains</h5>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {skillsData.categories.find(c => c.name === "Core Domains")?.items.map((item, i) => (
                                <span key={i} style={{ background: 'var(--bg-tertiary)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.85rem' }}>{item}</span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h5 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Architectures</h5>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {skillsData.categories.find(c => c.name.includes("Architectures"))?.items.map((item, i) => (
                                <span key={i} style={{ background: 'var(--bg-tertiary)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.85rem' }}>{item}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Card 2: Development Stack */}
                <div className="card">
                    <h4 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--accent-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Development Stack</h4>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <h5 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Languages</h5>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {skillsData.categories.find(c => c.name.includes("Programming"))?.items.map((item, i) => (
                                <span key={i} style={{ background: 'var(--bg-tertiary)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.85rem' }}>{item}</span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h5 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Libraries</h5>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {skillsData.categories.find(c => c.name.includes("Frameworks"))?.items.map((item, i) => (
                                <span key={i} style={{ background: 'var(--bg-tertiary)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.85rem' }}>{item}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Card 3: Engineering & Tools */}
                <div className="card">
                    <h4 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--accent-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Engineering & Deployment</h4>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <h5 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Optimization</h5>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {skillsData.categories.find(c => c.name.includes("Optimization"))?.items.map((item, i) => (
                                <span key={i} style={{ background: 'var(--bg-tertiary)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.85rem' }}>{item}</span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h5 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Tools</h5>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {/* Manually adding tools that were previously implied or scattered */}
                            {["Git", "Docker", "Linux", "VS Code", "Jupyter"].map((item, i) => (
                                <span key={i} style={{ background: 'var(--bg-tertiary)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.85rem' }}>{item}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Skills;
