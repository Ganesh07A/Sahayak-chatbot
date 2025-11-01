print("🚀 Starting Flask script...")

import os
import sys
import requests
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv

print("Python version:", sys.version)
load_dotenv()

# --- Initialize Flask ---
app = Flask(__name__,static_folder="../frontend/static", static_url_path="/static")
CORS(app)

# --- Configuration ---
API_KEY = os.environ.get("GEMINI_API_KEY", "")
PRIMARY_URL  = f"https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key={API_KEY}"
FALLBACK_URL = f"https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key={API_KEY}"

# --- System Prompt ---
SYSTEM_PROMPT = (
    "You are Shreeyash Sahayak, the official AI assistant of "
    "Shreeyash College of Engineering & Technology (sycet.org). "
    "Be concise, professional, and factual based only on the official website."
)

# --- Mock Student Database ---
MOCK_STUDENT_DB = {
    "202501000001": {
        "name": "Ajay Kumar",
        "prn": "202501000001",
        "program": "B.Tech Computer Science",
        "attendance": "82%",
        "grades": "A-",
        "feesDue": "No",
    },
    "202501000002": {
        "name": "Priya Sharma",
        "prn": "202501000002",
        "program": "B.Tech E&TC",
        "attendance": "91%",
        "grades": "A+",
        "feesDue": "Yes - ₹5,000",
    }
}

# --- Load Knowledge Base ---
def load_knowledge():
    try:
        with open("knowledge_base.txt", "r", encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        print("⚠️ knowledge_base.txt not found.")
        return ""

LOCAL_KNOWLEDGE = load_knowledge()

# --- Serve HTML File ---
@app.route('/')
def serve_chatbot():
    return send_from_directory('../frontend', 'syp-chatbot.html')

# --- Login Endpoint ---
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    prn = data.get('prn')
    if not prn:
        return jsonify({"error": "PRN is required"}), 400
    student_data = MOCK_STUDENT_DB.get(prn)
    if student_data:
        return jsonify(student_data)
    else:
        return jsonify({"error": "Student not found"}), 404

# --- Chat Endpoint ---
@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '').strip().lower()
    student_prn = data.get('prn')


    # website of college
    if "website" in user_message or "site" in user_message:
        return jsonify({
            "text": "You can visit the official college website here: https://sycet.org",
            "source_type": "knowledge_base"
        })
    
    if "aiml syllabus" in user_message:
        return jsonify({
            "text":"Here is your pdf: " '📘 <a href="/static/files/AIML%20syllabus.pdf" target="_blank" class="text-indigo-600 underline">Download AIML Syllabus (PDF)</a>',
            "source_type": "knowledge_base"
        })

    
    # 1️⃣ Handle private student data
    if student_prn and student_prn in MOCK_STUDENT_DB:
        student = MOCK_STUDENT_DB[student_prn]
        private_fields = {
            "attendance": f"<b>Attendance:</b> {student['attendance']}",
            "grades": f"<b>Grades:</b> {student['grades']}",
            "fees": f"<b>Fees:</b> {student['feesDue']}",
            "info": (
                f"<b>Name:</b> {student['name']}<br>"
                f"<b>PRN:</b> {student['prn']}<br>"
                f"<b>Program:</b> {student['program']}<br>"
                f"<b>Attendance:</b> {student['attendance']}<br>"
                f"<b>Grades:</b> {student['grades']}<br>"
                f"<b>Fees:</b> {student['feesDue']}"
            )
        }
        for key, val in private_fields.items():
            if key in user_message or f"my {key}" in user_message:
                return jsonify({"text": val, "source_type": "local"})
            

    # 2️⃣ Guest asking private info
    if not student_prn and any(w in user_message for w in ["attendance", "grades", "fees", "info"]):
        return jsonify({
            "text": "🔒 Please log in with your PRN to view personal data like attendance, grades, or fees.",
            "source_type": "local"
        })

    # 3️⃣ Check knowledge base first (keyword-based)
    if LOCAL_KNOWLEDGE:
        keywords = [
            "address", "location", "principal", "head", "director",
            "admission", "process", "courses", "departments", "fees",
            "structure", "contact", "email", "phone", "website",
            "established", "affiliation", "dean", "academic dean","approved by","hod of aiml department","hod of AIML",
        ]
        for key in keywords:
            if key in user_message:
                for line in LOCAL_KNOWLEDGE.splitlines():
                    if key in line.lower() and line.strip():
                        text = line.strip()
                        # Capitalize first letter properly
                        if text and not text[0].isupper():
                            text = text[0].upper() + text[1:]
                        return jsonify({
                            "text": text,
                            "source_type": "knowledge_base",
                            "sources": [{"uri": "https://sycet.org", "title": "Local Knowledge Base"}]
                        })

    # 4️⃣ If not found → Ask Gemini
    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [
                    {
                        "text": (
                            f"{SYSTEM_PROMPT}\n\nUser question: {user_message}"
                        )
                    }
                ]
            }
        ]
    }

    try:
        # Try primary model first
        response = requests.post(PRIMARY_URL, json=payload, timeout=60)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        print("⚠️ Gemini primary failed → retrying flash-lite:", e)
        try:
            response = requests.post(FALLBACK_URL, json=payload, timeout=60)
            response.raise_for_status()
        except requests.exceptions.RequestException as e2:
            print("⚠️ Gemini API Error:", e2)
            return jsonify({
                "text": "⚠️ AI service temporarily unavailable. Please try again later.",
                "source_type": "error"
            })

    # Parse Gemini response
    try:
        result = response.json()
        text = (
            result.get("candidates", [{}])[0]
            .get("content", {}).get("parts", [{}])[0]
            .get("text", "Sorry, I couldn’t find that.")
        )
        text = text.strip()
        return jsonify({"text": text, "source_type": "gemini"})
    except Exception as e:
        print("⚠️ Response parse error:", e)
        return jsonify({
            "text": "⚠️ Unexpected response from AI.",
            "source_type": "error"
        })

# --- Main Entry ---
if __name__ == '__main__':
    print("✅ Flask configuration loaded successfully.")
    if not API_KEY:
        print("⚠️ Warning: GEMINI_API_KEY not found. AI answers will be disabled.")
        print("💡 Set it with: set GEMINI_API_KEY=your_key_here (Windows)")
    print("🚀 Starting Shreeyash Sahayak Flask server on http://127.0.0.1:5000")
    app.run(debug=True, port=5000)
