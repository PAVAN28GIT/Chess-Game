import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import SignInPage from './pages/signin/SignInPage'
import SignUpPage from './pages/signup/SignUpPage'
import NoPage from './pages/NoPage/NoPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import LandingPage from './pages/LandingPage/LandingPage'
import JoinGamePage from './pages/gamePage/JoinGamePage'
import ProfilePage from './pages/profilePage/ProfilePage'
import PlayPage from './pages/gamePage/PlayPage'


function App() { 
  return (
    <div>
      <Toaster />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path='/sign-up' element={<SignUpPage />} />
 
 
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/user/:userid" element={<ProfilePage />} />

        <Route path="/game/join" element={<JoinGamePage />} />
        <Route path="/game/:gameId" element={<PlayPage />} />

        {/*
        <Route path="/games/history" element={<GameHistoryPage />} />
        <Route path="/settings" element={<SettingsPage />} /> */}

        <Route path='*' element={<NoPage />} />
      </Routes>
    </div>
  )
}

export default App
