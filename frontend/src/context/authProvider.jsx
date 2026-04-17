import { useState, useCallback, useMemo } from "react"
import { AuthContext } from "./AuthContext"

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token")
    return token ? { token } : null
  })

  const login = useCallback((token) => {
    localStorage.setItem("token", token)
    setUser({ token })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("token")
    setUser(null)
  }, [])

  const value = useMemo(() => ({
    user,
    login,
    logout
  }), [user, login, logout])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}