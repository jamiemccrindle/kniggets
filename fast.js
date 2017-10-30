const cache = require('./cache.json');

const knights = require('./knights');

function usage() {
    console.error('usage:')
    console.error('\tnode ./fast.js start end');
}

function main(argv) {
    if (argv.length !== 4) {
        usage();
        process.exit(1);
    }

    const [startArg, endArg] = argv.slice(2);   

    console.log(cache[startArg + endArg]);
}

main(process.argv);