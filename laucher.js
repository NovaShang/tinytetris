const Tetris = require('./tinytetris.js')
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var tetris = new Tetris(5, 20, (m) => {
    Tetris.renderAscii(m, (s) => {
        console.clear();
        console.log(s);
    });
});
tetris.start();
rl.prompt();
