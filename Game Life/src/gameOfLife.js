class Life {
    constructor(selector, fieldSize = 30) {
        this.gameWrapperEl = document.querySelector(selector);
        this.size = fieldSize;
        this.canvasEl = null;
        this.canvasContext = null;
        this.gameField = [];
        this.cycleCountEl = null;
        this.startBtn = null;
        this.cycleCount = 0;
    }

    createGameField() {
        for (let i = 0; i < this.size; i++) {
            this.gameField[i] = [];
            for (let j = 0; j < this.size; j++) {
                this.gameField[i][j] = 0;
            }
        }
    }

    renderGameAndBindEvent() {
        this.gameWrapperEl.innerHTML = `
        <canvas class="life" width="${this.size * 10}" height="${this.size * 10}"></canvas>
        <p>Number of cycles: <span class="count">0</span></p>
        <button class="start">Start</button>
        `
        this.canvasEl = this.gameWrapperEl.querySelector('.life');
        this.canvasEl.addEventListener('click', this.onClickCanvasField.bind(this));

        this.cycleCountEl = this.gameWrapperEl.querySelector('.count');

        this.startBtn = this.gameWrapperEl.querySelector('.start');
        this.startBtn.addEventListener('click',(e)=> {
            e.currentTarget.disabled = true;
            this.startGame();
        });

        this.canvasContext = this.canvasEl.getContext('2d');

        this.createGameField();
    }

    onClickCanvasField(e) {
        let x = Math.floor(e.offsetX / 10);
        let y = Math.floor(e.offsetY / 10);
        this.gameField[x][y] = 1;
        this.fillField();
    }

    fillField() {
        const color = '#5F81A3'
        this.canvasContext.fillStyle = color;
        this.canvasContext.clearRect(0, 0, this.size * 10, this.size * 10);

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.gameField[i][j] === 1) {
                    this.canvasContext.fillRect(i * 10, j * 10, 10, 10);
                }
            }
        }
    }

    startGame() {
        let emptyCellsCount = 0;
        let isSimilar = true;

        let newField = [];
        for (let i = 0; i < this.size; i++) {
            newField[i] = [];
            for (let j = 0; j < this.size; j++) {
                var neighborsCount = 0;
                if (this.gameField[this.changeLeftSideOnRight(i) - 1][j] == 1) neighborsCount++;
                if (this.gameField[i][this.changeRightSideOnLeft(j) + 1] == 1) neighborsCount++;
                if (this.gameField[this.changeRightSideOnLeft(i) + 1][j] == 1) neighborsCount++;
                if (this.gameField[i][this.changeLeftSideOnRight(j) - 1] == 1) neighborsCount++;
                if (this.gameField[this.changeLeftSideOnRight(i) - 1][this.changeRightSideOnLeft(j) + 1] == 1) neighborsCount++;
                if (this.gameField[this.changeRightSideOnLeft(i) + 1][this.changeRightSideOnLeft(j) + 1] == 1) neighborsCount++;
                if (this.gameField[this.changeRightSideOnLeft(i) + 1][this.changeLeftSideOnRight(j) - 1] == 1) neighborsCount++;
                if (this.gameField[this.changeLeftSideOnRight(i) - 1][this.changeLeftSideOnRight(j) - 1] == 1) neighborsCount++;

                if (this.gameField[i][j] == 0) {
                    (neighborsCount == 3) ? newField[i][j] = 1 : newField[i][j] = 0;
                } else {
                    (neighborsCount == 2 || neighborsCount == 3) ? newField[i][j] = 1 : newField[i][j] = 0;
                }

                if (newField[i][j] == 0) {
                    emptyCellsCount++;
                }

                if (newField[i][j] != this.gameField[i][j]) {
                    isSimilar = false;
                }
            }
        }

        this.gameField = newField;
        this.fillField();

        this.cycleCount++;
        this.cycleCountEl.innerHTML = this.cycleCount;

        if (emptyCellsCount == this.size * this.size || isSimilar) {
            this.startBtn.disabled = false;
            return;
        }

        setTimeout(this.startGame.bind(this), 500)
    }

    changeLeftSideOnRight(i) {
        if (i == 0) return this.size;
        return i;
    }
    
    changeRightSideOnLeft(i) {
        if (i == (this.size - 1)) return -1;
        return i;
    }
}

