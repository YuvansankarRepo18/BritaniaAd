import React, { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Cinematic Background Frame Sequence Animation Engine
 * Renders the 50-frame sequence seamlessly to full-bleed canvas.
 * Zero player controls, cinematic 0.5x speed, runs once from frame 1 to 50, then triggers onComplete.
 */
export default function FrameSequenceAnimation({
  frameCount = 50,
  framePrefix = '/frames/ezgif-frame-',
  frameSuffix = '.jpg',
  fps = 30,
  playbackSpeed = 0.5,
  isActive = true,
  resetTrigger = 0,
  onComplete = null,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // In-memory preloaded Image cache
  const imagesRef = useRef([]);
  const isLoadedRef = useRef(false);

  // Playback refs to avoid React re-renders during 60hz RAF loop
  const currentFrameRef = useRef(0);
  const isPlayingRef = useRef(false);
  const hasFinishedRef = useRef(false);
  const lastTimeRef = useRef(0);
  const accumulatorRef = useRef(0);
  const animFrameIdRef = useRef(null);

  // Stable callback ref
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const [imagesReady, setImagesReady] = useState(false);

  // Generate frame paths: /frames/ezgif-frame-001.jpg ... 050.jpg
  const framePaths = React.useMemo(() => {
    return Array.from({ length: frameCount }, (_, i) => {
      const numStr = String(i + 1).padStart(3, '0');
      return `${framePrefix}${numStr}${frameSuffix}`;
    });
  }, [frameCount, framePrefix, frameSuffix]);

  // High-DPI canvas render with object-fit: cover logic
  const drawFrame = useCallback((frameIndex) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const clientWidth = canvas.clientWidth;
    const clientHeight = canvas.clientHeight;

    if (clientWidth === 0 || clientHeight === 0) return;

    if (canvas.width !== clientWidth * dpr || canvas.height !== clientHeight * dpr) {
      canvas.width = clientWidth * dpr;
      canvas.height = clientHeight * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    // Cover calculation preserving 16:9 aspect ratio
    const imgWidth = img.naturalWidth || 1280;
    const imgHeight = img.naturalHeight || 720;
    const imgAspect = imgWidth / imgHeight;
    const containerAspect = clientWidth / clientHeight;

    let renderW, renderH, offsetX, offsetY;

    if (containerAspect > imgAspect) {
      // Container is wider than image: match width, overflow top/bottom
      renderW = clientWidth;
      renderH = clientWidth / imgAspect;
      offsetX = 0;
      offsetY = (clientHeight - renderH) / 2;
    } else {
      // Container is taller than image: match height, overflow left/right
      renderH = clientHeight;
      renderW = clientHeight * imgAspect;
      offsetX = (clientWidth - renderW) / 2;
      offsetY = 0;
    }

    ctx.clearRect(0, 0, clientWidth, clientHeight);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, offsetX, offsetY, renderW, renderH);

    ctx.restore();
  }, []);

  // Preload all frames into memory
  useEffect(() => {
    let loadedCount = 0;
    let isCancelled = false;
    imagesRef.current = new Array(frameCount);

    framePaths.forEach((src, index) => {
      const img = new Image();
      img.src = src;

      const checkComplete = () => {
        if (isCancelled) return;
        loadedCount += 1;
        if (loadedCount === frameCount) {
          isLoadedRef.current = true;
          setImagesReady(true);
        }
      };

      img.onload = () => {
        imagesRef.current[index] = img;
        checkComplete();
      };
      img.onerror = () => {
        console.error(`Failed to load background frame: ${src}`);
        checkComplete();
      };
    });

    return () => {
      isCancelled = true;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [framePaths, frameCount]);

  // Start playback routine
  const startPlayback = useCallback(() => {
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }

    currentFrameRef.current = 0;
    hasFinishedRef.current = false;
    isPlayingRef.current = true;
    lastTimeRef.current = 0;
    accumulatorRef.current = 0;

    // Draw frame 0 immediately
    drawFrame(0);

    const effectiveFps = fps * playbackSpeed;
    const frameDurationMs = 1000 / effectiveFps;

    const animate = (timestamp) => {
      if (!isPlayingRef.current) return;

      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }

      const elapsed = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      accumulatorRef.current += elapsed;

      while (accumulatorRef.current >= frameDurationMs) {
        accumulatorRef.current -= frameDurationMs;

        if (currentFrameRef.current >= frameCount - 1) {
          // Reached final frame: stop animation loop and fire onComplete
          currentFrameRef.current = frameCount - 1;
          isPlayingRef.current = false;
          hasFinishedRef.current = true;
          drawFrame(frameCount - 1);

          if (onCompleteRef.current) {
            onCompleteRef.current();
          }
          return; // Stop RAF loop
        } else {
          currentFrameRef.current += 1;
          drawFrame(currentFrameRef.current);
        }
      }

      animFrameIdRef.current = requestAnimationFrame(animate);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);
  }, [fps, playbackSpeed, frameCount, drawFrame]);

  // Stop playback
  const stopPlayback = useCallback(() => {
    isPlayingRef.current = false;
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
  }, []);

  // Handle active / reset triggers (e.g. initial load, scroll away, and return)
  useEffect(() => {
    if (!imagesReady) return;

    if (isActive) {
      // Replay from frame 001
      startPlayback();
    } else {
      // Out of view: pause and release loop
      stopPlayback();
    }

    return () => {
      stopPlayback();
    };
  }, [isActive, resetTrigger, imagesReady, startPlayback, stopPlayback]);

  // Resize listener
  useEffect(() => {
    const handleResize = () => {
      drawFrame(currentFrameRef.current);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawFrame]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
    </div>
  );
}
