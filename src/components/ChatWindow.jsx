// Passes data down to MessageBubble and MessageInput, manages auto-scroll.
// No state of its own — purely a layout and wiring component.
import { useEffect, useRef } from "react"
import MessageBubble from "./MessageBubble"
import MessageInput from "./MessageInput"

export default function ChatWindow({ activeContact, messages, onSend }) {

  // useRef gives a stable reference to a DOM element without triggering re-renders.
  // Starts as null, gets assigned to the actual div once React renders it.
  const messageAreaRef = useRef(null)

  // useEffect runs AFTER the DOM has updated — necessary here because we need
  // the new message bubble to exist in the DOM before we can scroll to it.
  // [messages] as dependency means: re-run whenever the messages array changes.
  useEffect(() => {
    if (messageAreaRef.current) {
      // Standard DOM scroll trick via the ref — same as vanilla JS, just accessed through ref.
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="chat-area">
      <div className="chat-header">
        <h2>{activeContact}</h2>
      </div>

      {/* ref={messageAreaRef} connects this DOM element to the useRef hook above */}
      <div className="message-area" ref={messageAreaRef}>
        {/* .map() renders one MessageBubble per message object.
            key={msg.id} is required — React uses it to track which items
            changed between renders without re-rendering the whole list. */}
        {messages.map(msg => (
          <MessageBubble
            key={msg.id}
            type={msg.type}
            text={msg.text}
            time={msg.time}
          />
        ))}
      </div>

      {/* onSend is prop-drilled through here — ChatWindow doesn't use it,
          just passes it along to MessageInput which actually calls it. */}
      <MessageInput onSend={onSend} />
    </div>
  )
}