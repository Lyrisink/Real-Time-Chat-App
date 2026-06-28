// ChatWindow.jsx — The right panel of the app.
// Responsible for rendering the chat header, the scrollable message list,
// and the message input bar at the bottom.
// It doesn't manage any state of its own — it receives everything it needs
// from App.jsx via props and passes them further down to its children.

// useEffect: a hook that runs code AFTER React has rendered/updated the DOM.
// We need this for scrolling because we can't scroll to an element
// that doesn't exist yet — we have to wait for React to paint it first.
//
// useRef: a hook that gives us a direct reference to a real DOM element.
// Unlike state, changing a ref does NOT trigger a re-render.
// It's React's escape hatch for when you need to touch the DOM directly
// (scrolling, focusing an input, measuring element size, etc.)
import { useEffect, useRef } from "react"

// Child components this component is responsible for rendering.
import MessageBubble from "./MessageBubble"
import MessageInput from "./MessageInput"

// Props destructured directly in the function signature (cleaner than writing props.activeContact etc.):
//   activeContact → the name string to show in the header ("Contact 1" etc.)
//   messages      → the array of message objects to render as bubbles
//   onSend        → the handleSend function from App.jsx, passed through to MessageInput
export default function ChatWindow({ activeContact, messages, onSend }) {

  // ---------------------------------------------------------------------------
  // REF — a direct pointer to the message area DOM element
  // ---------------------------------------------------------------------------
  // useRef(null) creates a ref object: { current: null }
  // Initially null because the DOM doesn't exist yet during the first render.
  // Once React renders the <div ref={messageAreaRef}> below, it automatically
  // sets messageAreaRef.current to that real DOM node.
  // From that point on, messageAreaRef.current gives us the actual div element,
  // just like document.querySelector('.message-area') would in vanilla JS.
  const messageAreaRef = useRef(null)

  // ---------------------------------------------------------------------------
  // EFFECT — auto-scroll to the bottom whenever messages change
  // ---------------------------------------------------------------------------
  // useEffect(fn, [dependencies]) runs fn after every render where
  // one of the dependencies has changed.
  //
  // The dependency here is [messages] — so this effect runs:
  //   1. Once after the very first render (initial mount)
  //   2. Every time the messages array gets a new item added
  //
  // Without the dependency array, it would run after EVERY render (too often).
  // With an empty dependency array [], it would run only once on mount (not enough).
  // [messages] is exactly right — run whenever new messages arrive.
  useEffect(() => {

    // Guard check: messageAreaRef.current could still be null
    // if somehow the effect runs before the DOM is ready (rare but safe practice).
    if (messageAreaRef.current) {

      // This is the vanilla JS scroll trick, now used through the ref.
      // scrollHeight = total height of all content inside the div (including overflow)
      // scrollTop    = how far down the div is currently scrolled
      // Setting scrollTop = scrollHeight jumps the scroll position to the very bottom,
      // which makes the latest message visible — exactly what scrollIntoView() did in vanilla.
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight
    }
  }, [messages]) // ← dependency array: re-run this effect when messages changes

  // ---------------------------------------------------------------------------
  // JSX
  // ---------------------------------------------------------------------------
  return (
    <div className="chat-area"> {/* Flex column container — grows to fill remaining width */}

      {/* HEADER — displays the active contact's name.
          {activeContact} is a JSX expression — curly braces let you embed
          any JavaScript value directly into the markup.
          When activeContact state changes in App.jsx, this re-renders automatically. */}
      <div className="chat-header">
        <h2>{activeContact}</h2>
      </div>

      {/* MESSAGE AREA — the scrollable list of bubbles.
          ref={messageAreaRef} is what connects the useRef hook to this real DOM element.
          After render, messageAreaRef.current === this div node. */}
      <div className="message-area" ref={messageAreaRef}>

        {/* .map() transforms each message object in the array into a MessageBubble component.
            This is the standard React pattern for rendering lists —
            instead of manually creating and appending DOM elements like in vanilla JS,
            you just describe what one item looks like and map over the data.

            key={msg.id} is REQUIRED by React for list items.
            React uses keys to efficiently figure out which items changed, were added,
            or were removed between renders — without keys it would re-render the entire
            list from scratch every time, which is slow.
            Keys must be unique among siblings (msg.id guarantees this). */}
        {messages.map(msg => (
          <MessageBubble
            key={msg.id}       // React's internal tracker — NOT passed as a prop to MessageBubble
            type={msg.type}    // "my" or "their" — determines which CSS class and side to use
            text={msg.text}    // The message content
            time={msg.time}    // Timestamp (only present on messages sent live, undefined on initial ones)
          />
        ))}

      </div>

      {/* MESSAGE INPUT — the text field and send button.
          onSend is passed straight through from App.jsx.
          ChatWindow doesn't need to know what onSend does —
          it just hands it to MessageInput, which calls it when the user sends.
          This is called "prop drilling" — passing props through an intermediate
          component that doesn't use them itself, just passes them along. */}
      <MessageInput onSend={onSend} />

    </div>
  )
}