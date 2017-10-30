const knights = require('./knights');

function usage() {
    console.error('usage:')
    console.error('\tnode ./knights1.js start end');
}


function main(argv) {
    if (argv.length !== 4) {
        usage();
        process.exit(1);
    }

    const [startArg, endArg] = argv.slice(2);   

    const start = knights.parseChess(startArg);
    const end = knights.parseChess(endArg);

    if (knights.isUndefined(start) || knights.isUndefined(end)) {
        console.error(`${startArg} or ${endArg} are not valid chess notation e.g. A1 B3 etc.`)
        usage();
        process.exit(1);
    }

    const [width, height, startX, startY, endX, endY] = [8, 8].concat(start).concat(end);

    const { path } = knights.shortest(width, height, startX, startY, endX, endY);

    // don't log the start of the path as per spec
    console.log(path.slice(1).map(knights.stringifyChess).join(' '));
}

main(process.argv);