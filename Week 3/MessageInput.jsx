function MessageInput({ onSend, value, onChange }) {
  function handleKeyDown(e) {
    if (e.key === 'Enter') onSend()
  }

  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type a message..."
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
      />
      <button onClick={onSend}>Send</button>
    </div>
  )
}

export default MessageInput