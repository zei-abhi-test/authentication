import { useState } from "react"

function ConnectionTest() {
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const testConnection = async () => {
    try {
      const res = await fetch("/api/test")

      const data = await res.json()

      setMessage(data.message)
      setError("")
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Connection failed")
      setMessage("")
    }
  }

  return (
    <div>
      <h2>Backend Connection Test</h2>

      <button onClick={testConnection}>
        Test Backend Connection
      </button>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </div>
  )
}

export default ConnectionTest