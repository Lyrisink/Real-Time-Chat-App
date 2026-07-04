import { createContext, useContext, useEffect, useState } from "react"; 
import { auth, db } from "../firebase"; 
import { onAuthStateChanged } from "firebase/auth"; 
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

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