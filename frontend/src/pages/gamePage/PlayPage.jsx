import React, { useState } from "react";
import { Chessboard } from "react-chessboard"; // Import the chessboard component
import { Chess } from "chess.js";
import SideBar from "../../components/SideBar";

function PlayPage() {
  const [game, setGame] = useState(new Chess()); // Initialize chess game state
  const [fen, setFen] = useState(game.fen()); // Store FEN string for chessboard display

  const handleMove = (from, to) => {
    const newGame = game.clone(); 
    const move = newGame.move({ from, to });
  
    if (move) {
      setGame(newGame); // Update game state with the new game object
      setFen(newGame.fen()); // Update FEN string for chessboard
    }
  };

  return (
    <div className="w-full h-screen object-cover text-white">
      <SideBar />
      <div className=" flex ml-24 px-20 justify-between">
        <div className="w-[100vh] h-[100vh]">
          <Chessboard
            position={fen} // Pass FEN string to chessboard
            onPieceDrop={handleMove} // Set up the move handler
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
