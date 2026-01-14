import React, { useState, useEffect } from 'react';
import projectsData from '../data/projects.json';
import {
    SiWebgl, SiOpengl, SiReact, SiJavascript, SiPython, SiOpencv,
    SiTensorflow, SiPytorch, SiNodedotjs, SiElectron, SiTypescript,
    SiTailwindcss, SiArduino, SiCplusplus, SiNextdotjs, SiChartdotjs,
    SiThreedotjs, SiDocker, SiGit
} from 'react-icons/si';
import { VscCode } from 'react-icons/vsc';
import { FaGithub, FaExternalLinkAlt, FaYoutube } from 'react-icons/fa';

// Icon Configuration Map
const techIcons = {
    "WebGL2": { icon: SiWebgl, color: "#990000" },
    "GLSL": { icon: SiOpengl, color: "#5586A4" }, // No direct GLSL icon, OpenGL is close
    "MediaPipe": { icon: VscCode, color: "#00B0FF" }, // Generic code icon or specific if available
    "React": { icon: SiReact, color: "#61DAFB" },
    "JavaScript": { icon: SiJavascript, color: "#F7DF1E" },
    "Ridge Regression": { icon: SiPython, color: "#3776AB" }, // Algo usually Python
    "Kalman Filter": { icon: SiPython, color: "#3776AB" },
    "WebGPU": { icon: SiWebgl, color: "#DA347B" }, // WebGPU often associated with distinctive reddish logo
    "Three.js": { icon: SiThreedotjs, color: "#000000" }, // Three.js is black/white
    "Transformers.js": { icon: SiTensorflow, color: "#FF6F00" }, // Hugging Face related
    "Electron": { icon: SiElectron, color: "#47848F" },
    "Node.js": { icon: SiNodedotjs, color: "#339933" },
    "Chart.js": { icon: SiChartdotjs, color: "#FF6384" },
    "TypeScript": { icon: SiTypescript, color: "#3178C6" },
    "Next.js": { icon: SiNextdotjs, color: "#000000" },
    "WebAssembly": { icon: VscCode, color: "#654FF0" },
    "Deep Q-Learning": { icon: SiPytorch, color: "#EE4C2C" },
    "PyTorch": { icon: SiPytorch, color: "#EE4C2C" },
    "OpenAI Gym": { icon: SiPython, color: "#3776AB" },
    "Reinforcement Learning": { icon: SiPython, color: "#3776AB" },
    "Simulation": { icon: SiCplusplus, color: "#00599C" },
    "OpenCV": { icon: SiOpencv, color: "#5C3EE8" },
    "aPipe": { icon: VscCode, color: "#5C3EE8" },
    "Python": { icon: SiPython, color: "#3776AB" },
    "HCI": { icon: VscCode, color: "#333" },
    "NumPy": { icon: SiPython, color: "#013243" },
    "PyAudio": { icon: SiPython, color: "#F7DF1E" },
    "TensorFlow": { icon: SiTensorflow, color: "#FF6F00" },
    "Pose Estimation": { icon: SiOpencv, color: "#5C3EE8" },
    "Web Development": { icon: SiReact, color: "#61DAFB" },
    "Google Colab": { icon: SiPython, color: "#F9AB00" },
    "Gaussian Splatting": { icon: SiOpencv, color: "#5C3EE8" }, // Graphics heavy
    "3D Reconstruction": { icon: SiThreedotjs, color: "#333" },
    "UNet 3+": { icon: SiTensorflow, color: "#FF6F00" },
    "Medical Imaging": { icon: SiOpencv, color: "#5C3EE8" },
    "ESP32-CAM": { icon: SiArduino, color: "#00979D" },
    "Stereo Vision": { icon: SiOpencv, color: "#5C3EE8" },
    "Embedded Systems": { icon: SiCplusplus, color: "#00599C" },
    "Tailwind CSS": { icon: SiTailwindcss, color: "#06B6D4" },
    "Client-side processing": { icon: SiJavascript, color: "#F7DF1E" }
};

const TechBadge = ({ name, compact = false }) => {
    const config = techIcons[name] || { icon: VscCode, color: "var(--text-color)" };
    const Icon = config.icon;

    return (
        <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: compact ? '0.25rem' : '0.4rem',
            padding: compact ? '0.15rem 0.5rem' : '0.3rem 0.8rem',
            background: 'var(--bg-secondary)',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            color: 'var(--text-color)',
            fontSize: compact ? '0.7rem' : '0.85rem',
            fontWeight: 500,
            whiteSpace: 'nowrap'
        }}>
            <Icon style={{ color: config.color, fontSize: compact ? '0.8rem' : '1.1rem' }} />
            {name}
        </span>
    );
};

