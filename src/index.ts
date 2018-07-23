import { extname } from "path";
import { promises } from "fs";
import { resolve } from "url";
import { rejects } from "assert";
var fsMover = require('fs-extra');
const createCSVFile = require('csv-file-creator');
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
        //  console.log(files)

        resolve(files)
    });
}
function constructTask() {
    function purifier(array){
        var purifiedArray = array.filter(function (path) {
            var paths_array = path.split("\\")
            return !(paths_array[paths_array.length - 1] == "task.xml" || paths_array[paths_array.length - 1] == "practice.json")
        })
        return purifiedArray
    }
    return new Promise((resolve, reject) => {
        Promise.all([pathFinder(path1), pathFinder(path2)]).then(values => {
            console.log(values)

            var array_path1 =purifier(values[0])
            var array_path2 =purifier(values[1])
            console.log(array_path1);
            console.log(array_path2);
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
        }).then(function () {
            moveResource("all")
        }).then(function () {
            prepareResult
        }).then(function () {
            moveResource("duplicate")
        })
    })

}
function prepareResult() {
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
    createCSVFile('result.csv', result);

}
function compareExtensionType(path1: string, path2: string, ext: string) {
    console.log("comparing files " + path1 + " & " + path2 + " on binary")
    var data1 = fs.readFileSync(path1)
    const encoded1 = new Buffer(data1, 'binary').toString('base64');
    var data2 = fs.readFileSync(path2)
    const encoded2 = new Buffer(data2, 'binary').toString('base64');
    return (encoded1 == encoded2)
}
function comparer(path1: string, path2: string): void {
    var ext_check = function (path1, path2) {
        return (path.extname(path1) == path.extname(path2))
    }
    var size_check = function (path1, path2) {
        const stats = fs.statSync(path1)
        const fileSizeInBytes = stats.size
        const stats1 = fs.statSync(path2)
        const fileSizeInBytes1 = stats1.size
        return (fileSizeInBytes == fileSizeInBytes1)
    }
    if (ext_check(path1, path2) && size_check(path1, path2) && compareExtensionType(path1, path2, path.extname(path1))) {
        check_map[path2] = true
        if (map_result[path1] == undefined) {
            map_result[path1] = []
        }
        map_result[path1].push(path2);
        counter++;
    }
}
function copyFile(src: string, dest: string) {
    var files_to_copy_array = src.split("\\");
    var filename = files_to_copy_array[files_to_copy_array.length - 1]
    fs.access(dest, (err) => {
        if (err)
            fs.mkdirSync(dest);
        copyF(src, path.join(dest, filename));
    });
    function copyF(src, dest) {
        let readStream = fs.createReadStream(src);
        readStream.once('error', (err) => {
            console.log(err);
        });
        readStream.once('end', () => {
            console.log('Done copying ' + src + " to " + dest);
        });
        readStream.pipe(fs.createWriteStream(dest));
    }
}
function moveResource(type: string) {
    //console.log(map_result);
    function resourseToMove(resourseArray, dest) {
        resourseArray.forEach(element => {
            copyFile(element, dest);
        });
    }
    if (type == "all") {
        var dest1 = config.paths.dest



    }
    if (type == "duplicate") {
        var dest2 = config.paths.dest + "/duplicates"
        for (var key in map_result) {
            resourseToMove(map_result[key], dest2);
        }

    }
}
constructTask();