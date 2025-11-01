// const chatBox = document.getElementById("chat-box");
// const chatForm = document.getElementById("chat-form");
// const userInput = document.getElementById("user-input");
// const loginModal = document.getElementById("loginModal");
// const modalCard = document.getElementById("modalCard");
// const loginBtn = document.getElementById("loginBtn");
// const guestBtn = document.getElementById("guestBtn");
// const prnInput = document.getElementById("prnInput");
// const loginError = document.getElementById("loginError");
// const logoutBtn = document.getElementById("logoutBtn");

// function appendMessage(message, sender) {
//   const div = document.createElement("div");
//   div.classList.add("p-2", "rounded-lg", "max-w-[80%]");
//   if (sender === "user") {
//     div.classList.add("bg-blue-600", "text-white", "ml-auto");
//   } else {
//     div.classList.add(
//       "bg-gray-200",
//       "dark:bg-gray-700",
//       "text-black",
//       "dark:text-white"
//     );
//   }
//   div.innerHTML = message;
//   chatBox.appendChild(div);
//   chatBox.scrollTop = chatBox.scrollHeight;
// }

// // === 🔊 Voice Output ===
// let voiceEnabled = true;
// const voiceToggle = document.getElementById("voiceToggle");
// voiceToggle.addEventListener("click", () => {
//   voiceEnabled = !voiceEnabled;
//   voiceToggle.innerText = voiceEnabled ? "🔈" : "🔇";
// });
// function speakText(text) {
//   if (!voiceEnabled) return;
//   const utterance = new SpeechSynthesisUtterance(text);
//   utterance.lang = "en-IN";
//   utterance.pitch = 1;
//   utterance.rate = 1;
//   speechSynthesis.speak(utterance);
// }

// // === 🌗 Theme Toggle ===
// const themeToggle = document.getElementById("themeToggle");
// const html = document.documentElement;
// if (localStorage.getItem("theme") === "dark") {
//   html.classList.add("dark");
//   themeToggle.innerText = "☀️";
// }
// themeToggle.addEventListener("click", () => {
//   html.classList.toggle("dark");
//   const isDark = html.classList.contains("dark");
//   localStorage.setItem("theme", isDark ? "dark" : "light");
//   themeToggle.innerText = isDark ? "☀️" : "🌙";
// });

// // === 🎙️ Voice Input ===
// const micButton = document.getElementById("micButton");
// let recognition;
// if ("webkitSpeechRecognition" in window) {
//   recognition = new webkitSpeechRecognition();
//   recognition.lang = "en-IN";
//   recognition.continuous = false;
//   recognition.interimResults = false;
//   micButton.addEventListener("click", () => {
//     recognition.start();
//     micButton.innerText = "🎙️ Listening...";
//   });
//   recognition.onresult = (event) => {
//     const transcript = event.results[0][0].transcript;
//     userInput.value = transcript;
//     micButton.innerText = "🎤";
//   };
//   recognition.onerror = () => {
//     micButton.innerText = "🎤";
//   };
// } else {
//   micButton.style.display = "none";
//   console.warn("Speech recognition not supported in this browser.");
// }

// // === 🪪 LOGIN MODAL ===
// function showModal() {
//   loginModal.classList.remove("pointer-events-none", "opacity-0");
//   setTimeout(
//     () => modalCard.classList.remove("scale-95", "translate-y-[-20px]"),
//     10
//   );
// }
// function hideModal() {
//   modalCard.classList.add("scale-95", "translate-y-[-20px]");
//   loginModal.classList.add("opacity-0", "pointer-events-none");
// }
// function clearChat() {
//   const chatBox = document.getElementById("chat-box");
//   if (chatBox) {
//     chatBox.innerHTML =
//       '<div class="text-center text-sm text-gray-500">Chat started. Ask me anything about Shreeyash College!</div>';
//   }
// }

// const savedData = JSON.parse(localStorage.getItem("studentData"));
// localStorage.removeItem("studentData");
// showModal();

// if (!savedData) showModal();
// else logoutBtn.classList.remove("hidden");

// loginBtn.addEventListener("click", async () => {
//   const prn = prnInput.value.trim();
//   if (!prn) return;
//   try {
//     const res = await fetch("/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ prn }),
//     });
//     const data = await res.json();
//     if (data.error) {
//       loginError.classList.remove("hidden");
//       return;
//     }
//     localStorage.setItem("studentData", JSON.stringify(data));
//     logoutBtn.classList.remove("hidden");
//     clearChat();
//     hideModal();
//   } catch {
//     loginError.textContent = "⚠️ Server error. Try again.";
//     loginError.classList.remove("hidden");
//   }
// });

