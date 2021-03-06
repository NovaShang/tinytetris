// 各种块的形状
const BLOCKS = [
    [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]], //I
    [[0, 2, 0], [2, 2, 2], [0, 0, 0]], // T
    [[0, 3, 0], [3, 3, 0], [3, 0, 0]], // Z
    [[0, 4, 0], [0, 4, 4], [0, 0, 4]], // S
    [[0, 5, 5], [0, 5, 0], [0, 5, 0]], // J
    [[6, 6, 0], [0, 6, 0], [0, 6, 0]], // L
    [[7, 7], [7, 7]] //O
];

// 主要的类
class Tetris {

    // 构造方法
    constructor(width, height, render, speed = 1) {
        this.Width = width;
        this.Height = height;
        this.Render = render;
        this.Blocks = BLOCKS;
        this.Speed = speed;
        this.reset();
    }

    // 检查碰撞
    hitTest(block, x, y) {
        if (block == null) return true;
        var blockCells = block
            .map((row, i) => row.map((cell, j) => {
                return { data: cell, y: i + y, x: j + x };
            })).reduce((a, b) => a.concat(b)).filter(cell => cell.data);
        if (blockCells.some(cell =>
            cell.y < 0 || cell.x < 0 ||
            cell.y > this.Height - 1 || cell.x > this.Width - 1))
            return true;
        else if (blockCells.some(cell => this.Board[cell.y][cell.x]))
            return true;
        else return false;
    }

    // 检查是否有完整的一行并返回消去的行数
    rowTest() {
        let count = 0;
        for (let i = 0; i < this.Height; i++) {
            if (!this.Board[i].some(x => x == 0)) {
                this.Board.splice(i, 1);
                this.Board.splice(0, 0, [...Array(this.Width)].map(x => 0));
                count++;
            }
        }
        this.Score += count * count * 100;
        return count;
    }

    // 旋转当前的block
    spin(block) {
        if (block == null) return;
        let length = block.length;
        let result = [...Array(length)].map(() => Array(length));
        for (let i = 0; i < length; i++)
            for (let j = 0; j < length; j++)
                result[i][j] = block[length - j - 1][i];
        return result;
    }

    // 向下移动一格
    move(x, y) {
        if (!this.hitTest(this.Block, this.X + x, this.Y + y)) {
            this.X += x;
            this.Y += y;
            return true;
        }
        else return false;
    }

    // 完成一个砖块的掉落
    drop() {
        this.Block.forEach((row, i) => row.forEach((cell, j) => {
            if (i + this.Y < this.Height && i + this.Y >= 0 &&
                j + this.X < this.Width && j + this.X >= 0)
                this.Board[i + this.Y][j + this.X] += cell;
        }));
        this.Block = null;
        this.rowTest();
    }

    // 更新状态，定时运行或在用户操作后运行
    update() {
        var board = JSON.parse(JSON.stringify(this.Board));
        if (this.Block != null)
            this.Block.forEach((row, i) => row.forEach((cell, j) => {
                if (i + this.Y < this.Height && i + this.Y >= 0 &&
                    j + this.X < this.Width && j + this.X >= 0)
                    board[i + this.Y][j + this.X] += cell;
            }));
        this.Render(board, this.Next, this.Score);
    }

    // 开始游戏
    start() {
        this.Interval = setInterval(() => this.tick(), 1000 / this.Speed);
    }

    // 停止游戏
    stop() {
        clearInterval(this.Interval);
    }

    // 重设状态
    reset() {
        this.Block = null;
        this.Next = this.random();
        this.X = 0;
        this.Y = 0;
        this.Score = 0;
        this.Interval = -1;
        this.Board = [...Array(this.Height)]
            .map(() => [...Array(this.Width)].map(x => 0));
    }

    // 随机生成一个砖块
    random() {
        const randomInt = (n) => Math.floor(Math.random() * n);
        var result = this.Blocks[randomInt(this.Blocks.length)];
        for (let i = 0; i < randomInt(4); i++)
            result = this.spin(result);
        return result;
    }

    // 每固定时间自动运行这里
    tick() {
        // 创建新的随机砖块
        if (this.Block == null) {
            this.Block = this.Next;
            this.Next = this.random();
            this.Y = 0;
            this.X = 0;
        }
        else if (!this.move(0, 1))
            this.drop();
        this.update();
    }

    // 接收外部操作
    action(code) {
        switch (code) {
            case 'move-left':
                this.move(-1, 0);
                break;
            case 'move-right':
                this.move(1, 0);
                break;
            case 'move-down':
                this.move(0, 1);
                break;
            case 'drop':
                while (this.move(0, 1)) { }
                break;
            case 'spin':
                let result = this.spin(this.Block);
                if (!this.hitTest(result, this.X, this.Y))
                    this.Block = result;
                break;
        }
        this.update();
    }
}

module.exports = Tetris;
