const example = ['9', '7', '1', '5', ' ', ' ', '8', '4', '2', ' ', ' ', '6', '9', ' ', ' ', ' ', '1', ' ', ' ', ' ', ' ', '8', ' ', '2', ' ', ' ', '9', '5', ' ', ' ', ' ', ' ', ' ', '7', '9', ' ', ' ', ' ', '7', '6', ' ', '8', '3', ' ', ' ', ' ', '2', '8', ' ', ' ', ' ', ' ', ' ', '5', '7', ' ', ' ', '1', ' ', '5', ' ', ' ', ' ', ' ', '4', ' ', ' ', ' ', '9', '1', ' ', ' ', '8', '1', '9', ' ', ' ', '7', '2', '5', '4'];
const example2 = [8, '', '', '', '', '', '', '', '', '', '', 3, 6, '', '', '', '', '', '', 7, '', '', 9, '', 2, '', '', '', 5, '', '', '', 7, '', '', '', '', '', '', '', 4, 5, 7, '', '', '', '', '', 1, '', '', '', 3, '', '', '', 1, '', '', '', '', 6, 8, '', '', 8, 5, '', '', '', 1, '', '', 9, '', '', '', '', 4, '', '']
const example3 = ['', '', '', 6, '', '', '', '', 3, 3, '', 6, '', '', 8, 9, '', '', 7, '', 9, '', 3, '', '', 2, '', '', '', '', 1, '', '', '', 5, '', 5, '', 7, '', 6, 2, '', 3, 9, '', '', '', '', 9, '', '', '', '', 6, '', '', '', '', '', '', 1, '', '', 5, 3, 7, '', '', 2, '', '', 2, '', '', '', '', 6, '', '', ''];

const solveButton = document.getElementById('solve');
const checkButton = document.getElementById('check');
const loadExapmpleButtom = document.getElementById('load-example');
const solvable = document.getElementById('solvable');
const timeSpent = document.getElementById('time-spent');

const cellActions = document.getElementById('buttons');

const deleteAll = document.getElementById('delete-all');
deleteAll.addEventListener('click', () => {
    board.clear();
});

const lockAll = document.getElementById('lock-all');
lockAll.addEventListener('click', () => {
    board.lock();
});

let hints = true;

const infoAll = document.getElementById('info-all');
infoAll.addEventListener('click', () => {
    board.hints(hints);
    board.iteration();
    hints = !hints;
});


const lockCellIcon = document.getElementById('lock-cell-icon')

function createListener() {
    cellActions.children.forEach(action => action.addEventListener('click', () => {
        if (action.id == 'remove-cell') {
            board.softRemove();
        } else if (action.id == 'lock-cell') {
            board.switchLock();
            if (board.currentCellHasValue) {
                lockCellIcon.innerHTML == 'lock_open' ? lockCellIcon.innerHTML = 'lock' : lockCellIcon.innerHTML = 'lock_open';
            }
        } else if (action.id == 'info-cell') {
            try {
                board.currentPossibilites();
            } catch (e) {
                alert('Selecciona una celda')
            }

        } else {
            board.updateValue(action.id);
        }

    }));
}
createListener();

const logger = new Logger();

checkButton.addEventListener('click', () => {
    const result = board.isValid();
    mostrarNotificacion({ solvable: result, time: 0 });
});

function mostrarNotificacion(result) {
    let icon = 'error_outline';
    let color = 'red';
    let text = 'No se puede resolver!';

    if (result.solvable) {
        icon = 'done';
        color = 'green';
        if (result.time === 0) {
            text = 'Correcto!';
        } else {
            text = result.time + 'ms';
        }
    }

    const toastHTML = `<span class="white-text"><i class="material-icons left">${icon}</i>${text}</span>`

    M.toast({ html: toastHTML, classes: `rounded ${color}` });
}

solveButton.addEventListener('click', () => {
    const result = board.solve();
    mostrarNotificacion(result);
});

loadExapmpleButtom.addEventListener('click', () => board.load(example));

let instances;
document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.sidenav');
    instances = M.Sidenav.init(elems);
});

var collapsibleElem = document.querySelector('.collapsible');
var collapsibleInstance = M.Collapsible.init(collapsibleElem);

document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.fixed-action-btn');
    var instances = M.FloatingActionButton.init(elems);
});

document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems);
});

document.getElementById('sketch-holder').addEventListener('click', () => {
    const locked = board.check(mouseX, mouseY);
    board.show();

    locked ? lockCellIcon.innerHTML = 'lock_open' : lockCellIcon.innerHTML = 'lock';
});

function test() {
    let times = [];
    for (let i = 0; i < 100; i++) {
        board.clear();
        board.load(example2);
        times.push(board.solve().time);
    }
    const sum = times.reduce((a, b) => a + b, 0);
    const avg = (sum / times.length) || 0;
    return avg;
}