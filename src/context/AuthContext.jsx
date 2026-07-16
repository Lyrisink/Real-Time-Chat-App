import { createContext, useContext, useEffect, useState } from "react"; 
import { auth, db, rtdb } from "../firebase"; 
import { onAuthStateChanged } from "firebase/auth"; 
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, onDisconnect, set } from "firebase/database";

const AuthContext = createContext(); 
export const useAuth = () => useContext(AuthContext); 
export const AuthProvider = ({ children }) => { 
 
 const [user, setUser] = useState(null); 
 
 useEffect(() => { 
 
   const unsubscribe = 
     onAuthStateChanged(auth, (currentUser) => { 
       setUser(currentUser);

       if (currentUser) {
          setDoc(doc(db, "users", currentUser.uid), {
            name: currentUser.displayName,
            photoURL: currentUser.photoURL,
            email: currentUser.email,
            lastSeen: serverTimestamp(),
          }, { merge: true });

          // --- Presence: mark this user online in RTDB ---
          const statusRef = ref(rtdb, `/status/${currentUser.uid}`);
          set(statusRef, "online");

          // Tell the RTDB server: if this client disconnects (closes tab,
          // crashes, loses network), YOU set this to "offline" — no client
          // code needs to run for this to fire.
          onDisconnect(statusRef).set("offline");
        }
     }); 
 
   return unsubscribe; 
 
 }, []); 
 
 return ( 
   <AuthContext.Provider value={{ user }}> 
     {children} 
   </AuthContext.Provider> 
 ); 
};