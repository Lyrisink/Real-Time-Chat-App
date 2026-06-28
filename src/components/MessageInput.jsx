// MessageInput.jsx — The text field and Send button at the bottom of the chat.
// This component owns the local state of what the user is currently typing.
// It's the only component that needs to know the draft text — once sent,
// it passes the final value up to App.jsx and forgets it entirely.

// useState needed here to track what the user is typing in real time.
import { useState } from "react"

// Only one prop received:
//   onSend → the handleSend function from App.jsx, passed down through ChatWindow.
//            When called with a text string, it appends a new message to the list.
export default function MessageInput({ onSend }) {

  // ---------------------------------------------------------------------------
  // STATE — the current value of the text input
  // ---------------------------------------------------------------------------
  // Starts as an empty string (input is empty on load).
  // Every keystroke updates this via onChange, keeping React in sync
  // with what's visible in the input field.
  // This is called a "controlled input" — React controls the input's value,
  // rather than the DOM holding it independently like in vanilla JS.
  const [value, setValue] = useState("")

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------
  function handleSend() {

    // .trim() removes leading/trailing whitespace.
    // Stored in a local variable because we need to check it before using it.
    const text = value.trim()

    // Guard clause — if the trimmed text is empty (user hit Send on blank input),
    // do nothing and exit early. The "return" with no value just exits the function.
    // This is the React equivalent of the vanilla JS "if (!text) return" pattern — identical logic.
    if (!text) return

    // Call the function passed down from App.jsx with the message text.
    // This triggers setMessages in App.jsx, which appends the new message
    // and causes ChatWindow to re-render with the updated list.
    // MessageInput itself doesn't know or care what onSend does internally —
    // it just calls it with the text. This separation is intentional.
    onSend(text)

    // Reset the input back to empty after sending.
    // Because this is a controlled input (value={value}), setting state to ""
    // automatically clears what's visible in the field.
    // In vanilla JS this was input.value = '' — direct DOM mutation.
    // Here we update state and React syncs the DOM for us.
    setValue("")
  }

  // Keyboard handler — lets the user send by pressing Enter instead of clicking Send.
  // e is the keyboard event object, automatically passed by React to any onKeyDown handler.
  // e.key is a string representing which key was pressed ("Enter", "Escape", "a", etc.)
  // If it's Enter, we just call the same handleSend function — no duplication of logic.
  function handleKeyDown(e) {
    if (e.key === "Enter") handleSend()
  }

  // ---------------------------------------------------------------------------
  // JSX
  // ---------------------------------------------------------------------------
  return (
    <div className="input">

      <input
        type="text"
        id="message-input"
        placeholder="Type a message..."

        // THE CONTROLLED INPUT PATTERN — two parts that always go together:
        //
        // value={value}
        //   Binds the input's displayed content to the React state variable.
        //   The input now shows exactly what "value" holds — React is in charge.
        //   Without this, the input would manage its own value internally (uncontrolled),
        //   and React wouldn't know what the user typed without querying the DOM.
        //
        // onChange={e => setValue(e.target.value)}
        //   Fires on every single keystroke.
        //   e.target is the input DOM element, e.target.value is its current text.
        //   We call setValue to update state, which triggers a re-render,
        //   which updates value={value}, which updates the displayed text.
        //   This cycle happens so fast it feels instant to the user.
        //   Without onChange, the input would appear frozen — you couldn't type anything,
        //   because React would keep resetting it to the unchanged state value.
        value={value}
        onChange={e => setValue(e.target.value)}

        // Attaches the keyboard listener. React passes the event object (e) automatically.
        // This replaces addEventListener('keydown', fn) from vanilla JS.
        onKeyDown={handleKeyDown}
      />

      {/* onClick calls handleSend directly — no event object needed here
          since we don't care which mouse button was clicked or any other event detail,
          just that a click happened. */}
      <button onClick={handleSend}>Send</button>

    </div>
  )
}