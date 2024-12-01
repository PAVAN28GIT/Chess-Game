import React, { useContext, useEffect, useRef, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import SideBar from "../../components/SideBar";
import { AuthContext } from "../../context/AuthContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import socket from "../../utils/socket.js";
import { showToast } from "../../utils/toast.js";
import BackendURL from "../../utils/config.js";

const formatTime = (milliseconds) => {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000); // Ensure seconds is a number
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};


function PlayPage() {

  const { gameId } = useParams(); // gameId from URL
  const { user, setUser , userProfile } = useContext(AuthContext); // current user id form context
  const savedUser = localStorage.getItem('user');
  const location = useLocation();
  const navigate = useNavigate();
  //const gameData = location.state?.gameData;
  const gameData  = location.state?.gameData;
  // { gameId, board, turn, color , player1 , player2} = gameData
  const [fen, setFen] = useState(gameData?.board);
  const [currentTurn, setCurrentTurn] = useState(gameData?.turn); //playerId 
  const [myTime, setMyTime] = useState(300000);
  const [opponentTime, setOpponentTime] = useState(300000);
  const [opponent, setOpponent] = useState("Dummy Player"); // opponent name
  const chessRef = useRef(new Chess(fen)); // mutable reference to Chess instance


  useEffect(() => {

    if (savedUser) {
      console.log("user from local storage" , savedUser);
      const userData = JSON.parse(savedUser);
      setUser(userData._id);
      console.log("user from local storage" , userData._id);
    } else {
      showToast("Please sign in to play", "error");
      navigate("/sign-in");
    }

    socket.emit("recoverGame", { gameId, playerId: user });

    socket.on("recoverdGameState", (data) => {
      console.log("Recovered Game State: ", data);
      // data = { board, turn, player1, player2 , color , timers: { player1, player2 } }
      setFen(data.board);
      setCurrentTurn(data.turn);
      gameData.player1 = data.player1;
      gameData.player2 = data.player2;
      gameData.color = data.color;

      console.log("gameData after recovery: ", gameData);
      
      if(user === gameData.player1){
        setMyTime(data.timers.player1);
        setOpponentTime(data.timers.player2);
      }else{
        setMyTime(data.timers.player2);
        setOpponentTime(data.timers.player1);
      }

    });
   
  }, [user]);

  useEffect(() => {
    chessRef.current.load(fen);
  }, [fen]);

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
    getName(); 
  }, []);


  useEffect(() => {
    const handleTimerUpdate = (timer) => {
      if (user === gameData.player1) {
        setMyTime(timer.timers.player1);
        setOpponentTime(timer.timers.player2);
      } else {
        setMyTime(timer.timers.player2);
        setOpponentTime(timer.timers.player1);
      }
    };

    const handleMoveMade = ({ fen, turn }) => {
      setFen(fen);
      setCurrentTurn(turn);
    };

    const handleBoardUpdate = (data) => {
      setFen(data.board);
      setCurrentTurn(data.turn);
      if (user === gameData.player1) {
        setMyTime(data.timers.player1);
        setOpponentTime(data.timers.player2);
      } else {
        setMyTime(data.timers.player2);
        setOpponentTime(data.timers.player1);
      }
    };

    const handleGameOver = (result) => {
      if (result.draw) {
        showToast("**** Game Draw ****", "success");
      } else if (result.winnerID === user) {
        if(result.res === 'Time out'){
          showToast("**** You Win By Time Out****", "success");
        }else if (result.res === 'Checkmate'){
          showToast("**** You Win By Checkmate****", "success");
        }else{
          showToast("**** You Win ****", "success");
        }
      } else {
        if(result.res === 'Time out'){
          showToast("**** You Lose By Time Out****", "error");
        }else if (result.res === 'Checkmate'){
          showToast("**** You Lose By Checkmate****", "error");
        }else{
          showToast("**** You Lose ****", "error");
        }
      }
    };

    // Set up socket listeners
    socket.on("timerUpdate", handleTimerUpdate);
    socket.on("moveMade", handleMoveMade);
    socket.on("boardUpdate", handleBoardUpdate);
    socket.on("gameOver", handleGameOver);

    // Cleanup on unmount
    return () => {
      socket.off("timerUpdate", handleTimerUpdate);
      socket.off("moveMade", handleMoveMade);
      socket.off("boardUpdate", handleBoardUpdate);
      socket.off("gameOver", handleGameOver);
    };

  }, []);

  const isMyTurn = currentTurn === user;
  
  const handlePieceDrop = (source, target) => {

    if (!isMyTurn) {
      showToast("It's not your turn!", "error");
      return false; // Prevent the move
    }
    const chess = chessRef.current; // Access the updated chess instance
    const move = chess.move({ from: source, to: target, promotion: 'q' }); 
    if (move) {
      setFen(chess.fen()); 
      socket.emit("makeMove", { gameId, from: source, to: target, playerId: user });
      return true; // Allow the move on the board
    } else {
      showToast("Invalid move. Try again.", "error");
      return false; // Prevent the move
    }

  }

  return (
    <div className="w-full h-screen text-white">
    <SideBar />
    <div className="flex ml-24 px-20 justify-between">
      <div className="w-[100vh] h-[100vh]">
        <Chessboard
          position={fen}
          boardOrientation={gameData?.color}
          onPieceDrop={handlePieceDrop}
        />
      </div>
      <div className="flex flex-col justify-between my-20 items-center text-nowrap">
        <div className="font-ChakraPetch font-bold text-2xl rounded-xl bg-zinc-900 py-2 px-10">
          <h1 className="font-thin">{opponent}</h1>
          <h1>Time Left: <span className="font-thin">{formatTime(opponentTime) }</span></h1>
        </div>
        <div>
          {isMyTurn && 
          <div className="px-4 py-1 rounded-lg bg-[#FFF5E0] text-black text-center font-ChakraPetch font-bold ">
            Your Turn
          </div>}
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


export default PlayPage;



