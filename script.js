/* ---------- Cursor follower ---------- */
document.addEventListener('mousemove', e => {
    const circle = document.querySelector('.circle');
    circle.style.left = `${e.clientX}px`;
    circle.style.top  = `${e.clientY}px`;
});

/* ---------- Game state ---------- */
let board;
let currentPlayer;

let xWins = +localStorage.getItem('xWins') || 0;
let oWins = +localStorage.getItem('oWins') || 0;
let ties  = +localStorage.getItem('ties')  || 0;

const turnEl   = document.querySelector('.turn');
const xScoreEl = document.getElementById('x-score');
const oScoreEl = document.getElementById('o-score');
const tiesEl   = document.getElementById('ties-score');

// Get new button elements
const resetBoardBtn = document.getElementById('reset-board-btn');
const startNewGameBtn = document.getElementById('start-new-game-btn');
const resetScoreBtn = document.getElementById('reset-score-btn');


updateScoreboard();
startGame();

/* ---------- Main functions ---------- */
function makeMove(cell, row, col) {
    if (board[row][col] !== '') return;         // ignore clicks on filled tile

    board[row][col] = currentPlayer;

    cell.style.backgroundImage = `url('assets/${currentPlayer}.png')`;
    cell.style.backgroundSize   = 'cover';
    cell.style.backgroundPosition = 'center';
    cell.style.pointerEvents = 'none';          // block further clicks

    if (checkWin()) {
        // wait a tick so the last mark renders before the alert pops
        setTimeout(() => {
            alert(`${currentPlayer} wins!`);
            updateScore(currentPlayer);
            startGame();
        }, 50);
        return;
    }

    if (isBoardFull()) {
        setTimeout(() => {
            alert("It's a tie!");
            ties++;
            localStorage.setItem('ties', ties);
            tiesEl.textContent = ties;
            startGame();
        }, 50);
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    turnEl.textContent = `${currentPlayer}'s Turn`;
}

function checkWin() {
    // rows & columns
    for (let i = 0; i < 3; i++) {
        if (board[i][0] && board[i][0] === board[i][1] && board[i][1] === board[i][2]) return true;
        if (board[0][i] && board[0][i] === board[1][i] && board[1][i] === board[2][i]) return true;
    }
    // diagonals
    if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2]) return true;
    if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0]) return true;
    return false;
}

function isBoardFull() {
    return board.flat().every(c => c !== '');
}

function updateScore(player) {
    if (player === 'X') {
        xWins++;
        localStorage.setItem('xWins', xWins);
    } else {
        oWins++;
        localStorage.setItem('oWins', oWins);
    }
    updateScoreboard();
}

function updateScoreboard() {
    xScoreEl.textContent = xWins;
    oScoreEl.textContent = oWins;
    tiesEl.textContent   = ties;
}

function startGame() {
    board = [['','',''], ['','',''], ['','','']];
    currentPlayer = 'X';
    turnEl.textContent = "X's Turn";

    document.querySelectorAll('.box').forEach(cell => {
        cell.style.backgroundImage = '';
        cell.style.pointerEvents   = 'auto';
    });
}

/* ---------- Button Event Listeners ---------- */

// Reset Board button (resets the current game, keeps score)
resetBoardBtn.addEventListener('click', () => startGame());

// Start New Game button (same as reset board, but more explicit for the user)
startNewGameBtn.addEventListener('click', () => startGame());

// Reset Score button
resetScoreBtn.addEventListener('click', () => {
    if (confirm("Are you sure you want to reset all scores? This cannot be undone.")) {
        xWins = 0;
        oWins = 0;
        ties = 0;
        localStorage.setItem('xWins', 0);
        localStorage.setItem('oWins', 0);
        localStorage.setItem('ties', 0);
        updateScoreboard();
        startGame(); // Also start a new game after resetting scores
    }
});