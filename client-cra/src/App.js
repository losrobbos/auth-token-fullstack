import "./App.css";
import axios from "axios";
import { useState } from "react";

axios.defaults.baseURL =
  process.env.REACT_APP_API_URL || "http://localhost:5000"; // = API URL

function App() {
  const [email, setEmail] = useState("")
  const [pw, setPw] = useState("")
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
      const response = await axios.post("/signup", { email, password: pw });
      const user = response.data
      console.log(user);
      setError("");
      setMessage(`Signed you up, ${user.email}`);
      setEmail("")
      setPw("")
    } catch (err) {
      showError(err);
    }
  }

  // fetch => for ALL sorts of grabbing data (json, html, files)
  // axios => specific for JSON apis => stringify under hood, content type
  const login = async () => {
    try {
      const response = await axios.post("/login", { email, password: pw });
      const data = response.data
      console.log(data);
      setError("");
      setMessage(`Logged you in, ${data.user.email}`);
      setToken(data.token)
    } catch (err) {
      showError(err);
    }
  };

  const getSecret = async () => {
    try {
      const response = await axios.get("/secret", {
        headers: {
          Authorization: token
        }
      } );
      setError("");
      setMessage(response.data.message);
    } catch (err) {
      showError(err);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <h2>Signup</h2>
          <input
            type="text"
            placeholder="Email..."
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password..."
            onChange={(e) => setPw(e.target.value)}
          />
          <button onClick={signup}>Signup</button>
        </div>
        <div>
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Email..."
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password..."
            onChange={(e) => setPw(e.target.value)}
          />
          <button onClick={login}>Login</button>
        </div>
        <div>
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
