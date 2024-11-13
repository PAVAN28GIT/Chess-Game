import React from 'react'
import SideBar from '../../components/SideBar'

function JoinGamePage() {
  return (
    <div className='h-screen w-full text-white '>
      <SideBar />

      <div className='ml-32 p-20'>
        here u shld send a request to server to find a opponent
        if found then take to chess board page
        else show loading untill opponent is found

      </div>


    </div>
  )
}

export default JoinGamePage