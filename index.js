class Tetris {

    // 构造方法
    constructor(width, height, render) {
        this.Width = width;
        this.Height = height;
        this.render = render;
        this.Block = [];
        this.X = 0;
        this.Y = 5;
        this.Board = [...Array(height)].map(() => Array(width));
    }

    // 所有方块形状
    static Blocks = [
        [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0]
        ], [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0]
        ], [
            [0, 1, 0],
            [1, 1, 0],
            [1, 0, 0]
        ], [
            [0, 1, 0],
            [0, 1, 1],
            [0, 0, 1]
        ], [
            [0, 1, 1],
            [0, 1, 0],
            [0, 1, 0]
        ], [
            [1, 1, 0],
            [0, 1, 0],
            [0, 1, 0]
        ], [
            [1, 1],
            [1, 1]
        ]
    ];

    // 使用文本渲染
    static renderAscii = (matrix, callback) =>
        callback(matrix.map(y => y.map(x => x ? '' : '').join('')).join('\n'));

    // 使用canvas渲染
    static renderCanvas = (matrix, ctx, margin, width, height) =>
        matrix.forEach((y, i) => y.forEach((x, j) => {
            if (x) ctx.fillRect(
                i * height + margin, j * width + margin,
                height - 2 * margin, width - 2 * margin);
        }));

    // 旋转当前的block
    spin(inverse = false) {
        let length = this.Block.length;
        let result = JSON.parse(JSON.stringify(this.Block));
        for (let i = 0; i < length; i++) {
            for (let j = 0; j < length; j++) {
                temp = this.Block[i][j];
                if (inverse)
                    result[i][j] = this.Block[j][length - i - 1];
                else
                    result[i][j] = this.Block[length - j - 1][i];
            }
        }
        if (!hitTest(result, this.X, this.Y))
            this.Block = result;
    }

    // 向下移动一格
    move(x, y) {
        if (!hitTest(this.Block, this.X + x, this.Y + y)) {
            this.X += x;
            this.Y += y;
            return true;
        }
        else return false;
    }

    // 移动到底
    dropBottom() {
        while (move(0, 1)) { }
    }

    // 检查碰撞
    hitTest(block, x, y) {
        var blockCells = block
            .map((row, i) => row.map((cell, j) => { data = cell, y = i + y, x = j + x }))
            .filter(cell => cell.data);
        if (blockCells.some(cell =>
            cell.y < 0 || cell.x < 0 ||
            cell.y > this.Height - 1 || cell.x > this.Width - 1))
            return true;
        else if (blockCells.some(cell => this.Board[cell.y, cell.x]))
            return true;
        else return false;
    }

    // 检查是否有完整的一行并返回消去的行数
    rowTest() {
        let count = 0;
        for (let i = 0; i < this.Height; i++) {
            if (!this.Board[i].some(x => x == 0)) {
                this.Board.splice(i, 1);
                this.Board.splice(0, 0, Array(this.Width));
                count++;
            }
        }
        return count;
    }

    // 更新状态，定时运行或在用户操作后运行
    update() {
        var board = JSON.parse(JSON.stringify(this.Board));
        this.Block.forEach((row, i) => row.forEach((cell, j) =>
            board[i + y][j + x] += cell));
        this.render(board);
    }
}
