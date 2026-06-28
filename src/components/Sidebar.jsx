// Sidebar.jsx — The left panel of the app.
// Renders the app title, search bar, and the scrollable list of contacts.
// Owns one piece of local state (the search input), but the "which contact
// is selected" state lives in App.jsx — because the chat window also needs
// to know about it, and state must live in the common parent.

import { useState } from "react"

// Props destructured directly:
//   contacts        → the full array of contact name strings from App.jsx
//   activeContact   → the currently selected contact name, to highlight it
//   onSelectContact → function to call when a contact is clicked,
//                     which updates activeContact state back in App.jsx
export default function Sidebar({ contacts, activeContact, onSelectContact }) {

  // ---------------------------------------------------------------------------
  // STATE — the search input's current value
  // ---------------------------------------------------------------------------
  // This state is LOCAL to Sidebar — no other component cares what's being
  // searched, so there's no reason to lift it up to App.jsx.
  // Rule of thumb: state lives in the lowest component that needs it.
  // If only one component needs a piece of state, keep it there.
  const [search, setSearch] = useState("")

  // ---------------------------------------------------------------------------
  // DERIVED DATA — filtered contact list
  // ---------------------------------------------------------------------------
  // This is NOT state — it's a regular variable computed fresh on every render.
  // Whenever "search" state changes, Sidebar re-renders, and this line
  // re-runs automatically, producing a new filtered array.
  // No need for useEffect or extra state — React's re-render handles it.
  //
  // .filter() returns a new array containing only items where the callback returns true.
  // .toLowerCase() on both sides makes the search case-insensitive —
  // "contact" matches "Contact", "CONTACT", etc.
  // .includes() checks if the contact name contains the search string anywhere in it.
  const filtered = contacts.filter(c =>
    c.toLowerCase().includes(search.toLowerCase())
  )

  // ---------------------------------------------------------------------------
  // JSX
  // ---------------------------------------------------------------------------
  return (
    <div className="sidebar">

      {/* Static title — just a plain string, no dynamic data needed */}
      <h2>Chat-App</h2>

      {/* SEARCH BAR — another controlled input, same pattern as MessageInput.
          value={search} + onChange={e => setSearch(e.target.value)}
          keeps React state in sync with what the user types.
          Every keystroke updates "search", triggers a re-render,
          and the filtered array above is recomputed — instantly updating the list. */}
      <div className="searchbar">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* CONTACTS LIST — scrollable area defined in CSS with overflow-y: auto */}
      <div className="contacts-list">
        <ul>

          {/* Mapping over "filtered" (not the original "contacts") so the list
              automatically shrinks as the user types in the search box.
              When search is empty, filtered === all contacts (nothing filtered out).
              When search has text, filtered is only the matching subset. */}
          {filtered.map(contact => (
            <li
              // key={contact} works here because contact names are unique strings.
              // In the messages list we used msg.id because messages can have
              // identical text — names can't clash here so the name itself is a safe key.
              key={contact}

              // DYNAMIC CLASS with a template literal (backtick string).
              // Template literals let you embed expressions with ${}.
              // "contact" class is always present (base styles).
              // "active" class is conditionally added with a ternary —
              // if this contact is the selected one, add "active", otherwise add ""
              // (empty string = no extra class).
              // This is how React handles classList.toggle() from vanilla JS.
              className={`contact ${activeContact === contact ? "active" : ""}`}

              // onClick uses an arrow function wrapper: () => onSelectContact(contact)
              // This is necessary because we need to PASS the specific contact name
              // as an argument when it's clicked.
              // If we wrote onClick={onSelectContact} without the wrapper,
              // React would call onSelectContact(event) — passing the click event object
              // instead of the contact name, which is wrong.
              // The arrow function captures "contact" from the current loop iteration
              // via closure, so each <li> correctly remembers its own contact name.
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