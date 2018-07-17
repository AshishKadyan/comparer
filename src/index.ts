import { extname } from "path";

const fs = require('fs');
const filehound = require('filehound');
var config = require('../config');
var path = require('path')
var map_result = {};
const path1 = config.paths.path1;
const path2 = config.paths.path2;
var counter = 1
var result = []
var check_map = {};

function pathFinder(path: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        const files = filehound.create()
            .paths(path)
            .find();
        resolve(files)
    });
}

Promise.all([pathFinder(path1), pathFinder(path2)]).then(values => {

    values[0].forEach((element, outer_index) => {
        values[0].forEach((element2, inner_index) => {
            if (inner_index > outer_index) {
                if (!check_map[element2])
                    comparer(element, element2) //compare files in folder asset2
            }

        })
    });
    values[0].forEach((element, outer_index) => {
        values[1].forEach(element2 => {
            if (!check_map[element2])
                comparer(element, element2) // compare files of folder asset1 and asset2
        });
    });
    values[1].forEach((element, outer_index) => {
        values[1].forEach((element2, inner_index) => {
            if (inner_index > outer_index) {
                if (!check_map[element2])
                    comparer(element, element2) // compare files in folder asset1

            }

        })
    });
}).then(prepare_result)
function prepare_result(){
    var counter = 0;
    for (var key in map_result) {
        result.push([])
        result[counter].push(key)
        map_result[key].forEach(element => {
            result[counter].push(element)

        });
        counter++;
    }
    console.log(result)
}
function comparer(path1, path2): void {
    var encodedImage1 = ""
    var encodedImage2 = ""
    var return_binary = function (path) {

        var data = fs.readFileSync(path)
        const encoded = new Buffer(data, 'binary').toString('base64');
        return encoded

    }
    var ext_check = function (path1, path2) {
        return (path.extname(path1) == path.extname(path2))
    }

    if (ext_check(path1, path2)) {
        console.log("comparing files " + path1 + " & " + path2)
        var path1_binary = return_binary(path1)
        var path2_binary = return_binary(path2)
        if (path1_binary == path2_binary) {
            check_map[path2] = true
            if (map_result[path1] == undefined) {
                map_result[path1] = []
            }
            map_result[path1].push(path2);
            counter++;
        }
    }


}