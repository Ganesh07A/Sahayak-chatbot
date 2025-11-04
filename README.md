# 🤖 Shreeyash Sahayak — AI Campus Chatbot  
An AI-powered chatbot built for **Shreeyash College of Engineering & Technology, Chh. Sambhajinagar**.  
The chatbot answers college-related queries, provides personal academic info to students securely, and includes voice features — all inside a modern UI inspired by ChatGPT.

---

## 🚀 Demo Preview

🎥 Video Demo (Coming Soon)  
📸 Screenshots:  
- Light & Dark Mode  
- Login Screen with PRN  
- Voice Input/Output  
- PDF & File Responses  
- AI + Local Knowledge Answers

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🧠 AI Responses | Uses **Gemini API** for answering dynamic college queries |
| 📚 Knowledge Base | Instant offline FAQ handling for common queries |
| 🔐 Student Login | PRN-based system for secure personal data access |
| 🗣️ Voice Support | Speech-to-Text input and Text-to-Speech output |
| 🌗 Theme Toggle | Switch between light/dark UI seamlessly |
| 📄 Send Files | Responds with downloadable PDFs and images through chat |
| 🔄 Hybrid AI | Combines local knowledge + live AI for fast fallback |
| 🎨 Clean UI | Built with TailwindCSS and responsive on all devices |

---

## 🧱 Tech Stack

| Area | Tools Used |
|------|------------|
| Frontend | HTML, TailwindCSS, Vanilla JavaScript |
| Backend | Python, Flask |
| API / AI | Gemini API (`models/gemini-2.5-flash`) |
| Voice | Web Speech API |
| Storage | Local Knowledge Base + Mock Student DB |
| Version Control | Git, GitHub |

---

## 📂 Project Structure

shreeyash-sahayak/
│
├── backend/
│ ├── server.py # Flask backend with all API logic
│ ├── knowledge_base.txt # Local static data for quick FAQ responses
│ ├── .env.example # Example for environment variables
│ └── requirements.txt # Python dependencies
│
|
|
├── frontend/
│ ├── syp-chatbot.html # Main chatbot UI
│ └── static/
│ ├── css/ # Tailwind-generated CSS
│ ├── js/ # Chat logic, voice functions, API calls
│ └── assets/ # Images, logo, PDFs
│
└── README.md # This documentation

yaml
Copy code

---

## 🔧 Setup Instructions

### 1️⃣ Clone the Repository

git clone https://github.com/Ganesh07A/shreeyash-sahayak.git
cd shreeyash-sahayak

shell
Copy code

### 2️⃣ Backend Setup

cd backend
pip install -r requirements.txt

sql
Copy code

Create your `.env` file and add:

GEMINI_API_KEY=your_api_key_here

yaml
Copy code

Run the Flask server:

python server.py

yaml
Copy code

The server starts at:  
`http://127.0.0.1:5000`

### 3️⃣ Load Frontend

You can either:

- Double-click `syp-chatbot.html` to open in a browser  
- OR host it from a simple server like `Live Server` in VS Code  
- Make sure Flask backend is running in the background

---

## 💬 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/login` | POST | PRN authentication for student info |
| `/chat` | POST | Handles chatbot query and routes response (KB or Gemini) |
| `/files/<name>` | GET | Serves static files likes PDFs/images via chat |

**Example `POST /chat` request:**

{
"message": "Show my attendance",
"prn": "202501000001"
}

yaml
Copy code

---

## 📚 Knowledge Base Usage

Local lookup happens when user messages contain certain keywords like:

`address`, `principal`, `admission`, `fees`, `departments`, etc.

These are stored in `knowledge_base.txt` like:

address: Shreeyash College, Satara Parisar, Chh. Sambhajinagar, Maharashtra 431002.
principal: Dr. B. M. Patil
admission process: Entrance-based (MHT-CET), Direct Second-Year for Diploma holders

yaml
Copy code

✅ If match found: bot replies instantly from the file  
❌ If not found: Gemini API is used for live AI response

---

## 🗣️ Voice Support

- **Input:** Converts speech-to-text via Web Speech API  
- **Output:** Speaks chatbot response using SpeechSynthesis  
- Works in both light and dark themes

---

## 🛠 Future Improvements

- Replace mock student DB with a real MySQL or MongoDB database  
- Deploy backend via Render / Railway and host frontend separately  
- Add role-based access for faculty or admin  
- Build history-based learning and personalization features

---

## 👨‍💻 Author

**Ganesh Suvarnakar**  
3rd Year B.Tech – Artificial Intelligence & ML (2023–2027)  
Shreeyash College of Engineering & Technology  
📧 Email: work.ganeshsuvarnakar@gmail.com  
🔗 GitHub: [Ganesh07A](https://github.com/Ganesh07A)

---

## 📄 License

This project is open source under the MIT License.

---

> ⭐ If this project inspired you, consider starring the repository!
