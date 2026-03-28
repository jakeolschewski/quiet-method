/**
 * Quiet Method — Background Service Worker
 * Receives behavioral metrics from content scripts, computes overload score,
 * triggers veil interventions when thresholds are crossed.
 *
 * © WEDGE METHOD LLC
 */

import {
  dimAllTabs,
  undimAllTabs,
  muteAllTabs,
  unmuteAllTabs,
  showCalmNotification,
} from './utils/veil.js';

// ── Constants ────────────────────────────────────────────────────────────
const VEIL_ACTIVATE_THRESHOLD = 0.7;
const VEIL_DEACTIVATE_THRESHOLD = 0.5;
const CALIBRATION_DURATION_MS = 5 * 60 * 1000; // 5 minutes
const SCORE_HISTORY_MAX = 60; // keep last 60 scores (~5 min at 5s intervals)
const SESSION_SAVE_INTERVAL_MS = 30000; // save session data every 30s

// ── State ────────────────────────────────────────────────────────────────
let state = {
  // Overload scoring
  overloadScore: 0,
  scoreHistory: [],
  veilActive: false,

  // Calibration
  isCalibrating: true,
  calibrationStart: Date.now(),
  calibrationData: {
    keystrokeVariances: [],
    scrollVelocities: [],
    mouseSpeeds: [],
  },
  baseline: {
    keystrokeVariance: 2500, // default baseline (ms²)
    scrollVelocity: 1.0,     // default baseline (px/ms)
    mouseSpeed: 0.5,          // default baseline (px/ms)
  },

  // Session tracking
  sessionStart: Date.now(),
  distractionsPreventedToday: 0,
  streakDays: 0,
  lastActiveDate: null,

  // Settings
  sensitivityMultiplier: 1.0,
  veilEnabled: true,

  // Latest metrics from content scripts
  latestMetrics: null,
};

// ── Initialization ───────────────────────────────────────────────────────
async function initialize() {
  try {
    const stored = await chrome.storage.local.get([
      'quietGuardState',
      'quietGuardStreak',
      'quietGuardDistractions',
      'quietGuardBaseline',
      'quietGuardSettings',
    ]);

    // Restore baseline
    if (stored.quietGuardBaseline) {
      state.baseline = { ...state.baseline, ...stored.quietGuardBaseline };
      state.isCalibrating = false;
    }

    // Restore streak
    if (stored.quietGuardStreak) {
      const { streakDays, lastActiveDate } = stored.quietGuardStreak;
      const today = getDateString();
      const yesterday = getDateString(new Date(Date.now() - 86400000));

      if (lastActiveDate === today) {
        state.streakDays = streakDays;
      } else if (lastActiveDate === yesterday) {
        state.streakDays = streakDays + 1;
      } else {
        state.streakDays = 1; // streak broken
      }
      state.lastActiveDate = today;
    } else {
      state.streakDays = 1;
      state.lastActiveDate = getDateString();
    }

    // Restore today's distractions count
    if (stored.quietGuardDistractions) {
      const { count, date } = stored.quietGuardDistractions;
      if (date === getDateString()) {
        state.distractionsPreventedToday = count;
      }
    }

    // Restore settings
    if (stored.quietGuardSettings) {
      state.sensitivityMultiplier = stored.quietGuardSettings.sensitivity ?? 1.0;
      state.veilEnabled = stored.quietGuardSettings.veilEnabled ?? true;
    }

    console.log('[Quiet Method] Initialized. Calibrating:', state.isCalibrating);
  } catch (err) {
    console.error('[Quiet Method] Init error:', err);
  }
}

// ── Utility ──────────────────────────────────────────────────────────────
function getDateString(date = new Date()) {
  return date.toISOString().split('T')[0];
}

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

