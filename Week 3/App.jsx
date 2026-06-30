import { useState } from 'react'
import Sidebar from './components/Sidebar'
import ChatWindow from './components/ChatWindow'
import MessageInput from './components/MessageInput'

function App() {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')

  function handleSend() {
    if (!inputValue.trim()) return
    setMessages([...messages, { text: inputValue, isSent: true }])
    setInputValue('')
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="chat-area">
        <div className="chat-header"><h2>Contact 1</h2></div>
        <ChatWindow messages={messages} />
        <MessageInput
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onSend={handleSend}
        />
      </div>
    </div>
  )
}

export default App