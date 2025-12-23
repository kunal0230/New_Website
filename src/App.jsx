import React, { Suspense } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CursorTracker from './components/CursorTracker';
import Footer from './components/Footer';

// Lazy load heavy components for performance optimization
const Publications = React.lazy(() => import('./components/Publications'));
const Projects = React.lazy(() => import('./components/Projects'));
const Experience = React.lazy(() => import('./components/Experience'));
const Skills = React.lazy(() => import('./components/Skills'));
const Certifications = React.lazy(() => import('./components/Certifications'));
const Blog = React.lazy(() => import('./components/Blog'));
const Photography = React.lazy(() => import('./components/Photography'));
const Contact = React.lazy(() => import('./components/Contact'));

function App() {
  return (
    <>
      <CursorTracker />
      <Navbar />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <Hero />
        <Suspense fallback={<div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
          <Publications />
          <Projects />
          <Experience />
          <Skills />
          <Certifications />
          <Blog />
          <Photography />
          <Contact />
        </Suspense>
        <Footer />
      </div>
      <Analytics />
      <SpeedInsights />
    </>
  );
}

export default App;
