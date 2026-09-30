import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./AIAssistant.css";

const AI_SOCKET_URL = "http://localhost:3005";

function AIAssistant() {
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);

    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [isSending, setIsSending] = useState(false);
    const [socketError, setSocketError] = useState("");

    useEffect(() => {
        const socket = io(AI_SOCKET_URL, {
          autoConnect: false,
          withCredentials: true,
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("AI Assistant connected");
            setSocketError("");
        });

        socket.on("agent-response", (response) => {
            setIsSending(false);

            if (response.error) {
                setMessages((prev) => [
                    ...prev,
                    {
                        type: "ai",
                        content: response.error,
                    },
                ]);
                return;
            }

            window.dispatchEvent(new Event("appointmentCreated"));

            setMessages((prev) => [
                ...prev,
                {
                    type: "ai",
                    content:
                        response.content ||
                        "Sorry, I couldn't generate a response.",
                },
            ]);
        });

        socket.on("connect_error", (error) => {
            console.error("AI socket error:", error);
            setSocketError("Unable to connect to AI assistant.");
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages, isSending]);

    function openAssistant() {
      setOpen(true);

      if (!socketRef.current?.connected) {
        setSocketError("");
        socketRef.current?.connect();
      }
    }

    function sendMessage() {
        const trimmed = input.trim();

        if (!trimmed || isSending) return;

        if (!socketRef.current?.connected) {
            setSocketError("AI assistant is not connected.");
            return;
        }

        setMessages((prev) => [
            ...prev,
            {
                type: "user",
                content: trimmed,
            },
        ]);

        setInput("");
        setIsSending(true);
        setSocketError("");

        socketRef.current.emit("message", trimmed);
    }

    function handleKeyDown(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }

    return (
      <>
        {/* Floating AI button */}
        {!open && (
          <button
            className="ai-floating-button"
            onClick={openAssistant}
            aria-label="Open AI Assistant"
          >
            ✦
          </button>
        )}

        {/* AI Assistant */}
        {open && (
          <div className="ai-assistant">
            <div className="ai-header">
              <div className="ai-header-info">
                <div className="ai-avatar">✦</div>

                <div>
                  <h3>PulsePilot AI</h3>
                  <span>Your healthcare assistant</span>
                </div>
              </div>

              <button
                className="ai-close"
                onClick={() => {
                  setOpen(false);
                  socketRef.current?.disconnect();
                }}
                aria-label="Close AI Assistant"
              >
                ×
              </button>
            </div>

            <div className="ai-messages">
              {messages.length === 0 && (
                <div className="ai-welcome">
                  <div className="ai-welcome-icon">✦</div>

                  <h3>Hi! I'm PulsePilot AI</h3>

                  <p>
                    I can help you find doctors, compare options and manage your
                    appointments.
                  </p>
                </div>
              )}

              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`ai-message ${
                    message.type === "user"
                      ? "ai-user-message"
                      : "ai-bot-message"
                  }`}
                >
                  {message.content}
                </div>
              ))}

              {isSending && (
                <div className="ai-message ai-bot-message ai-typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              )}

              {socketError && <div className="ai-error">{socketError}</div>}

              <div ref={messagesEndRef} />
            </div>

            <div className="ai-composer">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask PulsePilot AI..."
                rows={1}
                disabled={isSending}
              />

              <button
                onClick={sendMessage}
                disabled={!input.trim() || isSending}
                aria-label="Send message"
              >
                →
              </button>
            </div>
          </div>
        )}
      </>
    );
}

export default AIAssistant;