function Sidebar() {
  const contacts = [
    'Contact 1', 'Contact 2', 'Contact 3',
    'Contact 4', 'Contact 5', 'Contact 6',
    'Contact 7', 'Contact 8', 'Contact 9', 'Contact 10' , 'Contact 11', 'Contact 12', 'Contact 13', 'Contact 14', 'Contact 15'
  ]

  return (
    <div className="sidebar">
      <h2>Chat-App</h2>
      <div className="searchbar">
        <input type="text" placeholder="Search..." />
      </div>
      <div className="contacts-list">
        <ul>
          {contacts.map(contact => (
            <li key={contact} className="contact">{contact}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Sidebar