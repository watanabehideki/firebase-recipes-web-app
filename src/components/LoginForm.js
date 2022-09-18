import { useState } from "react"
import FirebaseAuthService from "../FirebaseAuthService"

function LoginForm({ existingUser }) {
  const [useName, setUserName] = useState("")
  const [passowrd, setPassword] = useState("")

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      await FirebaseAuthService.registerUser(useName, passowrd)
      setUserName("")
      setPassword("")
    } catch (error) {
      alert(error.message)
    }
  }

  function handleLogout() {
    FirebaseAuthService.loginUser()
  }
  return (
    <div className="login-form-container">
      {existingUser ? (
        <div className="row">
          <h3>Welcome, {existingUser.email}</h3>
          <button
            type="button"
            className="primary-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="login-form">
          <label className="input-label login-label">
            Username (email):
            <input
              type="email"
              required
              value={useName}
              onChange={ (e) => setUserName(e.target.value)}
              className="input-text"
            />
          </label>
          <label className="input-label login-label">
            Password:
            <input
              type="password"
              required
              value={passowrd}
              onChange={ (e) => setPassword(e.target.value)}
              className="input-text"
            />
          </label>
          <div className="button-box">
            <button type="submit" className="primary-button">Submit</button>
          </div>
        </form>
      )}
    </div>
  )
}

export default LoginForm
