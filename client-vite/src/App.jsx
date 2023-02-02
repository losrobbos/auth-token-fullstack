import "./App.css";
import axios from "axios";
import { useState } from "react";

axios.defaults.baseURL =
  import.meta.env.VITE_API_URL || "http://localhost:5000"; // = API URL

function App() {
  const [emailSignup, setEmailSignup] = useState("");
  const [pwSignup, setPwSignup] = useState("");
  const [emailLogin, setEmailLogin] = useState("");
  const [pwLogin, setPwLogin] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const showError = (err) => {
    if (err.response) {
      const errorMsg = err.response.data.error;
      setError(errorMsg);
    } else {
      setError("API not available...");
    }
  };

  const signup = async () => {
    try {
      const response = await axios.post("/signup", { email: emailSignup, password: pwSignup });
      const user = response.data;
      console.log(user);
      setError("");
      setMessage(`Signed you up, ${user.email}`);
      setEmailSignup("");
      setPwSignup("");
    } catch (err) {
      showError(err);
    }
  };

  // fetch => for ALL sorts of grabbing data (json, html, files)
  // axios => specific for JSON apis => stringify under hood, content type
  const login = async () => {
    try {
      const response = await axios.post("/login", { email: emailLogin, password: pwLogin });
      const data = response.data;
      console.log(data);
      setError("");
      setToken(data.token);
      setMessage(`Logged you in, ${data.user.email}`);
      setEmailLogin("")
      setPwLogin("")
    } catch (err) {
      showError(err);
    }
  };

  const getSecret = async () => {
    try {
      const response = await axios.get("/secret", {
        headers: {
          Authorization: token,
        },
      });
      setError("");
      setMessage(response.data.message);
    } catch (err) {
      showError(err);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <form>
          <h2>Signup</h2>
          <input
            type="text"
            placeholder="Email..."
            onChange={(e) => setEmailSignup(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password..."
            onChange={(e) => setPwSignup(e.target.value)}
          />
          <button type="button" onClick={signup}>Signup</button>
        </form>

        <form>
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Email..."
            onChange={(e) => setEmailLogin(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password..."
            onChange={(e) => setPwLogin(e.target.value)}
          />
          <button type="button" onClick={login}>Login</button>
        </form>

        <div className="secret">
          <button onClick={getSecret}>Show secret</button>
        </div>
        {error ? (
          <div className="error">{error}</div>
        ) : (
          <div className="result">{message}</div>
        )}
      </header>
    </div>
  );
}

export default App;
