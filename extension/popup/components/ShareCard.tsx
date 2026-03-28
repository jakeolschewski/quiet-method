/**
 * ShareCard — Generates a shareable "calm stats" card.
 * Produces text for social sharing with user's stats.
 *
 * © WEDGE METHOD LLC
 */

import React, { useState } from 'react';

interface ShareCardProps {
  distractionsBlocked: number;
  streakDays: number;
  currentScore: number;
}

export default function ShareCard({ distractionsBlocked, streakDays, currentScore }: ShareCardProps) {
  const [copied, setCopied] = useState(false);
  const [showCard, setShowCard] = useState(false);

  const calmLevel = currentScore < 0.3
    ? '🧘 Deep Calm'
    : currentScore < 0.5
      ? '😌 Focused'
      : currentScore < 0.7
        ? '⚡ Active'
        : '🔥 In the Zone';

  const shareText = `🛡️ My Quiet Method Stats\n\n${calmLevel}\n📊 ${distractionsBlocked} distractions blocked today\n🔥 ${streakDays}-day streak\n\nProtect your attention → Quiet Method by WEDGE METHOD LLC`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = shareText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!showCard) {
    return (
      <button
        className="share-button"
        onClick={() => setShowCard(true)}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        Share your calm
      </button>
    );
  }

  return (
    <div className="share-card">
      <div className="share-card-header">
        <h3>Share your calm</h3>
        <button
          className="share-card-close"
          onClick={() => setShowCard(false)}
        >
          ×
        </button>
      </div>

      <div className="share-card-preview">
        <div className="share-card-brand">🛡️ Quiet Method</div>
        <div className="share-card-stat-row">
          <span className="share-card-stat">{calmLevel}</span>
        </div>
        <div className="share-card-stat-row">
          <span className="share-card-number">{distractionsBlocked}</span>
          <span className="share-card-desc">distractions blocked</span>
        </div>
        <div className="share-card-stat-row">
          <span className="share-card-number">{streakDays}</span>
          <span className="share-card-desc">day streak</span>
        </div>
      </div>

      <button
        className={`copy-button ${copied ? 'copied' : ''}`}
        onClick={handleCopy}
      >
        {copied ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Copied!
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            Copy to clipboard
          </>
        )}
      </button>
    </div>
  );
}
