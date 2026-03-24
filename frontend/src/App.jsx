import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"

import ProtectedRoute from "./components/ProtectedRoute"
import PublicRoute from "./components/PublicRoute"
import CreatePost from "./pages/CreatePost"

function App() {

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Navigate to="/login" />} />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-post"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App