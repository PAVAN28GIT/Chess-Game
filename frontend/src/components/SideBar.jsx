import { useContext } from "react";

import { SiLichess } from "react-icons/si";
import { GoHomeFill } from "react-icons/go";
import { CiLogout } from "react-icons/ci";
import { GiRamProfile } from "react-icons/gi";

import { NavLink, useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";
import BackendURL from "../utils/config.js";
import { showToast } from "../utils/toast.js";

function SideBar() {
  const {user} = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async() =>{
    const res = await fetch( `${BackendURL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    if(res.ok){
      showToast('Logged out successfully', 'success');
      navigate('/');
      return;
    }
  }

  

  return (
    <div className="h-full fixed w-24 z-50 bg-gradient-to-b from-black via-gray-900 to-black flex flex-col text-white items-center py-8 justify-between">
      <div className="flex justify-center items-center">
        <SidebarIcon icon={<SiLichess size="28" />} to="/" />
      </div>
      <Divider />
      <div className="space-y-8 w-full">
        <SidebarIcon
          icon={<GoHomeFill size="28" />}
          text="Home"
          to="/dashboard"
        />

        <SidebarIcon
          icon={<GiRamProfile size="28" />}
          text="Profile"
          to={`/user/${user}`}   
        />
      </div>
      <Divider />
      <div className=" group relative hover:scale-105 hover:bg-zinc-800 rounded-full p-3">
        <p className=" absolute opacity-0 group-hover:opacity-100 left-16 ">Logout</p>
        <CiLogout size="28" onClick={handleLogout} className="cursor-pointer" />
      </div>
    </div>
  );
}

function SidebarIcon({ icon, text, to }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group relative flex items-center justify-center text-2xl w-full ${
          isActive ? "border-r-4 border-pink-500" : ""
        }`
      }
    >
      <div className="flex justify-center text-white group-hover:text-pink-500 transition-all duration-300 px-3 py-1 w-full hover:cursor-pointer">
        {icon}
      </div>

      {text && (
        <span className="opacity-0 group-hover:opacity-100 rounded-md group-hover:bg-black font-lato text-white px-2 py-[1px] absolute left-20 top-1/2  -translate-y-1/2 ml-2 transition-all duration-300 whitespace-nowrap group-hover:text-white text-sm group-hover:shadow-2xl group-hover:shadow-pink-700">
          {text}
        </span>
      )}
    </NavLink>
  );
}

function Divider() {
  return <hr className="w-full border-t border-gray-600" />;
}

export default SideBar;
