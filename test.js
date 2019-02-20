const Tetris = require('./tinytetris.js')
const assert = require('assert');

describe("Tetris", () => {
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
        ];
        let expect = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 1],
            [0, 1, 0],
        ];
        assert.equal(2, t.rowTest());
        assert.equal(JSON.stringify(expect), JSON.stringify(t.Board));
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
        let result = t.spin(t.Block);
        assert.equal(JSON.stringify(expect), JSON.stringify(result));
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
        let result = t.spin(t.Block);
        assert.equal(JSON.stringify(expect), JSON.stringify(result));
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
    it("移动碰撞 - 边界", () => {
        let t = new Tetris(3, 5, (s) => { });
        t.Y = 3;
        t.Block = [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0],
        ];
        t.Board = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ]
        t.move(0, 1);
        assert.equal(3, t.Y);
    });
    it("完成下落", () => {
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
        ];
        let expect = [
            [0, 0, 0],
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 1],
            [0, 1, 0],
        ];
        t.drop();
        assert.equal(JSON.stringify(expect), JSON.stringify(t.Board));
        assert.equal(null, t.Block);
    });
    it("更新状态", (done) => {
        let t = new Tetris(3, 5, (matrix) => {
            let expect = [
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 1],
                [0, 0, 0],
                [0, 1, 0],
            ];
            assert.equal(JSON.stringify(expect), JSON.stringify(matrix))
            done();
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
        ];
        t.update();
    });
    it("更新状态 - 超出范围", (done) => {
        let t = new Tetris(3, 5, (matrix) => {
            let expect = [
                [0, 0, 1],
                [0, 0, 1],
                [0, 1, 1],
                [0, 0, 0],
                [0, 1, 0],
            ];
            assert.equal(JSON.stringify(expect), JSON.stringify(matrix))
            done();
        });
        t.Block = [
            [0, 1, 0],
            [0, 1, 0],
            [1, 1, 0],
        ];
        t.Board = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 1, 0],
        ];
        t.X = 1;
        t.update();
    });

    it("开始/停止", (done) => {
        let t = new Tetris(3, 10, () => { }, 10);
        t.start();
        setTimeout(() => {
            assert.equal(2, t.Y);
            t.stop();
            setTimeout(() => {
                assert.equal(2, t.Y);
                done();
            }, 200)
        }, 350)
    });
    it("生成新砖块", () => {
        let t = new Tetris(3, 5, (m) => { });
        t.tick();
        assert.equal(true, t.Block.length > 1);
    });
    it("触底判断", () => {
        let t = new Tetris(3, 5, (m) => { });
        t.Block = [
            [0, 0, 1],
            [1, 1, 1],
            [0, 0, 0],
        ];
        t.Y = 3;
        t.tick();
        let expect = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 1],
            [1, 1, 1],
        ];
        assert.equal(null, t.Block);
        assert.equal(100, t.Score);
    });
    it("按键动作", (done) => {

        let t = new Tetris(3, 5, (m) => { }, 10);
        let callAll = () => {
            t.action('move-left');
            t.action('move-right');
            t.action('move-down');
            t.action('spin');
            t.action('drop');
        };
        t.start();
        callAll();
        setTimeout(() => {
            callAll();
            setTimeout(() => {
                callAll();
                t.stop();
                done();
            }, 200)
        }, 350)
    });
})