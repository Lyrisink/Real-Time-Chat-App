import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import Sidebar from "./components/Sidebar"
import RoomView from "./components/RoomView"
import ProtectedRoute from "./components/ProtectedRoute"
import "./App.css"

function AppShell({ theme, toggleTheme }) {
  const location = useLocation()
  const isRoomOpen = location.pathname.startsWith("/room/")

  return (
    <div className={`app-container ${isRoomOpen ? "chat-open" : ""}`}>
      <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle theme">
        {theme === "dark" ? "☀️" : "🌙"}
      </button>
      <Sidebar mobileHidden={isRoomOpen} />
      <Routes>
        <Route path="/" element={<p id="loading">Select a room to start chatting</p>} />
        <Route path="/room/:roomId" element={<RoomView />} />
      </Routes>
    </div>
  )
}

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark")

  useEffect(() => {
    document.body.classList.toggle("light", theme === "light")
    localStorage.setItem("theme", theme)
  }, [theme])

  function toggleTheme() {
    setTheme(prev => (prev === "dark" ? "light" : "dark"))
  }

  return (
    <BrowserRouter>
      <ProtectedRoute>
        <AppShell theme={theme} toggleTheme={toggleTheme} />
      </ProtectedRoute>
    </BrowserRouter>
  )
}