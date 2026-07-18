import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import MessageBubble from "./MessageBubble"
import MessageInput from "./MessageInput"

export default function ChatWindow({ activeContact, messages, onSend, roomId, typingUsers }) {
  const messageAreaRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="chat-area">
      <div className="chat-header">
        <button className="back-to-rooms-btn" onClick={() => navigate("/")} title="Back to rooms">
          ←
        </button>
        <h2>{activeContact}</h2>
      </div>

      <div className="message-area" ref={messageAreaRef}>
        {messages.map(msg => (
          <MessageBubble
            key={msg.id}
            type={msg.type}
            messageType={msg.messageType}
            text={msg.text}
            imageURL={msg.imageURL}
            time={msg.time}
          />
        ))}
      </div>

      {/* Renders only when someone (other than you) is typing */}
      {typingUsers.length > 0 && (
        <p className="typing-indicator">
          {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
        </p>
      )}

      <MessageInput onSend={onSend} roomId={roomId} />
    </div>
  )
}