document.addEventListener('DOMContentLoaded', function() {
  const apiKeyInput = document.getElementById('apiKey');
  const saveApiKeyButton = document.getElementById('saveApiKey');
  const captureQuestionButton = document.getElementById('captureQuestion');
  const statusDiv = document.getElementById('status');
  const resultDiv = document.getElementById('result');

  // Load saved Gemini API key
  chrome.storage.local.get(['geminiApiKey'], function(result) {
    if (result.geminiApiKey) {
      apiKeyInput.value = result.geminiApiKey;
    }
  });

  // Save Gemini API key and test connection
  saveApiKeyButton.addEventListener('click', function() {
    const apiKey = apiKeyInput.value.trim();
    if (apiKey) {
      chrome.storage.local.set({ geminiApiKey: apiKey }, function() {
        statusDiv.textContent = 'API key saved! Testuję połączenie...';
        // Test Gemini API connection
        fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              { parts: [ { text: 'Test połączenia z Gemini API.' } ] }
            ]
          })
        })
        .then(async res => {
          if (res.ok) {
            statusDiv.textContent = 'Połączenie z Gemini API działa!';
          } else {
            const err = await res.json();
            statusDiv.textContent = 'Błąd połączenia z Gemini API: ' + (err.error?.message || res.status);
          }
        })
        .catch(e => {
          statusDiv.textContent = 'Błąd połączenia z Gemini API: ' + e.message;
        });
        setTimeout(() => {
          if (statusDiv.textContent === 'API key saved!') statusDiv.textContent = '';
        }, 4000);
      });
    }
  });

  // Listen for selected text from content script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Popup received message:', request); // Debug log
    
    if (request.action === 'selectedText') {
      statusDiv.textContent = 'Otrzymywanie odpowiedzi od Gemini...';
      
      // Send to background script for Gemini processing
      chrome.runtime.sendMessage({
        action: 'selectedText',
        text: request.text
      }, function(response) {
        console.log('Received response from background:', response); // Debug log
        
        if (response.error) {
          statusDiv.textContent = 'Błąd: ' + response.error;
        } else {
          statusDiv.textContent = 'Odpowiedź otrzymana!';
          resultDiv.textContent = response.answer;
          console.log('[CHEXAM] Odpowiedź Gemini:', response.answer);
        }
      });
    }
  });

  // Capture question
  captureQuestionButton.addEventListener('click', async function() {
    statusDiv.textContent = 'Pobieram zaznaczony tekst...';
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      chrome.tabs.sendMessage(tab.id, { action: 'getSelectedText' }, (response) => {
        if (response && response.text) {
          console.log('[CHEXAM] Otrzymano tekst z content script:', response.text);
          statusDiv.textContent = 'Otrzymywanie odpowiedzi od Gemini...';
          chrome.runtime.sendMessage({
            action: 'selectedText',
            text: response.text
          }, function(response) {
            if (response.error) {
              statusDiv.textContent = 'Błąd: ' + response.error;
            } else {
              statusDiv.textContent = 'Odpowiedź otrzymana!';
              resultDiv.textContent = response.answer;
              console.log('[CHEXAM] Odpowiedź Gemini:', response.answer);
            }
          });
        } else {
          statusDiv.textContent = 'Nie zaznaczono tekstu!';
        }
      });
    } catch (error) {
      statusDiv.textContent = 'Błąd: ' + error.message;
    }
  });

  // Manual popup logic
  document.getElementById('showManual').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('manualPopup').style.display = 'flex';
  });
  document.getElementById('closeManual').addEventListener('click', function() {
    document.getElementById('manualPopup').style.display = 'none';
  });
}); 