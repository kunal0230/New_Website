import React, { useEffect, useRef, useState, useMemo } from 'react';

const ImageAnalyzer = ({ imageSrc, onClose }) => {
    const canvasRef = useRef(null);
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load image
    useEffect(() => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imageSrc;
        img.onload = () => {
            setImage(img);
            setIsLoading(false);
        };
    }, [imageSrc]);

    const [filter, setFilter] = useState('none'); // none, sobel, gaussian, noise, median, sharpen, emboss, hist_eq
    const [analysis, setAnalysis] = useState(null);
    const [exposure, setExposure] = useState(1.0);
    const [gamma, setGamma] = useState(1.0);
    const [channel, setChannel] = useState('rgb'); // rgb, r, g, b, l

    // Interaction State
    const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const lastMousePos = useRef({ x: 0, y: 0 });

    // Optimization: Gamma Lookup Table
    const gammaLUT = useMemo(() => {
        const lut = new Uint8ClampedArray(256);
        for (let i = 0; i < 256; i++) {
            lut[i] = Math.min(255, Math.max(0, 255 * Math.pow(i / 255, 1 / gamma)));
        }
        return lut;
    }, [gamma]);

    // Handle Zoom
    const handleWheel = (e) => {
        e.preventDefault();
        const scaleChange = e.deltaY * -0.001;
        const newScale = Math.min(Math.max(0.5, transform.scale + scaleChange), 5);
        setTransform(prev => ({ ...prev, scale: newScale }));
    };

    // Handle Pan
    const handleMouseDown = (e) => {
        setIsDragging(true);
        lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const dx = e.clientX - lastMousePos.current.x;
        const dy = e.clientY - lastMousePos.current.y;
        setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
        lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => setIsDragging(false);

    // Apply Convolution Kernel
    const convolve = (data, width, height, kernel) => {
        const side = Math.round(Math.sqrt(kernel.length));
        const half = Math.floor(side / 2);
        const output = new Float32Array(data.length);
        const w = width;
        const h = height;

        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                let r = 0, g = 0, b = 0;

                for (let ky = 0; ky < side; ky++) {
                    for (let kx = 0; kx < side; kx++) {
                        const cy = y + ky - half;
                        const cx = x + kx - half;

                        if (cx >= 0 && cx < w && cy >= 0 && cy < h) {
                            const offset = (cy * w + cx) * 4;
                            const weight = kernel[ky * side + kx];
                            r += data[offset] * weight;
                            g += data[offset + 1] * weight;
                            b += data[offset + 2] * weight;
                        }
                    }
                }
                const off = (y * w + x) * 4;
                output[off] = r;
                output[off + 1] = g;
                output[off + 2] = b;
                output[off + 3] = data[off + 3]; // Alpha
            }
        }
        return output;
    };

    // Filter Functions
    const applyHistogramEqualization = (data) => {
        const hist = new Array(256).fill(0);
        for (let i = 0; i < data.length; i += 4) {
            const l = Math.floor(0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]);
            hist[l]++;
        }

        const cdf = new Array(256).fill(0);
        let sum = 0;
        for (let i = 0; i < 256; i++) {
            sum += hist[i];
            cdf[i] = sum;
        }

        const total = data.length / 4;
        const output = new Uint8ClampedArray(data.length);

        for (let i = 0; i < data.length; i += 4) {
            const oldR = data[i];
            const oldG = data[i + 1];
            const oldB = data[i + 2];
            const l = Math.floor(0.2126 * oldR + 0.7152 * oldG + 0.0722 * oldB);

            const newL = Math.floor((cdf[l] / total) * 255);
            const ratio = l > 0 ? newL / l : 1;

            output[i] = Math.min(255, oldR * ratio);
            output[i + 1] = Math.min(255, oldG * ratio);
            output[i + 2] = Math.min(255, oldB * ratio);
            output[i + 3] = 255;
        }
        return output;
    };

    const applySobel = (data, w, h) => {
        const kx = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
        const ky = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
        const gx = convolve(data, w, h, kx);
        const gy = convolve(data, w, h, ky);
        const output = new Uint8ClampedArray(data.length);
        for (let i = 0; i < data.length; i += 4) {
            const mag = (Math.abs(gx[i]) + Math.abs(gy[i]) + Math.abs(gx[i + 1]) + Math.abs(gy[i + 1]) + Math.abs(gx[i + 2]) + Math.abs(gy[i + 2])) / 3;
            output[i] = output[i + 1] = output[i + 2] = mag;
            output[i + 3] = 255;
        }
        return output;
    };

    const applyMedian = (data, w, h) => {
        const output = new Uint8ClampedArray(data.length);
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const r = [], g = [], b = [];
                for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                        const cy = y + ky;
                        const cx = x + kx;
                        if (cx >= 0 && cx < w && cy >= 0 && cy < h) {
                            const off = (cy * w + cx) * 4;
                            r.push(data[off]);
                            g.push(data[off + 1]);
                            b.push(data[off + 2]);
                        }
                    }
                }
                r.sort((a, b) => a - b); g.sort((a, b) => a - b); b.sort((a, b) => a - b);
                const off = (y * w + x) * 4;
                const mid = Math.floor(r.length / 2);
                output[off] = r[mid];
                output[off + 1] = g[mid];
                output[off + 2] = b[mid];
                output[off + 3] = data[off + 3];
            }
        }
        return output;
    };

    // Main Processing Effect
    useEffect(() => {
        if (!image || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Layout Scaling: Fit image within available space (approx width of container)
        // We calculate max dimensions based on window, but let CSS handle display size.
        // Canvas internal resolution stays high (up to 1200px width for quality)
        const MAX_WIDTH = 1200;
        const scale = Math.min(1, MAX_WIDTH / image.width);
        canvas.width = image.width * scale;
        canvas.height = image.height * scale;

        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;

        // 1. FILTER CHAIN
        if (filter === 'noise') {
            for (let i = 0; i < data.length; i += 4) {
                if (Math.random() > 0.98) {
                    const val = Math.random() > 0.5 ? 255 : 0;
                    data[i] = data[i + 1] = data[i + 2] = val;
                }
            }
        } else if (filter === 'sobel') {
            const sobelData = applySobel(data, canvas.width, canvas.height);
            data.set(sobelData);
        } else if (filter === 'gaussian') {
            const kernel = [1 / 16, 2 / 16, 1 / 16, 2 / 16, 4 / 16, 2 / 16, 1 / 16, 2 / 16, 1 / 16];
            const blurred = convolve(data, canvas.width, canvas.height, kernel);
            for (let i = 0; i < data.length; i++) data[i] = blurred[i];
        } else if (filter === 'median') {
            const medianData = applyMedian(data, canvas.width, canvas.height);
            data.set(medianData);
        } else if (filter === 'sharpen') {
            const kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];
            const sharpened = convolve(data, canvas.width, canvas.height, kernel);
            for (let i = 0; i < data.length; i++) data[i] = sharpened[i];
        } else if (filter === 'emboss') {
            const kernel = [-2, -1, 0, -1, 1, 1, 0, 1, 2];
            const embossed = convolve(data, canvas.width, canvas.height, kernel);
            for (let i = 0; i < data.length; i++) {
                const val = embossed[i] + 128;
                data[i] = val;
            }
        } else if (filter === 'hist_eq') {
            const eqData = applyHistogramEqualization(data);
            data.set(eqData);
        }

        // 2. INTENSITY & COLOR (Pixel Loop Optimization)
        const histR = new Array(256).fill(0);
        const histG = new Array(256).fill(0);
        const histB = new Array(256).fill(0);
        const histL = new Array(256).fill(0);

        // Pre-calc channel flags
        const isoR = channel === 'r';
        const isoG = channel === 'g';
        const isoB = channel === 'b';
        const isoL = channel === 'l';
        const useLut = gamma !== 1.0;

        for (let i = 0; i < data.length; i += 4) {
            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];

            // Exposure
            if (exposure !== 1.0) {
                r = Math.min(255, r * exposure);
                g = Math.min(255, g * exposure);
                b = Math.min(255, b * exposure);
            }

            // Gamma (LUT)
            if (useLut) {
                // Clamp to 0-255 before LUT lookup to be safe, though min/max above handles it mostly
                r = gammaLUT[Math.floor(r)];
                g = gammaLUT[Math.floor(g)];
                b = gammaLUT[Math.floor(b)];
            }

            // Save processed values for Rec.709 stats
            const procR = r;
            const procG = g;
            const procB = b;

            // Channel Isolation
            if (isoR) { g = r; b = r; }
            else if (isoG) { r = g; b = g; }
            else if (isoB) { r = b; g = b; }
            else if (isoL) {
                const l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                r = l; g = l; b = l;
            }

            data[i] = r;
            data[i + 1] = g;
            data[i + 2] = b;

            // Stats (based on values closest to perception or raw?)
            // Usually histograms show the *output* distribution.
            histR[Math.floor(r)]++;
            histG[Math.floor(g)]++;
            histB[Math.floor(b)]++;
            // Luminance of the output pixel
            const l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            histL[Math.min(255, Math.floor(l))]++;
        }

        ctx.putImageData(imageData, 0, 0);

        const maxCount = Math.max(...histL, ...histR, ...histG, ...histB);
        setAnalysis({ histR, histG, histB, histL, maxCount });

    }, [image, exposure, gamma, channel, filter, gammaLUT]);

    const renderHistogram = (hist, color, height = 40) => {
        if (!analysis) return null;
        const max = analysis.maxCount;
        return (
            <div style={{ display: 'flex', alignItems: 'flex-end', height: `${height}px`, gap: '1px', opacity: 0.9 }}>
                {hist.map((val, i) => {
                    if (i % 4 !== 0) return null;
                    const h = (val / max) * 100;
                    return <div key={i} style={{ width: '1%', flex: 1, height: `${h}%`, background: color }} />;
                })}
            </div>
        );
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: '#0a0a0a',
            zIndex: 10001,
            display: 'flex',
            fontFamily: 'monospace',
            animation: 'fadeIn 0.3s ease'
        }}>
            {/* LEFT: IMAGE WORKSPACE (Flexible) */}
            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '40px',
                    background: 'radial-gradient(circle at center, #1a1a1a 0%, #000 100%)',
                    overflow: 'hidden',
                    cursor: isDragging ? 'grabbing' : 'grab'
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
            >
                <div style={{
                    boxShadow: '0 25px 50px rgba(0,0,0,0.7)',
                    border: '1px solid #333',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    display: 'flex',
                    transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                    transformOrigin: 'center',
                    transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                }}>
                    <canvas
                        ref={canvasRef}
                        style={{
                            maxWidth: '100%',
                            maxHeight: '90vh',
                            display: 'block',
                            objectFit: 'contain'
                        }}
                    />
                </div>

                {isLoading && <div style={{ position: 'absolute', color: '#666' }}>Processing...</div>}

                <div style={{ position: 'absolute', bottom: '20px', left: '20px', color: '#444', fontSize: '0.8rem', pointerEvents: 'none' }}>
                    Resolution: {image ? `${image.width}x${image.height}` : '---'} • 8-bit RGBA • Zoom: {(transform.scale * 100).toFixed(0)}%
                </div>

                <div style={{ position: 'absolute', top: '20px', left: '20px', color: '#444', fontSize: '0.7rem', pointerEvents: 'none' }}>
                    Scroll to Zoom • Drag to Pan
                </div>
            </div>

            {/* RIGHT: CONTROL SIDEBAR (Fixed Width) */}
            <div style={{
                width: '320px',
                background: '#111',
                borderLeft: '1px solid #222',
                display: 'flex',
                flexDirection: 'column',
                color: '#ddd'
            }}>
                {/* Header */}
                <div style={{
                    padding: '20px',
                    borderBottom: '1px solid #222',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    background: '#161616'
                }}>
                    <div>
                        <h2 style={{ fontSize: '1rem', margin: '0 0 5px 0', color: '#0f766e', letterSpacing: '1px', textTransform: 'uppercase' }}>Imaging Pipeline</h2>
                        <div style={{ fontSize: '0.65rem', color: '#666' }}>CLIENT-SIDE COMPUTER VISION</div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', fontSize: '1.5rem', lineHeight: '1rem' }}
                    >
                        &times;
                    </button>
                </div>

                {/* Scrollable Controls */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>

                    {/* 1. INTENSITY & HISTOGRAM */}
                    <div style={{ marginBottom: '30px' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#888', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            1. Intensity Distribution
                        </div>

                        <div style={{ padding: '10px', background: '#0a0a0a', borderRadius: '4px', marginBottom: '15px', border: '1px solid #222' }}>
                            {analysis ? (
                                <div style={{ height: '70px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '2px' }}>
                                    {renderHistogram(analysis.histR, '#ff5555', 20)}
                                    {renderHistogram(analysis.histG, '#55ff55', 20)}
                                    {renderHistogram(analysis.histB, '#5555ff', 20)}
                                    <div style={{ height: '1px', background: '#333', margin: '2px 0' }} />
                                    {renderHistogram(analysis.histL, '#fff', 20)}
                                </div>
                            ) : <div style={{ fontSize: '0.7rem', color: '#444', textAlign: 'center', padding: '20px' }}>Analyzing...</div>}
                        </div>

                        <div style={{ display: 'grid', gap: '15px' }}>
                            <div>
                                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#aaa', marginBottom: '5px' }}>
                                    EXPOSURE (GAIN) <span>{exposure.toFixed(2)}x</span>
                                </label>
                                <input
                                    type="range" min="0" max="3" step="0.1" value={exposure}
                                    onChange={e => setExposure(parseFloat(e.target.value))}
                                    style={{ width: '100%', height: '4px', background: '#333', appearance: 'none', borderRadius: '2px' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#aaa', marginBottom: '5px' }}>
                                    GAMMA CORRECTION <span>{gamma.toFixed(2)}</span>
                                </label>
                                <input
                                    type="range" min="0.1" max="3" step="0.1" value={gamma}
                                    onChange={e => setGamma(parseFloat(e.target.value))}
                                    style={{ width: '100%', height: '4px', background: '#333', appearance: 'none', borderRadius: '2px' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 2. COLOR SPACE */}
                    <div style={{ marginBottom: '30px' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#888', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            2. Color Space Decomposition
                        </div>

                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                            {['RGB', 'R', 'G', 'B', 'L'].map(mode => (
                                <button
                                    key={mode}
                                    onClick={() => setChannel(mode.toLowerCase())}
                                    style={{
                                        flex: 1,
                                        padding: '6px 0',
                                        background: channel === mode.toLowerCase() ? '#0f766e' : '#222',
                                        border: '1px solid #333',
                                        color: channel === mode.toLowerCase() ? 'white' : '#888',
                                        borderRadius: '3px',
                                        cursor: 'pointer',
                                        fontSize: '0.7rem',
                                        fontWeight: 'bold',
                                        minWidth: '40px'
                                    }}
                                >
                                    {mode}
                                </button>
                            ))}
                        </div>
                        <div style={{ marginTop: '8px', fontSize: '0.7rem', color: '#555', fontStyle: 'italic', lineHeight: '1.2' }}>
                            {channel === 'rgb' && "Composite RGB Signal."}
                            {channel === 'r' && "Red Channel Intensity."}
                            {channel === 'l' && "Luminance Y (Rec.709 Standard)."}
                        </div>
                    </div>

                    {/* 3. STRUCTURE & RESTORATION */}
                    <div style={{ marginBottom: '30px' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#888', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            3. Structure & Restoration
                        </div>
                        <div style={{ display: 'grid', gap: '8px' }}>
                            {[
                                { id: 'none', label: 'Original Signal' },
                                { id: 'hist_eq', label: 'Histogram Equalization' },
                                { id: 'sobel', label: 'Sobel Edge Detection (|G|)' },
                                { id: 'sharpen', label: 'Sharpen (High Pass)' },
                                { id: 'emboss', label: 'Emboss (Directional)' },
                                { id: 'gaussian', label: 'Gaussian Blur (Low Pass)' },
                                { id: 'median', label: 'Median Filter (Denoise)' },
                                { id: 'noise', label: 'Inject Noise (Salt & Pepper)' },
                            ].map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => setFilter(opt.id)}
                                    style={{
                                        padding: '8px 12px',
                                        background: filter === opt.id ? '#0f766e' : '#1a1a1a',
                                        color: filter === opt.id ? 'white' : '#888',
                                        border: '1px solid #333',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        borderRadius: '3px',
                                        fontSize: '0.75rem',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                        <div style={{ marginTop: '8px', fontSize: '0.7rem', color: '#555', fontStyle: 'italic', lineHeight: '1.2' }}>
                            {filter === 'sobel' && "Sobel approximates gradient magnitude."}
                            {filter === 'median' && "Non-linear filter, removes outliers while preserving edges."}
                            {filter === 'hist_eq' && "Global Contrast Enhancement via CDF."}
                            {filter === 'sharpen' && "Enhances high-frequency components."}
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div style={{ padding: '15px', borderTop: '1px solid #222', background: '#161616', fontSize: '0.65rem', color: '#444', textAlign: 'center' }}>
                    Custom Image Processing Pipeline v1.0
                </div>
            </div>
        </div>
    );
};

export default ImageAnalyzer;
