const fieldSize = 10;

class ScoreBoard {
    constructor(size) {
        this.minesLeft = size;
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
}

class Board {
    constructor(size) {
        this.board = [];
        this.size = size;
        for (let r = 0; r < this.size; r++) {
            this.board.push([]);
            for (let c = 0; c < this.size; c++) {
                let button = document.createElement("button");
                button.addEventListener("click", function () {
                    clicked(this)
                });
                this.board[r].push(button);
            }
        }
        this.drawBoard();
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
}

function clicked(button) {
    console.log("clicked");
    button.style.borderStyle = "none";
    button.disabled = true;
}


let board = new Board(fieldSize);
let scoreBoard = new ScoreBoard(fieldSize);