class Logger{
    constructor(){
        this.log = [];
    }

    add(board, solvable, time){
        const line = {
            board: board,
            solvable: solvable,
            time: time,
            timestamp: Date.now()
        }
        this.log.push(line);
    }

    print(){
        console.table(this.log);
    }
}