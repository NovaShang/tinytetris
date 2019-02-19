const Tetris = require('./index.js')
const assert = require('assert');

describe("Tetris", () => {
    it("渲染文字", () => {
        Tetris.renderAscii([[0, 0, 0], [0, 1, 0], [0, 1, 1]], (s) => {
            assert.equal("□□□\n□■□\n□■■", s);
        });
    });
    it("渲染canvas", () => {
        let ctx = {
            clearRect: (x, y, w, h) => { },
            fillRect: (x, y, w, h) => { }
        };
        Tetris.renderCanvas([[0, 0, 0], [0, 1, 0], [0, 1, 1]], ctx, 2, 10, 10);
    });
    it("碰撞检查 - 碰砖块", () => {
        let t = new Tetris(3, 5, (s) => { });
        t.Board = [
            [0, 0, 0],
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 0],
        ]
        t.Block = [
            [1, 1],
            [1, 1]
        ]
        assert.equal(true, t.hitTest(t.Block, 1, 1));
    });
    it("碰撞检查 - 碰墙", () => {
        let t = new Tetris(3, 5, (s) => { });
        t.Board = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 1, 0],
        ]
        t.Block = [
            [1, 1],
            [1, 1]
        ]
        assert.equal(true, t.hitTest(t.Block, 2, 2));
    });
    it("碰撞检查 - 不碰", () => {
        let t = new Tetris(3, 5, (s) => { });
        t.Board = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 1, 0],
            [0, 1, 0],
        ]
        t.Block = [
            [1, 1],
            [0, 1]
        ]
        assert.equal(false, t.hitTest(t.Block, 1, 2));
    });
    it("消去检查", () => {
        let t = new Tetris(3, 5, (s) => { });
        t.Board = [
            [0, 0, 0],
            [0, 0, 1],
            [1, 1, 1],
            [0, 1, 0],
            [1, 1, 1],
        ]
        assert.equal(2, t.rowTest());
        assert.equal(0, t.Board[4][0]);
        assert.equal(1, t.Board[4][1]);
        assert.equal(0, t.Board[3][1]);
        assert.equal(1, t.Board[3][2]);
        assert.equal(3, t.Board[2].filter(x => x == 0).length);
    });
    it("顺时针旋转 4x4", () => {
        let t = new Tetris(4, 5, (s) => { });
        t.Block = [
            [1, 1, 1, 1],
            [1, 0, 1, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        let expect = [
            [0, 0, 1, 1],
            [0, 0, 0, 1],
            [0, 0, 1, 1],
            [0, 0, 0, 1]
        ];
        t.spin();
        assert.equal(JSON.stringify(expect), JSON.stringify(t.Block));
    });
    it("顺时针旋转 3x3", () => {
        let t = new Tetris(3, 5, (s) => { });
        t.Block = [
            [1, 1, 1],
            [0, 0, 1],
            [0, 0, 0],
        ];
        let expect = [
            [0, 0, 1],
            [0, 0, 1],
            [0, 1, 1],
        ];
        t.spin();
        assert.equal(JSON.stringify(expect), JSON.stringify(t.Block));
    });
    it("逆时针旋转", () => {
        let t = new Tetris(3, 5, (s) => { });
        t.Block = [
            [1, 1, 1],
            [0, 0, 1],
            [0, 0, 0],
        ];
        let expect = [
            [1, 1, 0],
            [1, 0, 0],
            [1, 0, 0],
        ];
        t.spin(true);
        assert.equal(JSON.stringify(expect), JSON.stringify(t.Block));
    });
    it("旋转碰撞", () => {
        let t = new Tetris(3, 5, (s) => { });
        t.Board = [
            [0, 0, 0],
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 0],
        ]
        t.Block = [
            [1, 1, 1],
            [0, 0, 1],
            [0, 0, 0],
        ];
        let expect = [
            [1, 1, 1],
            [0, 0, 1],
            [0, 0, 0],
        ];
        t.spin();
        assert.equal(JSON.stringify(expect), JSON.stringify(t.Block));
    });
    it("移动", () => {
        let t = new Tetris(3, 5, (s) => { });
        t.Y = 1;
        t.Block = [
            [1, 1, 1],
            [0, 0, 1],
            [0, 0, 0],
        ];
        t.move(0, 1);
        assert.equal(2, t.Y);
    });
    it("移动碰撞", () => {
        let t = new Tetris(3, 5, (s) => { });
        t.Y = 1;
        t.Block = [
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 1],
        ];
        t.Board = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 1, 0],
        ]
        t.move(0, 1);
        assert.equal(1, t.Y);
    });
    it("更新状态", () => {
        let t = new Tetris(3, 5, (matrix) => {
            let expect = [
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 1],
                [0, 0, 0],
                [0, 1, 0],
            ];
            assert.equal(JSON.stringify(expect), JSON.stringify(matrix))
        });
        t.Block = [
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 1],
        ];
        t.Board = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 1, 0],
        ]
        t.update();
    });
})