// App.jsx — The root component of the application.
// In React, every app has one top-level component that holds the shared state
// and renders the overall layout. This is that component.

// useState is a React "hook" — a special function that lets a component
// remember values between re-renders. Whenever state changes, React
// automatically re-renders the component (and its children) with the new value.
import { useState } from "react"

// Importing child components. React apps are built by composing smaller
// components together. App.jsx is the parent that connects them all.
import Sidebar from "./components/Sidebar"
import ChatWindow from "./components/ChatWindow"

// App.css is empty but imported here in case you want App-specific styles later.
// Global styles live in index.css instead.
import "./App.css"

// ---------------------------------------------------------------------------
// STATIC DATA (defined outside the component)
// ---------------------------------------------------------------------------
// This array lives OUTSIDE the component function on purpose.
// Data that never changes doesn't need to be inside — putting it outside
// means it's created once when the file loads, not recreated on every render.

// Array.from({ length: 20 }) creates an array of 20 empty slots.
// The second argument (_, i) is a mapping function — _ is the empty slot value
// (ignored), i is the index (0–19). We use i+1 to get "Contact 1" to "Contact 20".
const CONTACTS = Array.from({ length: 20 }, (_, i) => `Contact ${i + 1}`)

// The initial messages shown when the app first loads.
// Each message is an object with:
//   id   → unique identifier React uses to track items in a list (the "key")
//   type → "my" (right side, purple) or "their" (left side, dark)
//   text → the message content
// No "time" field here — time is only added to messages the user sends live.
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

// ---------------------------------------------------------------------------
// THE COMPONENT
// ---------------------------------------------------------------------------
// "export default" means this is the main thing this file exports.
// Other files can import it by any name, but conventionally use "App".
// It's a regular JavaScript function that returns JSX (the HTML-like syntax).
export default function App() {

  // STATE DECLARATION
  // useState(initialValue) returns an array of exactly two things:
  //   [currentValue, setterFunction]
  // We use array destructuring to name them directly.

  // Tracks which contact is currently selected in the sidebar.
  // Starts as the first contact ("Contact 1") by default.
  // When a contact is clicked, setActiveContact updates this,
  // causing App to re-render and pass the new value down to children.
  const [activeContact, setActiveContact] = useState(CONTACTS[0])

  // Tracks the full list of messages shown in the chat window.
  // Starts with INITIAL_MESSAGES. New messages get appended here via handleSend.
  // Every time this updates, ChatWindow re-renders with the new list.
  const [messages, setMessages] = useState(INITIAL_MESSAGES)

  // ---------------------------------------------------------------------------
  // EVENT HANDLERS
  // ---------------------------------------------------------------------------
  // This function is called by MessageInput (deep inside ChatWindow) when
  // the user hits Send or presses Enter. It receives the message text as argument.
  //
  // setMessages takes a function as argument here (called the "functional update" form).
  // prev → the current messages array at the moment of the update.
  // We spread all previous messages (...prev) and append the new one at the end.
  // This is the React way of "adding to an array" — we never mutate the original,
  // we always create a new array. React compares old vs new to detect the change.
  //
  // Date.now() generates a unique number (milliseconds since 1970) used as the id.
  // new Date().toLocaleTimeString() generates a readable time like "12:04:31 PM".
  function handleSend(text) {
    setMessages(prev => [
      ...prev,
      { id: Date.now(), type: "my", text, time: new Date().toLocaleTimeString() }
    ])
  }

  // ---------------------------------------------------------------------------
  // JSX (what this component renders)
  // ---------------------------------------------------------------------------
  // JSX looks like HTML but it's actually JavaScript. Each "tag" here is either
  // a real HTML element (lowercase, like <div>) or a React component (uppercase, like <Sidebar>).
  //
  // Props are how parent components pass data DOWN to children.
  // Think of them like function arguments for components.
  // The child receives them as a single "props" object, or we can destructure them directly.
  return (
    <div className="app-container"> {/* className instead of class — JSX uses JS names */}

      {/* SIDEBAR receives:
          - contacts: the full array to render the list
          - activeContact: so it knows which one to highlight
          - onSelectContact: a function it calls when user clicks a contact
            (passing setActiveContact directly — when Sidebar calls this, it updates App's state) */}
      <Sidebar
        contacts={CONTACTS}
        activeContact={activeContact}
        onSelectContact={setActiveContact}
      />

      {/* CHATWINDOW receives:
          - activeContact: to display the contact name in the header
          - messages: the array to render as message bubbles
          - onSend: the handleSend function above, called when user sends a message
            (this is "lifting state up" — the child triggers an action, the parent handles it) */}
      <ChatWindow
        activeContact={activeContact}
        messages={messages}
        onSend={handleSend}
      />

    </div>
  )
}