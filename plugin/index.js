// Global WebSocket connection
let websocket = null;
let pluginUUID = null;

// Cache for contexts and their settings
const contextSettings = {};

// Connect to Stream Deck
function connectElgatoStreamDeckSocket(inPort, inPluginUUID, inRegisterEvent, inInfo) {
  pluginUUID = inPluginUUID;

  // Create WebSocket
  websocket = new WebSocket(`ws://127.0.0.1:${inPort}`);

  // WebSocket is connected
  websocket.onopen = function() {
    // Register plugin
    const json = {
      event: inRegisterEvent,
      uuid: inPluginUUID
    };
    websocket.send(JSON.stringify(json));
  };

  // Handle messages from Stream Deck
  websocket.onmessage = function(evt) {
    try {
      const jsonObj = JSON.parse(evt.data);
      const event = jsonObj.event;
      const context = jsonObj.context;

      if (event === 'willAppear') {
        // Store settings when action appears
        contextSettings[context] = jsonObj.payload.settings || {};
        updateCountdown(context);
      } else if (event === 'didReceiveSettings') {
        // Update settings when changed
        contextSettings[context] = jsonObj.payload.settings || {};
        updateCountdown(context);
      } else if (event === 'keyDown') {
        // Optional: handle key press
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  };

  websocket.onerror = function(evt) {
    console.error('WebSocket error:', evt);
  };
}

// Update countdown display
function updateCountdown(context) {
  const settings = contextSettings[context] || {};
  const targetDate = settings.targetDate;
  const eventName = settings.eventName || 'Event';
  const bannerColor = settings.bannerColor || '#4CAF50';

  if (!targetDate) {
    // No date set - show placeholder
    drawCountdown(context, '?', 'Set Date', bannerColor);
    return;
  }

  // Calculate days remaining
  const target = new Date(targetDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  const diffTime = target - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Draw the countdown
  drawCountdown(context, diffDays, eventName, bannerColor);
}

// Draw countdown on canvas and send to Stream Deck
function drawCountdown(context, days, eventName, bannerColor) {
  const canvas = document.createElement('canvas');
  canvas.width = 144;
  canvas.height = 144;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, 144, 144);

  // Banner at top
  ctx.fillStyle = bannerColor;
  ctx.fillRect(0, 0, 144, 40);

  // Event name on banner
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 16px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Truncate event name if too long
  let displayName = eventName;
  if (ctx.measureText(displayName).width > 130) {
    while (ctx.measureText(displayName + '...').width > 130 && displayName.length > 0) {
      displayName = displayName.slice(0, -1);
    }
    displayName += '...';
  }

  ctx.fillText(displayName, 72, 20);

  // Days number (large)
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(days), 72, 80);

  // "days" label
  ctx.font = 'bold 20px Arial';
  const label = Math.abs(days) === 1 ? 'day' : 'days';
  const prefix = days < 0 ? 'ago' : '';
  ctx.fillText(`${label} ${prefix}`.trim(), 72, 115);

  // Convert canvas to base64 and send to Stream Deck
  const imageData = canvas.toDataURL('image/png').split(',')[1];

  if (websocket && websocket.readyState === 1) {
    const json = {
      event: 'setImage',
      context: context,
      payload: {
        image: `data:image/png;base64,${imageData}`,
        target: 0
      }
    };
    websocket.send(JSON.stringify(json));
  }
}

// Update all countdowns every hour
setInterval(() => {
  for (const context in contextSettings) {
    updateCountdown(context);
  }
}, 3600000); // 1 hour

// Also update at midnight
function scheduleNextMidnightUpdate() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const timeUntilMidnight = tomorrow - now;

  setTimeout(() => {
    for (const context in contextSettings) {
      updateCountdown(context);
    }
    scheduleNextMidnightUpdate();
  }, timeUntilMidnight);
}

scheduleNextMidnightUpdate();
