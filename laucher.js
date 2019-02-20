const Tetris = require('./tinytetris.js')
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// 颜色表
const COLORS = ['']

// 使用文本渲染
renderAscii(matrix, callback) {
    callback(matrix.map(y => y.map(x => x ? '■' : '□').join('')).join('\n'));
}


// 使用canvas渲染
renderCanvas(matrix, ctx, margin, width, height) {
    matrix.forEach((y, i) => y.forEach((x, j) => {
        ctx.fillStyle = this.Colors[x];
        ctx.fillRect(
            i * height + margin, j * width + margin,
            height - 2 * margin, width - 2 * margin);
    }));
}

var tetris = new Tetris(5, 20, (m) => {
    Tetris.renderAscii(m, (s) => {
        console.clear();
        console.log(s);
    });
});
tetris.start();
rl.prompt();