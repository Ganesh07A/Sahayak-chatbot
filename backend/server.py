import os
import sys
import requests
from flask import Flask, request, jsonify, send_from_directory, session
from flask_cors import CORS
from dotenv import load_dotenv

print("Python version:", sys.version)
load_dotenv()

# --- Configurations & Initialization ---
app = Flask(__name__, static_folder="../frontend/static", static_url_path="/static")
CORS(app)

# 1. 🛡️ SECURITY: Flask requires a SECRET_KEY to sign session cookies. 
app.config['SECRET_KEY'] = os.environ.get("FLASK_SECRET_KEY", "THIS_IS_A_VERY_INSECURE_DEV_KEY_CHANGE_IT_IMMEDIATELY")

# Load API Keys and check immediately for critical failure
API_KEY = os.environ.get("GEMINI_API_KEY", "")
if not API_KEY:
    print("🚨 FATAL: GEMINI_API_KEY environment variable not set. Exiting.")
    # In a production environment, you would call sys.exit(1) here.
    # We allow running in debug mode for development setup.

# URLs for Gemini API calls
PRIMARY_URL= f"https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key={API_KEY}"
FALLBACK_URL = f"https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key={API_KEY}"

# Hardcoded Resources - Centralized for easy maintenance
CONFIG = {
    "COLLEGE_WEBSITE": "https://sycet.org",
    "AIML_SYLLABUS_PATH": "/static/files/AIML%20syllabus.pdf"
}

