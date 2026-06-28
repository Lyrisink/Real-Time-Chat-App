// MessageBubble.jsx — A single chat message bubble.
// This is the simplest component in the app — a "presentational" component,
// meaning it has no state, no effects, no logic of its own.
// Its only job is to receive data via props and return the correct markup.
// These are sometimes called "dumb components" — they just display what they're given.

// Notice there are no imports here beyond the default React JSX transform.
// No useState, no useEffect needed — this component is purely a function
// that takes props in and returns JSX out. That's the simplest a component can be.

// Props destructured directly:
//   type → "my" or "their", determines alignment and color (via CSS classes)
//   text → the message string to display
//   time → optional timestamp string, only present on messages sent live
export default function MessageBubble({ type, text, time }) {
  return (

    // DYNAMIC CLASS NAME using a ternary operator inside curly braces.
    // A ternary is: condition ? valueIfTrue : valueIfFalse
    // So if type === "my", className becomes "my-message" (right side, purple)
    // Otherwise it becomes "their-message" (left side, dark)
    // This is how React conditionally applies CSS — you compute the class name
    // as a JavaScript expression rather than toggling classes on a DOM element
    // like you would with classList.add/remove in vanilla JS.
    <div className={type === "my" ? "my-message" : "their-message"}>

      {/* The message text — straightforward, just render the prop value */}
      <p>{text}</p>

      {/* CONDITIONAL RENDERING — the && (short-circuit) pattern.
          In JavaScript, (A && B) evaluates to B only if A is truthy.
          If A is falsy, the whole expression is falsy and React renders nothing.
          
          So {time && <span>{time}</span>} means:
            - If time exists (truthy) → render the <span> with the timestamp
            - If time is undefined (falsy) → render nothing at all
          
          This is why initial messages (which have no "time" field) show no timestamp,
          while messages sent live (which have time set in handleSend) do show one.
          
          This is the React equivalent of an if-statement inside JSX —
          you can't use a regular if/else directly inside JSX markup,
          so && and ternaries are the standard patterns instead. */}
      {time && <span>{time}</span>}

    </div>
  )
}