// =====================================================
// GOOGLE SHEETS SYNC MODULE (ES MODULE)
// Completely isolated, stateless, safe.
// =====================================================

const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwm08F0v9AKjIA7E22Wyy4Z1Zs1RwGt7yCQvU-jYjWuJbRXQ60B8b09D6_QQMP9xqMM/exec';

let sessionId = null;
let queue = [];
let isSyncing = false;

// Exponential backoff base time
const BASE_DELAY = 1000;

// -----------------------------------------------------
// INTERNAL HELPERS
// -----------------------------------------------------
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function processQueue() {
  if (isSyncing || queue.length === 0) return;

  isSyncing = true;
  const { payload, attempt } = queue[0];

  try {
    const response = await fetch(WEB_APP_URL, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();

    if (data.success) {
      console.log(`[Sync] Success → Session ID ${data.sessionId || sessionId}`);
      if (!sessionId) sessionId = data.sessionId;

      queue.shift();
      isSyncing = false;
      processQueue();
    } else {
      throw new Error(data.error || 'Unknown sync error');
    }
  } catch (err) {
    console.warn(`[Sync] Failed attempt ${attempt}:`, err);

    const backoff = BASE_DELAY * Math.pow(2, attempt);
    queue[0].attempt++;

    await delay(backoff);
    isSyncing = false;
    processQueue();
  }
}

function enqueue(payload) {
  fetch(WEB_APP_URL, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  }).catch((err) => {
    console.warn('[Sync] Immediate send failed:', err);
  });
}

// -----------------------------------------------------
// PUBLIC API
// -----------------------------------------------------
export function initializeSession(meta) {
  const payload = {
    mode: 'SESSION_START',
    ...meta,
  };

  enqueue(payload);
}

export function syncProgressUpdate(progress) {
  const payload = {
    mode: 'PROGRESS_UPDATE',
    sessionId,
    ...progress,
  };

  enqueue(payload);
}

export function syncSessionComplete(finalData) {
  const payload = {
    mode: 'SESSION_COMPLETE',
    sessionId,
    ...finalData,
  };

  enqueue(payload);
}

export function notifyAbandonment(partialData) {
  const payload = {
    mode: 'SESSION_ABANDONED',
    sessionId,
    ...partialData,
  };

  enqueue(payload);
}

// Before unload: flush queue
window.addEventListener('beforeunload', () => {
  if (queue.length > 0) {
    navigator.sendBeacon(
      WEB_APP_URL,
      JSON.stringify({
        mode: 'UNLOAD_FLUSH',
        sessionId,
        queueCount: queue.length,
      })
    );
  }
});
