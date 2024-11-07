import React from "react";

function Button({ bname, py = '0.5rem', px = '1.5rem' }) {
  return (
    <div>
      <button className="transition group flex items-center justify-center bg-gradient-to-r from-purple-500 via-red-500 to-yellow-500 p-[1.5px] rounded-3xl hover:shadow-2xl hover:shadow-pink-500">
        <div
          className="px-6 py-[0.2rem] items-center justify-center rounded-3xl text-lg font-SpaceGrotesk bg-zinc-900 transition duration-300 ease-in-out group-hover:bg-gradient-to-b group-hover:from-red-600 group-hover:to-[#FEF3E2]"
          style={{ paddingTop: py, paddingBottom: py, paddingLeft: px, paddingRight: px }}
        >
          {bname}
        </div>
      </button>
    </div>
  );
}


export default Button;
