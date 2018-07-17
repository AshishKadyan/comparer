const fs = require('fs');
const filehound = require('filehound');
var config = require('../config');
var array1 = [];
var array2 = [];
var map = {};
const path1 = config.paths.path1;
const path2 = config.paths.path2;
var counter = 1
var paths1 = []
var paths2 = []
var check_map = {};

function img_pathfinder(path: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        /*stuff using username, password*/
        const files = filehound.create()
            .paths(path)
            .ext('gif', 'png', 'htm', 'xml', 'jpg', 'jpeg', 'bmp', 'svg', 'lnk', 'cur', 'ico', ',mp3', 'mso', 'thmx', 'mp4', 'ogg', 'wmv', 'wav', 'pdf', 'xlsr', 'accdb', 'db', 'dotx', 'docx', 'xsl', 'xlsx', 'wmf', 'txt', 'js', 'html', 'json', 'xml', 'ts')
            .find();
        resolve(files)
    });
}

Promise.all([img_pathfinder(path1), img_pathfinder(path2)]).then(values => {

    values[0].forEach((element, outer_index) => {
        values[0].forEach((element2, inner_index) => {
            if (inner_index > outer_index) {
                if(!check_map[element2])
                    comparer(element, element2) //compare files in folder asset2
            }

        })
    });
    values[0].forEach((element, outer_index) => {
        values[1].forEach(element2 => {
            if(!check_map[element2])
                comparer(element, element2) // compare files of folder asset1 and asset2
        });
    });
    values[1].forEach((element, outer_index) => {
        values[1].forEach((element2, inner_index) => {
            if (inner_index > outer_index) {
                if(!check_map[element2])
                  comparer(element, element2) // compare files in folder asset1

            }

        })
    });
}).then(function () {
    console.log(map)
    console.log(check_map)
})

function comparer(path1, path2): void {
    var encodedImage1 = ""
    var encodedImage2 = ""
    var return_binary = function (path) {

        var data = fs.readFileSync(path)
        const encoded = new Buffer(data, 'binary').toString('base64');
        //  console.log(encoded)
        return encoded

    }
    var values = []
    values[0] = return_binary(path1)
    values[1] = return_binary(path2)
    if (values[0] == values[1]) {
        check_map[path2] = true
        if (map[path1] == undefined) {
            map[path1] = []
        }
        map[path1].push(path2);
        // console.log("Duplicate reource " + counter + "=> ")
        // console.log('\x1b[36m%s\x1b[0m', "  " + path1);
        // console.log('\x1b[33m%s\x1b[0m', "  " + path2);
        counter++;
    }

}