const fieldSize = 10;
const restartButton = document.getElementById("restart");
const resultField = document.getElementById("result");

const mineSymbol = "&#10060;";
const flagSymbol = "&#128681;";
const explosionSymbol = "&#128165;";

const lostEmoji = "&#128555;";
const winEmoji = "&#128515;";

restartButton.addEventListener("click", newGame);

class ScoreBoard {
    constructor(size) {
        this.size = size;
        this.minesLeft = this.size;
        this.flagsRisen = 0;
        this.showScore();
    }

    showScore() {
        let minesLeftCounter = document.getElementById("minesLeft");
        let flagsRisenCounter = document.getElementById("flagsRisen");
        minesLeftCounter.innerHTML = this.addZeros(this.minesLeft);
        flagsRisenCounter.innerHTML = this.addZeros(this.flagsRisen);
    }

    addZeros(number) {
        let listOfNumbers = number.toString().split("");
        while (listOfNumbers.length < 3) {
            listOfNumbers.unshift("0");
        }
        return listOfNumbers.join("");
    }

    addFlag() {
        this.minesLeft -= 1;
        this.flagsRisen += 1;
        this.showScore();
    }

    removeFlag() {
        this.minesLeft += 1;
        this.flagsRisen -= 1;
        this.showScore();
    }
}

class Board {
    constructor(size) {
        this.map = [];
        this.board = [];
        this.size = size;
        for (let r = 0; r < this.size; r++) {
            this.map.push([]);
            this.board.push([]);
            for (let c = 0; c < this.size; c++) {
                let button = document.createElement("button");
                button.setAttribute("id", r.toString() + "-" + c.toString());
                button.addEventListener("click", function () {
                    clicked(this)
                });
                button.addEventListener("contextmenu", function () {
                    raiseFlag(this)
                });
                this.map[r].push(0);
                this.board[r].push(button);
            }
        }
        this.initialize();
        this.drawBoard();
    }

    initialize() {
        let mines = 0;
        while (mines < this.size) {
            let row = Math.floor(Math.random() * this.size);
            let col = Math.floor(Math.random() * this.size);
            if (this.map[row][col] !== -1) {
                this.map[row][col] = -1;
                mines++;
            }
        }
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (this.map[r][c] === -1) {
                    continue;
                }
                for (let row = Math.max(0, r - 1); row < Math.min(this.size - 1, r + 1) + 1; row++) {
                    for (let col = Math.max(0, c - 1); col < Math.min(this.size - 1, c + 1) + 1; col++) {
                        if (this.map[row][col] === -1) {
                            this.map[r][c] += 1;
                        }
                    }
                }
            }
        }
    }

    drawBoard() {
        let field = document.getElementById("field");
        field.style.gridTemplateColumns = "repeat(" + this.size + ", 30px)";
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                field.appendChild(this.board[r][c]);
            }
        }
    }

    showAllMines() {
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (this.board[r][c].disabled === true) {
                    continue;
                }
                if (this.board[r][c].innerHTML === "") {
                    if (this.map[r][c] === -1) {
                        this.board[r][c].innerHTML = mineSymbol;
                    } else if (this.map[r][c] > 0) {
                        this.board[r][c].innerHTML = this.map[r][c].toString();
                    }
                }
                this.board[r][c].disabled = true;
                this.board[r][c].style.borderStyle = "none";
            }
        }
    }

    isClear(r, c) {
        if (this.map[r][c] === -1) {
            return false;
        }
        return true;
    }

    reveal(r, c) {
        if (this.board[r][c].disabled === true) {
            return;
        }
        this.board[r][c].disabled = true;
        this.board[r][c].style.borderStyle = "none";
        if (this.map[r][c] === 0) {
            for (let row = Math.max(0, r - 1); row <= Math.min(this.size - 1, r + 1); row++) {
                for (let col = Math.max(0, c - 1); col <= Math.min(this.size - 1, c + 1); col++) {
                    this.reveal(row, col);
                }
            }
        } else if (this.map[r][c] > 0) {
            this.board[r][c].innerHTML = this.map[r][c].toString();
        }
    }
}

function clicked(button) {
    if ((button.innerHTML !== "") && (scoreBoard.flagsRisen > 0)) {
        button.innerHTML = "";
        scoreBoard.removeFlag();
    }
    let row = parseInt(button.id.split("-")[0]);
    let col = parseInt(button.id.split("-")[1]);
    if (board.isClear(row, col)) {
        board.reveal(row, col);
    } else {
        button.innerHTML = explosionSymbol;
        gameOver();
    }
}

function raiseFlag(button) {
    if ((button.innerHTML === "") && (scoreBoard.flagsRisen < fieldSize)) {
        button.innerHTML = flagSymbol;
        scoreBoard.addFlag();
    } else if ((button.innerHTML !== "") && (scoreBoard.flagsRisen > 0)) {
        button.innerHTML = "";
        scoreBoard.removeFlag();
    }
}

function gameOver() {
    board.showAllMines();
    restartButton.innerHTML = lostEmoji;
    let result = document.createElement("h3");
    resultField.appendChild(result);
    result.innerHTML = "Game over";

}

function newGame() {
    window.location.reload();
}

let board = new Board(fieldSize);
let scoreBoard = new ScoreBoard(fieldSize);