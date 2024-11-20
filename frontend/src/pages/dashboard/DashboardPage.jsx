import React, { useContext, useEffect } from "react";
import { showToast } from "../../utils/toast";
import SideBar from "../../components/SideBar";
import chessImg from "..//../assets/chessboard.jpg";
import Button from "../../components/Button";
import { FaChessBoard } from "react-icons/fa6";
import trap1 from "../../assets/tarraschTrap.mp4";
import { AuthContext } from "../../context/AuthContext";

function DashboardPage() {
  const { user, setUser } = useContext(AuthContext);
  const params = new URLSearchParams(window.location.search);
  const userid = params.get("user");

  useEffect(() => {
    if (userid && !user) {
      setUser(userid);
      console.log("user set through url");
    }
  }, []);

  return (
    <div className="flex h-full w-full bg-zinc-800">
      <SideBar />
      <div className=" ml-24 py-16 px-20 flex flex-col w-full space-y-32">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="w-1/2 h-full flex justify-center items-center">
            <img
              src={chessImg}
              alt="chessboard image"
              className="h-full object-contain"
            />
          </div>
          <div className="w-1/2 h-full text-center py-10 px-5 space-y-10 ">
            <h1 className="text-6xl font-bold font-lato text-white ">
              Play chess online !
            </h1>
            <p className="px-10 font-ChakraPetch text-white pb-10">
              Chess is more than just a game—it's a journey of skill, patience,
              and endless possibilities. Start your game now and experience the
              thrill of the board!
            </p>
            <Button text="Start Game" icon={<FaChessBoard />} />
          </div>
        </div>
        {/* video card , origin of chess */}
        <Cards />
      </div>
    </div>
  );
}

export default DashboardPage;

function Cards() {
  return (
    <div className="flex items-center justify-center h-[60vh] bg-zinc-900 py-10 rounded-xl">
      <div className="w-[32rem] h-full flex justify-center items-center overflow-hidden">
        <video
          className="h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          src={trap1}
        >
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="w-1/2 h-full px-5 py-3 space-y-4 ">
        <h1 className="text-4xl font-bold text-white font-ChakraPetch">
          Origin of Chess!
        </h1>
        <p className="text-white text-lg font-ChakraPetch font-thin">
          Chess, one of the oldest and most celebrated board games in the world,
          has a rich history dating back over a thousand years. Its origins can
          be traced to ancient{" "}
          <span className="font-bold text-orange-400">India</span>, where a game
          called <span className="font-bold">chaturanga </span> was played
          around the 6th century AD. This early version of chess involved
          strategic warfare between infantry, cavalry, elephants, and chariots,
          which evolved into the pieces we recognize today. The game spread
          through Persia, where it became known as shatranj, and later reached
          Europe during the Middle Ages, undergoing further transformation into
          the modern version we play now.
        </p>
      </div>
    </div>
  );
}
