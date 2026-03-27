import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './Home'
import Layout from './layout'
import Login from './pages/auth/Login'
import Create from './pages/posts/Create'
import Edit from './pages/posts/[id]/Edit'
import Show from './pages/posts/[id]/Show'
import Register from './pages/auth/Register'
import UserProfile from './pages/profile/UserProfile'
import EditProfile from './pages/profile/EditProfile'
import { getAuthToken } from './services/api'
import AboutUs from './pages/about/AboutUs'

function ProtectedRoute({ children }) {
  const token = getAuthToken()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<AboutUs />} />
        <Route path="create" element={<Create />} />
        <Route
          path="/me"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/me/edit"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route path="posts/:id" element={<Show />} />
        <Route path="posts/:id/edit" element={<Edit />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App