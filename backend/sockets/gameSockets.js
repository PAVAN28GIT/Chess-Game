import { Chess } from 'chess.js';
import Game from '../models/gameModel.js';
import {startTimer , isGameOver , getGameResult} from "../utils/chess.js";

let waitingQueue = [];
let timers = {};

export default function setupGameSocket(io) {
  
    io.on("connection", (socket) => {
      console.log("New Client connected:", socket.id);

      socket.on("startGame", async (playerId) => {
    
        try {
          if (waitingQueue.length === 0) {
            const roomId = `room-${playerId}`;
            waitingQueue.push({ playerId , roomId });
            socket.join(roomId); // join that room
            console.log(` ${playerId} is waiting for an opponent in ${roomId}`);

            socket.emit("waitingForOpponent", `${playerId} is Waiting in ${roomId}`);

          } else {
            const { playerId: opponentId, roomId } = waitingQueue.shift();
 
            socket.join(roomId); 

            const newGame = new Game({
              player1: opponentId,
              player2: playerId,
              currentPlayer : opponentId,
              status: "ongoing",
              timers : { 
                player1 : 300 , 
                player2 : 300 
              },
            });
        
            await newGame.save();       

            timers[roomId] = {
              player1: 300,
              player2: 300,
              currentTimer: "player1",
              interval: null,
            };
  
            // startTimer(roomId, timers, io);


            io.to(roomId).emit("gameStarted", {
              gameId: newGame._id,
              boardState: newGame.boardState,
              //timers: timers[roomId],
              player1: newGame.player1,
              player2: newGame.player2,
            });
  
            console.log(`Game started between ${opponentId} and ${playerId} in ${roomId}`);
          }
        } catch (error) {
          socket.emit("error", "Error starting the game");
        }
      });
  
      socket.on("makeMove", async ({ gameId, move, playerId }) => {
        try {
          const game = await Game.findById(gameId);
          if (!game) return socket.emit("error", "Game not found");

          const chess = new Chess(game.boardState);
          const validMove = chess.move(move);

          if (validMove) {
            const roomId = `room-${gameId}`;
            clearInterval(timers[roomId].interval);
  
            const currentPlayer = timers[roomId].currentTimer === "player1" ? "player2" : "player1";
            timers[roomId].currentTimer = currentPlayer;
  
            startTimer(roomId, timers, io);
  
            game.boardState = chess.fen();
            game.currentPlayer = currentPlayer === "player1" ? game.player1 : game.player2;
            await game.save();
  
            io.to(roomId).emit("moveMade", {
              move,
              boardState: game.boardState,
              currentPlayer: timers[roomId].currentTimer,
            });
  
            if (isGameOver(chess)) {
              const result = getGameResult(chess);
              clearInterval(timers[roomId].interval);
  
              game.status = "finished";
              game.winner =
                result === "checkmate"
                  ? game.currentPlayer.equals(game.player1)
                    ? game.player2
                    : game.player1
                  : null;
              await game.save();
  
              io.to(roomId).emit("gameOver", { result, winner: game.winner });
            }
          } else {
            socket.emit("invalidMove", "Invalid move");
          }
        } catch (error) {
          socket.emit("error", "Error processing move");
        }
      });
  
      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });
  }
  