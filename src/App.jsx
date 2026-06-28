// Root component — holds shared state and wires the layout together.
import { useState } from "react"
import Sidebar from "./components/Sidebar"
import ChatWindow from "./components/ChatWindow"
import "./App.css"

// Defined outside the component so they're created once, not on every re-render.
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

  // These two are shared state — both Sidebar and ChatWindow need them,
  // so they live here in the common parent and are passed down as props.
  const [activeContact, setActiveContact] = useState(CONTACTS[0])
  const [messages, setMessages] = useState(INITIAL_MESSAGES)

  // Called by MessageInput (via ChatWindow) when the user sends a message.
  // Uses the functional update form of setMessages (prev => ...) to safely
  // build the new array on top of the latest state.
  // We spread the old array and append the new message — never mutate directly.
  function handleSend(text) {
    setMessages(prev => [
      ...prev,
      { id: Date.now(), type: "my", text, time: new Date().toLocaleTimeString() }
    ])
  }

  return (
    <div className="app-container">
      {/* setActiveContact passed directly — Sidebar calls it with the clicked contact name */}
      <Sidebar
        contacts={CONTACTS}
        activeContact={activeContact}
        onSelectContact={setActiveContact}
      />
      {/* handleSend passed as onSend — drills through ChatWindow down to MessageInput */}
      <ChatWindow
        activeContact={activeContact}
        messages={messages}
        onSend={handleSend}
      />
    </div>
  )
}