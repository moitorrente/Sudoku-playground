const solved = [3, 1, 6, 5, 7, 8, 4, 9, 2,
    5, 2, 9, 1, 3, 4, 7, 6, 8,
    4, 8, 7, 6, 2, 9, 5, 3, 1,
    2, 6, 3, 4, 1, 5, 9, 8, 7,
    9, 7, 4, 8, 6, 3, 1, 2, 5,
    8, 5, 1, 7, 9, 2, 6, 4, 3,
    1, 3, 8, 9, 4, 7, 2, 5, 6,
    6, 9, 2, 3, 5, 1, 8, 7, 4,
    7, 4, 5, 2, 8, 6, 3, 1, 9];



class Board {
    constructor(rows, columns, boxSize) {
        this.empty = columns * rows;
        this.rows = rows;
        this.columns = columns;
        this.cells = [];
        this.currentId = undefined;
        this.currentX = undefined;
        this.currentY = undefined;
        this.boxSize = boxSize;
        this.cellSize = 70;
        this.solved = false;
        this.currentCellHasValue = false;
        this.createCells(rows, columns);
    }

    clear() {
        this.cells.forEach((cell) => {
            cell.setState('initial');
            cell.removeValue();
            cell.unlock();
        });
    }

    load(data, type) {
        if (type == 'string') {
            data = data.split('');
        }
        data.forEach((field, i) => {
            this.cells[i].setValue(field);
            if (this.cells[i].hasValue()) {
                this.cells[i].lock();
                this.empty--;
            }
        });
    }

    loadPartial(data, type) {
        if (type == 'string') {
            data = data.split('');
        }
        data.forEach((field, i) => {
            this.cells[i].setValue(field);
            if (this.cells[i].hasValue()) {
                this.empty--;
            }
        });
    }

    download() {
        const data = this.cells.map(cell => cell.value);
        return data;
    }

    select(x, y) {
        this.currentId = this.getId(x, y);
        this.currentX = x;
        this.currentY = y;
        this.cells.forEach(cell => cell.setState('initial'));
        this.show();
        this.hilites();
    }

    getId(x, y) {
        return x * this.rows + y;
    }

    step(step) {
        if (this.currentX !== undefined) {
            if (step > 0) {
                if (this.currentX < this.columns - 1) {
                    this.currentX += step;
                } else {
                    if (this.currentY < this.rows - 1) {
                        this.currentX = 0;
                        this.currentY += step;
                    }
                }
            } else {
                if (this.currentX > 0) {
                    this.currentX += step
                } else {
                    if (this.currentY > 0) {
                        this.currentX = this.columns - 1;
                        this.currentY += step;
                    }
                }
            }
            this.select(this.currentX, this.currentY);
        }
    }

    createCells(rows, columns) {
        for (let column = 0; column < columns; column++) {
            for (let row = 0; row < rows; row++) {
                this.cells.push(new Cell(row, column, this.cellSize));
            }
        }
    }

    show() {
        this.cells.forEach(cell => cell.show());
        this.drawGrid();
    }

    drawGrid() {
        push();
        strokeWeight(5);
        stroke('#485696')
        const horizontalLines = this.columns / this.boxSize;
        const verticalLines = this.rows / this.boxSize;

        for (let i = 1; i < horizontalLines; i++) {
            line(i * this.boxSize * this.cellSize, 0, i * this.boxSize * this.cellSize, height);
        }
        for (let i = 1; i < verticalLines; i++) {
            line(0, i * this.boxSize * this.cellSize, width, i * this.boxSize * this.cellSize);
        }
        pop();
    }

    check(x, y) {
        let some = false;
        this.cells.forEach(cell => cell.setState('initial'));
        this.cells.forEach(cell => {
            if (cell.isOver(x, y)) {
                this.currentId = cell.id;
                this.currentX = cell.col;
                this.currentY = cell.row;
                some = true;
            }
        });
        if (some) {
            this.hilites();
        }
        return this.cells[this.currentX + this.rows * this.currentY].locked;
    }

    hilites() {
        this.cells.forEach(cell => cell.setState('initial'));
        this.hiliteGroup();
        this.hiliteCurrent();
    }

