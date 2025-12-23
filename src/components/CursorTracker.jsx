import React, { useEffect, useRef, useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const Latex = ({ children }) => {
    const html = katex.renderToString(children, {
        throwOnError: false,
        displayMode: true
    });
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

const EFFECTS = {
    spectral: {
        name: 'Spectral Dispersion',
        desc: 'Visualizes lateral chromatic aberration relative to motion velocity, inspired by wavelength-dependent refraction.',
        mode: 'lighter'
    },
    temporal: {
        name: 'Temporal Integration',
        desc: 'Simulates sensor accumulation buffers, visualizing light trails analogous to long-exposure photography.',
        mode: 'source-over'
    },
    quantum: {
        name: 'Quantum Noise',
        desc: 'Visualizes perceptual shot noise via stochastic perturbation, approximating low-light signal degradation.',
        mode: 'source-over'
    },
    spatial: {
        name: 'Spatial Mapping (LiDAR)',
        desc: 'Reconstructs a sparse spatial mesh inspired by ToF depth scanning.',
        mode: 'source-over'
    }
};

const CursorTracker = () => {
    const canvasRef = useRef(null);
    const mouse = useRef({ x: -1000, y: -1000 });
    const particles = useRef([]);
    const obstacles = useRef([]);
    const activeEffectRef = useRef('spectral');

    // State for UI
    const [activeEffect, setActiveEffect] = useState('spectral');
    const [showDoc, setShowDoc] = useState(false);
    const [isMinimized, setIsMinimized] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

    // Update ref when state changes
    useEffect(() => {
        activeEffectRef.current = activeEffect;
    }, [activeEffect]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;

        // Configuration
        const particlesCount = 90;
        const connectionDistance = 80;
        const mouseRadius = 120;

        // Auto-minimize on scroll
        const handleScroll = () => {
            if (window.scrollY > window.innerHeight * 0.8) {
                setIsMinimized(true);
            } else {
                setIsMinimized(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        const PARTICLE_COUNT = 100;
        const MOUSE_RADIUS = 220;
        const MOUSE_FORCE = 0.8;
        const BASE_SPEED = 1.0;

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * BASE_SPEED;
                this.vy = (Math.random() - 0.5) * BASE_SPEED;
                this.size = Math.random() * 4 + 4; // Larger: 4-8px
                this.baseVx = this.vx;
                this.baseVy = this.vy;
                this.scanning = false; // For Spatial Mode
            }

            update(mx, my, mode) {
                // SPATIAL MAPPING LOGIC (LiDAR)
                if (mode === 'spatial') {
                    // 1. Move
                    this.x += this.vx;
                    this.y += this.vy;

                    // 2. Obstacle Scanning (Attraction to Edges)
                    let nearestEdgeDist = 9999;
                    let targetX = this.x;
                    let targetY = this.y;
                    this.scanning = false;

                    for (let rect of obstacles.current) {
                        const clampedX = Math.max(rect.left, Math.min(this.x, rect.right));
                        const clampedY = Math.max(rect.top, Math.min(this.y, rect.bottom));

                        const dx = this.x - clampedX;
                        const dy = this.y - clampedY;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        if (dist < 100 && dist < nearestEdgeDist) {
                            nearestEdgeDist = dist;
                            targetX = clampedX;
                            targetY = clampedY;
                        }
                    }

                    if (nearestEdgeDist < 60) {
                        this.scanning = true;
                        // Pull towards surface (Scan)
                        const pullStrength = 0.05;
                        this.vx += (targetX - this.x) * pullStrength;
                        this.vy += (targetY - this.y) * pullStrength;
                        // Dampen velocity to "stick"
                        this.vx *= 0.8;
                        this.vy *= 0.8;
                    } else {
                        const dx = mx - this.x;
                        const dy = my - this.y;
                        const distSq = dx * dx + dy * dy;

                        if (distSq < MOUSE_RADIUS * MOUSE_RADIUS) {
                            const dist = Math.sqrt(distSq);
                            const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
                            const angle = Math.atan2(dy, dx);
                            // Push away
                            this.vx -= Math.cos(angle) * force * 0.5;
                            this.vy -= Math.sin(angle) * force * 0.5;
                        }

                        // Base Drift
                        this.vx = this.vx * 0.98 + this.baseVx * 0.02;
                        this.vy = this.vy * 0.98 + this.baseVy * 0.02;
                    }

                    // Wrap
                    if (this.x < 0) this.x = canvas.width;
                    if (this.x > canvas.width) this.x = 0;
                    if (this.y < 0) this.y = canvas.height;
                    if (this.y > canvas.height) this.y = 0;

                    return; // Skip standard logic
                }


                // STANDARD LOGIC (Spectral, Temporal, Quantum)

                // 1. Move
                this.x += this.vx;
                this.y += this.vy;

                // 2. Obstacle Collision (Bounce with Push-Out)
                for (let rect of obstacles.current) {
                    const radius = this.size;

                    // Simple AABB vs Circle check (approximated with expanded rect)
                    if (this.x > rect.left - radius && this.x < rect.right + radius &&
                        this.y > rect.top - radius && this.y < rect.bottom + radius) {

                        // Determine penetration overlap for each side
                        const overlapLeft = (this.x + radius) - rect.left;
                        const overlapRight = rect.right - (this.x - radius);
                        const overlapTop = (this.y + radius) - rect.top;
                        const overlapBottom = rect.bottom - (this.y - radius);

                        // Find the smallest overlap (shallowest penetration)
                        const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

                        if (minOverlap === overlapLeft) {
                            this.x = rect.left - radius - 1; // Push out left
                            if (this.vx > 0) this.vx *= -1;  // Bounce if moving in
                        } else if (minOverlap === overlapRight) {
                            this.x = rect.right + radius + 1; // Push out right
                            if (this.vx < 0) this.vx *= -1;   // Bounce if moving in
                        } else if (minOverlap === overlapTop) {
                            this.y = rect.top - radius - 1;   // Push out top
                            if (this.vy > 0) this.vy *= -1;   // Bounce if moving in
                        } else if (minOverlap === overlapBottom) {
                            this.y = rect.bottom + radius + 1; // Push out bottom
                            if (this.vy < 0) this.vy *= -1;    // Bounce if moving in
                        }
                    }
                }

                // 3. Mouse Repulsion
                const dx = mx - this.x;
                const dy = my - this.y;
                const distSq = dx * dx + dy * dy;

                if (distSq < MOUSE_RADIUS * MOUSE_RADIUS) {
                    const dist = Math.sqrt(distSq);
                    const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
                    const angle = Math.atan2(dy, dx);

                    const pushX = -Math.cos(angle) * force * MOUSE_FORCE;
                    const pushY = -Math.sin(angle) * force * MOUSE_FORCE;

                    this.vx += pushX;
                    this.vy += pushY;
                }

                // 4. Return to base drift
                this.vx = this.vx * 0.97 + this.baseVx * 0.03;
                this.vy = this.vy * 0.97 + this.baseVy * 0.03;

                // 5. Screen Wrapping
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }

            drawSpectral(ctx) {
                // RGB Split - Increased Opacity
                ctx.fillStyle = 'rgba(255, 50, 50, 1)';
                ctx.beginPath(); ctx.arc(this.x - this.vx * 2, this.y - this.vy * 2, this.size, 0, Math.PI * 2); ctx.fill();

                ctx.fillStyle = 'rgba(50, 255, 50, 1)';
                ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();

                ctx.fillStyle = 'rgba(50, 50, 255, 1)';
                ctx.beginPath(); ctx.arc(this.x + this.vx * 2, this.y + this.vy * 2, this.size, 0, Math.PI * 2); ctx.fill();
            }

            drawTemporal(ctx) {
                // Solid Color for Trails - Slightly Reduced Size
                const tempSize = Math.max(0.5, this.size - 1);
                ctx.fillStyle = '#3c6e71';
                ctx.beginPath(); ctx.arc(this.x, this.y, tempSize, 0, Math.PI * 2); ctx.fill();
            }

            drawQuantum(ctx) {
                // Stochastic Jitter (Noise) - Increased Dot Size
                const noiseX = (Math.random() - 0.5) * 4;
                const noiseY = (Math.random() - 0.5) * 4;
                ctx.fillStyle = Math.random() > 0.5 ? '#3c6e71' : '#111';
                ctx.beginPath(); ctx.arc(this.x + noiseX, this.y + noiseY, 2, 0, Math.PI * 2); ctx.fill(); // 2px
            }

            drawSpatial(ctx) {
                // Point Cloud Style - Larger dots
                ctx.fillStyle = this.scanning ? '#00ff00' : '#888'; // Neon Green if scanning, Grey if void
                ctx.beginPath(); ctx.arc(this.x, this.y, this.scanning ? 6 : 4, 0, Math.PI * 2); ctx.fill();
            }
        }

        const updateObstacles = () => {
            // Only target explicitly marked obstacles for clean collision
            const elements = document.querySelectorAll('.physics-obstacle');
            obstacles.current = Array.from(elements).map(el => el.getBoundingClientRect());
        };

        const init = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particles.current = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.current.push(new Particle());
            }
            updateObstacles();
        };

        window.addEventListener('scroll', updateObstacles, { passive: true });
        window.addEventListener('resize', init);

        // Observer for DOM changes (navigation, content load)
        const observer = new MutationObserver((mutations) => {
            updateObstacles();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });

        // Initial delay to ensure layout is settled
        setTimeout(init, 500);

        init();

        const handleMouseMove = (e) => {
            mouse.current.x = e.clientX;
            mouse.current.y = e.clientY;
        };

        const handleMouseLeave = () => {
            mouse.current.x = -1000;
            mouse.current.y = -1000;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        const animate = () => {
            const mode = activeEffectRef.current;

            // Clear Strategies
            if (mode === 'temporal') {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'; // Lower alpha = Stronger trails 
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }

            ctx.globalCompositeOperation = EFFECTS[mode].mode;

            // Update Loop
            particles.current.forEach(p => p.update(mouse.current.x, mouse.current.y, mode));

            // Draw Loop
            if (mode === 'spatial') {
                // MESH RECONSTRUCTION
                ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
                ctx.lineWidth = 0.5;
                ctx.beginPath();

                particles.current.forEach((p, i) => {
                    p.drawSpatial(ctx);

                    // Connect neighbors
                    for (let j = i + 1; j < particles.current.length; j++) {
                        const p2 = particles.current[j];
                        const dx = p.x - p2.x;
                        const dy = p.y - p2.y;
                        if (dx * dx + dy * dy < 2500) { // 50px dist
                            ctx.moveTo(p.x, p.y);
                            ctx.lineTo(p2.x, p2.y);
                        }
                    }
                });
                ctx.stroke();
            } else {
                // STANDARD MODES
                particles.current.forEach(p => {
                    if (mode === 'spectral') p.drawSpectral(ctx);
                    else if (mode === 'temporal') p.drawTemporal(ctx);
                    else if (mode === 'quantum') p.drawQuantum(ctx);
                });
            }

            ctx.globalCompositeOperation = 'source-over';
            animationFrameId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener('resize', init);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('scroll', updateObstacles);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave); // Restoring this too
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <>
            <canvas
                ref={canvasRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    zIndex: 0,
                    opacity: 1,
                }}
            />
            {/* Lighting Lab UI */}
            <div style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                zIndex: 100,
                background: 'rgba(255, 255, 255, 0.95)',
                padding: isMinimized ? '10px 15px' : '20px',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                maxWidth: '320px',
                border: '1px solid #e0e0e0',
                fontFamily: 'var(--font-heading)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
            }}>
                <div style={{
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    fontWeight: 700,
                    marginBottom: isMinimized ? '0' : '12px',
                    color: '#666',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minWidth: isMinimized ? '150px' : '280px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '8px', height: '8px', background: '#2a9d8f', borderRadius: '50%', display: 'inline-block' }}></span>
                        Lighting Lab
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {!isMinimized && (
                            <button
                                onClick={() => setShowDoc(true)}
                                style={{
                                    border: '1px solid #2a9d8f',
                                    background: 'transparent',
                                    color: '#2a9d8f',
                                    fontSize: '0.65rem',
                                    fontWeight: 'bold',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                }}
                            >
                                DOCS
                            </button>
                        )}
                        <button
                            onClick={() => setIsMinimized(!isMinimized)}
                            style={{
                                border: 'none',
                                background: 'transparent',
                                color: '#999',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                padding: '0 4px'
                            }}
                        >
                            {isMinimized ? '+' : '−'}
                        </button>
                    </div>
                </div>

                {!isMinimized && (
                    <>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '15px' }}>
                            {Object.keys(EFFECTS).map(key => (
                                <button
                                    key={key}
                                    onClick={() => setActiveEffect(key)}
                                    style={{
                                        padding: '8px',
                                        fontSize: '0.75rem',
                                        fontWeight: 500,
                                        border: '1px solid',
                                        borderColor: activeEffect === key ? '#353535' : '#eee',
                                        borderRadius: '6px',
                                        background: activeEffect === key ? '#353535' : '#f8f9fa',
                                        color: activeEffect === key ? 'white' : '#555',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        textAlign: 'center'
                                    }}
                                >
                                    {EFFECTS[key].name.split(' (')[0].replace('Spatial', 'Spatial/XR')}
                                </button>
                            ))}
                        </div>

                        <div style={{
                            fontSize: '0.8rem',
                            color: '#444',
                            lineHeight: '1.5',
                            background: '#f1f5f9',
                            padding: '10px',
                            borderRadius: '6px',
                            borderLeft: `3px solid ${activeEffect === 'spatial' ? '#00ff00' : '#3c6e71'}`
                        }}>
                            <strong style={{ display: 'block', marginBottom: '4px', color: '#111' }}>
                                {EFFECTS[activeEffect].name}
                            </strong>
                            {EFFECTS[activeEffect].desc}
                        </div>
                    </>
                )}
            </div>

            {/* Documentation Modal */}
            {showDoc && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0,0,0,0.5)',
                    zIndex: 200,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(5px)'
                }} onClick={() => setShowDoc(false)}>
                    <div style={{
                        background: 'white',
                        width: '90%',
                        maxWidth: '600px',
                        maxHeight: '80vh',
                        overflowY: 'auto',
                        padding: '40px',
                        borderRadius: '8px',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                        fontFamily: 'Georgia, serif',
                        lineHeight: '1.6',
                        color: '#333'
                    }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
                            <div>
                                <h1 style={{ fontSize: '1.8rem', marginBottom: '5px', color: '#111' }}>Optical Simulation Framework</h1>
                                <p style={{ fontStyle: 'italic', color: '#666', fontFamily: 'sans-serif', fontSize: '0.9rem' }}>
                                    Interactive Web-based Demonstration of Photonics & Imaging Principles.
                                    <br /><br />
                                    This framework does not aim to replicate full physical optics, but to provide an interactive, perceptually grounded abstraction of imaging phenomena across optics, sensors, noise, and spatial reconstruction.
                                </p>
                            </div>
                            <button onClick={() => setShowDoc(false)}
                                style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#999' }}>&times;</button>
                        </div>

                        <section style={{ marginBottom: '30px' }}>
                            <h3 style={{ fontSize: '1.1rem', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px', color: '#2a9d8f', fontFamily: 'sans-serif', textTransform: 'uppercase', letterSpacing: '1px' }}>1. Spectral Dispersion (Optics)</h3>
                            <p style={{ fontSize: '0.95rem', marginBottom: '10px' }}>
                                Inspired by wavelength-dependent refraction, this module visualizes lateral chromatic aberration using RGB channel separation proportional to motion vectors.
                            </p>
                            <Latex>{'\\vec{P}_{red} = \\vec{P}_{pos} - k \\cdot \\vec{v}'}</Latex>
                            <Latex>{'\\vec{P}_{blue} = \\vec{P}_{pos} + k \\cdot \\vec{v}'}</Latex>
                            <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#555' }}>
                                <strong>Implementation Strategy:</strong> I render three overlapping particle instances per frame. By setting the Canvas blending mode to <code>globalCompositeOperation = 'lighter'</code> (additive mixing), the separated Red, Green, and Blue channels recombine into pure white light when velocity is zero, and fringe into spectrums during motion.
                            </div>
                        </section>

                        <section style={{ marginBottom: '30px' }}>
                            <h3 style={{ fontSize: '1.1rem', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px', color: '#2a9d8f', fontFamily: 'sans-serif', textTransform: 'uppercase', letterSpacing: '1px' }}>2. Temporal Integration (Sensors)</h3>
                            <p style={{ fontSize: '0.95rem', marginBottom: '10px' }}>
                                Simulates the accumulation of photons on a sensor's photodiode over an exposure time <em>t</em>. Visualized through alpha-blending persistence, analogous to <strong>Long Exposure Photography</strong>.
                            </p>
                            <Latex>{'I_{display}(t) = I_{new}(t) + (1 - \\alpha) \\cdot I_{display}(t-1)'}</Latex>
                            <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#555' }}>
                                <strong>Implementation Strategy:</strong> Instead of clearing the canvas frame buffer completely (`ctx.clearRect`), I draw a full-screen rectangle with low opacity (`rgba(255,255,255, 0.1)`). This creates a recursive feedback loop where previous frames fade exponentially, simulating the integration time of a physical CMOS sensor.
                            </div>
                        </section>

                        <section style={{ marginBottom: '30px' }}>
                            <h3 style={{ fontSize: '1.1rem', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px', color: '#2a9d8f', fontFamily: 'sans-serif', textTransform: 'uppercase', letterSpacing: '1px' }}>3. Quantum Noise (Signal)</h3>
                            <p style={{ fontSize: '0.95rem', marginBottom: '10px' }}>
                                This module visualizes the perceptual effects of shot noise by injecting stochastic perturbations during rendering, approximating Poisson-distributed photon arrival under low-light conditions.
                            </p>
                            <Latex>{'\\vec{P}_{noise} = \\vec{P}_{pos} + \\mathcal{N}(0, \\sigma)'}</Latex>
                            <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#555' }}>
                                <strong>Implementation Strategy:</strong> I decouple the <em>visual</em> position from the <em>physical</em> position. While the physics engine updates the particle's smooth trajectory, the render loop adds a randomized displacement vector (`Math.random()`) each frame, simulating high-ISO signal degradation.
                            </div>
                        </section>

                        <section>
                            <h3 style={{ fontSize: '1.1rem', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px', color: '#2a9d8f', fontFamily: 'sans-serif', textTransform: 'uppercase', letterSpacing: '1px' }}>4. Spatial Mapping (LiDAR/ToF)</h3>
                            <p style={{ fontSize: '0.95rem', marginBottom: '10px' }}>
                                Inspired by Time-of-Flight depth scanners, this module reconstructs a sparse spatial mesh using proximity constraints between sampled particles.
                            </p>
                            <Latex>{'\\forall p_i, p_j : \\|p_i - p_j\\| < r \\implies \\text{Connect}(p_i, p_j)'}</Latex>
                            <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#555' }}>
                                <strong>Implementation Strategy:</strong> I implement a distance-constraint graph. In the render loop, I iterate through particle pairs and draw connecting lines (`ctx.lineTo`) if their Euclidean distance is below a threshold. The particles are logically attracted to DOM element bounding boxes (`getBoundingClientRect`) to simulate surface clamping.
                            </div>
                        </section>
                    </div>
                </div>
            )}
        </>
    );
};

export default CursorTracker;
