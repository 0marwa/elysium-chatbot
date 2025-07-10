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

## curr stat

- [x] **frontend** 
- [x] **gemini API integration** (under work -- the model may change)
- [x] **multilingual** (arabic, french, english supported)
- [x] **smart filtering**
- [ ] **backend** (RAG impl)

## to run

- Setup script: `npm run setup`
