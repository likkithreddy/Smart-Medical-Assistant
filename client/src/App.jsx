import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Import pages
import Home from './pages/Home'
import Consultation from './pages/Consultation'
import History from './pages/History'
import Nearby from './pages/Nearby'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'

// Import shared components
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-100 text-gray-900">
        <Navbar />

        <main className="mt-16 flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/consultation" element={<Consultation />} />
            <Route path="/history" element={<History />} />
            <Route path="/nearby" element={<Nearby />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  )
}

export default App
