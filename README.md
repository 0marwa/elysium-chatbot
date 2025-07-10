# quran-chatbot

## workflow
- input: user sends a message
- filter: check if it's a Quran-related question
- respond:
    - Yes: answer based on the Mohammadi Quran view (dataset + strict prompted LLM)
    - No: give no answer / Neutral refusal "Sorry I can only answer Coran-related questions"

## tech stack
simplest & quickest imo:
- lang: python, react 4 ui
- API: gemini api (gratos) (+ fine-tuning later on)
- data source: json files containing coran verses + interpretation. need: digital version of verses (with IDs), dataset of mohammadi tafsir, i3rab of verses, & any other relevant resources

## chatbot implem logic
option 1:
- keyword matching + similarity + info retrieval from DB
- when asked a question : 
    - check if it's Cquran-related via classification/keyword detection
    - if not -> "Sorry I can only answer Quran-related questions"
    - if yes -> retrieve info from db if it's that simple and format it to match "answer-style"
- return answer

option 2:
- LLM with custom prompt
- gemini pro's API with strict system prompt like "You are an Islamic assistant trained to only answer questions based on the Mohammadi (Moroccan) interpretation of the Quran. You are not allowed to answer anything outside this scope."
- combine with retrieval (RAG) & inject the most relevant info from db as context to the LLM

## restrict to relevant questions only
- filtering methods:
    - simple/naive: use keyword classification (quran, surah, ayah, verse, hizb, waqf, sajda)
    - slightly + complicated: Train a binary classifier (quran vs. Non-Coran questions via basic NLP classifier) OR use an LLM to do ths filtering for you (ask GPT "is this question quran-related? Yes/No")

## Host the bot
- Simple web interface using React JS 
- Deploy using Vite
- Final version will run on private server for security reasons (hopefully lol)

# Project Structure
```
quran-chatbot/
│
├── backend/                   # FastAPI / Flask app
│   ├── main.py                # API logic
│   ├── logic/                 # Quran processing functions
│   └── data/                  # DB
│
├── frontend/                  # Vite + React app
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   └── api.js             # wrapper to call backend
│   └── index.html
│
└── README.md
```

## 🚀 Quick Start (Updated with AI!)

### Prerequisites
- Node.js (v16+)
- Gemini Pro API key (free tier available)

### Setup & Run
```bash
# 1. Clone the repository
git clone <your-repo>
cd Coran-chatbot

# 2. Setup frontend with AI
cd frontend
npm install
npm run setup  # This will guide you through API key setup

# 3. Get your Gemini API key
# Visit: https://makersuite.google.com/app/apikey
# Copy your API key and add it to frontend/.env

# 4. Start the app
npm run dev
```

## 🔒 Security Notice

**IMPORTANT:** This project uses API keys that must be kept secure!

- ✅ **Safe to push:** All source code, documentation, configs
- ❌ **NEVER push:** `.env` files, API keys, secrets
- 📖 **Read:** [SECURITY.md](SECURITY.md) for complete guidelines

The `.gitignore` is configured to protect your sensitive files automatically.

## 🎯 Current Status

- ✅ **Frontend:** Complete React app with beautiful UI
- ✅ **AI Integration:** Real Gemini Pro responses
- ✅ **Multilingual:** Arabic, French, English support
- ✅ **Smart Filtering:** Only Quran-related questions
- 🔄 **Backend:** Coming soon (RAG implementation)

## 📚 Documentation

- [Gemini Integration Guide](GEMINI_INTEGRATION.md)
- [Security Guidelines](SECURITY.md)
- Setup script: `npm run setup`
## curr stat

- [x] **frontend** 
- [x] **gemini API integration** 
- [x] **multilingual** (arabic, french, english supported)
- [x] **smart filtering**
- [ ] **backend** (RAG impl)

## documentation

- [Gemini Integration Guide](GEMINI_INTEGRATION.md)
- [Security Guidelines](SECURITY.md)
- Setup script: `npm run setup`
