(function () {
  // ── CONFIG ──────────────────────────────────────────────────
  const WEBHOOK_URL =
    "https://leatha-nondrinkable-india.ngrok-free.dev/webhook/c9187014-f9da-432c-9ebe-2070987a5224/chat";

  // Simple session ID — stays the same for this page visit
  const SESSION_ID = "cc-" + Math.random().toString(36).slice(2, 10);

  // ── STYLES ──────────────────────────────────────────────────
  const style = document.createElement("style");
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

    #eduvi-chat-bubble {
      position: fixed;
      bottom: 90px;
      right: 28px;
      width: 54px;
      height: 54px;
      background: #6C63FF;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(108,99,255,0.45);
      z-index: 9999;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    #eduvi-chat-bubble:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 26px rgba(108,99,255,0.55);
    }
    #eduvi-chat-bubble svg {
      width: 26px;
      height: 26px;
      fill: #fff;
    }

    /* Pulse ring on bubble */
    #eduvi-chat-bubble::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: rgba(108,99,255,0.25);
      animation: eduvi-pulse 2.2s ease-out infinite;
    }
    @keyframes eduvi-pulse {
      0%   { transform: scale(1);   opacity: 0.7; }
      100% { transform: scale(1.8); opacity: 0; }
    }

    /* ── CHAT WINDOW ── */
    #eduvi-chat-window {
      position: fixed;
      bottom: 160px;
      right: 28px;
      width: 340px;
      max-height: 520px;
      background: #ffffff;
      border-radius: 18px;
      box-shadow: 0 12px 48px rgba(26,26,46,0.18);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 9998;
      font-family: 'Poppins', sans-serif;
      transform: scale(0.92) translateY(16px);
      opacity: 0;
      pointer-events: none;
      transition: transform 0.25s ease, opacity 0.25s ease;
    }
    #eduvi-chat-window.open {
      transform: scale(1) translateY(0);
      opacity: 1;
      pointer-events: all;
    }

    /* Header */
    #eduvi-chat-header {
      background: linear-gradient(135deg, #1A1A2E 0%, #2d2a6e 100%);
      padding: 16px 18px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    #eduvi-chat-avatar {
      width: 38px;
      height: 38px;
      background: #6C63FF;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      flex-shrink: 0;
    }
    #eduvi-chat-header-info {}
    #eduvi-chat-header-name {
      color: #ffffff;
      font-weight: 600;
      font-size: 14px;
      line-height: 1.2;
    }
    #eduvi-chat-header-status {
      color: rgba(255,255,255,0.55);
      font-size: 11px;
      display: flex;
      align-items: center;
      gap: 4px;
      margin-top: 2px;
    }
    #eduvi-chat-header-status::before {
      content: '';
      width: 7px;
      height: 7px;
      background: #22C55E;
      border-radius: 50%;
      display: inline-block;
    }
    #eduvi-close-btn {
      margin-left: auto;
      background: rgba(255,255,255,0.12);
      border: none;
      color: #fff;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }
    #eduvi-close-btn:hover { background: rgba(255,255,255,0.22); }

    /* Messages */
    #eduvi-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px 14px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      background: #f7f6ff;
    }
    #eduvi-messages::-webkit-scrollbar { width: 4px; }
    #eduvi-messages::-webkit-scrollbar-thumb { background: #d0cefd; border-radius: 2px; }

    .eduvi-msg {
      max-width: 82%;
      padding: 10px 13px;
      border-radius: 14px;
      font-size: 13px;
      line-height: 1.55;
      animation: eduvi-fade-in 0.2s ease;
    }
    @keyframes eduvi-fade-in {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .eduvi-msg.bot {
      background: #ffffff;
      color: #1A1A2E;
      border-bottom-left-radius: 4px;
      align-self: flex-start;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }
    .eduvi-msg.user {
      background: #6C63FF;
      color: #ffffff;
      border-bottom-right-radius: 4px;
      align-self: flex-end;
    }

    /* Typing indicator */
    .eduvi-typing {
      display: flex;
      gap: 5px;
      align-items: center;
      padding: 10px 13px;
      background: #fff;
      border-radius: 14px;
      border-bottom-left-radius: 4px;
      width: fit-content;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }
    .eduvi-typing span {
      width: 7px;
      height: 7px;
      background: #6C63FF;
      border-radius: 50%;
      animation: eduvi-bounce 1.1s ease infinite;
    }
    .eduvi-typing span:nth-child(2) { animation-delay: 0.18s; }
    .eduvi-typing span:nth-child(3) { animation-delay: 0.36s; }
    @keyframes eduvi-bounce {
      0%, 60%, 100% { transform: translateY(0); }
      30%           { transform: translateY(-6px); }
    }

    /* Input bar */
    #eduvi-input-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 14px;
      border-top: 1px solid #ece9ff;
      background: #fff;
    }
    #eduvi-input {
      flex: 1;
      border: 1.5px solid #e0ddff;
      border-radius: 22px;
      padding: 9px 14px;
      font-size: 13px;
      font-family: 'Poppins', sans-serif;
      outline: none;
      color: #1A1A2E;
      transition: border-color 0.2s;
      resize: none;
    }
    #eduvi-input:focus { border-color: #6C63FF; }
    #eduvi-input::placeholder { color: #b0aed4; }

    #eduvi-send-btn {
      width: 36px;
      height: 36px;
      background: #6C63FF;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: background 0.2s, transform 0.15s;
    }
    #eduvi-send-btn:hover { background: #5a52e8; transform: scale(1.05); }
    #eduvi-send-btn:disabled { background: #ccc; cursor: not-allowed; transform: none; }
    #eduvi-send-btn svg { width: 16px; height: 16px; fill: #fff; }

    /* Mobile */
    @media (max-width: 480px) {
      #eduvi-chat-window {
        right: 12px;
        left: 12px;
        width: auto;
        bottom: 140px;
      }
    }
  `;
  document.head.appendChild(style);

  // ── HTML ────────────────────────────────────────────────────
  // Bubble
  const bubble = document.createElement("div");
  bubble.id = "eduvi-chat-bubble";
  bubble.title = "Chat with Eduvi";
  bubble.innerHTML = `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z"/>
      <circle cx="9" cy="10" r="1.2"/>
      <circle cx="12" cy="10" r="1.2"/>
      <circle cx="15" cy="10" r="1.2"/>
    </svg>
  `;
  document.body.appendChild(bubble);

  // Chat window
  const chatWindow = document.createElement("div");
  chatWindow.id = "eduvi-chat-window";
  chatWindow.innerHTML = `
    <div id="eduvi-chat-header">
      <div id="eduvi-chat-avatar">🎓</div>
      <div id="eduvi-chat-header-info">
        <div id="eduvi-chat-header-name">Eduvi Assistant</div>
        <div id="eduvi-chat-header-status">Online now</div>
      </div>
      <button id="eduvi-close-btn" title="Close">✕</button>
    </div>
    <div id="eduvi-messages"></div>
    <div id="eduvi-input-bar">
      <input id="eduvi-input" type="text" placeholder="Ask about courses, pricing..." maxlength="300" />
      <button id="eduvi-send-btn" title="Send">
        <svg viewBox="0 0 24 24"><path d="M2 21L23 12 2 3V10L17 12 2 14V21Z"/></svg>
      </button>
    </div>
  `;
  document.body.appendChild(chatWindow);

  // ── REFERENCES ──────────────────────────────────────────────
  const messagesEl = document.getElementById("eduvi-messages");
  const inputEl    = document.getElementById("eduvi-input");
  const sendBtn    = document.getElementById("eduvi-send-btn");
  const closeBtn   = document.getElementById("eduvi-close-btn");

  // ── TOGGLE ──────────────────────────────────────────────────
  let isOpen = false;

  function openChat() {
    isOpen = true;
    chatWindow.classList.add("open");
    // stop bubble pulse when open
    bubble.style.animation = "none";
    inputEl.focus();
    // show welcome message only once
    if (messagesEl.children.length === 0) {
      addBotMessage("👋 Hi there! I'm the Eduvi assistant. Ask me about courses, pricing, mentors, or anything about the platform!");
    }
  }

  function closeChat() {
    isOpen = false;
    chatWindow.classList.remove("open");
    bubble.style.animation = "";
  }

  bubble.addEventListener("click", function () {
    isOpen ? closeChat() : openChat();
  });
  closeBtn.addEventListener("click", closeChat);

  // ── MESSAGES ────────────────────────────────────────────────
  function addMessage(text, type) {
    const msg = document.createElement("div");
    msg.className = "eduvi-msg " + type;
    msg.textContent = text;
    messagesEl.appendChild(msg);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return msg;
  }

  function addBotMessage(text) {
    return addMessage(text, "bot");
  }

  function addUserMessage(text) {
    return addMessage(text, "user");
  }

  function showTyping() {
    const el = document.createElement("div");
    el.className = "eduvi-typing";
    el.id = "eduvi-typing";
    el.innerHTML = "<span></span><span></span><span></span>";
    messagesEl.appendChild(el);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function hideTyping() {
    const el = document.getElementById("eduvi-typing");
    if (el) el.remove();
  }

  // ── SEND ────────────────────────────────────────────────────
  async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text) return;

    addUserMessage(text);
    inputEl.value = "";
    sendBtn.disabled = true;
    showTyping();

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "1"
        },
        body: JSON.stringify({
          action: "sendMessage",
          sessionId: SESSION_ID,
          chatInput: text
        })
      });

      hideTyping();

      // Handle streaming (Agent 1 format: line-by-line JSON with type:"item")
      const contentType = response.headers.get("content-type") || "";
      let botReply = "";

      if (contentType.includes("text/event-stream") || contentType.includes("text/plain")) {
        // Streaming response
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n").filter(l => l.trim());
          for (const line of lines) {
            try {
              const parsed = JSON.parse(line);
              if (parsed.type === "item" && parsed.output) {
                botReply += parsed.output;
              }
            } catch (_) {}
          }
        }
      } else {
        // JSON response (Agent 2 format: {"output":"..."})
        const data = await response.json();
        botReply = data.output || data.text || data.message || "Sorry, I didn't get a response.";
      }

      addBotMessage(botReply || "Sorry, I couldn't get a response. Please try again.");

    } catch (err) {
      hideTyping();
      addBotMessage("Oops! Something went wrong. Please try again in a moment.");
      console.error("Eduvi chatbot error:", err);
    }

    sendBtn.disabled = false;
    inputEl.focus();
  }

  // ── EVENTS ──────────────────────────────────────────────────
  sendBtn.addEventListener("click", sendMessage);

  inputEl.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

})();
