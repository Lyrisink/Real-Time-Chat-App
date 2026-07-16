import { BrowserRouter, Routes, Route } from "react-router-dom"
import Sidebar from "./components/Sidebar"
import RoomView from "./components/RoomView"
import ProtectedRoute from "./components/ProtectedRoute"
import "./App.css"

export default function App() {
  return (
    <BrowserRouter>
      <ProtectedRoute>
        <div className="app-container">
          <Sidebar />
          <Routes>
            <Route path="/" element={<p id="loading">Select a room to start chatting</p>} />
            <Route path="/room/:roomId" element={<RoomView />} />
          </Routes>
        </div>
      </ProtectedRoute>
    </BrowserRouter>
  )
}