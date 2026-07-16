import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { signOut } from "firebase/auth"
import { auth, db } from "../firebase"
import { collection, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from "firebase/firestore"
import { rtdb } from "../firebase"
import { ref, onValue } from "firebase/database"
import { getDocs } from "firebase/firestore"


function UserStatusDot({ uid }) {
  const [isOnline, setIsOnline] = useState(false)

  useEffect(() => {
    const statusRef = ref(rtdb, `/status/${uid}`)
    const unsubscribe = onValue(statusRef, (snapshot) => {
      setIsOnline(snapshot.val() === "online")
    })
    return unsubscribe
  }, [uid])

  return <span className={`status-dot ${isOnline ? "online" : "offline"}`} />
}


export default function Sidebar() {
  const [rooms, setRooms] = useState([])
  const [newRoomName, setNewRoomName] = useState("")
  const { user } = useAuth()
  const navigate = useNavigate()
  const { roomId } = useParams() // reads roomId from current URL, if any
  const [allUsers, setAllUsers] = useState([])

useEffect(() => {
  getDocs(collection(db, "users")).then(snapshot => {
    const users = snapshot.docs
      .map(d => ({ uid: d.id, ...d.data() }))
      .filter(u => u.uid !== user?.uid) // don't show yourself in the list
    setAllUsers(users)
  })
}, [user])

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "rooms"), (snapshot) => {
      setRooms(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    })
    return unsubscribe
  }, [])

  if (!user) return null;



  async function handleCreateRoom() {
    if (!newRoomName.trim()) return
    await addDoc(collection(db, "rooms"), {
      name: newRoomName.trim(),
      createdAt: serverTimestamp()
    })
    setNewRoomName("")
  }

  async function handleDeleteRoom(e, roomIdToDelete) {
  e.stopPropagation() // prevents the click from also triggering navigate() on the <li>
  const confirmed = window.confirm("Delete this room? This cannot be undone.")
  if (!confirmed) return

  await deleteDoc(doc(db, "rooms", roomIdToDelete))

  if (roomId === roomIdToDelete) {
    navigate("/") // if you were viewing the room you just deleted, bounce back to the room list
  }
}

  return (
    <div className="sidebar">
      <div className="user-profile">
        <img src={user.photoURL} alt="profile" />
        <h3>{user.displayName}</h3>
      </div>

      <h2>Chat-App</h2>

      <div className="searchbar new-room-bar">
        <input
          type="text"
          placeholder="New room name..."
          value={newRoomName}
          onChange={e => setNewRoomName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleCreateRoom()}
        />
        <button onClick={handleCreateRoom}>+</button>
      </div>

      <div className="contacts-list">
        <ul>
          {rooms.map(room => (
            <li
              key={room.id}
              className={`contact ${roomId === room.id ? "active" : ""}`}
              onClick={() => navigate(`/room/${room.id}`)}
            >
              <span className="room-name">{room.name}</span>
              <button
                className="delete-room-btn"
                onClick={(e) => handleDeleteRoom(e, room.id)}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="online-users">
        <h4>Members</h4>
        <ul>
          {allUsers.map(u => (
            <li key={u.uid} className="online-user-item">
              <UserStatusDot uid={u.uid} />
              <span>{u.name}</span>
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