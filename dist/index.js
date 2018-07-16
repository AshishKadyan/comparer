var fs = require('fs');
var filehound = require('filehound');
var config = require('../config');
var array1 = [];
var array2 = [];
var path1 = config.paths.path1;
var path2 = config.paths.path2;
var counter = 1;
function img_pathfinder(path) {
    return new Promise(function (resolve, reject) {
        /*stuff using username, password*/
        var files = filehound.create()
            .paths(path)
            .ext('gif', 'png')
            .find();
        resolve(files);
    });
}
Promise.all([img_pathfinder(path1), img_pathfinder(path2)]).then(function (values) {
    values[1].forEach(function (element, outer_index) {
        values[1].forEach(function (element2, inner_index) {
            if (inner_index > outer_index) {
                comparer(element, element2); // compare files in folder asset1
            }
        });
    });
    values[0].forEach(function (element, outer_index) {
        values[0].forEach(function (element2, inner_index) {
            if (inner_index > outer_index) {
                comparer(element, element2); //compare files in folder asset2
            }
        });
        values[1].forEach(function (element2) {
            comparer(element, element2); // compare files of folder asset1 and asset2
        });
    });
});
function comparer(path1, path2) {
    var encodedImage1 = "";
    var encodedImage2 = "";
    var return_binary = function (path) {
        return new Promise(function (resolve, reject) {
            fs.readFile(path, function (err, data) {
                if (err)
                    throw err;
                var encoded = new Buffer(data, 'binary').toString('base64');
                resolve(encoded);
            });
        });
    };
    Promise.all([return_binary(path1), return_binary(path2)]).then(function (values) {
        if (values[0] == values[1]) {
            console.log("Duplicate reource " + counter + "=> ");
            console.log('\x1b[36m%s\x1b[0m', "  " + path1);
            console.log('\x1b[33m%s\x1b[0m', "  " + path2);
            counter++;
        }
    });
}
