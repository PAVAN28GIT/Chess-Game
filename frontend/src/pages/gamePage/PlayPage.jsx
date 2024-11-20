import React, { useContext, useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import SideBar from "../../components/SideBar";
import { AuthContext } from "../../context/AuthContext";
import { useParams } from "react-router-dom";
import socket from "../../utils/socket.js";
import { showToast } from "../../utils/toast.js";

function PlayPage() {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [timers, setTimers] = useState({ player1: 300, player2: 300 });
  const [currentPlayer, setCurrentPlayer] = useState("player1");
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [orientation, setOrientation] = useState("white");
  const { gameId } = useParams();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const initializeListeners = () => {
      socket.on("gameStarted", (data) => {
        setFen(data.boardState);
        setTimers(data.timers);
        setCurrentPlayer(data.timers.currentTimer);

        if (user._id === data.player1) {
          setOrientation("white");
          setIsMyTurn(data.timers.currentTimer === "player1");
        } else {
          setOrientation("black");
          setIsMyTurn(data.timers.currentTimer === "player2");
        }
      });

      socket.on("timerUpdate", (updatedTimers) => {
        setTimers(updatedTimers);
      });

      socket.on("moveMade", (data) => {
        setFen(data.boardState);
        setCurrentPlayer(data.currentPlayer);
        setIsMyTurn(data.currentPlayer === (orientation === "white" ? "player1" : "player2"));
      });

      socket.on("gameOver", ({ result, winner }) => {
        const message = result === "timeout" ? "Timeout" : result;
        showToast(`Game Over! ${message}. Winner: ${winner}`, "success");
      });
    };

    initializeListeners();

    return () => {
      socket.off("gameStarted");
      socket.off("timerUpdate");
      socket.off("moveMade");
      socket.off("gameOver");
    };
  }, [user._id, orientation]);




  const handleMove = (from, to) => {
    if (!isMyTurn) {
      showToast("It's not your turn!", "error");
      return false;
    }

    const newGame = game.clone();
    const move = newGame.move({ from, to });

    if (move) {
      setGame(newGame);
      setFen(newGame.fen());

      socket.emit("makeMove", {
        gameId,
        move,
        playerId: user._id,
      });
    } else {
      showToast("Invalid move!", "error");
      return false;
    }
  };



  

  return (
    <div className="w-full h-screen object-cover text-white">
      <SideBar />
      <div className="flex ml-24 px-20 justify-between">
        <div className="w-[100vh] h-[100vh]">
          <Chessboard
            position={fen}
            onPieceDrop={handleMove}
            boardOrientation={orientation}
          />
        </div>
        <div className="flex flex-col justify-between my-20">
          <div className="font-ChakraPetch font-bold text-2xl rounded-xl bg-zinc-900 py-2 px-10 space-y-2">
            <h1>
              Player: <span className="font-thin">{orientation === "white" ? "White" : "Black"}</span>
            </h1>
            <h1>
              Time Left:{" "}
              <span className="font-thin">
                {Math.floor(timers[orientation === "white" ? "player1" : "player2"] / 60)}:
                {String(timers[orientation === "white" ? "player1" : "player2"] % 60).padStart(2, "0")}
              </span>
            </h1>
          </div>
          <h1 className="font-ChakraPetch font-bold text-2xl rounded-xl bg-zinc-900 py-2 px-10">
            Opponent Time:{" "}
            <span className="font-thin">
              {Math.floor(timers[orientation === "white" ? "player2" : "player1"] / 60)}:
              {String(timers[orientation === "white" ? "player2" : "player1"] % 60).padStart(2, "0")}
            </span>
          </h1>
        </div>
      </div>
    </div>
  );
}

export default PlayPage;