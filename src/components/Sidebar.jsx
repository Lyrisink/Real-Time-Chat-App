import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { signOut } from "firebase/auth"
import { auth } from "../firebase"


export default function Sidebar({ contacts, activeContact, onSelectContact }) {

  const [search, setSearch] = useState("")
  const { user } = useAuth()
  if (!user) return null;

  const filtered = contacts.filter(c =>
    c.toLowerCase().includes(search.toLowerCase())
  )

  return (
  <div className="sidebar">
    <div className="user-profile">
      <img src={user.photoURL} alt="profile" />
      <h3>{user.displayName}</h3>
    </div>

    <h2>Chat-App</h2>

    <div className="searchbar">
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
    </div>

    <div className="contacts-list">
      <ul>
        {filtered.map(contact => (
          <li
            key={contact}
            className={`contact ${activeContact === contact ? "active" : ""}`}
            onClick={() => onSelectContact(contact)}
          >
            {contact}
          </li>
        ))}
      </ul>
    </div>

    <button className="logout-btn" onClick={() => signOut(auth)}>
      Logout
    </button>
  </div>
)
}