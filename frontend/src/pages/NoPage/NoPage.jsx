import React from 'react'


function NoPage() {
  return (
    <div className="h-screen w-full bg-center bg-zinc-900 flex items-center justify-center">

      <div className="w-3/4 h-screen bg-[url('/images/404.jpg')] bg-contain bg-center">
        <div className="absolute inset-0 bg-black opacity-30"></div>
      </div>
    </div>
  )
}

export default NoPage