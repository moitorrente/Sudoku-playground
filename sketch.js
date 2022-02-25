const board = new Board(9, 9, 3);

function setup() {
    const canvas = createCanvas(630, 630);
    canvas.parent('sketch-holder');
    textAlign(CENTER, CENTER);
}

function draw() {
    background(220);
    cursor('pointer');
    board.show();
}

function keyTyped() {
    if (!isNaN(key) && key > 0) {
        board.updateValue(key);
    }
    if (key === 'Backspace' || key === 'Delete' || key === ' ') {
        board.removeValue();
    }
}

document.querySelector('body').addEventListener('keydown', function (e) {
    const code = e.keyCode || e.which;
    if (e.shiftKey && code === 9) {
        e.preventDefault();
        board.step(-1);
    } else if (code == 9) {
        e.preventDefault();
        board.step(1);
    }
});