function MessageBubble({ text, isSent }) {
  return (
    <div className={isSent ? 'my-message' : 'their-message'}>
      <p>{text}</p>
    </div>
  )
}

export default MessageBubble