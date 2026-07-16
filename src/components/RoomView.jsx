import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { db, auth } from "../firebase"
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore"
import ChatWindow from "./ChatWindow"
import { rtdb } from "../firebase"
import { ref, onValue } from "firebase/database"

export default function RoomView() {
  const { roomId } = useParams()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [roomName, setRoomName] = useState("")
  const [typingUsers, setTypingUsers] = useState([])

useEffect(() => {
  const typingRef = ref(rtdb, `/typing/${roomId}`)
  const unsubscribe = onValue(typingRef, (snapshot) => {
    const data = snapshot.val() || {}
    // data looks like: { uid1: "Piyush", uid2: false }
    // Keep only entries that are truthy (a name string) and not yourself
    const names = Object.entries(data)
      .filter(([uid, value]) => value && uid !== auth.currentUser.uid)
      .map(([, name]) => name)
    setTypingUsers(names)
  })
  return unsubscribe
}, [roomId])

  useEffect(() => {
    getDoc(doc(db, "rooms", roomId)).then(snap => {
      if (snap.exists()) setRoomName(snap.data().name)
    })
  }, [roomId])

  useEffect(() => {
    setLoading(true)
    const messagesRef = collection(db, "rooms", roomId, "messages")
    const q = query(messagesRef, orderBy("timestamp", "asc"))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          type: data.senderId === auth.currentUser.uid ? "my" : "their",
          text: data.text,
          time: data.timestamp?.toDate().toLocaleTimeString() ?? ""
        }
      })
      setMessages(msgs)
      setLoading(false)
    })
    return unsubscribe
  }, [roomId])

  async function handleSend(text) {
    const messagesRef = collection(db, "rooms", roomId, "messages")
    await addDoc(messagesRef, {
      text,
      senderId: auth.currentUser.uid,
      senderName: auth.currentUser.displayName,
      timestamp: serverTimestamp()
    })
  }

  if (loading) return <p id="loading">Loading messages...</p>

  return (
    <ChatWindow
      activeContact={roomName || "Room"}
      messages={messages}
      onSend={handleSend}
      roomId={roomId}
      typingUsers={typingUsers}
    />
  )
}