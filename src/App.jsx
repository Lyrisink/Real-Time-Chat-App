import { useEffect, useState } from "react"
import Sidebar from "./components/Sidebar"
import ChatWindow from "./components/ChatWindow"
import ProtectedRoute from "./components/ProtectedRoute"
import { db, auth } from "./firebase"
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore"
import "./App.css"

const CONTACTS = Array.from({ length: 20 }, (_, i) => `Contact ${i + 1}`)
const ROOM_ID = "PvtXCzoKafhTqo3x7Zdz"

export default function App() {
  const [activeContact, setActiveContact] = useState(CONTACTS[0])
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const messagesRef = collection(db, "rooms", ROOM_ID, "messages")
    const q = query(messagesRef, orderBy("timestamp", "asc"))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          type: data.senderId === auth.currentUser.uid ? "my" : "their",
          text: data.text,
          time: data.timestamp?.toDate().toLocaleTimeString() ?? ""
        }
      }) 
      setMessages(msgs)
      setLoading(false)
    })
      return unsubscribe
  }, [])

  async function handleSend(text) {
    const messagesRef = collection(db, "rooms", ROOM_ID, "messages")
    await addDoc(messagesRef, {
      text,
      senderId: auth.currentUser.uid,
      senderName: auth.currentUser.displayName,
      timestamp: serverTimestamp()
    })
  }

  return (
    <ProtectedRoute>
      <div className="app-container">
        <Sidebar
          contacts={CONTACTS}
          activeContact={activeContact}
          onSelectContact={setActiveContact}
        />
        {loading ? <p id="loading">Loading messages...</p> : (
        <ChatWindow
          activeContact={activeContact}
          messages={messages}
          onSend={handleSend}
        />
        )}
      </div>
    </ProtectedRoute>
  )
}

