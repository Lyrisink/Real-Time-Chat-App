import { useState, useRef, useEffect } from "react"
import { rtdb, auth } from "../firebase"
import { ref, set, onDisconnect } from "firebase/database"
import EmojiPicker from "emoji-picker-react"

export default function MessageInput({ onSend, roomId }) {
  const [value, setValue] = useState("")
  const [uploading, setUploading] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  const [pickerTheme, setPickerTheme] = useState(
    document.body.classList.contains("light") ? "light" : "dark"
  )
  const typingTimeoutRef = useRef(null)
  const fileInputRef = useRef(null)
  const pickerRef = useRef(null)

  // Watch <body> for the "light" class toggling, so the emoji picker's
  // own theme stays in sync with the app's theme without prop-drilling
  // through RoomView -> ChatWindow -> here.
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setPickerTheme(document.body.classList.contains("light") ? "light" : "dark")
    })
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

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
      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)

      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData
      })

      if (!res.ok) throw new Error("Cloudinary upload failed")

      const data = await res.json()
      onSend(data.secure_url, "image")
    } catch (err) {
      console.error("Image upload failed:", err)
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  function handleEmojiClick(emojiData) {
    setValue(prev => prev + emojiData.emoji)
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowPicker(false)
      }
    }
    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showPicker])

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

      <div className="emoji-wrapper" ref={pickerRef}>
        <button
          className="attach-btn"
          onClick={() => setShowPicker(prev => !prev)}
          title="Emoji"
        >
          😊
        </button>
        {showPicker && (
          <div className="emoji-picker-wrapper">
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              theme={pickerTheme}
              width={300}
              height={380}
            />
          </div>
        )}
      </div>

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