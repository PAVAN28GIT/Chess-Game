import React from "react";
import { Link } from "react-router-dom";
import Button from "./button";
import { SiLichess } from "react-icons/si";

function Navbar() {
  return (
    <div className="w-full flex justify-between px-10 py-5 items-center z-10">
      <SiLichess className="size-10" />

      <div>
        <button className="font-lato text-slate-200 text-sm hover:scale-105 hover:text-white">
          Home
        </button>
      </div>
      <Link to="/sign-in">
        <Button bname="Sign in" />
      </Link>
    </div>
  );
}

export default Navbar;
