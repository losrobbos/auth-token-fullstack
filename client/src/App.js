import "./App.css";
import axios from "axios";
import { useState } from "react";

axios.defaults.baseURL =
  process.env.REACT_APP_API_URL || "http://localhost:5000"; // = API URL

function App() {
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

  // fetch => for ALL sorts of grabbing data (json, html, files)
  // axios => specific for JSON apis => stringify under hood, content type

  const login = async () => {
    try {
      const response = await axios.post("/login", {
        email: "los@los.los",
        password: "los123",
      });
      console.log(response.data);
      setError("");
      setMessage(`Logged you in, ${response.data.user.email}`);
      setToken(response.data.token)
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
