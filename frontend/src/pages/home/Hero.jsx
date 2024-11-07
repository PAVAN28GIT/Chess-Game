import React from "react";
import Navbar from "../../components/Navbar";
import Button from "../../components/button";

function Hero() {
  return (
    <div className="h-full w-full bg-purple-950 rounded-3xl text-white">
      <Navbar />

      <div className="flex w-full px-6  justify-between">
        <div className=" w-[40rem] my-20 font-lato space-y-20">
          <h1 class="text-6xl font-black bg-gradient-to-r from-[#ff3b2d] to-[#FEF3E2] inline-block text-transparent bg-clip-text">
            Enjoy Your Play with friends from around the world.
          </h1>
          <ul class="list-disc pl-8 text-xl font-lato text-slate-300">
            <li>Latency to under 100ms</li>
            <li>Timed matches </li>
            <li>Real-time communication between players</li>
          </ul>

          <div className="ml-5">
          <Button bname="Play Now" py='2' px= '10' />
          </div>
         
        </div>





        <div className="w-[25rem]">
          <img
            src="/images/aichess.jpg"
            alt="chess bg"
            className="h-[21rem] my-32"
          />
        </div>
      </div>
    </div>
  );
}

export default Hero;
