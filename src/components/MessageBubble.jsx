const emojiOnlyPattern = /^(\p{Extended_Pictographic}|\u200d|\ufe0f|\s)+$/u

export default function MessageBubble({ type, messageType, text, imageURL, time, senderName, showSenderName }) {
  const isEmojiOnly = messageType !== "image" && text && emojiOnlyPattern.test(text.trim())

  return (
    <div className={type === "my" ? "my-message" : "their-message"}>
      {type === "their" && showSenderName && senderName && (
        <span className="sender-name">{senderName}</span>
      )}
      {messageType === "image" ? (
        <img src={imageURL} alt="shared" className="message-image" />
      ) : (
        <p className={isEmojiOnly ? "emoji-only" : ""}>{text}</p>
      )}
      {time && <span>{time}</span>}
    </div>
  )
}