const Projects = () => {
    const [selectedProject, setSelectedProject] = useState(null);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (selectedProject) {
            document.body.style.overflow = 'hidden';
            document.body.classList.add('modal-open');
        } else {
            document.body.style.overflow = 'unset';
            document.body.classList.remove('modal-open');
        }
        return () => {
            document.body.style.overflow = 'unset';
            document.body.classList.remove('modal-open');
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            {project.domain && (
                                <span style={{
                                    fontSize: '0.65rem',
                                    color: 'var(--text-color)',
                                    opacity: 0.7,
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    fontWeight: 600
                                }}>
                                    {project.domain}
                                </span>
                            )}

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {project.link && (
                                    <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        style={{ color: 'var(--accent-primary)', opacity: 0.9, transition: 'opacity 0.2s', fontSize: '0.9rem' }}
                                        title="Live Demo"
                                        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.9'}
                                    >
                                        <FaExternalLinkAlt />
                                    </a>
                                )}
                                {project.github && (
                                    <a
                                        href={project.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        style={{ color: 'var(--text-color)', opacity: 0.7, transition: 'opacity 0.2s', fontSize: '1rem' }}
                                        title="GitHub Repo"
                                        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
                                    >
                                        <FaGithub />
                                    </a>
                                )}
                                {project.video && (
                                    <a
                                        href={project.video}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        style={{ color: '#ff0000', opacity: 0.8, transition: 'opacity 0.2s', fontSize: '1rem' }}
                                        title="Watch Video"
                                        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
                                    >
                                        <FaYoutube />
                                    </a>
                                )}
                            </div>
                        </div>

                        <h4>{project.title}</h4>
                        <p className="text-muted" style={{ marginBottom: '1rem' }}>{project.summary}</p>

                        <div style={{ marginTop: 'auto', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                            {project.details.technologies.slice(0, 4).map((tech, i) => (
                                <TechBadge key={i} name={tech} compact={true} />
                            ))}
                        </div>
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
                        <p className="text-muted" style={{ marginBottom: '1.5rem' }}>{selectedProject.summary}</p>

                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                            {selectedProject.link && (
                                <a
                                    href={selectedProject.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.5rem 1rem',
                                        background: 'var(--accent-primary)', // Ensure this variable is valid, else fallback to a color
                                        color: '#ffffff', // Force white text on accent background
                                        textDecoration: 'none',
                                        borderRadius: '4px',
                                        fontSize: '0.9rem',
                                        fontWeight: 500,
                                        border: '1px solid transparent'
                                    }}
                                >
                                    Live Demo <FaExternalLinkAlt style={{ fontSize: '0.8rem' }} />
                                </a>
                            )}
                            {selectedProject.github && (
                                <a
                                    href={selectedProject.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.5rem 1rem',
                                        border: '1px solid var(--border-color)',
                                        color: 'var(--text-color)',
                                        textDecoration: 'none',
                                        borderRadius: '4px',
                                        fontSize: '0.9rem',
                                        fontWeight: 500,
                                        background: 'var(--bg-secondary)'
                                    }}
                                >
                                    GitHub Code
                                </a>
                            )}
                            {selectedProject.video && (
                                <a
                                    href={selectedProject.video}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.5rem 1rem',
                                        background: '#ff0000', /* YouTube Red */
                                        color: 'white',
                                        textDecoration: 'none',
                                        borderRadius: '4px',
                                        fontSize: '0.9rem',
                                        fontWeight: 500
                                    }}
                                >
                                    Watch Video ▶
                                </a>
                            )}
                        </div>

                        {selectedProject.image && (
                            <div style={{ marginBottom: '2rem' }}>
                                <img
                                    src={selectedProject.image}
                                    alt={selectedProject.title}
                                    style={{
                                        width: '100%',
                                        maxHeight: '400px',
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                        border: '1px solid var(--border-color)'
                                    }}
                                />
                            </div>
                        )}

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
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                                    {selectedProject.details.technologies.map((tech, i) => (
                                        <TechBadge key={i} name={tech} />
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
