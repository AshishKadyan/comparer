var fs = require("fs");
var filehound = require("filehound")
var config=require('./config')
var array1 = [];
var array2 = [];
console.log(config.paths.path1)
path1 = config.paths.path1;
path2 = config.paths.path2;
var counter = 1

var img_pathfinder = function (path) {
    return new Promise(function (resolve, reject) {
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

function comparer(path1, path2) {
    var encodedImage1 = ""
    var encodedImage2 = ""
    var return_binary = function (path) {
        return new Promise(function (resolve, reject) {
            /*stuff using username, password*/
            fs.readFile(path, function (err, data) {
                if (err) throw err;
                // Encode to base64
                encoded = new Buffer(data, 'binary').toString('base64');
                resolve(encoded);
                // Decode from base64

            });
        });
    }
    Promise.all([return_binary(path1), return_binary(path2)]).then(function (values) {
        if (values[0] == values[1]) {
            console.log("Duplicate reource " + counter + "=> " + path1 + "  " + path2)
            counter++;
        }
    })
}