    hiliteCurrent() {
        if (this.currentX && this.currentY) {
            this.cells[this.currentX + this.rows * this.currentY].setState('selected');
            this.currentCellHasValue = this.cells[this.currentX + this.rows * this.currentY].hasValue();
        }
    }

    hiliteGroup() {
        const terX = Math.floor(this.currentX / this.boxSize);
        const terY = Math.floor(this.currentY / this.boxSize);
        this.hiliteBox(terX, terY);
        this.hiliteLines(this.currentX, this.currentY);
    }

    hiliteLines(x, y) {
        this.cells.filter(obj => { if (obj.col === x) obj.setState('group') });
        this.cells.filter(obj => { if (obj.row === y) obj.setState('group') });
    }

    hiliteBox(x, y) {
        const boxXInf = this.boxSize * x;
        const boxXSup = boxXInf + this.boxSize;
        const boxYInf = this.boxSize * y;
        const boxYSup = boxYInf + this.boxSize;

        this.cells.forEach(cell => {
            if (cell.col < boxXSup && cell.row < boxYSup &&
                cell.col >= boxXInf && cell.row >= boxYInf) {
                cell.setState('group');
            }
        });
    }

    hiliteNumber(number) {
        this.cells.forEach(cell => {
            if (cell.value == number) cell.setState('selected');
        });
    }

    updateValue(value) {
        if (this.currentId !== undefined) this.cells[this.currentX + this.rows * this.currentY].setValue(value);

        this.hilites();
        this.hiliteNumber(value);
    }

    removeValue() {
        if (this.currentId !== undefined) this.cells[this.currentX + this.rows * this.currentY].removeValue();
    }

    getEmpty() {
        return this.cells.filter(cell => !cell.hasValue());
    }

    updateEmpty() {
        this.empty = this.getEmpty().length;
    }


    validateRow(row) {
        let horizontal = [];
        const positions = hr[row];
        for (let i = 0, j = 9; i < j; i++) {
            if (this.cells[positions[i]].value) horizontal.push(this.cells[positions[i]].value);
        }
        return this.validate(horizontal);
    }

    validateColumn(column) {
        let vertical = [];
        const positions = hc[column];
        for (let i = 0, j = 9; i < j; i++) {
            if (this.cells[positions[i]].value) vertical.push(this.cells[positions[i]].value);
        }

        return this.validate(vertical);
    }

    validateGroup(id) {
        const boxXInf = Math.floor(id % this.boxSize) * this.boxSize;
        const boxXSup = boxXInf + this.boxSize;
        const boxYInf = Math.floor(id / this.boxSize) * this.boxSize;
        const boxYSup = boxYInf + this.boxSize;
        const group = this.cells.filter(cell => {
            if (cell.col < boxXSup && cell.row < boxYSup &&
                cell.col >= boxXInf && cell.row >= boxYInf) {
                return this
            }
        }).filter(cell => cell.value).map(cell => cell.value);
        return this.validate(group);
    }

    validateGroupCoord(x, y) {
        const boxX = Math.floor(x / 3) * 3;
        const boxY = Math.floor(y / 3) * 3;
        let group = [];

        for (let j = boxY, n = boxY + 3; j < n; j++) {
            for (let i = boxX, m = boxX + 3; i < m; i++) {
                if (this.cells[i + this.rows * j].value) group.push(this.cells[i + this.rows * j].value)
            }
        }

        return this.validate(group);
    }

    isValid() {
        let valid = true;
        for (let column = 0; column < this.columns; column++) {
            if (!this.validateColumn(column)) {
                valid = false;
                break;
            }
        }

        for (let row = 0; row < this.rows; row++) {
            if (!this.validateRow(row)) {
                valid = false;
                break;
            }
        }

        for (let group = 0; group < this.rows * this.columns; group++) {
            if (!this.validateGroup(group)) {
                valid = false;
                break;
            }
        }
        return valid;
    }

    validate(array) {
        return array.length === [...new Set(array)].length;
    }

    validateUnfinished(array) {

    }

    currentPossibilites() {
        this.possibilities(this.currentX, this.currentY);
    }

