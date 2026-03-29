/**
 * Quiet Method — Affiliate Analytics
 * Tracks notification impressions, clicks, and computed CTR.
 * All data stored locally in chrome.storage.local.
 *
 * Storage key: 'quietmethod_affiliate_analytics'
 *
 * Schema:
 * {
 *   totalNotificationsShown: number,
 *   totalClicks: number,
 *   clicksByName: { [toolName: string]: number },
 *   firstRecorded: number (timestamp),
 *   lastUpdated: number (timestamp),
 * }
 *
 * © WEDGE METHOD LLC
 */

const STORAGE_KEY = 'quietmethod_affiliate_analytics';

/**
 * Read current analytics from storage.
 * Returns a fully initialised object even if storage is empty.
 *
 * @returns {Promise<AffiliateAnalytics>}
 */
export async function getAnalytics() {
  try {
    const stored = await chrome.storage.local.get(STORAGE_KEY);
    const data = stored[STORAGE_KEY];
    if (data) return data;
  } catch (_) {}

  // Return fresh initialised object
  return {
    totalNotificationsShown: 0,
    totalClicks: 0,
    clicksByName: {},
    firstRecorded: Date.now(),
    lastUpdated: Date.now(),
  };
}

/**
 * Record that a recommendation notification was shown to the user.
 *
 * @param {string} toolName - The name of the recommended tool
 * @returns {Promise<void>}
 */
export async function recordNotificationShown(toolName) {
  const analytics = await getAnalytics();
  analytics.totalNotificationsShown += 1;
  analytics.lastUpdated = Date.now();

  if (!analytics.firstRecorded) {
    analytics.firstRecorded = Date.now();
  }

  // Ensure clicksByName entry exists for this tool
  if (!analytics.clicksByName[toolName]) {
    analytics.clicksByName[toolName] = 0;
  }

  await _save(analytics);
}

/**
 * Record that the user clicked on an affiliate recommendation.
 *
 * @param {string} toolName - The name of the tool that was clicked
 * @returns {Promise<void>}
 */
export async function recordAffiliateClick(toolName) {
  const analytics = await getAnalytics();
  analytics.totalClicks += 1;
  analytics.clicksByName[toolName] = (analytics.clicksByName[toolName] ?? 0) + 1;
  analytics.lastUpdated = Date.now();

  await _save(analytics);
}

/**
 * Compute the click-through rate as a percentage.
 * Returns 0 if no notifications have been shown yet.
 *
 * @returns {Promise<number>} CTR as a value between 0–100
 */
export async function getClickThroughRate() {
  const analytics = await getAnalytics();
  if (analytics.totalNotificationsShown === 0) return 0;
  return (analytics.totalClicks / analytics.totalNotificationsShown) * 100;
}

/**
 * Returns the tool name with the most clicks, or null if none yet.
 *
 * @returns {Promise<string|null>}
 */
export async function getMostPopularRecommendation() {
  const analytics = await getAnalytics();
  const entries = Object.entries(analytics.clicksByName);
  if (entries.length === 0) return null;

  return entries.reduce((best, current) =>
    current[1] > best[1] ? current : best
  )[0];
}

/**
 * Returns a full summary object for display purposes.
 *
 * @returns {Promise<{
 *   totalNotificationsShown: number,
 *   totalClicks: number,
 *   ctr: number,
 *   mostPopular: string|null,
 *   clicksByName: Object
 * }>}
 */
export async function getAnalyticsSummary() {
  const analytics = await getAnalytics();
  const ctr = analytics.totalNotificationsShown > 0
    ? (analytics.totalClicks / analytics.totalNotificationsShown) * 100
    : 0;

  const clickEntries = Object.entries(analytics.clicksByName);
  const mostPopular = clickEntries.length > 0
    ? clickEntries.reduce((best, cur) => cur[1] > best[1] ? cur : best)[0]
    : null;

  return {
    totalNotificationsShown: analytics.totalNotificationsShown,
    totalClicks: analytics.totalClicks,
    ctr: Math.round(ctr * 10) / 10,  // 1 decimal place
    mostPopular,
    clicksByName: analytics.clicksByName,
  };
}

// ── Internal helpers ──────────────────────────────────────────────────────

/**
 * Persist analytics to chrome.storage.local.
 * @param {object} data
 */
async function _save(data) {
  try {
    await chrome.storage.local.set({ [STORAGE_KEY]: data });
  } catch (err) {
    console.warn('[Quiet Method] Failed to save affiliate analytics:', err);
  }
}
