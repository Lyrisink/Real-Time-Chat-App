import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

function Login() {
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Chat-App</h1>
        <p>Sign in to continue</p>
        <button className="google-btn" onClick={handleLogin}>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default Login;