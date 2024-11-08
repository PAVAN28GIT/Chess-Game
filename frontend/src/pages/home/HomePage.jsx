import React from 'react'

import SideBar from '../../components/SideBar'
import Hero from './Hero'

function HomePage() {
  return (
    <div className="w-full h-screen flex fixed bg-black">
      <SideBar />
      <Hero />
     
    </div>
  )
}

export default HomePage