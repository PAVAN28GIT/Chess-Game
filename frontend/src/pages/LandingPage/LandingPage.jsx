import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/SideBar";
import { AuthContext } from "../../context/AuthContext";

function LandingPage() {
  const { user } = useContext(AuthContext);
  return (
    <div className="h-screen">
      <Sidebar />
      <div className="slow-appear-logo flex items-center justify-center w-full h-full bg-cover bg-center bg-[url('/images/chess-her.png')] relative">
        <div className="absolute inset-0 bg-black opacity-60"></div>

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-20 py-16 space-y-3">
          <h1 className="text-6xl sm:text-8xl font-extrabold text-white font-ChakraPetch">
            Play Chess Online
          </h1>
          <p className="text-lg sm:text-2xl text-white font-light text-center">
            Play exciting chess matches with opponents from around the world and
            enjoy the thrill of the game.
          </p>

          <div className="flex text-white items-center justify-center">
            <Link 
            to={user?'/dashboard' : '/sign-in'}>
              <button className="transition group flex items-center justify-center bg-gradient-to-r from-purple-500 via-red-500 to-yellow-500 p-[1.5px] rounded-3xl hover:shadow-2xl hover:shadow-zinc-900">
                <div className="px-10 py-2 items-center justify-center rounded-3xl text-lg font-SpaceGrotesk bg-zinc-900 transition duration-300 ease-in-out group-hover:bg-gradient-to-b group-hover:from-gray-700 group-hover:to-gray-900">
                  Get Started
                </div>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
