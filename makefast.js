const knights = require('./knights');
const assert = require('assert');

function makeCache(width, height) {
    const result = {};
    for (let startX = 0; startX < width; startX++) {
        for (let startY = 0; startY < height; startY++) {
            for (let endX = 0; endX < width; endX++) {
                for (let endY = 0; endY < height; endY++) {
                    const { path } = knights.shortest(width, height, startX, startY, endX, endY);
                    result[
                        knights.stringifyChess([startX, startY]) + knights.stringifyChess([endX, endY])
                    ] = path.slice(1).map(knights.stringifyChess).join(' ');
                }
            }
        }
    }
    return result;
}

function main() {
    console.log(JSON.stringify(makeCache(8, 8)));
}

main();