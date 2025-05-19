# Chexam

## 🇵🇱 Instrukcja obsługi (Polski)

**Chexam** to rozszerzenie do Chrome, które wykorzystuje model Gemini (Google AI Studio) do pomagania w rozwiązywaniu pytań egzaminacyjnych online.

### Jak korzystać?
1. Otwórz stronę z pytaniami egzaminacyjnymi lub innym tekstem, który chcesz przeanalizować.
2. Zaznacz myszką interesujące Cię pytanie lub fragment tekstu na stronie (tak jak zwykły tekst).
3. Kliknij ikonę rozszerzenia **Chexam** w pasku przeglądarki.
4. W oknie popup kliknij przycisk **Pobierz pytanie**.
5. Rozszerzenie pobierze zaznaczony tekst i wyśle go do Gemini (model gemini-1.5-flash-latest przez Google AI Studio).
6. Odpowiedź pojawi się w oknie popup oraz w konsoli popupu (F12).
7. Jeśli używasz rozszerzenia po raz pierwszy, wprowadź swój klucz Gemini API w odpowiednim polu popupu.
8. Rozszerzenie działa tylko na zwykłych stronach internetowych (nie na chrome:// itp.).

### Wymagania
- Przeglądarka Google Chrome
- Klucz API z [Google AI Studio (Gemini)](https://aistudio.google.com/app/apikey)

### Instalacja
1. Pobierz repozytorium lub sklonuj je:
   ```bash
   git clone https://github.com/Matus4709/Chexam.git
   ```
2. Otwórz `chrome://extensions` w Chrome.
3. Włącz tryb deweloperski (prawy górny róg).
4. Kliknij „Załaduj rozpakowane” i wskaż folder z projektem.
5. Gotowe!

---

## 🇬🇧 User Guide (English)

**Chexam** is a Chrome extension that uses the Gemini model (Google AI Studio) to help you answer online exam questions.

### How to use?
1. Open a page with exam questions or any text you want to analyze.
2. Select the question or text fragment with your mouse (as regular text).
3. Click the **Chexam** extension icon in the browser bar.
4. In the popup window, click the **Get Question** button.
5. The extension will grab the selected text and send it to Gemini (gemini-1.5-flash-latest model via Google AI Studio).
6. The answer will appear in the popup and in the popup console (F12).
7. If this is your first time, enter your Gemini API key in the popup field.
8. The extension works only on regular web pages (not on chrome:// etc.).

### Requirements
- Google Chrome browser
- API key from [Google AI Studio (Gemini)](https://aistudio.google.com/app/apikey)

### Installation
1. Download or clone the repository:
   ```bash
   git clone https://github.com/Matus4709/Chexam.git
   ```
2. Open `chrome://extensions` in Chrome.
3. Enable Developer Mode (top right corner).
4. Click "Load unpacked" and select the project folder.
5. Done!

## Features

- Capture exam questions by selecting text or automatically detecting question elements
- Get AI-generated answers using ChatGPT
- Secure API key storage
- Clean and intuitive user interface

## Security Note

Your OpenAI API key is stored locally in your browser and is only used to make requests to the OpenAI API. The extension does not send your API key to any other servers.

## License

MIT License 