/**
 * Quiet Method — Content Script
 * Captures behavioral telemetry: keystroke timing, scroll velocity, mouse erraticness.
 * Sends aggregated metrics to background.js every 5 seconds.
 * Also listens for veil commands from background.js.
 *
 * © WEDGE METHOD LLC
 */

(() => {
  'use strict';

  // ── Constants ──────────────────────────────────────────────────────────
  const REPORT_INTERVAL_MS = 5000;
  const KEYSTROKE_WINDOW_MS = 30000;
  const SCROLL_WINDOW_MS = 10000;
  const MOUSE_WINDOW_MS = 10000;

  // ── Rolling buffers ────────────────────────────────────────────────────
  const keystrokeIntervals = [];   // { timestamp, interval }
  const scrollEvents = [];          // { timestamp, velocity }  (px/ms)
  const mouseMovements = [];        // { timestamp, dx, dy, speed }

  let lastKeydownTime = null;
  let lastScrollY = null;
  let lastScrollTime = null;
  let lastMouseX = null;
  let lastMouseY = null;
  let lastMouseTime = null;

  // ── Veil state ─────────────────────────────────────────────────────────
  let veilActive = false;
  let currentVeilLevel = 0;

  // ── Utility: prune old entries from a buffer ───────────────────────────
  function pruneBuffer(buffer, windowMs) {
    const cutoff = Date.now() - windowMs;
    while (buffer.length > 0 && buffer[0].timestamp < cutoff) {
      buffer.shift();
    }
  }

  // ── Utility: compute variance ──────────────────────────────────────────
  function variance(values) {
    if (values.length < 2) return 0;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const sqDiffs = values.map(v => (v - mean) ** 2);
    return sqDiffs.reduce((a, b) => a + b, 0) / values.length;
  }

  // ── Keystroke capture ──────────────────────────────────────────────────
  document.addEventListener('keydown', (e) => {
    try {
      const now = Date.now();
      if (lastKeydownTime !== null) {
        const interval = now - lastKeydownTime;
        if (interval > 0 && interval < 5000) { // ignore very long gaps
          keystrokeIntervals.push({ timestamp: now, interval });
        }
      }
      lastKeydownTime = now;
    } catch (_) { /* graceful degradation */ }
  }, { passive: true, capture: true });

  // ── Scroll capture ────────────────────────────────────────────────────
  let scrollThrottleTimer = null;
  window.addEventListener('scroll', () => {
    try {
      if (scrollThrottleTimer) return;
      scrollThrottleTimer = setTimeout(() => { scrollThrottleTimer = null; }, 50);

      const now = Date.now();
      const currentY = window.scrollY;

      if (lastScrollY !== null && lastScrollTime !== null) {
        const dt = now - lastScrollTime;
        if (dt > 0) {
          const dy = Math.abs(currentY - lastScrollY);
          const velocity = dy / dt; // px/ms
          scrollEvents.push({ timestamp: now, velocity });
        }
      }

      lastScrollY = currentY;
      lastScrollTime = now;
    } catch (_) { /* graceful degradation */ }
  }, { passive: true });

  // ── Mouse movement capture ─────────────────────────────────────────────
  let mouseThrottleTimer = null;
  document.addEventListener('mousemove', (e) => {
    try {
      if (mouseThrottleTimer) return;
      mouseThrottleTimer = setTimeout(() => { mouseThrottleTimer = null; }, 30);

      const now = Date.now();
      const x = e.clientX;
      const y = e.clientY;

      if (lastMouseX !== null && lastMouseY !== null && lastMouseTime !== null) {
        const dt = now - lastMouseTime;
        if (dt > 0) {
          const dx = x - lastMouseX;
          const dy = y - lastMouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const speed = dist / dt; // px/ms
          mouseMovements.push({ timestamp: now, dx, dy, speed });
        }
      }

      lastMouseX = x;
      lastMouseY = y;
      lastMouseTime = now;
    } catch (_) { /* graceful degradation */ }
  }, { passive: true });

  // ── Compute aggregated metrics ─────────────────────────────────────────
  function computeMetrics() {
    const now = Date.now();

    // Prune old data
    pruneBuffer(keystrokeIntervals, KEYSTROKE_WINDOW_MS);
    pruneBuffer(scrollEvents, SCROLL_WINDOW_MS);
    pruneBuffer(mouseMovements, MOUSE_WINDOW_MS);

    // Keystroke variance
    const intervals = keystrokeIntervals.map(k => k.interval);
    const keystrokeVariance = variance(intervals);
    const keystrokeMean = intervals.length > 0
      ? intervals.reduce((a, b) => a + b, 0) / intervals.length
      : 0;
    const keystrokeCount = intervals.length;

    // Scroll velocity stats
    const velocities = scrollEvents.map(s => s.velocity);
    const avgScrollVelocity = velocities.length > 0
      ? velocities.reduce((a, b) => a + b, 0) / velocities.length
      : 0;
    const maxScrollVelocity = velocities.length > 0
      ? Math.max(...velocities)
      : 0;

    // Mouse erraticness — direction change frequency
    let directionChanges = 0;
    const speeds = mouseMovements.map(m => m.speed);
    const avgMouseSpeed = speeds.length > 0
      ? speeds.reduce((a, b) => a + b, 0) / speeds.length
      : 0;

    for (let i = 2; i < mouseMovements.length; i++) {
      const prev = mouseMovements[i - 1];
      const curr = mouseMovements[i];
      // Direction change if sign of dx or dy flips
      if ((prev.dx > 0 && curr.dx < 0) || (prev.dx < 0 && curr.dx > 0) ||
          (prev.dy > 0 && curr.dy < 0) || (prev.dy < 0 && curr.dy > 0)) {
        directionChanges++;
      }
    }

    const mouseErraticness = mouseMovements.length > 2
      ? directionChanges / (mouseMovements.length - 1)
      : 0;

    return {
      keystroke: {
        variance: keystrokeVariance,
        mean: keystrokeMean,
        count: keystrokeCount,
      },
      scroll: {
        avgVelocity: avgScrollVelocity,
        maxVelocity: maxScrollVelocity,
        eventCount: velocities.length,
      },
      mouse: {
        avgSpeed: avgMouseSpeed,
        erraticness: mouseErraticness,
        movementCount: mouseMovements.length,
      },
      timestamp: now,
      url: window.location.href,
    };
  }

  // ── Report metrics to background ──────────────────────────────────────
  function reportMetrics() {
    try {
      const metrics = computeMetrics();
      chrome.runtime.sendMessage({
        type: 'METRICS_REPORT',
        payload: metrics,
      }, (response) => {
        // Handle potential disconnection gracefully
        if (chrome.runtime.lastError) {
          // Extension context invalidated — stop reporting
          clearInterval(reportTimer);
        }
      });
    } catch (err) {
      // If the extension context is invalidated, stop gracefully
      if (err.message?.includes('Extension context invalidated')) {
        clearInterval(reportTimer);
      }
    }
  }

  const reportTimer = setInterval(reportMetrics, REPORT_INTERVAL_MS);

  // ── Listen for veil commands from background ──────────────────────────
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    try {
      switch (message.type) {
        case 'APPLY_VEIL': {
          const { brightness = 0.85, saturation = 0.7 } = message.payload || {};
          applyVeil(brightness, saturation);
          sendResponse({ success: true });
          break;
        }
        case 'REMOVE_VEIL': {
          removeVeil();
          sendResponse({ success: true });
          break;
        }
        case 'GRADUAL_REMOVE_VEIL': {
          gradualRemoveVeil();
          sendResponse({ success: true });
          break;
        }
        case 'GET_STATUS': {
          sendResponse({ veilActive, currentVeilLevel });
          break;
        }
        default:
          sendResponse({ error: 'Unknown message type' });
      }
    } catch (err) {
      sendResponse({ error: err.message });
    }
    return true; // async response
  });

  // ── Veil DOM manipulation ──────────────────────────────────────────────
  const VEIL_STYLE_ID = 'quiet-method-veil-style';

  function applyVeil(brightness, saturation) {
    let styleEl = document.getElementById(VEIL_STYLE_ID);
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = VEIL_STYLE_ID;
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = `
      html {
        filter: brightness(${brightness}) saturate(${saturation}) !important;
        transition: filter 1.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
      }
    `;
    veilActive = true;
    currentVeilLevel = 1 - brightness; // 0 = no veil, 0.15 = default veil
  }

  function removeVeil() {
    const styleEl = document.getElementById(VEIL_STYLE_ID);
    if (styleEl) {
      styleEl.textContent = `
        html {
          filter: brightness(1) saturate(1) !important;
          transition: filter 1.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
      `;
      // Remove element after transition
      setTimeout(() => {
        styleEl.remove();
      }, 1600);
    }
    veilActive = false;
    currentVeilLevel = 0;
  }

  function gradualRemoveVeil() {
    // Step from current veil to none over 3 seconds
    const steps = 6;
    const stepTime = 500;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      const brightness = 0.85 + (0.15 * progress);
      const saturation = 0.7 + (0.3 * progress);

      const styleEl = document.getElementById(VEIL_STYLE_ID);
      if (styleEl) {
        styleEl.textContent = `
          html {
            filter: brightness(${brightness}) saturate(${saturation}) !important;
            transition: filter 0.4s ease !important;
          }
        `;
      }

      if (step >= steps) {
        clearInterval(interval);
        removeVeil();
      }
    }, stepTime);
  }

  // ── Cleanup on unload ─────────────────────────────────────────────────
  window.addEventListener('beforeunload', () => {
    clearInterval(reportTimer);
  });

})();
