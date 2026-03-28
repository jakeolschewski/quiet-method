/**
 * Quiet Method — Veil Utilities
 * Functions for applying/removing the calming "veil" overlay.
 * Used by background.js service worker.
 *
 * © WEDGE METHOD LLC
 */

/**
 * Dim a specific tab's page by injecting CSS filters via content script message.
 * @param {number} tabId - The tab to dim
 * @param {number} [brightness=0.85] - Brightness level (0-1)
 * @param {number} [saturation=0.7] - Saturation level (0-1)
 * @returns {Promise<boolean>}
 */
export async function dimPage(tabId, brightness = 0.85, saturation = 0.7) {
  try {
    const response = await chrome.tabs.sendMessage(tabId, {
      type: 'APPLY_VEIL',
      payload: { brightness, saturation },
    });
    return response?.success ?? false;
  } catch (err) {
    console.warn(`[Quiet Method] Could not dim tab ${tabId}:`, err.message);
    return false;
  }
}

/**
 * Remove the veil from a specific tab instantly.
 * @param {number} tabId
 * @returns {Promise<boolean>}
 */
export async function undimPage(tabId) {
  try {
    const response = await chrome.tabs.sendMessage(tabId, {
      type: 'REMOVE_VEIL',
    });
    return response?.success ?? false;
  } catch (err) {
    console.warn(`[Quiet Method] Could not undim tab ${tabId}:`, err.message);
    return false;
  }
}

/**
 * Gradually remove the veil from a specific tab.
 * @param {number} tabId
 * @returns {Promise<boolean>}
 */
export async function gradualUndimPage(tabId) {
  try {
    const response = await chrome.tabs.sendMessage(tabId, {
      type: 'GRADUAL_REMOVE_VEIL',
    });
    return response?.success ?? false;
  } catch (err) {
    console.warn(`[Quiet Method] Could not gradually undim tab ${tabId}:`, err.message);
    return false;
  }
}

/**
 * Dim all open tabs.
 * @param {number} [brightness=0.85]
 * @param {number} [saturation=0.7]
 * @returns {Promise<number>} Number of tabs successfully dimmed
 */
export async function dimAllTabs(brightness = 0.85, saturation = 0.7) {
  try {
    const tabs = await chrome.tabs.query({});
    let count = 0;
    for (const tab of tabs) {
      if (tab.id && tab.url && !tab.url.startsWith('chrome://')) {
        const success = await dimPage(tab.id, brightness, saturation);
        if (success) count++;
      }
    }
    return count;
  } catch (err) {
    console.error('[Quiet Method] dimAllTabs error:', err);
    return 0;
  }
}

/**
 * Remove veil from all open tabs.
 * @returns {Promise<number>} Number of tabs successfully undimmed
 */
export async function undimAllTabs() {
  try {
    const tabs = await chrome.tabs.query({});
    let count = 0;
    for (const tab of tabs) {
      if (tab.id && tab.url && !tab.url.startsWith('chrome://')) {
        const success = await gradualUndimPage(tab.id);
        if (success) count++;
      }
    }
    return count;
  } catch (err) {
    console.error('[Quiet Method] undimAllTabs error:', err);
    return 0;
  }
}

/**
 * Mute audio on all open tabs.
 * @returns {Promise<number>} Number of tabs muted
 */
export async function muteAllTabs() {
  try {
    const tabs = await chrome.tabs.query({});
    let count = 0;
    for (const tab of tabs) {
      if (tab.id) {
        try {
          await chrome.tabs.update(tab.id, { muted: true });
          count++;
        } catch (_) { /* some tabs can't be muted */ }
      }
    }
    return count;
  } catch (err) {
    console.error('[Quiet Method] muteAllTabs error:', err);
    return 0;
  }
}

/**
 * Unmute all tabs.
 * @returns {Promise<number>} Number of tabs unmuted
 */
export async function unmuteAllTabs() {
  try {
    const tabs = await chrome.tabs.query({});
    let count = 0;
    for (const tab of tabs) {
      if (tab.id) {
        try {
          await chrome.tabs.update(tab.id, { muted: false });
          count++;
        } catch (_) { /* some tabs can't be unmuted */ }
      }
    }
    return count;
  } catch (err) {
    console.error('[Quiet Method] unmuteAllTabs error:', err);
    return 0;
  }
}

/**
 * Show a calm, gentle notification.
 * @param {string} [message="Quiet Method activated — taking it easy for a moment"]
 * @param {string} [title="Quiet Method"]
 */
export function showCalmNotification(
  message = 'Quiet Method activated — taking it easy for a moment',
  title = 'Quiet Method'
) {
  try {
    chrome.notifications.create(`qg-calm-${Date.now()}`, {
      type: 'basic',
      iconUrl: 'assets/icon-128.png',
      title,
      message,
      priority: 0, // low priority — gentle
      silent: true, // no sound — that would be counterproductive
    });
  } catch (err) {
    console.warn('[Quiet Method] Notification error:', err.message);
  }
}
