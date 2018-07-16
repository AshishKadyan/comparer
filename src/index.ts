const fs = require('fs');
const filehound = require('filehound');
var config = require('../config');
var array1 = [];
var array2 = [];

const path1 = config.paths.path1;
const path2 = config.paths.path2;
var counter = 1

function img_pathfinder(path: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        /*stuff using username, password*/
        const files = filehound.create()
            .paths(path)
            .ext('gif', 'png')
            .find();
        resolve(files)
    });
}

Promise.all([img_pathfinder(path1), img_pathfinder(path2)]).then(values => {
    values[0].forEach(element => {
        values[1].forEach(element2 => {
            comparer(element, element2)
        });
    });
});

function comparer(path1, path2): void {
    var encodedImage1 = ""
    var encodedImage2 = ""
    var return_binary = function (path) {
        return new Promise(function (resolve, reject) {
            fs.readFile(path, function (err, data: any) {
                if (err) throw err;
                const encoded = new Buffer(data, 'binary').toString('base64');
                resolve(encoded);
            });
        });
    }
    Promise.all([return_binary(path1), return_binary(path2)]).then(function (values) {
        if (values[0] == values[1]) {
            console.log("Duplicate reource " + counter + "=> ")
            console.log('\x1b[36m%s\x1b[0m', "  " + path1);
            console.log('\x1b[33m%s\x1b[0m', "  " + path2);
            counter++;
        }
    })
}