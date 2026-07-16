// // Purely presentational — no state, no hooks, no logic.
// // Receives props and returns markup. That's it.
// export default function MessageBubble({ type, text, time }) {
//   return (
//     // className is computed from the type prop — React's equivalent of classList.toggle()
//     <div className={type === "my" ? "my-message" : "their-message"}>
//       <p>{text}</p>
//       {/* && pattern: only renders the span if time exists.
//           Initial messages have no time field, so they show no timestamp.
//           Live-sent messages have time set in handleSend, so they do. */}
//       {time && <span>{time}</span>}
//     </div>
//   )
// }

export default function MessageBubble({ type, messageType, text, imageURL, time }) {
  return (
    <div className={type === "my" ? "my-message" : "their-message"}>
      {messageType === "image" ? (
        <img src={imageURL} alt="shared" className="message-image" />
      ) : (
        <p>{text}</p>
      )}
      {time && <span>{time}</span>}
    </div>
  )
}