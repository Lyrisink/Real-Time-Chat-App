import MessageBubble from './MessageBubble'

function ChatWindow({ messages }) {
  return (
    <div className="message-area">
      {messages.map((msg, i) => (
        <MessageBubble key={i} text={msg.text} isSent={msg.isSent} />
      ))}
    </div>
  )
}

export default ChatWindow