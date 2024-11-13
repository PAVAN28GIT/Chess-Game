import { SiLichess } from "react-icons/si";
import { GoHomeFill } from "react-icons/go";
import { FaChess } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { CiLogout } from "react-icons/ci";
import { GiRamProfile } from "react-icons/gi";

function SideBar() {
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
          icon={<FaChess size="28" />}
          text="Start Game"
          to="/game/join"
        />
        <SidebarIcon
          icon={<GiRamProfile size="28" />}
          text="Profile"
          to="/user/:userid"
        />
      </div>
      <Divider />
      <div>
        <SidebarIcon
          icon={<CiLogout size="28" />}
          text="Logout"
          to="/sign-in"
        />
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
