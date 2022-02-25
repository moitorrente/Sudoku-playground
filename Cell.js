class Cell {
    constructor(column, row, w) {
        this.id = row * 9 + column;
        this.col = column;
        this.row = row;
        this.border = 0;
        this.x = column * w;
        this.y = row * w;
        this.w = w;
        this.possible = [];
        this.state = 'initial';
        this.value = '';
        this.locked = false;
        this.hint = false;
        this.colors = {
            'initial': '#F4FAFF',
            'selected': '#B7ADCF',
            'group': '#DEE7E7',
            'over': 'yellow',
            'error': 'red'
        }
        this.color = this.colors[this.state]
    }

    show() {
        fill(this.color);
        stroke('#485696');
        strokeWeight(1);
        rect(this.x, this.y, this.w, this.w);


        push()
        textSize(32);
        strokeWeight(0);
        if (this.locked) {
            fill('#0A122A');
        } else {
            fill('#3D52D5');

        }
        text(this.value, this.x + this.w / 2, this.y + this.w / 2);
        pop();

        if (this.hint) {
            push();
            textSize(14);
            strokeWeight(0);
            fill(0);
            text(this.possible.join(''), this.x + this.w / 2, this.y + this.w / 7);
            pop();
        }
    }

    hints(activated) {
        activated ? this.hint = true : this.hint = false;
    }

    getColor(state) {
        return this.colors[state];
    }

    setColor(color) {
        this.color = color;
    }

    setState(state) {
        this.state = state;
        this.setColor(this.getColor(this.state));
    }

    isOver(x, y) {
        if (x > this.x && x < this.x + this.w &&
            y > this.y && y < this.y + this.w) {
            return true;
        }
        return false;
    }

    setValue(value) {
        if (!this.locked) {
            if (!isNaN(parseInt(value))) {
                this.value = parseInt(value);
            }
        }
    }

    hasValue() {
        if (this.value) return true;
        return false;
    }

    save() {
        this.tempValue = this.value;
    }

    load() {
        this.value = this.tempValue;
    }

    lock() {
        this.locked = true;
    }

    unlock() {
        this.locked = false;
    }

    removeValue() {
        this.value = '';
        this.possible = [];
    }

    softRemove() {
        if (!this.locked) {
            this.value = '';
            this.possible = [];
        }
    }

    setPossible(values) {
        if (!this.value) {
            this.possible = values;
        } else {
            this.possible.length = 0;
        }
    }


}