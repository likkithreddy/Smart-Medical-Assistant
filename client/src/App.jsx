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
import SymptomChecker from './pages/SymptomChecker'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


// Import shared components
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-100 text-gray-900">
        <div className='fixed top-0 z-50 w-full'>
          <Navbar />
        </div>

        <main className=" flex-grow mt-14">
          <Routes>
            
            <Route path="/" element={<Home />} />
            <Route path="/symptom" element={<SymptomChecker />} />
            <Route path="/consultation" element={<Consultation />} />
            <Route path="/history" element={<History />} />
            <Route path="/nearby" element={<Nearby />} />
            <Route path="/profile" element={<Profile />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ToastContainer />
        </main>

        {/* <Footer /> */}
      </div>
    </Router>
  )
}

export default App
