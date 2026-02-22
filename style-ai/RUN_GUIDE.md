# How to Run StyleAI

Follow these steps to get the StyleAI application running locally.

## Prerequisite: API Key
Ensure you have a **Groq API Key**. Create a `.env` file in the `backend` directory:
```env
GROQ_API_KEY=your_actual_key_here
```

## 1. Start the Backend
Open a terminal in the `backend` directory:
```powershell
cd backend
# If you haven't set up the venv yet:
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt

# Start the Flask server:
python app.py
```
> The backend will run on **http://localhost:5000**

## 2. Start the Frontend
Open a **new** terminal in the `frontend` directory:
```powershell
cd frontend
# Install dependencies:
npm install
# Start the Vite development server:
npm run dev
```
> The frontend will run on **http://localhost:5173**

## 3. Use the App
1. Go to **http://localhost:5173** in your browser.
2. Upload a face photo (sidebar).
3. Select an **Occasion** and **Aesthetic**.
4. Click **Generate Catalog**.
