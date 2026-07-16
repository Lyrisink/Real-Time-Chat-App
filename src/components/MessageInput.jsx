import { useState, useRef } from "react"
import { rtdb, auth } from "../firebase"
import { ref, set, onDisconnect } from "firebase/database"

export default function MessageInput({ onSend, roomId }) {
  const [value, setValue] = useState("")
  const typingTimeoutRef = useRef(null) // holds the debounce timer across renders

  function setTypingStatus(isTyping) {
    const typingRef = ref(rtdb, `/typing/${roomId}/${auth.currentUser.uid}`)
    set(typingRef, isTyping ? auth.currentUser.displayName : false)
    // Safety net: if the tab closes mid-type, clear the flag server-side
    onDisconnect(typingRef).set(false)
  }

  function handleChange(e) {
    setValue(e.target.value)
    setTypingStatus(true)

    // Reset the "stopped typing" timer every keystroke — only fires
    // once the user pauses for 2s without typing again
    clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => setTypingStatus(false), 2000)
  }

  function handleSend() {
    const text = value.trim()
    if (!text) return
    onSend(text)
    setValue("")
    clearTimeout(typingTimeoutRef.current)
    setTypingStatus(false) // stop showing "typing" the instant they send
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSend()
  }

  return (
    <div className="input">
      <input
        type="text"
        id="message-input"
        placeholder="Type a message..."
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  )
}