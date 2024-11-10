import { SiLichess } from 'react-icons/si';
import { GoHomeFill } from 'react-icons/go';
import { IoGameController } from 'react-icons/io5';
import { MdAccountCircle } from 'react-icons/md';
import { NavLink } from 'react-router-dom';

function SideBar() {
  return (
    <div className='h-full w-20 z-50 bg-gradient-to-b from-black via-gray-900 to-black flex flex-col text-white items-center py-8 justify-between'>
      
      <div className="flex justify-center items-center">
        <SiLichess className='text-4xl' />
      </div>

      {/* Divider Line */}
      <hr className='w-full border-t border-gray-600' />

      {/* Menu Items */}
      <div className="space-y-8">
        <SidebarIcon
          icon={<GoHomeFill size="28" />}
          text="Home"
          to="/"
        />
        <SidebarIcon
          icon={<IoGameController size="28" />}
          text="Start Game"
          to="/sign-in"
        />
      </div>

      {/* Divider Line */}
      <hr className='w-full border-t border-gray-600' />

      {/* Login Section */}
      <div>
        <SidebarIcon
          icon={<MdAccountCircle size="28" />}
          text="Login"
          to="/sign-in"
        />
      </div>
    </div>
  );
}

export default SideBar;

function SidebarIcon({ icon, text, to }) {
  return (
    <NavLink to={to} className="group relative flex items-center justify-center text-2xl">
      {/* Icon */}
      <div className="flex items-center justify-center text-white group-hover:text-pink-500 transition-all duration-300 px-3 py-1">
        {icon}
      </div>

      {/* Tooltip */}
      <span className="font-lato rounded-md group-hover:bg-black text-white px-3 py-[1px] absolute left-full top-1/2 transform -translate-y-1/2 ml-3 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 whitespace-nowrap group-hover:text-white font-bold text-sm">
        {text}
      </span>
    </NavLink>
  );
}
