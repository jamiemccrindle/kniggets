const range = (start, end) => Array.from({ length: end - start }, (v, i) => i);

const distance = (x1, y1, x2, y2) => Math.sqrt(Math.abs(x2 - x1) ** 2 + Math.abs(y2 - y1) ** 2);

const isUndefined = value => typeof value === 'undefined';
const isNotUndefined = value => !isUndefined(value);

// a class makes it easier for me to work with an encapsulated array
class Board {
    constructor(width, height) {
        this.data = Array.from({ length: width * height });
        this.width = width;
        this.height = height;
    }
    setCost(x, y, cost) {
        this.data[x * this.width + y] = cost;
    }
    hasCost(x, y) {
        return isNotUndefined(this.getCost(x, y));
    }
    getCost(x, y) {
        return this.data[x * this.width + y];
    }
    isValid(x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }
    getEmptyNeighbours(x, y) {
        return [
            [x + 1, y + 2],
            [x + 1, y - 2],
            [x + 2, y + 1],
            [x + 2, y - 1],
            [x - 1, y + 2],
            [x - 1, y - 2],
            [x - 2, y + 1],
            [x - 2, y - 1],
        ].filter(value => this.isValid(value[0], value[1]) && !this.hasCost(value[0], value[1]))
    }

    // when more than 2,2 blocks away just head straight for the end otherwise
    // penalise blocks that are at 0:1, 1:0, 1:1 and 2:2 (abs)
    distanceWithPenalty(x, y, endX, endY) {
        // 4 moves when 2 diagnals away
        if (Math.abs(endX - x) === 2 && Math.abs(endY - y) === 2) return (this.width * this.height + 2);

        // 3 moves when next to the end
        if (Math.abs(endX - x) === 1 && Math.abs(endY - y) === 0
            || Math.abs(endX - x) === 0 && Math.abs(endY - y) === 1) return (this.width * this.height + 1);

        // 2 moves when 1 diagonal away
        if (Math.abs(endX - x) === 1 && Math.abs(endY - y) === 1) return (this.width * this.height);

        // otherwise the distance
        return distance(x, y, endX, endY);
    }

    getNearestEmptyNeighbour(x, y, endX, endY) {
        // adding it onto the end makes it easier to debug the sort
        const neighbours = this.getEmptyNeighbours(x, y)
            .map(x => x.concat(this.distanceWithPenalty(x[0], x[1], endX, endY)));

        // could do it faster than a sort but I think it keeps it O(n) because it's a
        // constant length and the code is simpler
        neighbours.sort((a, b) => a[2] - b[2]);
        return neighbours[0];
    }
    toString() {
        // golf!
        return range(0, this.width)
            .reduce((result, i) => result.concat(range(0, this.height)
                .map(j => this.hasCost(i, j) ? this.getCost(i, j) : 'x').join(' ')), [])
            .join('\n');
    }
    toRowsAndColumns() {
        const result = [];
        for (let i = 0; i < this.width; i++) {
            result.push(this.data.slice(i * this.width, i * this.width + this.height));
        }
        return result;
    }
    maxCost() {
        return Math.max(...this.data);
    }
}

// breadth first search
function search(width, height, startX, startY) {
    const queue = [];
    const board = new Board(width, height);
    queue.push([startX, startY, 0]);
    while (queue.length > 0) {
        const [currentX, currentY, currentCost] = queue.shift();
        board.setCost(currentX, currentY, currentCost);
        const neighbours = board.getEmptyNeighbours(currentX, currentY);
        neighbours.forEach(neighbour => queue.push(neighbour.concat(currentCost + 1)));
    }
    return board;
}

// best first search
function shortest(width, height, startX, startY, endX, endY) {
    const board = new Board(width, height);
    let currentX = startX;
    let currentY = startY;
    let currentCost = 0;
    let path = [];
    while (!(currentX === endX && currentY === endY)) {
        board.setCost(currentX, currentY, currentCost);
        path.push([currentX, currentY]);
        const nearest = board.getNearestEmptyNeighbour(currentX, currentY, endX, endY);
        [currentX, currentY] = nearest;
        currentCost = currentCost + 1;
    }
    path.push([currentX, currentY]);
    board.setCost(currentX, currentY, currentCost);
    return { board, path, cost: currentCost };
}

function parseChess(value) {
    if (value.length !== 2) return undefined;
    const x = value[0].toUpperCase().charCodeAt(0) - 65;
    const y = parseInt(value[1], 10);
    if (x < 0 || x >= 8 || y < 1 || y > 8) {
        return undefined;
    }
    return [y - 1, x];
}


function numberToChar(value) {
    return String.fromCharCode(value + 97);
}

function stringifyChess(value) {
    if (value.length !== 2) return undefined;
    return String.fromCharCode(value[1] + 65) + (value[0] + 1);
}

module.exports = {
    range,
    distance,
    isUndefined,
    isNotUndefined,
    Board,
    search,
    shortest,
    parseChess,
    stringifyChess,
    numberToChar
}
