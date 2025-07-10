# Gemini AI Integration 

The chatbot now features **intelligent AI-powered responses** using Google's Gemini Pro.

### New Features
• **AI Responses**: context-aware answers using Gemini Pro
• **Filtering**: AI-powered detection of Quran-related questions
• **Specialized Knowledge**: Focused on Mohammadi/Moroccan Quranic interpretation
• **Multilingual AI**: Intelligent responses in Arabic, French, and English
• **Verse Citations**: AI includes relevant Quranic references
• **Content Filtering**: Politely refuses non-Islamic questions

### Setup steps

1. **Get your Gemini API key:**
   - Visit: https://makersuite.google.com/app/apikey
   - Create a new API key (free tier available)

2. **Configure the environment:**
   ```bash
   cd frontend
   npm run setup
   # Follow the instructions to add your API key to .env
   ```

3. **Start the app:**
   ```bash
   npm run dev
   ```

### Technical Details

- **AI Model**: Google Gemini Pro
- **Language Support**: Arabic, French, English
- **Response Time**: ~2-3 seconds
- **Fallback**: Mock responses for testing/offline use
- **Security**: API key stored in environment variables

### Migration from Mock API (older implementation)

The new AI system maintains the same interface as the previous mock API, so the frontend components work without changes.
