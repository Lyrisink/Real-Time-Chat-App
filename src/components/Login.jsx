import { auth, db } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, collection, query, where, getDocs, updateDoc, arrayUnion } from "firebase/firestore";

function Login() {
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    await setDoc(doc(db, "users", result.user.uid), { active: true }, { merge: true });

    // Auto-join the General room, if one exists
    const generalQuery = query(collection(db, "rooms"), where("isGeneral", "==", true));
    const snapshot = await getDocs(generalQuery);
    if (!snapshot.empty) {
      const generalRoomDoc = snapshot.docs[0];
      await updateDoc(doc(db, "rooms", generalRoomDoc.id), {
        members: arrayUnion(result.user.uid)
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Aurora</h1>
        <p>Sign in to continue</p>
        <button className="google-btn" onClick={handleLogin}>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default Login;