import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import SignInPage from './pages/signin/SignInPage'
import SignUpPage from './pages/signup/SignUpPage'
import HomePage from './pages/home/HomePage'
import NoPage from './pages/NoPage/NoPage'

function App() {

  return (
    <div>
      <Toaster />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path='/sign-up' element={<SignUpPage />} />
   
        <Route path='*' element={<NoPage />} />
      </Routes>
    
    </div>
      
  )
}

export default App
