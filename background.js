// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'selectedText') {
    chrome.storage.local.get(['geminiApiKey'], async function(result) {
      if (!result.geminiApiKey) {
        sendResponse({ error: 'Brak klucza Gemini API. Wprowadź klucz w ustawieniach rozszerzenia.' });
        return;
      }
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${result.geminiApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { text: request.text + '\nOdpowiedz na to pytanie po polsku.' }
                  ]
                }
              ]
            })
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Gemini error details:', errorData);
          throw new Error(`HTTP error! status: ${response.status} - ${JSON.stringify(errorData)}`);
        }
        const data = await response.json();
        const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Brak odpowiedzi.';
        sendResponse({ answer: answer });
      } catch (error) {
        console.error('Error:', error);
        sendResponse({ error: 'Błąd komunikacji z Gemini: ' + error.message });
      }
    });
    return true;
  }
}); 