    possibilities(x, y) {
        this.cells[x + this.rows * y].save();
        let possible = [];

        for (let i = 1, j = 10; i < j; i++) {
            this.cells[x + this.rows * y].setValue(i);
            if (this.validateRow(y)) {
                if (this.validateColumn(x)) {
                    if (this.validateGroupCoord(x, y)) {
                        possible.push(i);
                    }
                }
            }
        }

        this.cells[x + this.rows * y].load();
        this.cells[x + this.rows * y].setPossible(possible);
        return possible;
    }

    iteration() {
        for (let j = 0; j < 9; j++) {
            for (let i = 0; i < 9; i++) {
                if (this.cells[i + this.rows * j].locked) {
                    this.cells[i + this.rows * j].setPossible([]);
                } else {
                    if (!this.cells[i + this.rows * j].value) {
                        this.possibilities(i, j);
                    }
                }


            }
        }
        this.updateEmpty();
    }

    nextEmpty() {
        for (let i = this.cells.length; i--;) {
            if (!this.cells[i].value) {
                return [this.cells[i].row, this.cells[i].col]
            }
        }
        return false;
    }

    // nextEmpty() {
    //     this.iteration();
    //     const min = this.cells.filter(x => !x.hasValue()).reduce(function (prev, curr) {
    //         return prev.n < curr.n ? prev : curr;
    //     }, 0);


    //     if (min) {
    //         return [min.row, min.col, min.possible]
    //     }

    //     return false;
    // }


    validateValue(value, x, y) {
        this.cells[x + this.rows * y].save();
        this.cells[x + this.rows * y].setValue(value);
        if (!this.validateRow(y)) {
            this.cells[x + this.rows * y].load();
            return false;
        }
        if (!this.validateColumn(x)) {
            this.cells[x + this.rows * y].load();
            return false;
        }
        if (!this.validateGroupCoord(x, y)) {
            this.cells[x + this.rows * y].load();
            return false;
        }
        this.cells[x + this.rows * y].load();
        return true;
    }


    solve() {
        let initialBoard = board.download();
        const start = performance.now();
        this.iteration();
        this.solving();
        const finish = performance.now();
        const result = {
            'solvable': this.isValid(),
            'time': Math.floor(finish - start)
        }
        logger.add(initialBoard, result.solvable, result.time);
        return result;
    }



    solving() {
        const emptySpot = this.nextEmpty();
        if (!emptySpot) {
            return true;
        }

        const [row, column] = emptySpot;
        const possible = this.possibilities(column, row);

        // if(possible.length == 1){
        //     this.cells[column + this.rows * row].setValue(possible[0]);
        //     this.solving();
        // }

        for (let i = 0, j = possible.length; i < j; i++) {
            if (this.validateValue(possible[i], column, row)) {
                this.cells[column + this.rows * row].setValue(possible[i]);
                this.solving();
            } else {
                return true;
            }
        }
        if (this.nextEmpty()) {
            this.cells[column + this.rows * row].removeValue();
        } else {
            return true;
        }

    }

    lock() {
        this.cells.forEach(cell => { if (cell.hasValue()) cell.lock() });
    }

    switchLock() {
        if (this.currentId !== undefined) {
            const cell = this.cells[this.currentX + this.rows * this.currentY];
            if (cell.hasValue()) cell.locked ? cell.unlock() : cell.lock();
        }
    }

    softRemove() {
        if (this.currentId !== undefined) this.cells[this.currentX + this.rows * this.currentY].softRemove();
    }

    hints(activate){
        this.cells.forEach(cell => cell.hints(activate))
    }
}

function hashColumn(n) {
    let h = [];
    for (let i = 0, j = 9; i < j; i++) {
        h.push(i * 9 + n)
    }
    return h;
}

function hashRow(n) {
    let h = [];
    for (let i = 0, j = 9; i < j; i++) {
        h.push(i + n * 9)
    }
    return h;
}

let hc = [];
let hr = [];



function hash() {
    for (let i = 0; i < 9; i++) {
        hc.push(hashColumn(i));
        hr.push(hashRow(i));
    }
}

hash();

const min = (someArrayOfObjects) => {
    const values = someArrayOfObjects.map(value => value.possible.length).filter(x => x);
    return values[Math.min.apply(null, values)]
};