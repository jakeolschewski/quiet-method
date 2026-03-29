/**
 * Quiet Method — Affiliate Recommendations
 * Returns curated tool recommendations when the user is overloaded.
 * Each click generates affiliate revenue for Quiet Method.
 *
 * © WEDGE METHOD LLC
 */

/** @typedef {{ name: string, tagline: string, url: string, category: 'focus'|'meditation'|'music'|'productivity' }} Recommendation */

/** @type {Recommendation[]} */
const RECOMMENDATIONS = [
  {
    name: 'Focus@Will',
    tagline: 'AI-powered focus music',
    url: 'https://www.focusatwill.com/?ref=quietmethod',
    category: 'music',
  },
  {
    name: 'Calm',
    tagline: 'Guided breathing exercises',
    url: 'https://www.calm.com/?ref=quietmethod',
    category: 'meditation',
  },
  {
    name: 'Brain.fm',
    tagline: 'Music designed for focus',
    url: 'https://brain.fm/?ref=quietmethod',
    category: 'music',
  },
  {
    name: 'Notion',
    tagline: 'Organize your work, reduce chaos',
    url: 'https://notion.so/?ref=quietmethod',
    category: 'productivity',
  },
  {
    name: 'Todoist',
    tagline: 'Clear your mind, list your tasks',
    url: 'https://todoist.com/?ref=quietmethod',
    category: 'productivity',
  },
  {
    name: 'Forest App',
    tagline: 'Stay focused, grow trees',
    url: 'https://www.forestapp.cc/?ref=quietmethod',
    category: 'focus',
  },
  {
    name: 'Headspace',
    tagline: 'Meditation for busy minds',
    url: 'https://www.headspace.com/?ref=quietmethod',
    category: 'meditation',
  },
  {
    name: 'Noisli',
    tagline: 'Background sounds for focus',
    url: 'https://www.noisli.com/?ref=quietmethod',
    category: 'focus',
  },
];

/**
 * Returns a random recommendation, avoiding the last shown one.
 * Tracks last shown index in chrome.storage.local to persist across
 * service worker restarts.
 *
 * @returns {Promise<Recommendation>}
 */
export async function getRecommendation() {
  // Read last shown index from storage
  let lastIndex = -1;
  try {
    const stored = await chrome.storage.local.get('quietmethod_last_affiliate_index');
    if (typeof stored.quietmethod_last_affiliate_index === 'number') {
      lastIndex = stored.quietmethod_last_affiliate_index;
    }
  } catch (_) {
    // Storage unavailable — proceed without deduplication
  }

  // Build candidate pool (all indices except lastIndex)
  const candidates = RECOMMENDATIONS
    .map((_, i) => i)
    .filter((i) => i !== lastIndex);

  // Pick a random candidate
  const pickedIndex = candidates[Math.floor(Math.random() * candidates.length)];
  const recommendation = RECOMMENDATIONS[pickedIndex];

  // Persist the chosen index so we don't repeat it next time
  try {
    await chrome.storage.local.set({ quietmethod_last_affiliate_index: pickedIndex });
  } catch (_) {}

  return recommendation;
}

/**
 * Returns a slice of recommendations for the popup panel.
 * Avoids returning duplicates within the slice.
 *
 * @param {number} count - How many recommendations to return (default 3)
 * @returns {Recommendation[]}
 */
export function getRecommendationSlice(count = 3) {
  // Shuffle a copy and return the first `count` items
  const shuffled = [...RECOMMENDATIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
