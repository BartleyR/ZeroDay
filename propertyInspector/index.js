// Global WebSocket and context
let websocket = null;
let uuid = null;
let actionInfo = {};

// Connect to Stream Deck
function connectElgatoStreamDeckSocket(inPort, inUUID, inRegisterEvent, inInfo, inActionInfo) {
  uuid = inUUID;
  actionInfo = JSON.parse(inActionInfo);

  // Create WebSocket
  websocket = new WebSocket(`ws://127.0.0.1:${inPort}`);

  // WebSocket is connected
  websocket.onopen = function() {
    // Register Property Inspector
    const json = {
      event: inRegisterEvent,
      uuid: inUUID
    };
    websocket.send(JSON.stringify(json));

    // Request current settings
    requestSettings();
  };

  // Handle messages
  websocket.onmessage = function(evt) {
    try {
      const jsonObj = JSON.parse(evt.data);
      const event = jsonObj.event;

      if (event === 'didReceiveSettings') {
        const settings = jsonObj.payload.settings;
        loadSettings(settings);
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  };
}

// Request settings from plugin
function requestSettings() {
  if (websocket && websocket.readyState === 1) {
    const json = {
      event: 'getSettings',
      context: uuid
    };
    websocket.send(JSON.stringify(json));
  }
}

// Load settings into UI
function loadSettings(settings) {
  // Event settings
  if (settings.eventName) document.getElementById('eventName').value = settings.eventName;
  if (settings.targetDate) document.getElementById('targetDate').value = settings.targetDate;

  // Banner settings
  if (settings.bannerColor) document.getElementById('bannerColor').value = settings.bannerColor;
  if (settings.bannerTextColor) document.getElementById('bannerTextColor').value = settings.bannerTextColor;
  if (settings.bannerFontFamily) document.getElementById('bannerFontFamily').value = settings.bannerFontFamily;
  if (settings.bannerFontSize) document.getElementById('bannerFontSize').value = settings.bannerFontSize;

  // Main display settings
  if (settings.backgroundColor) document.getElementById('backgroundColor').value = settings.backgroundColor;
  if (settings.textColor) document.getElementById('textColor').value = settings.textColor;
  if (settings.numberFontFamily) document.getElementById('numberFontFamily').value = settings.numberFontFamily;
  if (settings.numberFontSize) document.getElementById('numberFontSize').value = settings.numberFontSize;
  if (settings.labelFontSize) document.getElementById('labelFontSize').value = settings.labelFontSize;
}

// Validate date format
function isValidDate(dateString) {
  // Check format YYYY-MM-DD
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  // Check if it's a valid date
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}

// Save settings to plugin
function saveSettings() {
  const targetDateInput = document.getElementById('targetDate');
  const targetDate = targetDateInput.value.trim();

  // Validate date if provided
  if (targetDate && !isValidDate(targetDate)) {
    targetDateInput.style.borderColor = '#f44336';
    return;
  } else {
    targetDateInput.style.borderColor = '#555';
  }

  const settings = {
    // Event settings
    eventName: document.getElementById('eventName').value,
    targetDate: targetDate,

    // Banner settings
    bannerColor: document.getElementById('bannerColor').value,
    bannerTextColor: document.getElementById('bannerTextColor').value,
    bannerFontFamily: document.getElementById('bannerFontFamily').value,
    bannerFontSize: parseInt(document.getElementById('bannerFontSize').value),

    // Main display settings
    backgroundColor: document.getElementById('backgroundColor').value,
    textColor: document.getElementById('textColor').value,
    numberFontFamily: document.getElementById('numberFontFamily').value,
    numberFontSize: parseInt(document.getElementById('numberFontSize').value),
    labelFontSize: parseInt(document.getElementById('labelFontSize').value)
  };

  if (websocket && websocket.readyState === 1) {
    const json = {
      event: 'setSettings',
      context: uuid,
      payload: settings
    };
    websocket.send(JSON.stringify(json));
  }
}

// Set up event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Event settings
  document.getElementById('eventName').addEventListener('input', saveSettings);
  document.getElementById('targetDate').addEventListener('input', saveSettings);
  document.getElementById('targetDate').addEventListener('blur', saveSettings);

  // Banner settings
  document.getElementById('bannerColor').addEventListener('change', saveSettings);
  document.getElementById('bannerTextColor').addEventListener('change', saveSettings);
  document.getElementById('bannerFontFamily').addEventListener('change', saveSettings);
  document.getElementById('bannerFontSize').addEventListener('change', saveSettings);

  // Main display settings
  document.getElementById('backgroundColor').addEventListener('change', saveSettings);
  document.getElementById('textColor').addEventListener('change', saveSettings);
  document.getElementById('numberFontFamily').addEventListener('change', saveSettings);
  document.getElementById('numberFontSize').addEventListener('change', saveSettings);
  document.getElementById('labelFontSize').addEventListener('change', saveSettings);
});
