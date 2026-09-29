import React from 'react';
import { Sparkles, Cookie, Film } from 'lucide-react';

export default function Navbar() {
  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'rgba(9, 4, 2, 0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(245, 158, 11, 0.15)',
      }}
    >
      <div
        className="container"
        style={{
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Logo & Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #7e22ce 0%, #ea580c 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(234, 88, 12, 0.4)',
            }}
          >
            <Cookie size={22} color="#fff" />
          </div>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1.25rem',
                letterSpacing: '-0.01em',
                lineHeight: 1,
              }}
            >
              BRITANNIA <span style={{ color: '#fbbf24' }}>BOURBON</span>
            </div>
            <div
              style={{
                fontSize: '0.65rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#d97706',
                fontWeight: 600,
              }}
            >
              Original Frame Sequence
            </div>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '28px',
          }}
          className="desktop-nav"
        >
          <a
            href="#animation-hero"
            style={{
              color: '#fcf7f2',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fbbf24')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#fcf7f2')}
          >
            <Film size={15} color="#f59e0b" />
            Live Animation
          </a>
          <a
            href="#cocoa-craft"
            style={{
              color: '#d1beae',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 500,
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fbbf24')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#d1beae')}
          >
            The Chocolate Story
          </a>
          <a
            href="#specs"
            style={{
              color: '#d1beae',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 500,
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fbbf24')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#d1beae')}
          >
            Technical Specs
          </a>
        </nav>

        {/* Action Pill Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            className="glass-pill"
            style={{
              padding: '6px 14px',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#fbbf24',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: '1px solid rgba(251, 191, 36, 0.3)',
            }}
          >
            <Sparkles size={13} />
            <span>50 HD FRAMES</span>
          </div>
        </div>
      </div>
    </header>
  );
}