// ── Overload Score Computation ───────────────────────────────────────────
function computeOverloadScore(metrics) {
  if (!metrics) return state.overloadScore;

  // 1) Keystroke variance score
  //    High variance = erratic typing = overload signal
  const kVariance = metrics.keystroke?.variance ?? 0;
  const baselineKV = state.baseline.keystrokeVariance;
  const kVarianceRatio = baselineKV > 0 ? kVariance / baselineKV : 0;
  // Score increases when variance exceeds 120% of baseline
  const keystrokeScore = clamp((kVarianceRatio - 0.8) / 1.2);

  // 2) Scroll velocity score
  //    Fast scrolling = scanning, not reading = overload signal
  const avgScrollVel = metrics.scroll?.avgVelocity ?? 0;
  // >3 px/ms is considered high
  const scrollScore = clamp(avgScrollVel / 3);

  // 3) Tab density score
  //    More tabs = more cognitive load
  let tabCount = 0;
  try {
    const tabs = await_safe_tab_count();
    tabCount = tabs;
  } catch (_) { /* fallback */ }
  const tabScore = clamp(tabCount / 15);

  // 4) Time on device score
  //    Longer sessions = more fatigue
  const sessionMinutes = (Date.now() - state.sessionStart) / 60000;
  const timeScore = clamp(sessionMinutes / 120); // maxes at 2 hours

  // 5) Mouse erraticness bonus
  const mouseErraticness = metrics.mouse?.erraticness ?? 0;
  const mouseBonus = clamp(mouseErraticness / 0.5) * 0.1; // small bonus

  // Weighted combination
  const sensitivity = state.sensitivityMultiplier;
  const raw = (
    0.35 * keystrokeScore +
    0.25 * scrollScore +
    0.25 * tabScore +
    0.15 * timeScore +
    mouseBonus
  ) * sensitivity;

  // Smooth with exponential moving average
  const alpha = 0.3;
  const smoothed = alpha * clamp(raw) + (1 - alpha) * state.overloadScore;

  return clamp(smoothed);
}

// Tab count — synchronous-friendly wrapper
let cachedTabCount = 0;
async function updateTabCount() {
  try {
    const tabs = await chrome.tabs.query({});
    cachedTabCount = tabs.length;
  } catch (_) {
    // tabs API might fail during service worker startup
  }
}

function await_safe_tab_count() {
  return cachedTabCount;
}

// Keep tab count fresh
setInterval(updateTabCount, 5000);
updateTabCount();

// ── Calibration ──────────────────────────────────────────────────────────
function processCalibration(metrics) {
  if (!state.isCalibrating) return;

  const elapsed = Date.now() - state.calibrationStart;

  // Collect calibration data
  if (metrics.keystroke?.variance > 0) {
    state.calibrationData.keystrokeVariances.push(metrics.keystroke.variance);
  }
  if (metrics.scroll?.avgVelocity > 0) {
    state.calibrationData.scrollVelocities.push(metrics.scroll.avgVelocity);
  }
  if (metrics.mouse?.avgSpeed > 0) {
    state.calibrationData.mouseSpeeds.push(metrics.mouse.avgSpeed);
  }

  // Finish calibration after 5 minutes
  if (elapsed >= CALIBRATION_DURATION_MS) {
    finishCalibration();
  }
}

function finishCalibration() {
  const { keystrokeVariances, scrollVelocities, mouseSpeeds } = state.calibrationData;

  if (keystrokeVariances.length > 0) {
    state.baseline.keystrokeVariance =
      keystrokeVariances.reduce((a, b) => a + b, 0) / keystrokeVariances.length;
  }
  if (scrollVelocities.length > 0) {
    state.baseline.scrollVelocity =
      scrollVelocities.reduce((a, b) => a + b, 0) / scrollVelocities.length;
  }
  if (mouseSpeeds.length > 0) {
    state.baseline.mouseSpeed =
      mouseSpeeds.reduce((a, b) => a + b, 0) / mouseSpeeds.length;
  }

  state.isCalibrating = false;
  console.log('[Quiet Method] Calibration complete. Baseline:', state.baseline);

  // Persist baseline
  chrome.storage.local.set({ quietGuardBaseline: state.baseline });
}

// ── Veil Activation / Deactivation ───────────────────────────────────────
async function checkAndApplyVeil(score) {
  if (!state.veilEnabled) return;

  if (score > VEIL_ACTIVATE_THRESHOLD && !state.veilActive) {
    // Activate veil
    state.veilActive = true;
    state.distractionsPreventedToday++;

    console.log('[Quiet Method] ⚡ Veil activated. Score:', score.toFixed(2));

    // Apply interventions
    await dimAllTabs(0.85, 0.7);
    await muteAllTabs();
    showCalmNotification();

    // Update badge
    try {
      await chrome.action.setBadgeText({ text: '🛡️' });
      await chrome.action.setBadgeBackgroundColor({ color: '#6366f1' });
    } catch (_) {}

    // Save distraction count
    chrome.storage.local.set({
      quietGuardDistractions: {
        count: state.distractionsPreventedToday,
        date: getDateString(),
      },
    });

  } else if (score < VEIL_DEACTIVATE_THRESHOLD && state.veilActive) {
    // Deactivate veil — gradually
    state.veilActive = false;

    console.log('[Quiet Method] ✨ Veil deactivated. Score:', score.toFixed(2));

    await undimAllTabs();
    await unmuteAllTabs();

    // Clear badge
    try {
      await chrome.action.setBadgeText({ text: '' });
    } catch (_) {}
  }
}

