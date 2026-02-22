# StyleAI: Your Intelligent Personal Stylist 💎✨

StyleAI is an AI-powered styling engine that combines biometric analysis with deep learning to curate professional-grade fashion catalogs. It analyzes your unique physical features (skin tone, undertone, seasonal profile) to recommend outfits that harmonize with your natural appearance.

## 🚀 Current Status: Studio Ready
The project is fully functional and has been overhauled into a **"Studio" Aesthetic**. It features:
- **Biometric Analysis**: Instant detection of skin tone, season, and undertone via image processing.
- **Dynamic Curation**: Generates 4 distinct, context-aware outfits (Office, Wedding, Gala, etc.).
- **Interactive Refinement**: "Like" or "Refine" specific outfits to train the engine on your tastes.
- **Smart Shopping**: One-click links to acquire items from global retailers like Zara and Myntra.

## 🛠️ Tech Stack
- **Frontend**: React.js 19 + TypeScript + Vite (Fast, lightweight, modern).
- **Styling**: Tailwind CSS v4 + Framer Motion (Premium "Studio" UI & smooth animations).
- **Backend**: Python + Flask (Robust API and logic layer).
- **Core Intelligence**: Groq API (LLaMA 3.3 70B) for fashion reasoning and OpenCV for color analysis.

## ⚙️ How It Works
1. **The Scan**: When you upload an image, the Python backend uses OpenCV to extract color histograms from your face, determining your "Color DNA".
2. **The Logic**: That DNA is combined with your chosen Occasion and Aesthetic (e.g., "Minimalist" or "Modern Indian").
3. **The Synthesis**: An LLM (via Groq) reasons through thousands of style combinations to pick the 4 best outfits for you.
4. **The Refinement**: You can give feedback on any outfit, and the AI will regenerate only that specific card based on your input.

## 🏁 Getting Started

### 1. Prerequisite: API Key
Create a `.env` file in the `backend` directory:
```env
GROQ_API_KEY=gsk_your_actual_key_here
```
*(Get your key at [console.groq.com](https://console.groq.com))*

### 2. Run the Backend
```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### 3. Run the Frontend
```powershell
cd frontend
npm install
npm run dev
```
Open **http://localhost:5173** in your browser.

## 📁 Project Structure
- `/frontend`: Vite + React UI components and Studio styles.
- `/backend`: Flask server, color analysis logic, and styling engine.

---
