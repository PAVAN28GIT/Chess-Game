import React, { useContext, useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import SideBar from "../../components/SideBar";
import { AuthContext } from "../../context/AuthContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import socket from "../../utils/socket.js";
import { showToast } from "../../utils/toast.js";
import BackendURL from "../../utils/config.js";

function PlayPage() {
  const { gameId } = useParams(); // gameId from URL
  const { user , userProfile } = useContext(AuthContext); // current user id form context
  const location = useLocation();
  const navigate = useNavigate();
  const gameData = location.state?.gameData;
  // { gameId, board, turn, color , player1 , player2} = gameData
  const [fen, setFen] = useState(gameData.board);
  const [currentTurn, setCurrentTurn] = useState(gameData.turn); //playerId 
  const [myTime, setMyTime] = useState(300000);
  const [opponentTime, setOpponentTime] = useState(300000);
  const [opponent, setOpponent] = useState("Dummy Player");

  useEffect(() => {
    if (!gameData || !user) {
      showToast("Unable to retrieve game information. Please try again later.", "error");
      navigate("/dashboard");
      return;
    }
    if(gameId !== gameData.gameId){
      showToast("Game ID mismatch. Please try again later.", "error");
      navigate("/dashboard");
      return;
    }
}, []);

  // format time in mm:ss
  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    socket.on("timerUpdate", (timer) => {
      if (user === gameData.player1) {
        setMyTime(timer.player1);
        setOpponentTime(timer.player2);
      } else {
        setMyTime(timer.player2);
        setOpponentTime(timer.player1);
      }
    });

    // Handle move updates
    socket.on("moveMade", ({ fen, turn }) => {
      setFen(fen);
      setCurrentTurn(turn);
    });

  },[]);

  const isMyTurn = currentTurn === user;

  const getName = async () => {
    try {
      const oppid = user === gameData.player1 ? gameData.player2 : gameData.player1;

      const res = await fetch(`${BackendURL}/api/user/${oppid}`, {
        method: "GET",
        credentials: "include",
      });
  
      if (res.ok) {
        const data = await res.json();
        setOpponent(data.name);
      } else {
        showToast("Error fetching opponent information", "error");
      }
    } catch (error) {
      console.error("Error fetching opponent:", error);
      showToast("Error fetching opponent information", "error");
    }
  };

  useEffect(() => {
    getName();  // fetch opponent name
  }, []);
  

  return (
    <div className="w-full h-screen text-white">
    <SideBar />
    <div className="flex ml-24 px-20 justify-between">
      <div className="w-[100vh] h-[100vh]">
        <Chessboard
          position={fen}
          boardOrientation={gameData.color}
          onPieceDrop={(source, target) => {
            if (!isMyTurn) {
              showToast("It's not your turn!", "error");
              return;
            }
            socket.emit("makeMove", { gameId, source, target });
          }}
        />
      </div>
      <div className="flex flex-col justify-between my-20">
        <div className="font-ChakraPetch font-bold text-2xl rounded-xl bg-zinc-900 py-2 px-10">
          <h1>Opponent: <span className="font-thin">{opponent}</span></h1>
          <h1>Time Left: <span className="font-thin">{formatTime(opponentTime)}</span></h1>
        </div>
        <div className="font-ChakraPetch font-bold text-2xl rounded-xl bg-zinc-900 py-2 px-10 space-y-2">
          <h1>You : <span className="font-thin">{userProfile?.user?.name}</span></h1>
          <h1>Time Left: <span className="font-thin">{formatTime(myTime)}</span></h1>
        </div>
       
      </div>
    </div>
  </div>
  );
}

// function PlayPage() {

//   const { gameId } = useParams();
//   const { user } = useContext(AuthContext);
//   const location = useLocation();
//   const gameDate = location.state?.gameData;

//   if(!gameDate ) {
//     showToast("Unable to retrieve game information. Please try again later.", "error");
//     navigate("/dashboard");
//     return;
//   }

//   if(gameDate && gameId !== gameDate.gameId){
//     showToast("Game ID mismatch. Please try again later.", "error");
//     navigate("/dashboard");
//     return;
//   }

//   const { board, turn, color, game } = gameDate;

//   const [ curGame , setCurGame] = useState(game);
//   const [fen , setFen] = useState(board);
//   const [ currentTurn , setCurrentTurn] = useState(turn);
//   const [myTime , setMyTime] = useState(300000);
//   const [opponentTime , setOpponentTime] = useState(300000);

//   io.on("timerUpdate " , (timer)=>{
//     if(user === curGame.player1){
//       setMyTime(timer.player1);
//       setOpponentTime(timer.player2);
//     }else{
//       setMyTime(timer.player2);
//       setOpponentTime(timer.player1);
//     }

//   } )

//   return (
//     <div className="w-full h-screen object-cover text-white">
//       <SideBar />
//       <div className="flex ml-24 px-20 justify-between">
//         <div className="w-[100vh] h-[100vh]">
//           <Chessboard
//             position={fen}
//             //onPieceDrop={handleMove}
//             boardOrientation={color}
//           />
//         </div>
//         <div className="flex flex-col justify-between  my-20 ">
//             <div className="font-ChakraPetch font-bold text-2xl rounded-xl bg-zinc-900 py-2 px-10 space-y-2">
//             <h1>  Player :  <span className="font-thin">Zoro</span> </h1>
//             <h1> Time Left : <span className="font-thin">00:00</span> </h1>
//             </div>

//             <h1 className="font-ChakraPetch font-bold text-2xl rounded-xl bg-zinc-900 py-2 px-10 "> Time Left : <span className="font-thin">00:00</span> </h1>

//         </div>

//       </div>
//     </div>
//   );
// }

export default PlayPage;
