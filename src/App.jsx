import { useState } from "react"
import Sidebar from "./components/Sidebar"
import ChatWindow from "./components/ChatWindow"
import ProtectedRoute from "./components/ProtectedRoute"
import "./App.css"

const CONTACTS = Array.from({ length: 20 }, (_, i) => `Contact ${i + 1}`)

const INITIAL_MESSAGES = [
  { id: 1, type: "their", text: "This is a message from Contact 1." },
  { id: 2, type: "my", text: "This is a message from me." },
  { id: 3, type: "their", text: "This is a message from Contact 1." },
  { id: 4, type: "my", text: "This is a message from me." },
  { id: 5, type: "their", text: "This is a message from Contact 1." },
  { id: 6, type: "my", text: "This is a message from me." },
  { id: 7, type: "their", text: "This is a message from Contact 1." },
  { id: 8, type: "my", text: "This is a message from me." },
  { id: 9, type: "their", text: "This is a message from Contact 1." },
  { id: 10, type: "my", text: "This is a message from me." },
  { id: 11, type: "their", text: "This is a message from Contact 1." },
  { id: 12, type: "my", text: "This is a message from me." },
]

export default function App() {
  const [activeContact, setActiveContact] = useState(CONTACTS[0])
  const [messages, setMessages] = useState(INITIAL_MESSAGES)

  function handleSend(text) {
    setMessages(prev => [
      ...prev,
      { id: Date.now(), type: "my", text, time: new Date().toLocaleTimeString() }
    ])
  }

  return (
    <ProtectedRoute>
      <div className="app-container">
        <Sidebar
          contacts={CONTACTS}
          activeContact={activeContact}
          onSelectContact={setActiveContact}
        />
        <ChatWindow
          activeContact={activeContact}
          messages={messages}
          onSend={handleSend}
        />
      </div>
    </ProtectedRoute>
  )
}

