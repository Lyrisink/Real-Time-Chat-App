// Owns search state locally (nothing else needs it).
// activeContact and onSelectContact come from App.jsx because ChatWindow also needs them.
import { useState } from "react"

export default function Sidebar({ contacts, activeContact, onSelectContact }) {

  const [search, setSearch] = useState("")

  // Derived data — just a variable, not state. Recomputed on every render automatically.
  // No useEffect needed; React's re-render handles recalculation when search changes.
  const filtered = contacts.filter(c =>
    c.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="sidebar">
      <h2>Chat-App</h2>

      <div className="searchbar">
        {/* Controlled input — same pattern as MessageInput */}
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
              key={contact} // contact names are unique so they're safe to use as keys
              // "active" class added conditionally via template literal + ternary
              className={`contact ${activeContact === contact ? "active" : ""}`}
              // Arrow function wrapper needed to pass contact as argument.
              // Without it, onClick would receive the event object instead.
              onClick={() => onSelectContact(contact)}
            >
              {contact}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}