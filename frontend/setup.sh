#!/bin/bash

# setup script for chatbot with gemini integration

echo "Quran Chatbot - Gemini AI Setup"
echo "================================"
echo ""

# Check if .env exists
if [ -f ".env" ]; then
    echo ".env file already exists"
    if grep -q "VITE_GEMINI_API_KEY=your_api_key_here" .env; then
        echo "   Please update your .env file with your actual Gemini API key"
        echo "   Current placeholder detected: VITE_GEMINI_API_KEY=your_api_key_here"
        echo ""
        echo "   To get your API key:"
        echo "   1. Visit: https://makersuite.google.com/app/apikey"
        echo "   2. Create a new API key"
        echo "   3. Replace 'your_api_key_here' in .env with your actual key"
    else
        echo "  API key appears to be configured"
    fi
else
    echo "  Creating .env file from template..."
    cp .env.example .env
    echo "  Please edit .env and add your Gemini API key"
    echo ""
    echo "   To get your API key:"
    echo "   1. Visit: https://makersuite.google.com/app/apikey"  
    echo "   2. Create a new API key"
    echo "   3. Edit .env and replace 'your_actual_gemini_api_key_here' with your key"
fi

echo ""
echo " After setting your API key, run:"
echo "   npm run dev"
echo ""
