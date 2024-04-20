"use strict";

//imports start and restart buttons
const startButton = document.querySelector("#start-button");
const restartButton = document.querySelector("#restart-button");

//gameboard module
const GameBoard = (function () {
    const boardSize = 3 * 3;
    
    let gameboard = [];
    for (let i = 0; i < boardSize; i++) {
        gameboard.push("");
    }
    // renders gameboard to the DOM
    const renderGame = () => {
        let boardHTML = "";

        //check for winning combo
        const winningCombination = winHandler(gameboard);

        gameboard.forEach((el, i) => {
            let className = el === "x" ? "board-x" : el === "o" ? "board-o" : "";

            //add winner class if the board is apart of winning combo
            if (winningCombination && winningCombination.includes(i)) {
                className += ` winner`;
            }
            boardHTML += `<div id="board-${i}" class="board ${className}">${el}</div>`;
        });
        document.querySelector("#gameboard").innerHTML = boardHTML;
    };
    
    //this will update the gameboard array and re-render
    const update = (index, value) => {
        gameboard[index] = value;
        renderGame();
    };

    const getGameBoard = () => gameboard;

    return {
        renderGame,
        update,
        getGameBoard,
    };
})();

// creates player objects
const createPlayer = (name, move) => {
    return {
        name,
        move,
    };
};

//module for game controller
const GameController = (function () {
    let players = [];
    let currentPlayerIndex;
    let endGame;

    //starts game
    const startGame = () => {
        const player1Name = document.querySelector("#player1").value;
        const player2Name = document.querySelector("#player2").value;

        //this will check if player names are empty
        if (!player1Name || !player2Name) {
            alert("Please enter names for both players.");
            return;
        }

        players = [createPlayer(player1Name, "x"), createPlayer(player2Name, "o")];

        currentPlayerIndex = 0;
        endGame = false;
        GameBoard.renderGame();
        addClickEventListeners();
        toggleStart();
    };

    //restart game
    const restartGame = () => {
        //clears the gameboard and player inputs
        for (let i = 0; i < 9; i++) {
            GameBoard.update(i, "");            
        }
        currentPlayerIndex = 0;
        endGame = false;
        toggleStart();
        document.querySelector("#player1").value = "";
        document.querySelector("#player2").value = "";
    };

    //toggles the gameboard visibility
    const toggleBoardHide = (el) => {
        el.classList.toggle("gameboard-show");
    };

    //toggles button visibility 
    const toggleButtonHide = (el) => {
        el.classList.toggle("hidden");
    };

    //toggle game start

    const toggleStart = () => {
        toggleBoardHide(document.querySelector("#gameboard"));
        toggleButtonHide(restartButton);
        toggleButtonHide(document.querySelector(".controls"));
    };

    //add click events to the gameboard
    const addClickEventListeners = () => {
        const gameboard = document.querySelector("#gameboard");
        gameboard.addEventListener("click", handleClick);
    };

    //toggle the current player
    const togglePlayer = () => {
        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    };

    // handle the click event on the gameboard
    const handleClick = (event) => {
        if (endGame) return;
        
        const index = event.target.id.split("-")[1];

        if (GameBoard.getGameBoard()[index] !== "") return;

        GameBoard.update(index, players[currentPlayerIndex].move);
        
        const winningCombination = winHandler(GameBoard.getGameBoard());
        if (winningCombination) {
            endGame = true;
        }
        
        const draw = drawHandler(GameBoard.getGameBoard());
        if (draw && !winningCombination) {
            alert("Its's a draw!");
        }

        togglePlayer();
    };

    return {
        startGame,
        restartGame,
        handleClick,
        togglePlayer,
    };
})();

function drawHandler(board) {
    let draw = true;
    board.forEach((el) => {
        if (!el) {
            draw = false;
        }
    });
    return draw;
}

function winHandler(board) {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
       ];

       for (let i = 0; i < winningCombinations.length; i++) {
           const [a, b, c]= winningCombinations[i];
           if (board[a]) {
            if (board[a] === board[b] && board[b] === board[c]) {
                return winningCombinations[i];
            }
        }
    }
}