const knights = require('./knights');
const assert = require('assert');

function testShortest(width, height) {
    for (let startX = 0; startX < width; startX++) {
        for (let startY = 0; startY < height; startY++) {
            const board = knights.search(width, height, startX, startY);
            for (let endX = 0; endX < width; endX++) {
                for (let endY = 0; endY < height; endY++) {
                    const { cost } = knights.shortest(width, height, startX, startY, endX, endY);
                    assert.equal(cost, board.getCost(endX, endY));
                }
            }
        }
    }
}

function main() {
    testShortest(8, 8);
    testShortest(5, 5);
    testShortest(10, 10);
    testShortest(10, 5);
}

main();