// guestBtn.addEventListener("click", () => {
//   localStorage.removeItem("studentData");
//   logoutBtn.classList.remove("hidden");
//   hideModal();
// });

// logoutBtn.addEventListener("click", () => {
//   localStorage.removeItem("studentData");
//   clearChat(); // 🧹 Clear previous chat
//   logoutBtn.classList.add("hidden");
//   showModal();
// });

// // === 💬 CHAT LOGIC ===
// chatForm.addEventListener("submit", async (e) => {
//   e.preventDefault();
//   const message = userInput.value.trim();
//   if (!message) return;

//   appendMessage(message, "user");
//   userInput.value = "";
//   appendMessage("<em>typing...</em>", "bot");

//   const student = JSON.parse(localStorage.getItem("studentData"));
//   const prn = student ? student.prn : null;

//   try {
//     const res = await fetch("/chat", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ message, prn }),
//     });
//     const data = await res.json();
//     chatBox.lastChild.remove();

//     if (data.text) {
//       let label = "";
//       if (data.source_type === "local") {
//         label = `<p class='text-xs text-green-600 mt-1'>📘 From Local Knowledge Base</p>`;
//       } else if (data.source_type === "gemini") {
//         label = `<p class='text-xs text-blue-600 mt-1'>🤖 From Gemini AI</p>`;
//       }
//       appendMessage(`${data.text}${label}`, "bot");
//       speakText(data.text);
//     } else appendMessage("⚠️ No response received.", "bot");
//   } catch {
//     chatBox.lastChild.remove();
//     appendMessage("⚠️ Error connecting to server.", "bot");
//   }
// });

/* -------------------------
       Utility / element refs
       ------------------------- */
const chatBox = document.getElementById("chat-box");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const micButton = document.getElementById("micButton");
const micIcon = document.getElementById("micIcon");
const sendBtn = document.getElementById("sendBtn");
const loginModal = document.getElementById("loginModal");
const modalCard = document.getElementById("modalCard");
const loginBtn = document.getElementById("loginBtn");
const guestBtn = document.getElementById("guestBtn");
const prnInput = document.getElementById("prnInput");
const loginError = document.getElementById("loginError");
const logoutBtn = document.getElementById("logoutBtn");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const voiceToggle = document.getElementById("voiceToggle");
const voiceLabel = document.getElementById("voiceLabel");
const voiceIcon = document.getElementById("voiceIcon");

/* -------------------------
       THEME: apply saved pref
       ------------------------- */
const html = document.documentElement;
if (localStorage.getItem("theme") === "dark") {
  html.classList.add("dark");
  themeIcon.className = "fa-solid fa-sun text-yellow-300";
} else {
  themeIcon.className = "fa-solid fa-moon text-gray-600";
}
themeToggle.addEventListener("click", () => {
  html.classList.toggle("dark");
  const isDark = html.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  themeIcon.className = isDark
    ? "fa-solid fa-sun text-yellow-300"
    : "fa-solid fa-moon text-gray-600";
});

/* -------------------------
       VOICE OUTPUT settings
       ------------------------- */
let voiceEnabled = true;
voiceToggle.addEventListener("click", () => {
  voiceEnabled = !voiceEnabled;
  voiceLabel.textContent = voiceEnabled ? "Voice: ON" : "Voice: OFF";
  voiceIcon.className = voiceEnabled
    ? "fa-solid fa-volume-high text-indigo-600"
    : "fa-solid fa-volume-xmark text-gray-600";
});

function speakText(text) {
  if (!voiceEnabled) return;
  const utter = new SpeechSynthesisUtterance(text);
  // Choose a preferred voice if available; else fallback
  const voices = speechSynthesis.getVoices();
  // try to pick en-IN or a close variant
  utter.voice =
    voices.find((v) => v.lang && v.lang.includes("en-IN")) ||
    voices.find((v) => v.lang && v.lang.includes("en-")) ||
    voices[0];
  utter.lang = utter.voice?.lang || "en-IN";
  utter.pitch = 1;
  utter.rate = 1;
  speechSynthesis.cancel();
  speechSynthesis.speak(utter);
}

/* -------------------------
       VOICE INPUT: Web Speech API
       ------------------------- */
