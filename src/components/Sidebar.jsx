import { useState, useEffect, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { signOut } from "firebase/auth"
import { auth, db } from "../firebase"
import { collection, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc, updateDoc, arrayUnion, query, where, setDoc } from "firebase/firestore"
import { rtdb } from "../firebase"
import { ref, onValue, set as rtdbSet } from "firebase/database"
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


export default function Sidebar({ mobileHidden }) {
  const [rooms, setRooms] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreatePopover, setShowCreatePopover] = useState(false)
  const [newRoomName, setNewRoomName] = useState("")
  const [selectedMembers, setSelectedMembers] = useState([])
  const { user } = useAuth()
  const navigate = useNavigate()
  const { roomId } = useParams() // reads roomId from current URL, if any
  const [allUsers, setAllUsers] = useState([])

  const [openMenuRoomId, setOpenMenuRoomId] = useState(null)
  const [addMembersMode, setAddMembersMode] = useState(false)
  const [membersToAdd, setMembersToAdd] = useState([])

  const createBtnRef = useRef(null)
  const popoverRef = useRef(null)
  const activeMenuWrapperRef = useRef(null)

useEffect(() => {
  getDocs(collection(db, "users")).then(snapshot => {
    const users = snapshot.docs
      .map(d => ({ uid: d.id, ...d.data() }))
      .filter(u => u.uid !== user?.uid) // don't show yourself in the list
      .filter(u => u.active !== false) // hide users who removed themselves as a member
    setAllUsers(users)
  })
}, [user])

useEffect(() => {
    if (!user) return
    const q = query(
      collection(db, "rooms"),
      where("members", "array-contains", user.uid)
    )
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRooms(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    })
    return unsubscribe
  }, [user])

  // Close the create-room popover on outside click or Escape
  useEffect(() => {
    if (!showCreatePopover) return

    function handleClickOutside(e) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target) &&
        createBtnRef.current &&
        !createBtnRef.current.contains(e.target)
      ) {
        setShowCreatePopover(false)
        setSelectedMembers([])
      }
    }

    function handleEscape(e) {
      if (e.key === "Escape") {
        setShowCreatePopover(false)
        setSelectedMembers([])
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [showCreatePopover])

  // Close the room ⋮ menu on outside click or Escape
  useEffect(() => {
    if (!openMenuRoomId) return

    function handleClickOutside(e) {
      if (
        activeMenuWrapperRef.current &&
        !activeMenuWrapperRef.current.contains(e.target)
      ) {
        closeRoomMenu()
      }
    }

    function handleEscape(e) {
      if (e.key === "Escape") {
        closeRoomMenu()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [openMenuRoomId])

  if (!user) return null;

  function closeRoomMenu() {
    setOpenMenuRoomId(null)
    setAddMembersMode(false)
    setMembersToAdd([])
  }

  function toggleRoomMenu(e, roomIdClicked) {
    e.stopPropagation() // prevents the click from also triggering navigate() on the <li>
    if (openMenuRoomId === roomIdClicked) {
      closeRoomMenu()
    } else {
      setOpenMenuRoomId(roomIdClicked)
      setAddMembersMode(false)
      setMembersToAdd([])
    }
  }

  function toggleMemberToAdd(uid) {
    setMembersToAdd(prev =>
      prev.includes(uid) ? prev.filter(id => id !== uid) : [...prev, uid]
    )
  }

  async function handleAddMembers(roomIdToUpdate) {
    if (membersToAdd.length === 0) return
    await updateDoc(doc(db, "rooms", roomIdToUpdate), {
      members: arrayUnion(...membersToAdd)
    })
    closeRoomMenu()
  }

  async function handleCreateRoom() {
    if (!newRoomName.trim()) return
    await addDoc(collection(db, "rooms"), {
      name: newRoomName.trim(),
      createdAt: serverTimestamp(),
      createdBy: user.uid,
      members: [user.uid, ...selectedMembers]
    })
    setNewRoomName("")
    setSelectedMembers([])
    setShowCreatePopover(false)
  }

  function toggleMember(uid) {
    setSelectedMembers(prev =>
      prev.includes(uid) ? prev.filter(id => id !== uid) : [...prev, uid]
    )
  }

  async function handleDeleteRoom(e, roomIdToDelete) {
  e.stopPropagation() // prevents the click from also triggering navigate() on the <li>
  const confirmed = window.confirm("Delete this room? This cannot be undone.")
  if (!confirmed) return

  await deleteDoc(doc(db, "rooms", roomIdToDelete))
  closeRoomMenu()

  if (roomId === roomIdToDelete) {
    navigate("/") // if you were viewing the room you just deleted, bounce back to the room list
  }
}

async function handleRemoveAsMember() {
    const confirmed = window.confirm(
      "Remove yourself as a member? You won't appear in anyone's member list or be addable to new rooms until you log in again."
    )
    if (!confirmed) return

    await setDoc(doc(db, "users", user.uid), { active: false }, { merge: true })
    await rtdbSet(ref(rtdb, `/status/${user.uid}`), "offline")
    await signOut(auth)
  }

  async function handleLogoutClick() {
    const confirmed = window.confirm("Log out?")
    if (!confirmed) return
    await rtdbSet(ref(rtdb, `/status/${user.uid}`), "offline")
    await signOut(auth)
  }

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className={`sidebar ${mobileHidden ? "mobile-hidden" : ""}`}>
      <div className="user-profile">
        <img src={user.photoURL} alt="profile" />
        <h3>{user.displayName}</h3>
      </div>

      <div className="app-brand">
        <img src="/logo-dark-nobg.png" alt="Aurora" className="brand-logo brand-logo-dark" />
        <img src="/logo-light-nobg.png" alt="Aurora" className="brand-logo brand-logo-light" />
        <span className="brand-name">Aurora</span>
      </div>

      <div className="searchbar new-room-bar">
        <input
          type="text"
          placeholder="Search rooms..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />

        <div className="create-room-wrapper">
          <button
            ref={createBtnRef}
            type="button"
            title="Create new room"
            onClick={() => setShowCreatePopover(prev => !prev)}
          >
            +
          </button>

          {showCreatePopover && (
            <div className="create-room-popover" ref={popoverRef}>
              <input
                type="text"
                autoFocus
                placeholder="Room name..."
                value={newRoomName}
                onChange={e => setNewRoomName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleCreateRoom()}
              />

              {allUsers.length > 0 && (
                <div className="member-picker">
                  <span className="member-picker-label">Add members</span>
                  <ul className="member-checkbox-list">
                    {allUsers.map(u => (
                      <li key={u.uid} className="member-checkbox-item">
                        <label>
                          <input
                            type="checkbox"
                            checked={selectedMembers.includes(u.uid)}
                            onChange={() => toggleMember(u.uid)}
                          />
                          <span>{u.name}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                type="button"
                className="popover-confirm-btn"
                onClick={handleCreateRoom}
              >
                Create
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="contacts-list">
        <ul>
          {filteredRooms.map(room => {
            const isMenuOpen = openMenuRoomId === room.id
            const nonMembers = isMenuOpen && addMembersMode
              ? allUsers.filter(u => !(room.members || []).includes(u.uid))
              : []

            return (
              <li
                key={room.id}
                className={`contact ${roomId === room.id ? "active" : ""}`}
                onClick={() => navigate(`/room/${room.id}`)}
              >
                <span className="room-name">{room.name}</span>

                <div
                  className="room-menu-wrapper"
                  onClick={e => e.stopPropagation()}
                  ref={isMenuOpen ? activeMenuWrapperRef : null}
                >
                  <button
                    type="button"
                    className="room-menu-btn"
                    title="Room options"
                    onClick={(e) => toggleRoomMenu(e, room.id)}
                  >
                    ⋮
                  </button>

                  {isMenuOpen && (
                    <div className="room-menu-dropdown">
                      {!addMembersMode ? (
                        <>
                          <button
                            type="button"
                            className="room-menu-item"
                            onClick={() => setAddMembersMode(true)}
                          >
                            Add members
                          </button>
                          <button
                            type="button"
                            className="room-menu-item danger"
                            onClick={(e) => handleDeleteRoom(e, room.id)}
                          >
                            Delete room
                          </button>
                        </>
                      ) : (
                        <div className="add-members-panel">
                          {nonMembers.length === 0 ? (
                            <span className="member-picker-empty">
                              Everyone's already in this room
                            </span>
                          ) : (
                            <ul className="member-checkbox-list">
                              {nonMembers.map(u => (
                                <li key={u.uid} className="member-checkbox-item">
                                  <label>
                                    <input
                                      type="checkbox"
                                      checked={membersToAdd.includes(u.uid)}
                                      onChange={() => toggleMemberToAdd(u.uid)}
                                    />
                                    <span>{u.name}</span>
                                  </label>
                                </li>
                              ))}
                            </ul>
                          )}
                          <button
                            type="button"
                            className="popover-confirm-btn"
                            disabled={membersToAdd.length === 0}
                            onClick={() => handleAddMembers(room.id)}
                          >
                            Add
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </li>
            )
          })}
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

      <div className="sidebar-footer-actions">
        <button className="logout-btn" onClick={handleLogoutClick}>
          Logout
        </button>
        <button
          className="remove-member-btn"
          onClick={handleRemoveAsMember}
          title="Remove me as a member"
        >
          ✕
        </button>
      </div>
    </div>
  )
}