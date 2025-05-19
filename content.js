// Initialize state in window object to persist across injections
if (!window.chexamState) {
  window.chexamState = {
    isSelecting: false,
    startX: null,
    startY: null,
    selectionBox: null
  };
}

// Create selection box element
function createSelectionBox() {
  const box = document.createElement('div');
  box.style.position = 'fixed';
  box.style.border = '2px solid #3498db';
  box.style.backgroundColor = 'rgba(52, 152, 219, 0.1)';
  box.style.pointerEvents = 'none';
  box.style.zIndex = '9999';
  document.body.appendChild(box);
  return box;
}

// Update selection box position and size
function updateSelectionBox(x, y, width, height) {
  if (window.chexamState.selectionBox) {
    window.chexamState.selectionBox.style.left = x + 'px';
    window.chexamState.selectionBox.style.top = y + 'px';
    window.chexamState.selectionBox.style.width = width + 'px';
    window.chexamState.selectionBox.style.height = height + 'px';
  }
}

// Get text from selected area
function getTextFromArea(x, y, width, height) {
  // Get all elements under the selection box
  const elements = document.elementsFromPoint(x + width/2, y + height/2);
  let selectedText = '';
  elements.forEach(element => {
    const rect = element.getBoundingClientRect();
    if (rect.left >= x && rect.right <= x + width && rect.top >= y && rect.bottom <= y + height) {
      selectedText += element.textContent + ' ';
    }
  });
  return selectedText.trim();
}

// Mouse event handlers
function handleMouseDown(e) {
  if (!window.chexamState.isSelecting) return;
  window.chexamState.startX = e.clientX;
  window.chexamState.startY = e.clientY;
  if (!window.chexamState.selectionBox) {
    window.chexamState.selectionBox = createSelectionBox();
  }
  updateSelectionBox(window.chexamState.startX, window.chexamState.startY, 0, 0);
}

function handleMouseMove(e) {
  if (!window.chexamState.isSelecting || !window.chexamState.startX || !window.chexamState.startY) return;
  const currentX = e.clientX;
  const currentY = e.clientY;
  const width = Math.abs(currentX - window.chexamState.startX);
  const height = Math.abs(currentY - window.chexamState.startY);
  const left = Math.min(window.chexamState.startX, currentX);
  const top = Math.min(window.chexamState.startY, currentY);
  updateSelectionBox(left, top, width, height);
}

function handleMouseUp(e) {
  if (!window.chexamState.isSelecting || !window.chexamState.startX || !window.chexamState.startY) return;
  const endX = e.clientX;
  const endY = e.clientY;
  const width = Math.abs(endX - window.chexamState.startX);
  const height = Math.abs(endY - window.chexamState.startY);
  const left = Math.min(window.chexamState.startX, endX);
  const top = Math.min(window.chexamState.startY, endY);
  if (window.chexamState.selectionBox) {
    window.chexamState.selectionBox.remove();
    window.chexamState.selectionBox = null;
  }
  window.chexamState.isSelecting = false;
  window.chexamState.startX = null;
  window.chexamState.startY = null;
  // Remove event listeners
  document.removeEventListener('mousedown', handleMouseDown);
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
  document.body.style.cursor = 'default';
  if (width > 10 && height > 10) { // Minimum size check
    const selectedText = getTextFromArea(left, top, width, height);
    if (selectedText) {
      console.log('Selected text:', selectedText); // Debug log
      console.log('[CHEXAM] Zaznaczony tekst:', selectedText);
      chrome.runtime.sendMessage({ 
        action: 'selectedText', 
        text: selectedText 
      }, response => {
        console.log('Response from background:', response); // Debug log
      });
    }
  }
}

// Clean up function
function cleanup() {
  if (window.chexamState.selectionBox) {
    window.chexamState.selectionBox.remove();
    window.chexamState.selectionBox = null;
  }
  window.chexamState.isSelecting = false;
  window.chexamState.startX = null;
  window.chexamState.startY = null;
  document.body.style.cursor = 'default';
  document.removeEventListener('mousedown', handleMouseDown);
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Content script received message:', request); // Debug log
  if (request.action === 'captureQuestion') {
    // Clean up any existing selection
    cleanup();
    window.chexamState.isSelecting = true;
    document.body.style.cursor = 'crosshair';
    // Add event listeners
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    sendResponse({ status: 'selecting' });
  }
  if (request.action === 'getSelectedText') {
    const selection = window.getSelection();
    const selectedText = selection.toString();
    console.log('[CHEXAM] window.getSelection():', selection);
    console.log('[CHEXAM] Natywnie zaznaczony tekst:', selectedText);
    sendResponse({ text: selectedText });
    return true;
  }
  return true;
}); 