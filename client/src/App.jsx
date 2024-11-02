import { useCallback, useEffect, useState } from "react";
import "./App.css";
import Square from "./Square/Square";
import {io} from "socket.io-client"
import Swal from "sweetalert2"


const renderFrom = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

const App = () => {
  const [gameState, setGameState] = useState(renderFrom);
  const [currPlayer, setCurrPlayer] = useState("circle");
  const [finishedState, setFinishedState] = useState(null);
  const [finishedArrayState, setFinishedArrayState] = useState([]);
  const [playOnline, setPlayOnline] = useState(false);
  const [socket,setSocket] = useState(null);
  const [playerName, setPlayerName] = useState("")

  const checkWinner = useCallback(() => {
    //row
    for (let row = 0; row < gameState.length; row++) {
      if (
        gameState[row][0] === gameState[row][1] &&
        gameState[row][1] === gameState[row][2]
      ) {
        setFinishedArrayState([row * 3 + 0, row * 3 + 1, row * 3 + 2]);
        return gameState[row][0];
      }
    }

    // column
    for (let col = 0; col < gameState.length; col++) {
      if (
        gameState[0][col] === gameState[1][col] &&
        gameState[1][col] === gameState[2][col]
      ) {
        setFinishedArrayState([0 * 3 + col, 1 * 3 + col, 2 * 3 + col]);
        return gameState[0][col];
      }
    }

    if (
      gameState[0][0] === gameState[1][1] &&
      gameState[1][1] == gameState[2][2]
    ) {
      setFinishedArrayState([0, 4, 8]);
      return gameState[0][0];
    }
    if (
      gameState[0][2] == gameState[1][1] &&
      gameState[1][1] == gameState[2][0]
    ) {
      setFinishedArrayState([2, 4, 6]);
      return gameState[1][1];
    }

    const isDrawMatch = gameState.flat().every((e) => {
      if (e === "circle" || e === "cross") {
        return true;
      }
    });
    if (isDrawMatch) {
      return "draw";
    }
  }, [gameState]);

  useEffect(() => {
    const winner = checkWinner();
    if (winner === "circle" || winner === "cross" || winner === "draw") {
      console.log(winner);
      setFinishedState(winner);
    }
  }, [checkWinner]);

  const takePlayerName = async ()=>{
    return await Swal.fire({
      title: "Enter your Name",
      input: "text",
      inputLabel: "Name....",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "You need to write something!";
        }
      }
    });
  }


  socket?.on("connect", ()=>{
    // alert("Connected to server")
    setPlayOnline(true);
  })

  socket?.emit("request_to_play", ()=>{
    
  })

  const playOnlineClick=async()=>{

    const result = await takePlayerName();
    if(!result.isConfirmed)return ;
    setPlayerName(result.value)
    console.log(result);
    const newSocket = io("http://localhost:3000", {
      autoConnect: true
    })
    // console.log(newSocket)
    if(!result.isDismissed)setSocket(newSocket)
  }

  if(!playOnline){
    return (
      <div className="main-div">
        <button className="play-online" onClick={playOnlineClick}>Play Online</button>
      </div>
    )
  }

  return (
    <div className="main-div">
      <div className="move-detection">
        <div className="left water-background">Yourself</div>
        <div className="right water-background">Opponent</div>
      </div>
      <div>
        <h1 className="water-background game-heading">Tic Tac Toe</h1>
        <div className="square-wrapper">
          {gameState.map((arr, rowIndex) => {
            return arr.map((e, colIndex) => {
              return (
                <Square
                  finishedArrayState={finishedArrayState}
                  finishedState={finishedState}
                  currPlayer={currPlayer}
                  setCurrPlayer={setCurrPlayer}
                  setGameState={setGameState}
                  id={rowIndex * 3 + colIndex}
                  key={rowIndex * 3 + colIndex}
                />
              );
            });
          })}
        </div>
        {finishedState && (
          <h3 className="finished-state">
            {finishedState === "draw"
              ? "The Match was a draw"
              : `${finishedState} has won the game`}{" "}
            <br />
            hahahahah
          </h3>
        )}
      </div>
    </div>
  );
};

export default App;