// ── Message Handling ─────────────────────────────────────────────────────
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  try {
    switch (message.type) {
      case 'METRICS_REPORT': {
        handleMetricsReport(message.payload);
        sendResponse({ received: true });
        break;
      }

      case 'GET_STATE': {
        sendResponse({
          overloadScore: state.overloadScore,
          veilActive: state.veilActive,
          isCalibrating: state.isCalibrating,
          distractionsPreventedToday: state.distractionsPreventedToday,
          streakDays: state.streakDays,
          sessionStart: state.sessionStart,
          sensitivity: state.sensitivityMultiplier,
          veilEnabled: state.veilEnabled,
          tabCount: cachedTabCount,
          scoreHistory: state.scoreHistory.slice(-20),
        });
        break;
      }

      case 'UPDATE_SETTINGS': {
        const { sensitivity, veilEnabled } = message.payload || {};
        if (sensitivity !== undefined) {
          state.sensitivityMultiplier = clamp(sensitivity, 0.3, 2.0);
        }
        if (veilEnabled !== undefined) {
          state.veilEnabled = veilEnabled;
          if (!veilEnabled && state.veilActive) {
            // User manually disabled — remove veil immediately
            state.veilActive = false;
            undimAllTabs();
            unmuteAllTabs();
            chrome.action.setBadgeText({ text: '' }).catch(() => {});
          }
        }
        // Persist settings
        chrome.storage.local.set({
          quietGuardSettings: {
            sensitivity: state.sensitivityMultiplier,
            veilEnabled: state.veilEnabled,
          },
        });
        sendResponse({ success: true });
        break;
      }

      case 'TOGGLE_VEIL': {
        if (state.veilActive) {
          state.veilActive = false;
          undimAllTabs();
          unmuteAllTabs();
          chrome.action.setBadgeText({ text: '' }).catch(() => {});
        } else {
          state.veilActive = true;
          dimAllTabs(0.85, 0.7);
          muteAllTabs();
          chrome.action.setBadgeText({ text: '🛡️' }).catch(() => {});
          chrome.action.setBadgeBackgroundColor({ color: '#6366f1' }).catch(() => {});
        }
        sendResponse({ veilActive: state.veilActive });
        break;
      }

      case 'RESET_CALIBRATION': {
        state.isCalibrating = true;
        state.calibrationStart = Date.now();
        state.calibrationData = {
          keystrokeVariances: [],
          scrollVelocities: [],
          mouseSpeeds: [],
        };
        sendResponse({ success: true });
        break;
      }

      default:
        sendResponse({ error: 'Unknown message type' });
    }
  } catch (err) {
    console.error('[Quiet Method] Message handling error:', err);
    sendResponse({ error: err.message });
  }
  return true; // async
});

// ── Process incoming metrics ─────────────────────────────────────────────
async function handleMetricsReport(metrics) {
  state.latestMetrics = metrics;

  // Process calibration if still in learning phase
  processCalibration(metrics);

  // Compute overload score
  state.overloadScore = computeOverloadScore(metrics);

  // Track history
  state.scoreHistory.push({
    score: state.overloadScore,
    timestamp: Date.now(),
  });
  if (state.scoreHistory.length > SCORE_HISTORY_MAX) {
    state.scoreHistory.shift();
  }

  // Check veil thresholds
  await checkAndApplyVeil(state.overloadScore);
}

// ── Session persistence ──────────────────────────────────────────────────
setInterval(() => {
  chrome.storage.local.set({
    quietGuardStreak: {
      streakDays: state.streakDays,
      lastActiveDate: state.lastActiveDate || getDateString(),
    },
  });
}, SESSION_SAVE_INTERVAL_MS);

// ── Tab change listeners (update tab count on change) ────────────────────
chrome.tabs.onCreated.addListener(() => updateTabCount());
chrome.tabs.onRemoved.addListener(() => {
  // Small delay to let Chrome finalize tab removal
  setTimeout(updateTabCount, 200);
});

// ── Alarm for periodic housekeeping ──────────────────────────────────────
chrome.alarms.create('quietGuardHousekeeping', { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'quietGuardHousekeeping') {
    updateTabCount();
    // Update date tracking
    const today = getDateString();
    if (state.lastActiveDate !== today) {
      state.lastActiveDate = today;
      state.distractionsPreventedToday = 0;
    }
  }
});

// ── Extension install handler ────────────────────────────────────────────
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('[Quiet Method] Extension installed. Starting calibration...');
    showCalmNotification(
      'Welcome to Quiet Method! We\'ll learn your browsing patterns over the next 5 minutes.',
      'Quiet Method Setup'
    );
  }
});

// ── Boot ─────────────────────────────────────────────────────────────────
initialize();
console.log('[Quiet Method] Service worker started.');