# ---- System Prompt ---
# The prompt now informs the AI it will receive grounding context (RAG)
SYSTEM_PROMPT = (
    "You are Shreeyash Sahayak, the official AI assistant of "
    "Shreeyash College of Engineering & Technology (sycet.org). "
    "Be concise, professional, and factual. Your response must be strictly "
    "based on the provided KNOWLEDGE BASE CONTEXT (if available) or the System Prompt instructions. "
    "The assistant was developed as a college project and built by Ganesh Suvarnakar."
    "Do not invent information."
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

# --- Load Knowledge Base ----
def load_knowledge():
    """Loads the entire knowledge base file content into a single string."""
    try:
        with open("knowledge_base.txt", "r", encoding="utf-8") as f:
            return f.read().strip()
    except FileNotFoundError:
        print("knowledge_base.txt not found.")
        return ""

LOCAL_KNOWLEDGE = load_knowledge()
print(f"📄 Loaded {len(LOCAL_KNOWLEDGE.splitlines())} lines into Knowledge Base.")

# --- Helper Function for Gemini API Calls (Refactored) ---
def _get_gemini_response_with_rag(user_message, knowledge_base):
    """Handles API call, fallback, and parsing for Gemini."""
    
    # RAG Enhancement: Combine System Prompt, Knowledge Base, and User Question
    prompt_with_context = (
        f"{SYSTEM_PROMPT}\n\n"
        f"--- KNOWLEDGE BASE CONTEXT (Use for factual answers about the college) ---\n"
        f"{knowledge_base}\n\n"
        f"User question: {user_message}"
    )

    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": prompt_with_context}]
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
            # Fallback to the lighter model
            response = requests.post(FALLBACK_URL, json=payload, timeout=60)
            response.raise_for_status()
        except requests.exceptions.RequestException as e2:
            print("⚠️ Gemini API Error (both primary and fallback failed):", e2)
            return "⚠️ AI service temporarily unavailable. Please try again later.", "error"

    # Parse Gemini response
    try:
        result = response.json()
        text = (
            result.get("candidates", [{}])[0]
            .get("content", {}).get("parts", [{}])[0]
            .get("text", "Sorry, I couldn’t find that.")
        )
        return text.strip(), "gemini"
    except Exception as e:
        print("⚠️ Response parse error:", e)
        return "⚠️ Unexpected response from AI.", "error"


# --- Rendering HTML File ---
@app.route('/')
def serve_chatbot():
    return send_from_directory('../frontend', 'syp-chatbot.html')


# --- Login Endpoint (Updated for Sessions) ---
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    prn = data.get('prn')
    
    if not prn:
        return jsonify({"error": "PRN is required"}), 400
    
    student_data = MOCK_STUDENT_DB.get(prn)
    
    if student_data:
        # Stores the name and PRN securely in the session
        session['student_prn'] = prn 
        session['student_name'] = student_data['name']
        
        # Return only non-sensitive data for initial UI update
        return jsonify({
            "name": student_data['name'],
            "prn": student_data['prn'],
            "program": student_data['program'],
        })
    else:
        # Clean up session if invalid login attempt
        if 'student_prn' in session:
             session.pop('student_prn', None)
             session.pop('student_name', None)
        return jsonify({"error": "Student not found"}), 404

# --- Welcome Message Endpoint ---
@app.route('/welcome', methods=['GET'])
def welcome_message():
    """
    Provides a personalized greeting if the user is logged in.
    """
    student_name = session.get('student_name')
    
    if student_name:
        greeting = f"Hello, {student_name}! Welcome to Shreeyash Sahayak. How can I assist you with your college inquiries today?"
        return jsonify({
            "text": greeting,
            "source_type": "greeting"
        })
    else:
        return jsonify({
            "text": "Hello! I am Shreeyash Sahayak, the official AI assistant. How may I help you?",
            "source_type": "greeting"
        })


# --- Chat Endpoint (SECURITY FIXED - Final) ---
@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '').strip().lower()
    
    # Get PRN securely from the session
    student_prn = session.get('student_prn')

    # Keywords that indicate a request for private, per-student data
    private_keywords = ["attendance", "grades", "fees", "info", "my data", "my information"]
    is_asking_private_info = any(w in user_message for w in private_keywords)
    
    # Check if the user is asking specifically about any student name or PRN in the mock DB.
    private_identifiers = list(MOCK_STUDENT_DB.keys()) + [s['name'].lower() for s in MOCK_STUDENT_DB.values()]
    is_asking_specific_private_data = is_asking_private_info or any(i in user_message for i in private_identifiers)


    # --- 1️. PRIVATE DATA ACCESS / DENIAL ---
    if is_asking_specific_private_data:
        # Check if the user is logged in AND the PRN is valid
        if student_prn and student_prn in MOCK_STUDENT_DB:
            student = MOCK_STUDENT_DB[student_prn]
            
            # Determine if the query explicitly mentions any other student's ID/Name (implying unauthorized access)
            is_asking_about_another_student = False
            for other_prn, other_student in MOCK_STUDENT_DB.items():
                if other_prn != student_prn: # Only check other students
                    if other_prn.lower() in user_message or other_student['name'].lower() in user_message:
                        is_asking_about_another_student = True
                        break

            # DENY ACCESS if logged-in user asks about UNAUTHORIZED data (another student)
            if is_asking_about_another_student:
                 return jsonify({
                    "text": "🔒 You can only access your own attendance, grades, or fees. Access to other student data is strictly restricted.",
                    "source_type": "local"
                 })
            
            # --- FIX: If logged in and asking for private info, GRANT ACCESS ---
            
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
            # Find and return the specific private data response (e.g., if user says 'grades')
            for key, val in private_fields.items():
                if key in user_message or f"my {key}" in user_message:
                    return jsonify({"text": val, "source_type": "local"})
            
            # Fallback: If they used a generic trigger like "my data" or "info" without a specific key, return the full info.
            return jsonify({"text": private_fields['info'], "source_type": "local"})

        # --- GUEST DENIAL ---
        else:
            # User is NOT logged in (Guest) -> DENY ACCESS
            return jsonify({
                "text": "🔒 Please log in with your PRN to view personal data like attendance, grades, or fees. This information is confidential.",
                "source_type": "local"
            })
    
    
    # --- 2️. Hardcoded Responses (Specific keywords/actions) ---
    if "website" in user_message or "site" in user_message:
        return jsonify({
            "text": f"You can visit the official college website here: {CONFIG['COLLEGE_WEBSITE']}",
            "source_type": "knowledge_base"
        })
    
    if "aiml syllabus" in user_message:
        return jsonify({
            "text":f'📘 <a href="{CONFIG["AIML_SYLLABUS_PATH"]}" target="_blank" class="text-indigo-600 underline">Download AIML Syllabus (PDF)</a>',
            "source_type": "knowledge_base"
        })

    # --- 3️. Ask Gemini using RAG (All general questions) ---
    text, source_type = _get_gemini_response_with_rag(user_message, LOCAL_KNOWLEDGE)
    
    # Optional: Add sources if the response came from Gemini/RAG
    sources = [{"uri": CONFIG['COLLEGE_WEBSITE'], "title": "College Knowledge Base"}] if source_type == "gemini" else None
    
    return jsonify({
        "text": text, 
        "source_type": source_type,
        "sources": sources
    })


# --- Main Entry ---
if __name__ == '__main__':
    print(" ✅ Flask configuration loaded successfully.")
    
    # Added reminder to set secret key for security
    if app.config['SECRET_KEY'] == "THIS_IS_A_VERY_INSECURE_DEV_KEY_CHANGE_IT_IMMEDIATELY":
        print("⚠️ WARNING: FLASK_SECRET_KEY is using a default value. Change this immediately for production!")
        
    # The default port for Flask is 5000, updated the print statement to reflect the common development port.
    print("🚀 Starting Shreeyash Sahayak Flask server on http://127.0.0.1:5000")
    app.run(debug=True, port=5000)
