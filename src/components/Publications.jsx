import React, { useState, useEffect } from 'react';

const Publications = () => {
    const [selectedPdf, setSelectedPdf] = useState(null);

    // Add/remove modal-open class when PDF viewer opens/closes
    useEffect(() => {
        if (selectedPdf) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
        return () => {
            document.body.classList.remove('modal-open');
        };
    }, [selectedPdf]);

    const publications = [
        {
            conference: "International Conference on Computing, STEM and Applied Sciences | 20/03/2025",
            title: "Vision-Driven Virtual Piano: Monocular Hand Tracking, Dynamic Calibration, and Velocity-Based Note Triggering",
            links: [
                { text: "Certificate", url: "/conferences/ICCSAS_25_Certificate.pdf" },
                { text: "Paper", url: "/conferences/Vision_Driven_Virtual_Piano_Paper.pdf" }
            ]
        },
        {
            conference: "International Conference Science Technology Engineering Mathematics for Sustainable Development | 21/02/2025",
            title: "Stereo Vision with ESP32-CAM: Depth Estimation for Autonomous Driving Applications",
            links: [
                { text: "Certificate", url: "/conferences/ICSTEMSD_25_Certificate.pdf" },
                { text: "Paper", url: "/conferences/Stereo_Vision_ESP32_Paper.pdf" }
            ]
        }
    ];

    return (
        <section className="section" id="publications" style={{ padding: '1rem 0' }}>
            <div className="section-header">
                <h3>Publications & Conferences</h3>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem',
                width: '100%'
            }}>
                {publications.map((pub, idx) => (
                    <div key={idx} className="card physics-obstacle" style={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        padding: '1.2rem'
                    }}>
                        <div style={{ marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.5rem' }}>
                                <h4 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0 }}>
                                    Conference
                                </h4>
                                <span style={{
                                    color: 'var(--text-muted)',
                                    fontSize: '0.85rem',
                                    fontFamily: 'monospace',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {pub.conference.split('|')[1].trim()}
                                </span>
                            </div>

                            <span style={{
                                color: 'var(--accent-primary)',
                                fontSize: '1rem',
                                fontWeight: 500,
                                display: 'block',
                                marginBottom: '0.5rem'
                            }}>
                                {pub.conference.split('|')[0].trim()}
                            </span>
                        </div>

                        <p style={{
                            color: 'var(--text-secondary)',
                            lineHeight: 1.6,
                            fontSize: '0.95rem',
                            marginBottom: '1.5rem',
                            flex: 1,
                            fontStyle: 'italic'
                        }}>
                            "{pub.title}"
                        </p>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: 'auto' }}>
                            {pub.links && pub.links.length > 0 ? (
                                pub.links.map((link, i) => (
                                    <button key={i}
                                        onClick={() => setSelectedPdf(link.url)}
                                        style={{
                                            background: 'var(--bg-tertiary)',
                                            color: 'var(--text-secondary)',
                                            padding: '0.2rem 0.6rem',
                                            fontSize: '0.8rem',
                                            borderRadius: '4px',
                                            border: '1px solid var(--border-color)',
                                            textDecoration: 'none',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            cursor: 'pointer',
                                            fontFamily: 'inherit'
                                        }}
                                        onMouseOver={e => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
                                        onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                                    >
                                        {link.text}
                                        <span style={{ fontSize: '10px' }}>↗</span>
                                    </button>
                                ))
                            ) : (
                                <span style={{
                                    color: 'var(--text-muted)',
                                    fontSize: '0.8rem',
                                    fontStyle: 'italic'
                                }}>
                                    Paper forthcoming
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {selectedPdf && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0,0,0,0.8)',
                    zIndex: 10000,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    backdropFilter: 'blur(5px)'
                }} onClick={() => setSelectedPdf(null)}>

                    <div style={{
                        width: '90%',
                        maxWidth: '1000px',
                        height: '85vh',
                        background: 'white',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        position: 'relative',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                        display: 'flex',
                        flexDirection: 'column'
                    }} onClick={e => e.stopPropagation()}>

                        <div style={{
                            padding: '1rem',
                            borderBottom: '1px solid #eee',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: '#f8f9fa'
                        }}>
                            <h4 style={{ margin: 0, color: '#333' }}>Document Viewer</h4>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <a href={selectedPdf} download style={{
                                    fontSize: '0.9rem',
                                    color: 'var(--accent-primary)',
                                    textDecoration: 'none',
                                    fontWeight: 500
                                }}>
                                    Download PDF ⬇
                                </a>
                                <button onClick={() => setSelectedPdf(null)} style={{
                                    border: 'none',
                                    background: 'transparent',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer',
                                    color: '#666',
                                    lineHeight: 1
                                }}>
                                    &times;
                                </button>
                            </div>
                        </div>

                        <div style={{ flex: 1, position: 'relative' }}>
                            <iframe
                                src={selectedPdf}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    border: 'none'
                                }}
                                title="PDF Viewer"
                            />
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Publications;
