import { useState, useEffect, useRef } from "react";
import { chatbotAPI } from "../services/chatbot.service";
import "../styles/AIChatbot.css";

const AIChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const chatRef = useRef(null);

  const USER_ID = "demo-user";

  const quickActions = [
    "Check PNR",
    "Seat Exchange",
    "Train Status",
    "Emergency Help",
  ];

  // Load history on mount
  useEffect(() => {
    loadHistory();
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const loadHistory = async () => {
    try {
      const res = await chatbotAPI.getHistory(USER_ID);
      setHistory(res.data.sessions || []);
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  const createNewChat = async () => {
    try {
      const res = await chatbotAPI.newChat(USER_ID);
      setSessionId(res.data.session.id);
      setMessages([]);
      await loadHistory();
    } catch (err) {
      console.error("Error creating new chat:", err);
    }
  };

  const clearChat = async () => {
    try {
      await chatbotAPI.clearHistory(USER_ID);
      setMessages([]);
      setHistory([]);
      setSessionId(null);
    } catch (err) {
      console.error("Error clearing history:", err);
    }
  };

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  const sendMessage = async (messageText) => {
    const text = typeof messageText === "string" ? messageText : input;
    if (!text.trim()) return;

    // Add user message locally
    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text,
      },
    ]);

    // Clear input if message was sent from input box
    if (typeof messageText !== "string") {
      setInput("");
    }

    setLoading(true);

    try {
      const res = await chatbotAPI.sendMessage({
        userId: USER_ID,
        sessionId,
        message: text,
      });

      // Add bot response
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: res.data.reply,
        },
      ]);

      if (res.data.sessionId) {
        setSessionId(res.data.sessionId);
      }

      await loadHistory();
    } catch (err) {
      console.error("Error sending message:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An unexpected error occurred. Please try again.";
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `❌ ${errorMessage}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    sendMessage(action);
  };

  return (
    <div className={`rs-chatbot-container ${darkMode ? "dark" : ""}`}>
      {/* ================= Sidebar ================= */}
      <div className="rs-sidebar">
        <div className="rs-new-chat" onClick={createNewChat}>
          ➕ New Chat
        </div>

        <div className="rs-history">
          {history.length === 0 ? (
            <p
              style={{
                color: "#9ca3af",
                textAlign: "center",
                marginTop: "20px",
              }}
            >
              No Chats
            </p>
          ) : (
            history.map((chat) => (
              <div
                key={chat.id}
                className={`rs-history-item ${sessionId === chat.id ? "active" : ""}`}
                onClick={async () => {
                  setSessionId(chat.id);
                  try {
                    const res = await chatbotAPI.getSession(chat.id);
                    const mappedMessages = (res.data.messages || []).map(
                      (msg) => ({
                        sender: msg.role === "user" ? "user" : "bot",
                        text: msg.content,
                      }),
                    );
                    setMessages(mappedMessages);
                  } catch (err) {
                    console.error("Error loading session:", err);
                  }
                }}
              >
                💬 {chat.title}
              </div>
            ))
          )}
        </div>

        <div className="rs-sidebar-footer">
          <button
            onClick={clearChat}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
            }}
          >
            🗑 Clear Chat
          </button>
        </div>
      </div>

      {/* ================= Main ================= */}
      <div className="rs-main">
        {/* Header */}
        <div className="rs-header">
          <h2>🤖 RailSwap AI</h2>
          <button
            onClick={toggleTheme}
            style={{
              border: "none",
              background: "transparent",
              fontSize: "20px",
              cursor: "pointer",
            }}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Chat Messages */}
        <div className="rs-chat" ref={chatRef}>
          {messages.length === 0 && (
            <div
              style={{
                textAlign: "center",
                marginTop: "80px",
                color: "#888",
              }}
            >
              <h2>Welcome to RailSwap AI</h2>
              <p>
                Ask anything about trains, seat exchange, journey, routes or
                RailSwap.
              </p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div key={index} className={`rs-message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}

          {loading && <div className="rs-message bot">🤖 Thinking...</div>}
        </div>

        {/* Quick Actions */}
        <div className="rs-quick-actions">
          {quickActions.map((item) => (
            <button key={item} onClick={() => handleQuickAction(item)}>
              {item}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="rs-input">
          <input
            type="text"
            placeholder="Message RailSwap AI..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={() => sendMessage()}>➤</button>
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;