let recognition;
try {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SR) {
    recognition = new SR();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      micIcon.className = "fa-solid fa-microphone-lines text-red-500";
    };
    recognition.onend = () => {
      micIcon.className = "fa-solid fa-microphone text-indigo-600";
    };
    recognition.onerror = (e) => {
      console.warn("Speech recognition error", e);
      micIcon.className = "fa-solid fa-microphone text-indigo-600";
    };
    recognition.onresult = (evt) => {
      const transcript = evt.results[0][0].transcript;
      userInput.value = transcript;
      userInput.focus();
    };
  } else {
    micButton.style.display = "none";
  }
} catch (err) {
  console.warn("SpeechRecognition not supported:", err);
  micButton.style.display = "none";
}

micButton.addEventListener("click", () => {
  if (!recognition) return;
  try {
    recognition.start();
  } catch (err) {
    /* ignore repeated starts */
  }
});

/* -------------------------
       Helper: clear chat (resets welcome hint)
       ------------------------- */
function clearChat() {
  chatBox.innerHTML =
    '<div class="w-full text-center text-sm text-gray-600 dark:text-gray-300 select-none">Chat started. Ask me anything about Shreeyash College!</div>';
  // keep scroll at bottom
  chatBox.scrollTop = chatBox.scrollHeight;
}

/* -------------------------
       Typing animation (word-by-word)
       - messageEl is the element where text will appear
       - fullText is the complete bot reply string
       - speedMs controls word pacing
       ------------------------- */
async function typeBotReply(messageEl, fullText, speedMs = 45) {
  // split into words but keep punctuation attached
  const words = fullText.split(/\s+/);
  messageEl.classList.add("typing-cursor");
  messageEl.innerHTML = ""; // start empty
  for (let i = 0; i < words.length; i++) {
    // append next word
    messageEl.innerHTML += (i === 0 ? "" : " ") + escapeHtml(words[i]);
    chatBox.scrollTop = chatBox.scrollHeight;
    await new Promise((r) => setTimeout(r, speedMs));
  }
  messageEl.classList.remove("typing-cursor");
}

// small escape helper to avoid HTML injection
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, function (m) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[m];
  });
}

/* -------------------------
       Append user message (right) / append bot message (left with avatar)
       - botAvatarSrc: path to avatar image shown left of bot messages
       ------------------------- */
const botAvatarSrc = "./static/syp-logo.png"; // adjust if needed
function appendUserMessage(text) {
  const wrapper = document.createElement("div");
  wrapper.className = "flex justify-end";
  const bubble = document.createElement("div");
  bubble.className =
    "max-w-[80%] bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-4 py-2 rounded-2xl rounded-tr-none shadow";
  bubble.innerHTML = escapeHtml(text);
  wrapper.appendChild(bubble);
  chatBox.appendChild(wrapper);
  chatBox.scrollTop = chatBox.scrollHeight;
}


function linkifyText(text) {
  // Replace URLs with clickable hyperlinks
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener" class="text-indigo-600 underline hover:text-indigo-800">${url}</a>`;
  });
}


function appendBotContainer() {
  const wrapper = document.createElement("div");
  wrapper.className = "flex items-start gap-3";
  // avatar
  const avatar = document.createElement("img");
  avatar.src = botAvatarSrc;
  avatar.alt = "bot";
  avatar.className = "w-10 h-10 rounded-full shadow-sm object-cover mt-1";
  // message bubble container
  const bubbleWrap = document.createElement("div");
  bubbleWrap.className =
    "max-w-[78%] bg-white dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-tl-none shadow";
  // inner message element (we will type into this)
  const messageEl = document.createElement("div");
  messageEl.className = "text-gray-900 dark:text-gray-100 text-sm";
  bubbleWrap.appendChild(messageEl);
  wrapper.appendChild(avatar);
  wrapper.appendChild(bubbleWrap);
  chatBox.appendChild(wrapper);
  chatBox.scrollTop = chatBox.scrollHeight;
  return messageEl;
}

/* -------------------------
       Show / hide login modal (animated)
       ------------------------- */
function showModal() {
  loginModal.classList.remove("opacity-0", "pointer-events-none");
  setTimeout(() => {
    modalCard.classList.remove("translate-y-4", "scale-95", "opacity-0");
    modalCard.classList.add("opacity-100");
  }, 20);
}
function hideModal() {
  modalCard.classList.add("translate-y-4", "scale-95", "opacity-0");
  setTimeout(
    () => loginModal.classList.add("opacity-0", "pointer-events-none"),
    250
  );
}

