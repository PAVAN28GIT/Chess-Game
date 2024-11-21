import React ,{useState} from "react";
import LeftSlide from "./LeftSlide";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { showToast } from "../../utils/toast";
import { userAuth } from "../../hooks/userAuth";
import BackendURL from '../../utils/config.js';

function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { handleLogIn} = userAuth();

  const handleSignIn = async(e) => {
    e.preventDefault();
    try {
      if (!email || !password) {
        return showToast('Please fill in all fields', 'error');
      }
      const userData = { email, password };
      await handleLogIn(userData );
    } catch (error) {
      console.error(error);
      showToast(error.message || 'An error occurred', 'error'); // Displaying error message
    }
  }

  const handleGoogleSignIn = async () => {
    try{
      window.location.href = `${BackendURL}/api/auth/google`;
    }catch(error){
      console.error(error);
      showToast(error.message || 'An error occurred', 'error');
    }
  };



  return (
    <div className="flex bg-[#f8f6ff] justify-center items-center h-screen">

      <LeftSlide />

      <div className=" w-1/2 px-10 text-black">
        <div className="flex flex-col items-center justify-center space-y-5">
          <h1 className="font-black text-5xl font-lato py-4">Welcome Back</h1>

          <button 
          onClick={handleGoogleSignIn}
          className="border-black w-full lg:w-1/2 border-2 rounded-xl flex items-center justify-center space-x-2 py-2 hover:bg-black hover:text-white transition hover:ease-in-out duration-150">
            <span className="text-2xl">
              <FcGoogle />
            </span>
            <span className="font-medium">Continue with Google</span>
          </button>
          <Divider />

          <div className="inputs w-full lg:w-1/2 pb-6 lg:pb-0 xl:pb-6 flex flex-col items-center space-y-2">
            <input
                
                className='border-2 w-full outline-none border-slate-500 p-3 px-4 mx-4 rounded-xl'
                placeholder='Enter the email'
                type='email' name='email'
                id='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                
                className='border-2 w-full outline-none border-slate-500  p-3 px-4 mx-4 rounded-xl'
                placeholder='Enter the password'
                type='password' name='password'
                id='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
          </div>

          <button
          onClick={handleSignIn}
           className="border-black w-full lg:w-1/2 border-2 rounded-xl flex items-center justify-center space-x-2 py-2 bg-black text-white hover:scale-105 duration-300 transition hover:ease-in-out">
            Sign in
          </button>
         
          <Link to="/sign-up" >
            No accout? <span className="font-bold hover:underline cursor-pointer ">Create an account</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;


const Divider = () => {
  return (
      <div className="or w-full lg:w-1/2 py-4 lg:py-0 xl:py-4 flex items-center space-x-4">
          <div className='w-full h-[0.075rem] bg-gray-700' />
          <div className='text-xl pb-1 font-semibold'>or</div>
          <div className='w-full h-[0.075rem] bg-gray-700' />
      </div>
  )
}
