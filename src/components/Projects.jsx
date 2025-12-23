import React, { useState, useEffect } from 'react';
import projectsData from '../data/projects.json';

const Projects = () => {
    const [selectedProject, setSelectedProject] = useState(null);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (selectedProject) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedProject]);

    return (
        <section className="section" id="projects" style={{ padding: '1rem 0' }}>
            <div className="section-header">
                <h3>Selected Research Projects</h3>
            </div>

            <div className="projects-grid">
                {projectsData.map((project) => (
                    <div
                        key={project.id}
                        className="project-card"
                        onClick={() => setSelectedProject(project)}
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => e.key === 'Enter' && setSelectedProject(project)}
                    >
                        <h4>{project.title}</h4>
                        <p className="text-muted">{project.summary}</p>
                        <span style={{
                            fontSize: '0.75rem',
                            color: 'var(--accent-color)',
                            marginTop: 'auto', /* Push to bottom */
                            paddingTop: '0.5rem',
                            display: 'inline-block',
                            fontWeight: 500
                        }}>
                            View Details →
                        </span>
                    </div>
                ))}
            </div>

            {selectedProject && (
                <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button
                            className="close-button"
                            onClick={() => setSelectedProject(null)}
                            aria-label="Close modal"
                        >
                            ×
                        </button>

                        <h2 style={{ marginBottom: '0.5rem' }}>{selectedProject.title}</h2>
                        <p className="text-muted" style={{ marginBottom: '2rem' }}>{selectedProject.summary}</p>

                        <div className="project-details">
                            <DetailSection title="Overview" content={selectedProject.details.overview} />
                            <DetailSection title="Research Question" content={selectedProject.details.researchQuestion} />

                            <div style={{ marginBottom: '1.5rem' }}>
                                <h5 style={{ marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Challenges</h5>
                                <ul style={{ listStyle: 'disc', paddingLeft: '1.2rem' }}>
                                    {selectedProject.details.challenges.map((challenge, i) => (
                                        <li key={i} style={{ marginBottom: '0.25rem' }}>{challenge}</li>
                                    ))}
                                </ul>
                            </div>

                            <DetailSection title="Methodology" content={selectedProject.details.methodology} />

                            <div style={{ marginBottom: '1.5rem' }}>
                                <h5 style={{ marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Technologies</h5>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {selectedProject.details.technologies.map((tech, i) => (
                                        <span key={i} style={{
                                            background: 'var(--bg-secondary)',
                                            padding: '0.2rem 0.6rem',
                                            fontSize: '0.85rem',
                                            borderRadius: '4px',
                                            border: '1px solid var(--border-color)'
                                        }}>
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <DetailSection title="Results" content={selectedProject.details.results} />
                            <DetailSection title="Future Work" content={selectedProject.details.futureWork} />
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

const DetailSection = ({ title, content }) => (
    <div style={{ marginBottom: '1.5rem' }}>
        <h5 style={{ marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>{title}</h5>
        <p>{content}</p>
    </div>
);

export default Projects;
