import { Chess } from 'chess.js';
import Game from '../models/gameModel.js';


let waitingQueue = []; // Queue for players waiting to start a game
const games = {}; // In-memory game object

export default function setupGameSocket(io) {
    io.on('connection', (socket) => {
        console.log('New client connected');

        socket.on('startGame', async (playerId) => {
            console.log(`Player ${playerId} joined the queue`);

            if (waitingQueue.length === 0) {
                waitingQueue.push({ playerId, socket });
                socket.emit('waitingForOpponent', { message: 'Waiting for an opponent...' });
            } else {
                // Match with the first player in the queue
                const opponent = waitingQueue.shift();

                const newGame = new Game({
                    player1: opponent.playerId,
                    player2: playerId,
                    currentPlayer: opponent.playerId,
                    timers: {
                        player1: 5 * 60 * 1000, // 5 minutes in milliseconds
                        player2: 5 * 60 * 1000,
                    },
                });

                const savedGame = await newGame.save(); // save to db
                const gameId = savedGame._id.toString();

                const chess = new Chess(); // new chess instance

                games[gameId] = { // In-Memory Object
                    chess,
                    currentPlayer: opponent.playerId,
                    player1: opponent.playerId,
                    player2: playerId,
                    timers: {
                        player1: 5 * 60 * 1000,
                        player2: 5 * 60 * 1000,
                    },
                    timerIntervals: {
                        player1: null,
                        player2: null,
                    },
                    status: 'ongoing',
                };

                socket.join(gameId);      // cuurent player
                opponent.socket.join(gameId);  // opponent

                startTimer(gameId, 'player1', io);

                opponent.socket.emit('gameStarted', {
                    gameId,
                    board: chess.fen(),
                    turn: opponent.playerId,
                    player1:  games[gameId].player1 ,
                    player2:  games[gameId].player2 ,
                    color: 'white',
                });
                socket.emit('gameStarted', {
                    gameId,
                    board: chess.fen(),
                    turn: opponent.playerId,
                    player1:  games[gameId].player1,
                    player2:  games[gameId].player2 ,
                    color: 'black',
                });
            }
        });

        // Handle a move by a player
        socket.on('makeMove', async ({ gameId, from, to, playerId }) => {
            const game = games[gameId];
            console.log(`move made by ${playerId} from ${from} to ${to}`);

            if (!game) {
                socket.emit('error', { message: 'Game not found' });
                return;
            }

            const chess = game.chess;

            if (game.currentPlayer !== playerId) {
                socket.emit('error', { message: 'Not your turn' });
                return;
            }

            try {
                chess.move({ from, to });
                const updatedBoard = chess.fen();
                const nextTurn = chess.turn() === 'w' ? game.player1 : game.player2;

                // Check for game over conditions
                if (isGameOver(updatedBoard)) {
              
                    const result = getGameResult(updatedBoard, game.player1, game.player2);
               
                    game.status = 'finished';
                    game.winner = result.winnerID;
                    await Game.updateOne({ _id: gameId }, { boardState: updatedBoard, status: 'finished', winner: result.winnerID });

                    io.to(gameId).emit('gameOver', result );
                    delete games[gameId];
                } else {
                    game.currentPlayer = nextTurn;

                    // Switch timers
                    stopTimer(gameId, playerId === game.player1 ? 'player1' : 'player2');
                    startTimer(gameId, nextTurn === game.player1 ? 'player1' : 'player2', io);

                    io.to(gameId).emit('boardUpdate', {
                        board: updatedBoard,
                        turn: nextTurn,
                        timers: game.timers,
                    });
                    await Game.updateOne({ _id: gameId }, { boardState: updatedBoard, currentPlayer: nextTurn }); 
                }
            } catch (error) {
                console.error(error);
                socket.emit('error', { message: error.message });
            }
        });

        // Handle reconnection
        socket.on('recoverGame', async ({ gameId, playerId }) => {
            const game = games[gameId] || (await Game.findById(gameId));

            if (!game) {
                socket.emit('error', { message: 'Game not found' });
                return;
            }

            if (![game.player1, game.player2].includes(playerId)) {
                socket.emit('error', { message: 'You are not part of this game' });
                return;
            }

            socket.join(gameId); // rejoin socket to room

            socket.emit('recoverdGameState', {
              
                board: game.chess.fen(),
                turn: game.currentPlayer,
                player1:  games[gameId].player1 ,
                player2:  games[gameId].player2 ,
                color: playerId === game.player1 ? 'white' : 'black',
                timers: game.timers,
            });
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
}

function startTimer(gameId, player, io){
  const game = games[gameId];
  if (!game) return;

  const interval = setInterval(async () => {
      game.timers[player] -= 1000;

      // winner declaration --- if the timer has run out
      if (game.timers[player] <= 0) {
          clearInterval(interval);
          game.timerIntervals[player] = null;

          const winnerID = player === "player1" ? game.player2 : game.player1;
          game.result = winnerID;

          // Update in database 
          await Game.updateOne(
              { _id: gameId },
              {
                  status: "finished",
                  winne : winnerID,
                  timers: game.timers,
              }
          );
          const result = { winnerID, draw: false , res:'Time out'};

          io.to(gameId).emit("gameOver", result);

          // Remove the game from the in-memory storage
          delete games[gameId];
      } else {
          io.to(gameId).emit("timerUpdate", {  
              timers: game.timers,
          });
      }
  }, 1000);

  // Store the interval ID so it can be cleared later
  game.timerIntervals[player] = interval;
};

function stopTimer(gameId, player){
  const game = games[gameId];
  if (!game || !game.timerIntervals[player]){
        return;
  } 
  clearInterval(game.timerIntervals[player]);
  game.timerIntervals[player] = null;
};

function isGameOver(boardState){
  const chess = new Chess(boardState);

  if (chess.isCheckmate() || chess.isDraw() || chess.isStalemate() || chess.isInsufficientMaterial()) {
      return true;
  }
  return false;
};


function getGameResult (boardState, player1, player2){
  const chess = new Chess(boardState);

  if (chess.isCheckmate()) {
      const winnerID = chess.turn() === 'w' ? player2 : player1;
      return { winnerID, draw: false , res:'Checkmate'};
  }

  if (chess.isDraw() || chess.isStalemate() || chess.isInsufficientMaterial()) {
      return { winnerID: null, draw: true };
  }
  return null;
};