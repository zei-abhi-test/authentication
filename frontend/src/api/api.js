// import axios from "axios"


// const API = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
//   timeout: 10000,
//   headers: {
//     "Content-Type": "application/json",
//   },
// })


// API.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token")

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }

//     return config
//   },
//   (error) => Promise.reject(error)
// )

// API.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
   
//       localStorage.removeItem("token")

//       window.location.href = "/login"
//     }

//     return Promise.reject(error)
//   }
// )

// export default API

//3.11

import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json"
  }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    return Promise.reject(err)
  }
)

export default api