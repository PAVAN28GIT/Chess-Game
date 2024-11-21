import React, { useContext, useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import SideBar from "../../components/SideBar";
import { AuthContext } from "../../context/AuthContext";
import { useParams } from "react-router-dom";
import socket from "../../utils/socket.js";
import { showToast } from "../../utils/toast.js";

function PlayPage() {

  const { gameId } = useParams();
  const { user } = useContext(AuthContext);
  const [orientation , setOrientation] = useState("white");
  const [fen, setFen] = useState("start");

  console.log("gameId in playpage : ", gameId);

  socket.on("gameStarted" , (data) => {

    console.log("game started event listened in playpage", data);
    const { player1 , player2 , boardState , gameId , timers } = data;

    setFen(boardState);

    if (player1 === user) {
      setOrientation("white");
    } else {
      setOrientation("black");
    }
  });

 


  return (
    <div className="w-full h-screen object-cover text-white">
      <SideBar />
      <div className="flex ml-24 px-20 justify-between">
        <div className="w-[100vh] h-[100vh]">
          <Chessboard
            position={fen}
            //onPieceDrop={handleMove}
            boardOrientation={orientation}
          />
        </div>
        <div className="flex flex-col justify-between  my-20 ">
            <div className="font-ChakraPetch font-bold text-2xl rounded-xl bg-zinc-900 py-2 px-10 space-y-2">
            <h1>  Player :  <span className="font-thin">Zoro</span> </h1>
            <h1> Time Left : <span className="font-thin">00:00</span> </h1>
            </div>
            
            <h1 className="font-ChakraPetch font-bold text-2xl rounded-xl bg-zinc-900 py-2 px-10 "> Time Left : <span className="font-thin">00:00</span> </h1>
          
        </div>
   
      </div>
    </div>
  );
}

export default PlayPage;