import React from "react";
import Hero from "./Hero";
import { SiLichess } from "react-icons/si";

function HomePage() {
  return (
    <div className="bg-[#f4dcff] h-screen w-full p-5 flex fixed">
      <div className="w-1/4 flex flex-col items-center justify-center px-10 pr-20 h-full space-y-5">
        <SiLichess className="size-32" />

        <div className="space-y-1">
          <h1 className="font-lato font-bold text-3xl text-purple-950">
            About us
          </h1>
          <p className="text-left text-sm font-lato text-purple-950">
            Our platform allows you to play real-time chess with friends or
            opponents from around the world. With a clean interface and variety
            of customizable themes we ensure enjoyable chess exp every time you
            play.
          </p>
        </div>
      </div>

      <div className="w-3/4 h-full">
        <Hero />
      </div>
    </div>
  );
}

export default HomePage;
