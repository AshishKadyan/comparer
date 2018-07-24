var equal = require('deep-equal');
console.dir([
    equal(
        { a : [ 2, 3 ], b : [ 4 ] },
        {  b : [ 4 ],a : [ 2, 3 ] }
    ),
    equal(
        { x : 5, y : 6 },
        { x : 5, y : 6 }
    )
]);
