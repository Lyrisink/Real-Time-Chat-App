// Owns the draft message state locally — no other component needs it.
// Once sent, the text is passed up via onSend and local state resets.
import { useState } from "react"

export default function MessageInput({ onSend }) {

  // Controlled input: React holds the input's value in state rather than the DOM.
  const [value, setValue] = useState("")

  function handleSend() {
    const text = value.trim()
    if (!text) return   // guard: ignore empty sends
    onSend(text)        // bubble the text up to App.jsx's handleSend
    setValue("")        // clearing state automatically clears the controlled input
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
        value={value}                          // controlled: input displays whatever state holds
        onChange={e => setValue(e.target.value)} // updates state on every keystroke
        onKeyDown={handleKeyDown}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  )
}