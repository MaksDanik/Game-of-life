class Life {
    constructor(selector, fieldSize = 30) {
        this._gameWrapperEl = document.querySelector(selector);
        this._size = fieldSize;
        this._canvasEl = null;
        this._canvasContext = null;
        this._gameField = [];
        this._cycleCountEl = null;
        this._startBtn = null;
        this._restartBtn = null;
        this._cycleCount = 0;
        this._timeout = null;
    }

    _createGameField() { // create a 2D-array
        for (let i = 0; i < this._size; i++) {
            this._gameField[i] = [];
            for (let j = 0; j < this._size; j++) {
                this._gameField[i][j] = 0;
            }
        }
    }

    renderGameAndBindEvent() {
        this._gameWrapperEl.innerHTML = `
        <canvas class="life" width="${this._size * 10}" height="${this._size * 10}"></canvas>
        <p>Number of cycles: <span class="count">0</span></p>
        <button class="btn start">Start</button>
        <button class="btn restart">New</button>
        `
        this._canvasEl = this._gameWrapperEl.querySelector('.life');
        this._canvasEl.addEventListener('click', this._onClickCanvasField.bind(this));

        this._cycleCountEl = this._gameWrapperEl.querySelector('.count');

        this._startBtn = this._gameWrapperEl.querySelector('.start');
        this._startBtn.addEventListener('click', this._onClickStartBtn.bind(this));

        this._restartBtn = this._gameWrapperEl.querySelector('.restart');
        this._restartBtn.addEventListener('click', this._onClickRestartBtn.bind(this));

        this._canvasContext = this._canvasEl.getContext('2d');

        this._createGameField();
    }



    _onClickStartBtn(e) {
        e.currentTarget.disabled = true;
        this._startGame();
    }

    _onClickRestartBtn(e) {
        clearTimeout(this._timeout);
        this._createGameField();
        this._cycleCount = 0;
        this._cycleCountEl.innerHTML = this._cycleCount;
        this._canvasContext.clearRect(0, 0, this._size * 10, this._size * 10);

        this._startBtn.disabled = false;
    }

    _onClickCanvasField(e) { 
        let x = Math.floor(e.offsetX / 10);
        let y = Math.floor(e.offsetY / 10);
        this._gameField[x][y] = 1;
        this._fillField();
    }

    _fillField() {
        const color = '#5F81A3'
        this._canvasContext.fillStyle = color;
        this._canvasContext.clearRect(0, 0, this._size * 10, this._size * 10);

        for (let i = 0; i < this._size; i++) {
            for (let j = 0; j < this._size; j++) {
                if (this._gameField[i][j] === 1) {
                    this._canvasContext.fillRect(i * 10, j * 10, 10, 10);
                }
            }
        }
    }

    _startGame() {
        let emptyCellsCount = 0;
        let isSimilar = true;

        let newField = [];
        for (let i = 0; i < this._size; i++) {
            newField[i] = [];
            for (let j = 0; j < this._size; j++) {
                var neighborsCount = 0;
                if (this._gameField[this._changeLeftSideOnRight(i) - 1][j] == 1) neighborsCount++;
                if (this._gameField[i][this._changeRightSideOnLeft(j) + 1] == 1) neighborsCount++;
                if (this._gameField[this._changeRightSideOnLeft(i) + 1][j] == 1) neighborsCount++;
                if (this._gameField[i][this._changeLeftSideOnRight(j) - 1] == 1) neighborsCount++;
                if (this._gameField[this._changeLeftSideOnRight(i) - 1][this._changeRightSideOnLeft(j) + 1] == 1) neighborsCount++;
                if (this._gameField[this._changeRightSideOnLeft(i) + 1][this._changeRightSideOnLeft(j) + 1] == 1) neighborsCount++;
                if (this._gameField[this._changeRightSideOnLeft(i) + 1][this._changeLeftSideOnRight(j) - 1] == 1) neighborsCount++;
                if (this._gameField[this._changeLeftSideOnRight(i) - 1][this._changeLeftSideOnRight(j) - 1] == 1) neighborsCount++;

                if (this._gameField[i][j] == 0) { // game rule: Each cell with three neighbors becomes populated
                    (neighborsCount == 3) ? newField[i][j] = 1 : newField[i][j] = 0;
                } else { // game rule: Each cell with two or three neighbors survives
                    (neighborsCount == 2 || neighborsCount == 3) ? newField[i][j] = 1 : newField[i][j] = 0;
                }

                if (newField[i][j] == 0) {
                    emptyCellsCount++;
                }

                if (newField[i][j] != this._gameField[i][j]) {
                    isSimilar = false;
                }
            }
        }

        this._gameField = newField;
        this._fillField();

        this._cycleCount++;
        this._cycleCountEl.innerHTML = this._cycleCount;

        if (emptyCellsCount == this._size * this._size || isSimilar) {
            this._startBtn.disabled = false;
            return;
        }

        this._timeout = setTimeout(this._startGame.bind(this), 500)
    }

    _changeLeftSideOnRight(i) {
        if (i == 0) return this._size;
        return i;
    }

    _changeRightSideOnLeft(i) {
        if (i == (this._size - 1)) return -1;
        return i;
    }
}

