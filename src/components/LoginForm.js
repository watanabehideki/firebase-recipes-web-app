import { useState } from "react"
import FirebaseAuthService from "../FirebaseAuthService"

function LoginForm({ existingUser }) {
  const [useName, setUserName] = useState("")
  const [passowrd, setPassword] = useState("")

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      await FirebaseAuthService.loginUser(useName, passowrd)
      setUserName("")
      setPassword("")
    } catch (error) {
      alert(error.message)
    }
  }

  function handleLogout() {
    FirebaseAuthService.loginUser()
  }

  async function handleSendResetPasswordEmail() {
    if (!useName) {
      alert("Missing username!")
      return
    }

    try {
      await FirebaseAuthService.sendPasswordResetEmail(useName)
      alert("sent the password reset email")
    } catch (error) {
      alert(error.message)
    }
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
              onChange={(e) => setUserName(e.target.value)}
              className="input-text"
            />
          </label>
          <label className="input-label login-label">
            Password:
            <input
              type="password"
              required
              value={passowrd}
              onChange={(e) => setPassword(e.target.value)}
              className="input-text"
            />
          </label>
          <div className="button-box">
            <button type="button" className="primary-button">
              Login
            </button>
            <button
              type="button"
              onClick={handleSendResetPasswordEmail}
              className="primary-button"
            >
              Reset Password
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default LoginForm