/* -------------------------
       Manage login state: uses backend /login endpoint
       - stores studentData in localStorage as "studentData"
       - clears chat when login changes
       ------------------------- */
function setLoggedInUI(isLoggedIn) {
  if (isLoggedIn) {
    logoutBtn.classList.remove("hidden");
  } else {
    logoutBtn.classList.add("hidden");
  }
}

// On page load: show modal if not logged in
(function init() {
  const saved = localStorage.getItem("studentData");
  if (!saved) {
    // show modal
    showModal();
    setLoggedInUI(false);
  } else {
    setLoggedInUI(true);
  }
})();

// login button -> call backend /login to validate PRN
loginBtn.addEventListener("click", async () => {
  const prn = prnInput.value.trim();
  if (!prn) return;
  loginError.classList.add("hidden");
  try {
    const res = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prn }),
    });
    const data = await res.json();
    if (data.error) {
      loginError.textContent = data.error;
      loginError.classList.remove("hidden");
      return;
    }
    // success: save and hide modal
    localStorage.setItem("studentData", JSON.stringify(data));
    clearChat(); // clear previous chat for new user
    hideModal();
    setLoggedInUI(true);
  } catch (err) {
    loginError.textContent = "Server error. Try again.";
    loginError.classList.remove("hidden");
  }
});

// guest button -> continue as guest (no PRN)
guestBtn.addEventListener("click", () => {
  localStorage.removeItem("studentData"); // ensure no prn present
  clearChat();
  hideModal();
  setLoggedInUI(true);
});

// logout: clear saved data and show modal again
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("studentData");
  clearChat();
  setLoggedInUI(false);
  showModal();
});

/* -------------------------
       Main chat submit handler
       - sends { message, prn } to /chat
       - expects { text, source_type } in response
       ------------------------- */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = userInput.value.trim();
  if (!message) return;
  // append user message
  appendUserMessage(message);
  userInput.value = "";
  // show typing placeholder
  const typingEl = appendBotContainer(); // returns element where bot text will be typed
  typingEl.innerHTML = '<em class="text-gray-500">Typing…</em>';
  try {
    const student = JSON.parse(localStorage.getItem("studentData"));
    const prn = student ? student.prn : null;
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, prn }),
    });
    const data = await res.json();
    // Replace the placeholder with typed reply
    const botMessageEl = typingEl;
    // If API returned error text (source_type === 'error'), show it plainly
    if (!data || !data.text) {
      botMessageEl.innerHTML =
        '<span class="text-red-500">⚠️ No response received.</span>';
      speakText("No response received from the server.");
      return;
    }

    // If source_type === knowledge_base or local, show label after typing
    // Type out the bot's reply with typing animation
    // botMessageEl.innerHTML = data.text; // allow HTML for bold & line breaks
    botMessageEl.innerHTML = linkifyText(data.text);

    // small source footer label
    if (data.source_type === "knowledge_base") {
      const label = document.createElement("div");
      label.className = "text-xs text-green-600 mt-2";
      label.innerHTML = "📘 From Local Knowledge Base";
      botMessageEl.parentElement.appendChild(label);
    } else if (data.source_type === "local") {
      const label = document.createElement("div");
      label.className = "text-xs text-indigo-600 mt-2";
      label.innerHTML = "🔒 Private (Student Data)";
      botMessageEl.parentElement.appendChild(label);
    } else if (data.source_type === "gemini") {
      const label = document.createElement("div");
      label.className = "text-xs text-blue-500 mt-2";
      label.innerHTML = "🤖 From Gemini AI";
      botMessageEl.parentElement.appendChild(label);
    }

    // speak reply
    speakText(data.text);
  } catch (err) {
    console.error("Chat request failed", err);
    typingEl.innerHTML =
      '<span class="text-red-500">⚠️ Error connecting to server.</span>';
  }
});

/* -------------------------
       Keyboard: Enter to send (Shift+Enter for newline)
       ------------------------- */
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendBtn.click();
  }
});

/* -------------------------
       Small utility: show modal for debugging (optional)
       If you want to force the modal to show on every reload during dev, uncomment:
         localStorage.removeItem('studentData');
         showModal();
       ------------------------- */
// localStorage.removeItem('studentData');
// showModal();

/* -------------------------
       END of script
       ------------------------- */
