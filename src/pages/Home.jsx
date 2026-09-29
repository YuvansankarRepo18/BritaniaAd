import React, { useState, useEffect, useRef, useCallback } from 'react';
import FrameSequenceAnimation from '../components/FrameSequenceAnimation.jsx';
import Navbar from '../components/Navbar.jsx';
import { Sparkles, ShieldCheck, Zap, Monitor, Cpu, ChevronDown } from 'lucide-react';

// Configurable playback speed (0.5 = 0.5x speed / ~15 FPS)
const PLAYBACK_SPEED = 0.5;

export default function Home() {
  const heroRef = useRef(null);

  // Animation and title states
  const [showTitle, setShowTitle] = useState(false);
  const [isHeroInView, setIsHeroInView] = useState(true);
  const [resetTrigger, setResetTrigger] = useState(0);

  // Callback when animation finishes its single run from frame 1 to 50
  const handleAnimationComplete = useCallback(() => {
    setShowTitle(true);
  }, []);

  // Dual detection: IntersectionObserver + scroll position for rock-solid reset on return
  useEffect(() => {
    const heroElement = heroRef.current;
    if (!heroElement) return;

    let hasScrolledAway = false;

    // 1. IntersectionObserver for view detection
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (hasScrolledAway) {
            setShowTitle(false);
            setResetTrigger((prev) => prev + 1);
            hasScrolledAway = false;
          }
          setIsHeroInView(true);
        } else {
          setIsHeroInView(false);
          hasScrolledAway = true;
        }
      },
      {
        threshold: 0.15,
      }
    );

    observer.observe(heroElement);

    // 2. Scroll listener for immediate top re-entry
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 250) {
        hasScrolledAway = true;
      } else if (scrollY <= 20 && hasScrolledAway) {
        setShowTitle(false);
        setResetTrigger((prev) => prev + 1);
        setIsHeroInView(true);
        hasScrolledAway = false;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#070403', position: 'relative' }}>
      <Navbar />

      {/* FULL-SCREEN CINEMATIC HERO SECTION */}
      <section
        id="animation-hero"
        ref={heroRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '100vh',
          minHeight: '640px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
        }}
      >
        {/* Cinematic Background Canvas Animation (0.5x Speed, No Controls) */}
        <FrameSequenceAnimation
          frameCount={50}
          framePrefix="/frames/ezgif-frame-"
          frameSuffix=".jpg"
          fps={30}
          playbackSpeed={PLAYBACK_SPEED}
          isActive={isHeroInView}
          resetTrigger={resetTrigger}
          onComplete={handleAnimationComplete}
        />

        {/* Cinematic Dark Vignette & Gradient Overlay for Text Contrast */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse at center, rgba(7, 4, 3, 0.2) 0%, rgba(7, 4, 3, 0.6) 65%, rgba(7, 4, 3, 0.95) 100%)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* Ambient Warm Atmosphere Glows */}
        <div
          className="ambient-glow pulse-glow"
          style={{
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '800px',
            height: '400px',
            background:
              'radial-gradient(ellipse at center, rgba(217, 119, 6, 0.15) 0%, rgba(126, 34, 206, 0.1) 50%, transparent 75%)',
            zIndex: 2,
          }}
        />

        {/* FOREGROUND TITLE & HERO CONTENT */}
        <div
          className="container"
          style={{
            position: 'relative',
            zIndex: 10,
            textAlign: 'center',
            maxWidth: '960px',
            padding: '0 24px',
          }}
        >
          {/* Animated Container: Fades in only AFTER the animation finishes */}
          <div
            style={{
              opacity: showTitle ? 1 : 0,
              transform: showTitle ? 'translateY(0)' : 'translateY(24px)',
              transition:
                'opacity 1.3s cubic-bezier(0.16, 1, 0.3, 1), transform 1.3s cubic-bezier(0.16, 1, 0.3, 1)',
              pointerEvents: showTitle ? 'auto' : 'none',
              willChange: 'opacity, transform',
            }}
          >
            {/* Top Pill Tag */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 20px',
                borderRadius: '999px',
                background: 'rgba(20, 10, 7, 0.75)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                marginBottom: '20px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
              }}
            >
              <Sparkles size={15} color="#fbbf24" />
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#fbbf24',
                }}
              >
                The Original Chocolate Craving
              </span>
            </div>

            {/* Main Headline */}
            <h1
              style={{
                fontSize: 'clamp(2.75rem, 6.5vw, 5.25rem)',
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                marginBottom: '18px',
                textShadow: '0 10px 40px rgba(0, 0, 0, 0.9), 0 0 50px rgba(217, 119, 6, 0.35)',
              }}
            >
              UNLEASH THE <br />
              <span className="gradient-text-gold">CHOCOLATE RUSH</span>
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: 'clamp(1.05rem, 2vw, 1.35rem)',
                color: '#f0dfd5',
                maxWidth: '680px',
                marginLeft: 'auto',
                marginRight: 'auto',
                marginBottom: '36px',
                lineHeight: 1.6,
                textShadow: '0 4px 16px rgba(0, 0, 0, 0.8)',
              }}
            >
              Indulge in the legendary Britannia Bourbon experience. Deep dark biscuits filled
              with rich molten cocoa cream and crowned with sparkling sugar.
            </p>

            {/* Scroll Down Callout */}
            <div>
              <a
                href="#stats-section"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#fbbf24',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  background: 'rgba(25, 12, 8, 0.75)',
                  backdropFilter: 'blur(10px)',
                  padding: '10px 24px',
                  borderRadius: '999px',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.5)',
                  transition: 'all 0.25s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(2px)';
                  e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.25)';
                }}
              >
                <span>Discover The Chocolate Story</span>
                <ChevronDown size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* STATS & PERFORMANCE SPECS */}
      <section
        id="stats-section"
        style={{
          padding: '60px 0 60px 0',
          position: 'relative',
          zIndex: 10,
          background: '#070403',
        }}
      >
        <div className="container">
          <div
            className="glass-panel"
            style={{
              padding: '36px 28px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '24px',
              border: '1px solid rgba(245, 158, 11, 0.2)',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-display)',
                  color: '#fbbf24',
                  lineHeight: 1,
                  marginBottom: '8px',
                }}
              >
                50 / 50
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fcf7f2', marginBottom: '4px' }}>
                Extracted Frames
              </div>
              <div style={{ fontSize: '0.75rem', color: '#9a8270' }}>
                100% complete source sequence
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-display)',
                  color: '#fbbf24',
                  lineHeight: 1,
                  marginBottom: '8px',
                }}
              >
                0.5x
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fcf7f2', marginBottom: '4px' }}>
                Cinematic Speed
              </div>
              <div style={{ fontSize: '0.75rem', color: '#9a8270' }}>
                Smooth ~15 FPS motion
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-display)',
                  color: '#fbbf24',
                  lineHeight: 1,
                  marginBottom: '8px',
                }}
              >
                1280×720
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fcf7f2', marginBottom: '4px' }}>
                Native Aspect Ratio
              </div>
              <div style={{ fontSize: '0.75rem', color: '#9a8270' }}>
                Full-bleed responsive cover
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-display)',
                  color: '#fbbf24',
                  lineHeight: 1,
                  marginBottom: '8px',
                }}
              >
                0 ms
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fcf7f2', marginBottom: '4px' }}>
                Zero Video Overhead
              </div>
              <div style={{ fontSize: '0.75rem', color: '#9a8270' }}>
                Pure canvas background
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE ART OF BOURBON SECTION */}
      <section
        id="cocoa-craft"
        style={{
          padding: '90px 0',
          position: 'relative',
          background: 'linear-gradient(180deg, #070403 0%, #150905 50%, #070403 100%)',
        }}
      >
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 56px auto' }}>
            <h2
              style={{
                fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                fontWeight: 800,
                marginBottom: '16px',
              }}
            >
              The Science of <span className="gradient-text-gold">Pure Indulgence</span>
            </h2>
            <p style={{ color: '#bfaaa0', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Three iconic layers that make Britannia Bourbon an irresistible legend across generations.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
            }}
          >
            {/* Card 1 */}
            <div
              className="glass-panel"
              style={{
                padding: '36px 28px',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                transition: 'transform 0.25s ease, border-color 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.2)';
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(217, 119, 6, 0.15)',
                  border: '1px solid rgba(217, 119, 6, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  color: '#fbbf24',
                }}
              >
                <Sparkles size={24} />
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '12px', color: '#fff' }}>
                Sparkling Sugar Crystals
              </h3>
              <p style={{ color: '#bfaaa0', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Glistening on every biscuit's crunchy surface, delivering a subtle sweetness and an
                exciting tactile bite from the very first crunch.
              </p>
            </div>

            {/* Card 2 */}
            <div
              className="glass-panel"
              style={{
                padding: '36px 28px',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                transition: 'transform 0.25s ease, border-color 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.2)';
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(126, 34, 206, 0.15)',
                  border: '1px solid rgba(126, 34, 206, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  color: '#c084fc',
                }}
              >
                <Zap size={24} />
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '12px', color: '#fff' }}>
                Velvety Cocoa Cream
              </h3>
              <p style={{ color: '#bfaaa0', fontSize: '0.95rem', lineHeight: 1.6 }}>
                The rich, melt-in-your-mouth chocolate cream nestled between two biscuits brings a
                creamy decadence that flows just like the animation depicts.
              </p>
            </div>

            {/* Card 3 */}
            <div
              className="glass-panel"
              style={{
                padding: '36px 28px',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                transition: 'transform 0.25s ease, border-color 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.2)';
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(234, 88, 12, 0.15)',
                  border: '1px solid rgba(234, 88, 12, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  color: '#fb923c',
                }}
              >
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '12px', color: '#fff' }}>
                Double Chocolate Crunch
              </h3>
              <p style={{ color: '#bfaaa0', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Expertly baked chocolate biscuits with signature embossing that hold the creamy center
                together in an exquisite equilibrium of crunch and cream.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TECHNICAL ENGINE ARCHITECTURE SECTION */}
      <section
        id="specs"
        style={{
          padding: '80px 0',
          position: 'relative',
        }}
      >
        <div className="container">
          <div
            className="glass-panel"
            style={{
              padding: '48px 36px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div style={{ maxWidth: '640px', marginBottom: '36px' }}>
              <div
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#fbbf24',
                  letterSpacing: '0.1em',
                  marginBottom: '10px',
                }}
              >
                Engine Specifications
              </div>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>
                Built for Flawless Frame Fidelity
              </h3>
              <p style={{ color: '#bfaaa0', lineHeight: 1.6 }}>
                Every frame is treated as an immutable asset. Rendered directly to an HTML5 Canvas to
                eliminate CSS overhead, DOM thrashing, and frame skipping.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '20px',
              }}
            >
              <div
                style={{
                  padding: '20px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Cpu size={16} color="#fbbf24" />
                  <span style={{ fontWeight: 600, color: '#fff' }}>Delta Time Accumulator</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#9a8270' }}>
                  Maintains cinematic 0.5x playback speed consistently regardless of display refresh rate.
                </p>
              </div>

              <div
                style={{
                  padding: '20px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Monitor size={16} color="#fbbf24" />
                  <span style={{ fontWeight: 600, color: '#fff' }}>Aspect Ratio Cover Fit</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#9a8270' }}>
                  Scales 1280×720 frames proportionally across all viewports without stretching or distortion.
                </p>
              </div>

              <div
                style={{
                  padding: '20px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Zap size={16} color="#fbbf24" />
                  <span style={{ fontWeight: 600, color: '#fff' }}>RAM Preload Buffer</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#9a8270' }}>
                  All 50 image assets remain cached in memory for seamless, zero-lag playback.
                </p>
              </div>

              <div
                style={{
                  padding: '20px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <ShieldCheck size={16} color="#fbbf24" />
                  <span style={{ fontWeight: 600, color: '#fff' }}>IntersectionObserver Lifecycle</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#9a8270' }}>
                  Stops animation when scrolled away and resets sequence cleanly upon return.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '40px 0',
          background: '#040201',
          textAlign: 'center',
          color: '#7a665b',
          fontSize: '0.85rem',
        }}
      >
        <div className="container">
          <div style={{ marginBottom: '12px', color: '#fbbf24', fontWeight: 700, letterSpacing: '0.05em' }}>
            BRITANNIA BOURBON • THE ORIGINAL CHOCOLATE BISCUIT
          </div>
          <p style={{ maxWidth: '600px', margin: '0 auto 16px auto', lineHeight: 1.5 }}>
            Reproduced from the original 50-frame sequence (`ezgif-2799bcef3afb4a8c-jpg`).
            All image frames preserved at original dimensions, colors, and timing.
          </p>
          <div>
            Built with React, HTML5 Canvas & high-performance requestAnimationFrame.
          </div>
        </div>
      </footer>
    </div>
  );
}
