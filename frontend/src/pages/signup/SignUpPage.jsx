import React from "react";
import LeftSlide from "./LeftSlide";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";

function SignUpPage() {
  return (
    <div className="flex bg-[#f8f6ff] justify-center items-center">
      <LeftSlide />

      <div className=" w-1/2 px-10 text-black">
        <div className="flex flex-col items-center justify-center space-y-5">
          <h1 className="font-black text-5xl font-lato py-4">Create an Account</h1>

          <button className="border-black w-full lg:w-1/2 border-2 rounded-xl flex items-center justify-center space-x-2 py-2 hover:bg-black hover:text-white transition hover:ease-in-out duration-150">
            <span className="text-2xl">
              <FcGoogle />
            </span>
            <span className="font-medium">Continue with Google</span>
          </button>
          <Divider />

          <div className="inputs w-full lg:w-1/2 pb-6 lg:pb-0 xl:pb-6 flex flex-col items-center space-y-2">
          <input
                
                className='border-2 w-full outline-none border-slate-500 p-3 px-4 mx-4 rounded-xl'
                placeholder='Enter Name'
                type='text' name='text'
                id='name'
                required
            />
            <input
                
                className='border-2 w-full outline-none border-slate-500 p-3 px-4 mx-4 rounded-xl'
                placeholder='Enter the email'
                type='email' name='email'
                id='email'
                required
            />
            <input
                
                className='border-2 w-full outline-none border-slate-500  p-3 px-4 mx-4 rounded-xl'
                placeholder='Enter the password'
                type='password' name='password'
                id='password'
                required
            />
          </div>

          <button className="border-black w-full lg:w-1/2 border-2 rounded-xl flex items-center justify-center space-x-2 py-2 bg-black text-white hover:scale-105 duration-300 transition hover:ease-in-out">
            Create Account
          </button>
         

          
          <Link to="/sign-in">
            Already have an account? <span className="font-bold hover:underline cursor-pointer ">Sign in</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage


const Divider = () => {
  return (
      <div className="or w-full lg:w-1/2 py-4 lg:py-0 xl:py-4 flex items-center space-x-4">
          <div className='w-full h-[0.075rem] bg-gray-700' />
          <div className='text-xl pb-1 font-semibold'>or</div>
          <div className='w-full h-[0.075rem] bg-gray-700' />
      </div>
  )
}
