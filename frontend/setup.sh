#!/bin/bash

# setup script for chatbot with gemini integration

echo "🕌 quran chatbot - gemini ai setup"
echo "=================================="
echo ""

# check if .env exists
if [ -f ".env" ]; then
    echo "✅ .env file already exists"
    if grep -q "VITE_GEMINI_API_KEY=your_api_key_here" .env; then
        echo "⚠️  please update your .env file with your actual gemini api key"
        echo "   current placeholder detected: VITE_GEMINI_API_KEY=your_api_key_here"
        echo ""
        echo "   to get your api key:"
        echo "   1. visit: https://makersuite.google.com/app/apikey"
        echo "   2. create a new api key"
        echo "   3. replace 'your_api_key_here' in .env with your actual key"
    else
        echo "✅ api key appears to be configured"
    fi
else
    echo "📝 creating .env file from template..."
    cp .env.example .env
    echo "⚠️  please edit .env and add your gemini api key"
    echo ""
    echo "   to get your api key:"
    echo "   1. visit: https://makersuite.google.com/app/apikey"  
    echo "   2. create a new api key"
    echo "   3. edit .env and replace 'your_actual_gemini_api_key_here' with your key"
fi

echo ""
echo "🚀 after setting your api key, run:"
echo "   npm run dev"
echo ""
