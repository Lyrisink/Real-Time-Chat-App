import { useState, useRef } from "react"
import { rtdb, auth, storage } from "../firebase"
import { ref, set, onDisconnect } from "firebase/database"
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage"

export default function MessageInput({ onSend, roomId }) {
  const [value, setValue] = useState("")
  const [uploading, setUploading] = useState(false)
  const typingTimeoutRef = useRef(null)
  const fileInputRef = useRef(null)

  function setTypingStatus(isTyping) {
    const typingRef = ref(rtdb, `/typing/${roomId}/${auth.currentUser.uid}`)
    set(typingRef, isTyping ? auth.currentUser.displayName : false)
    onDisconnect(typingRef).set(false)
  }

  function handleChange(e) {
    setValue(e.target.value)
    setTypingStatus(true)
    clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => setTypingStatus(false), 2000)
  }

  function handleSend() {
    const text = value.trim()
    if (!text) return
    onSend(text, "text")
    setValue("")
    clearTimeout(typingTimeoutRef.current)
    setTypingStatus(false)
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSend()
  }

  async function handleImagePick(e) {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      const path = `chat-images/${roomId}/${Date.now()}_${file.name}`
      const imgRef = storageRef(storage, path)
      await uploadBytes(imgRef, file)
      const url = await getDownloadURL(imgRef)
      onSend(url, "image")
    } catch (err) {
      console.error("Image upload failed:", err)
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  return (
    <div className="input">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImagePick}
        style={{ display: "none" }}
      />
      <button
        className="attach-btn"
        onClick={() => fileInputRef.current.click()}
        disabled={uploading}
        title="Attach image"
      >
        {uploading ? <span className="spinner" /> : "📎"}
      </button>
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