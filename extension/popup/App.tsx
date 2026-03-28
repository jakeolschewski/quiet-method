/**
 * Quiet Method — Main Popup App
 * Shows live overload metrics, controls, and share features.
 *
 * © WEDGE METHOD LLC
 */

import React, { useEffect, useState, useCallback } from 'react';
import PulseMeter from './components/PulseMeter';
import ShareCard from './components/ShareCard';
import './styles.css';

interface GuardState {
  overloadScore: number;
  veilActive: boolean;
  isCalibrating: boolean;
  distractionsPreventedToday: number;
  streakDays: number;
  sessionStart: number;
  sensitivity: number;
  veilEnabled: boolean;
  tabCount: number;
  scoreHistory: Array<{ score: number; timestamp: number }>;
}

const DEFAULT_STATE: GuardState = {
  overloadScore: 0,
  veilActive: false,
  isCalibrating: true,
  distractionsPreventedToday: 0,
  streakDays: 1,
  sessionStart: Date.now(),
  sensitivity: 1.0,
  veilEnabled: true,
  tabCount: 0,
  scoreHistory: [],
};

function sendMessage(msg: any): Promise<any> {
  return new Promise((resolve) => {
    try {
      chrome.runtime.sendMessage(msg, (response) => {
        if (chrome.runtime.lastError) {
          resolve(null);
        } else {
          resolve(response);
        }
      });
    } catch {
      resolve(null);
    }
  });
}

export default function App() {
  const [state, setState] = useState<GuardState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch state from background
  const fetchState = useCallback(async () => {
    const response = await sendMessage({ type: 'GET_STATE' });
    if (response && response.overloadScore !== undefined) {
      setState(response);
      if (!isLoaded) setIsLoaded(true);
    }
  }, [isLoaded]);

  // Poll for state every 2 seconds
  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 2000);
    return () => clearInterval(interval);
  }, [fetchState]);

  // Handle sensitivity change
  const handleSensitivityChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setState(prev => ({ ...prev, sensitivity: value }));
    await sendMessage({
      type: 'UPDATE_SETTINGS',
      payload: { sensitivity: value },
    });
  };

  // Handle veil toggle
  const handleVeilToggle = async () => {
    const newEnabled = !state.veilEnabled;
    setState(prev => ({ ...prev, veilEnabled: newEnabled }));
    await sendMessage({
      type: 'UPDATE_SETTINGS',
      payload: { veilEnabled: newEnabled },
    });
  };

  // Format session time
  const sessionMinutes = Math.round((Date.now() - state.sessionStart) / 60000);
  const sessionDisplay = sessionMinutes < 60
    ? `${sessionMinutes}m`
    : `${Math.floor(sessionMinutes / 60)}h ${sessionMinutes % 60}m`;

  const sensitivityLabel = state.sensitivity < 0.7
    ? 'Low'
    : state.sensitivity < 1.3
      ? 'Normal'
      : 'High';

  return (
    <div className={`app ${isLoaded ? 'loaded' : ''}`}>
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L3 7V12C3 17.25 6.75 22.12 12 23C17.25 22.12 21 17.25 21 12V7L12 2Z" 
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="rgba(99,102,241,0.15)" />
              <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="logo-text">Quiet Method</span>
          </div>
        </div>
        <div className="header-right">
          {state.veilActive && (
            <span className="veil-badge">
              <span className="veil-badge-dot" />
              Veil Active
            </span>
          )}
        </div>
      </header>

      {/* Pulse Meter */}
      <section className="meter-section">
        <PulseMeter score={state.overloadScore} isCalibrating={state.isCalibrating} />
      </section>

      {/* Stats Row */}
      <section className="stats-row">
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div className="stat-value">{state.distractionsPreventedToday}</div>
          <div className="stat-label">Blocked today</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <div className="stat-value">{state.streakDays}d</div>
          <div className="stat-label">Streak</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div className="stat-value">{sessionDisplay}</div>
          <div className="stat-label">Session</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </div>
          <div className="stat-value">{state.tabCount}</div>
          <div className="stat-label">Tabs</div>
        </div>
      </section>

      {/* Controls */}
      <section className="controls-section">
        {/* Sensitivity Slider */}
        <div className="control-row">
          <div className="control-label">
            <span>Sensitivity</span>
            <span className="control-value">{sensitivityLabel}</span>
          </div>
          <input
            type="range"
            min="0.3"
            max="2.0"
            step="0.1"
            value={state.sensitivity}
            onChange={handleSensitivityChange}
            className="slider"
          />
        </div>

        {/* Veil Toggle */}
        <div className="control-row">
          <div className="control-label">
            <span>Auto Veil</span>
            <span className="control-value">{state.veilEnabled ? 'On' : 'Off'}</span>
          </div>
          <button
            className={`toggle ${state.veilEnabled ? 'active' : ''}`}
            onClick={handleVeilToggle}
            role="switch"
            aria-checked={state.veilEnabled}
          >
            <span className="toggle-thumb" />
          </button>
        </div>
      </section>

      {/* Share */}
      <section className="share-section">
        <ShareCard
          distractionsBlocked={state.distractionsPreventedToday}
          streakDays={state.streakDays}
          currentScore={state.overloadScore}
        />
      </section>

      {/* Premium teaser */}
      <section className="premium-section">
        <div className="premium-card">
          <div className="premium-lock">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <div className="premium-content">
            <div className="premium-title">Quiet Method Pro</div>
            <div className="premium-features">
              Focus scheduling · Detailed analytics · Team sync
            </div>
          </div>
          <span className="premium-badge">Soon</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <span>© WEDGE METHOD LLC</span>
      </footer>
    </div>
  );
}
