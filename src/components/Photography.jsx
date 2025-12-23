import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import ImageAnalyzer from './ImageAnalyzer';

const Photography = () => {
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [showAnalyzer, setShowAnalyzer] = useState(false);

    // List of photos found in the directory
    const photos = [
        "IMG_0129.jpg", "IMG_1265.png", "IMG_1297.png", "IMG_1561.jpg",
        "IMG_1857.jpg", "IMG_2323.jpg", "IMG_2510.jpg", "IMG_2557.jpg",
        "IMG_2792.jpg", "IMG_2794.jpg", "IMG_2834HQ.jpg", "IMG_3191.jpg",
        "IMG_3485.jpg", "IMG_3541.jpg", "IMG_3555.jpg", "IMG_3559.jpg",
        "IMG_3644.jpg", "IMG_3827-1.jpg", "IMG_5628.jpg", "IMG_5753.jpg",
        "IMG_6854.jpg", "IMG_9177.jpg"
    ];

    // Handle Keyboard Navigation
    useEffect(() => {
        if (selectedIndex === null) return;

        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') {
                setSelectedIndex((prev) => (prev + 1) % photos.length);
            } else if (e.key === 'ArrowLeft') {
                setSelectedIndex((prev) => (prev - 1 + photos.length) % photos.length);
            } else if (e.key === 'Escape') {
                setSelectedIndex(null);
                setShowAnalyzer(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIndex, photos.length]);

    const currentImage = selectedIndex !== null ? `/photos/${photos[selectedIndex]}` : null;

    return (
        <section className="section" id="photography">
            <div className="section-header">
                <h3>Visual Intuition</h3>
            </div>

            <p className="text-muted physics-obstacle" style={{ maxWidth: '100%', marginBottom: '1.5rem', lineHeight: '1.6', fontSize: '1.1rem' }}>
                I practice photography to refine my understanding of composition, scale, and lighting—fundamental concepts that directly inform my work in computer vision and image processing.
            </p>
            <p className="physics-obstacle" style={{ maxWidth: '100%', marginBottom: '3rem', fontSize: '1rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                Click any image to open the lightbox, then select "Analyze Signal" to explore its histogram and channel breakdown.
            </p>

            <div style={{
                columns: '3 250px',
                columnGap: '1rem',
            }}>
                {photos.map((photo, index) => (
                    <div
                        key={index}
                        style={{
                            marginBottom: '2rem',
                            padding: '1rem 0',
                            breakInside: 'avoid',
                            cursor: 'pointer',
                            overflow: 'hidden',
                            borderRadius: '8px',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-secondary)',
                            position: 'relative'
                        }}
                        onClick={() => setSelectedIndex(index)}
                    >
                        <img
                            src={`/photos/${photo}`}
                            alt="Photography Portfolio"
                            style={{
                                width: '100%',
                                height: 'auto',
                                display: 'block',
                                transition: 'transform 0.5s ease',
                            }}
                            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                            loading="lazy"
                        />
                    </div>
                ))}
            </div>

            {/* Lightbox Modal - Portaled to Body */}
            {selectedIndex !== null && createPortal(
                <div
                    className="modal-overlay"
                    style={{
                        opacity: 1,
                        animation: 'fadeIn 0.2s',
                        zIndex: 10000,
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(5px)',
                        transition: 'all 0.3s ease',
                        paddingRight: showAnalyzer ? '600px' : '0' // Make space for analyzer
                    }}
                    onClick={() => {
                        setSelectedIndex(null);
                        setShowAnalyzer(false);
                    }}
                >
                    <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }} onClick={e => e.stopPropagation()}>
                        <img
                            src={currentImage}
                            alt="Full Screen"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '90vh',
                                borderRadius: '4px',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                            }}
                        />

                        {/* Action Bar */}
                        <div style={{
                            position: 'absolute',
                            bottom: '20px',
                            right: '20px',
                            display: 'flex',
                            gap: '10px',
                            zIndex: 10
                        }}>
                            <button
                                onClick={() => setShowAnalyzer(!showAnalyzer)}
                                style={{
                                    background: '#0f766e',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    color: 'white',
                                    padding: '10px 20px',
                                    borderRadius: '50px',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    transition: 'all 0.2s ease'
                                }}
                                title="Open Imaging Pipeline"
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(15, 118, 110, 0.4)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="4 17 10 11 4 5"></polyline>
                                    <line x1="12" y1="19" x2="20" y2="19"></line>
                                </svg>
                                Analyze Signal
                            </button>
                        </div>

                        {/* Close Button */}
                        <button
                            style={{
                                position: 'absolute',
                                top: '-50px',
                                right: 0,
                                color: 'white',
                                fontSize: '2rem',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                lineHeight: 1
                            }}
                            onClick={() => {
                                setSelectedIndex(null);
                                setShowAnalyzer(false);
                            }}
                        >
                            &times;
                        </button>

                        {/* Navigation Hints */}
                        <div style={{
                            position: 'absolute',
                            bottom: '-40px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            color: 'rgba(255,255,255,0.7)',
                            fontSize: '0.8rem',
                            pointerEvents: 'none',
                            whiteSpace: 'nowrap'
                        }}>
                            ← Arrows to Navigate • Escape to Close
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Analyzer Panel - Portaled to Body */}
            {
                showAnalyzer && selectedIndex !== null && createPortal(
                    <ImageAnalyzer
                        imageSrc={currentImage}
                        onClose={() => setShowAnalyzer(false)}
                    />,
                    document.body
                )
            }
        </section >
    );
};

export default Photography;
