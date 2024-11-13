import React from 'react'
import { Link } from 'react-router-dom'


function Button({to , text ,icon}) {
  return (
    <div className="flex text-white items-center justify-center">
          <Link to={to}>
            <button className="transition group flex items-center justify-center bg-gradient-to-r from-purple-500 via-red-500 to-yellow-500 p-[1.8px] rounded-md hover:shadow-2xl hover:shadow-zinc-900">
       
            <div className="px-12 py-3 items-center justify-center rounded-md text-2xl font-ChakraPetch font-bold bg-zinc-900 transition duration-300 ease-in-out group-hover:bg-gradient-to-b group-hover:from-gray-700 group-hover:to-gray-900">
                <div className='flex gap-4 items-center'> {icon}  {text} </div>
                 <div className='font-thin text-sm'>Play with someone online! </div>
               
              </div>
            </button>
          </Link>
        </div>
   
  )
}

export default Button