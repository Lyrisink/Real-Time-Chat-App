import { auth, db } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

function Login() {
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    await setDoc(doc(db, "users", result.user.uid), { active: true }, { merge: true });
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