import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../utils/socket.js";
import BackendURL from "../utils/config.js";
import { showToast } from "../utils/toast";
import { AuthContext } from "../context/AuthContext.jsx";

function Button({ text, icon }) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleStartGame = async () => {
    try {
      if (!user) {
        showToast("Please Login to Play", "error");
        navigate("/sign-in");
        return;
      }
      const playerId = user;
  
      socket.emit("startGame", playerId);

      socket.on("waitingForOpponent", (message) => {
        console.log(message);
        showToast("Waiting for an opponent...", "loading");
      });

      socket.on("gameStarted", (data) => {
        const { gameId } = data;
        showToast("", "dismiss");
        showToast("Game started!", "success");
        navigate(`/game/${gameId}`, { state: { gameData: data } }); 
      });
    } catch (error) {
      showToast("", "dismiss");
      showToast("Error starting the game", "error");
      console.log(error.message);
    }
  };

  return (
    <div className="flex text-white items-center justify-center">
      <button
        onClick={handleStartGame}
        className="transition group flex items-center justify-center bg-gradient-to-r from-purple-500 via-red-500 to-yellow-500 p-[1.8px] rounded-md hover:shadow-2xl hover:shadow-zinc-900"
      >
        <div className="px-12 py-3 items-center justify-center rounded-md text-2xl font-ChakraPetch font-bold bg-zinc-900 transition duration-300 ease-in-out group-hover:bg-gradient-to-b group-hover:from-gray-700 group-hover:to-gray-900">
          <div className="flex gap-4 items-center">
            {" "}
            {icon} {text}{" "}
          </div>
          <div className="font-thin text-sm">Play with someone online! </div>
        </div>
      </button>
    </div>
  );
}

export default Button;
