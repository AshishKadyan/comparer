"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fsMover = require('fs-extra');
var createCSVFile = require('csv-file-creator');
var fs = require('fs');
var filehound = require('filehound');
var config = require('../config');
var path = require('path');
var map_result = {};
var path1 = config.paths.dest;
var path2 = config.paths.path2;
var counter = 1;
var result = [];
var check_map = {};
function pathFinder(path) {
    return new Promise(function (resolve, reject) {
        var files = filehound.create()
            .paths(path)
            .find();
        //  console.log(files)
        resolve(files);
    });
}
function constructTask() {
    // function purifier(array) {
    //     var purifiedArray = array.filter(function (path) {
    //         var paths_array = path.split("\\")
    //         return !(paths_array[paths_array.length - 1] == "task.xml" || paths_array[paths_array.length - 1] == "practice.json")
    //     })
    //     return purifiedArray
    // }
    return new Promise(function (resolve, reject) {
        Promise.all([pathFinder(path1), pathFinder(path2)]).then(function (values) {
            values[0].forEach(function (element, outer_index) {
                values[0].forEach(function (element2, inner_index) {
                    if (inner_index > outer_index) {
                        if (!check_map[element2])
                            comparer(element, element2); //compare files in folder asset2
                    }
                });
            });
            values[0].forEach(function (element, outer_index) {
                values[1].forEach(function (element2) {
                    if (!check_map[element2]) {
                    }
                    //comparer(element, element2) // compare files of folder asset1 and asset2
                });
            });
            values[1].forEach(function (element, outer_index) {
                values[1].forEach(function (element2, inner_index) {
                    if (inner_index > outer_index) {
                        if (!check_map[element2]) {
                        }
                        // comparer(element, element2) // compare files in folder asset1
                    }
                });
            });
        }).then(function () {
            moveResource("all");
        }).then(function () {
            prepareResult;
        }).then(function () {
            moveResource("duplicate");
        });
    });
}
function prepareResult() {
    var counter = 0;
    for (var key in map_result) {
        result.push([]);
        result[counter].push(key);
        map_result[key].forEach(function (element) {
            result[counter].push(element);
        });
        counter++;
    }
    createCSVFile('result.csv', result);
}
function compareExtensionType(path1, path2, ext) {
    console.log("comparing files " + path1 + " & " + path2 + " on binary");
    var data1 = fs.readFileSync(path1);
    var encoded1 = new Buffer(data1, 'binary').toString('base64');
    var data2 = fs.readFileSync(path2);
    var encoded2 = new Buffer(data2, 'binary').toString('base64');
    return (encoded1 == encoded2);
}
function comparer(path1, path2) {
    var ext_check = function (path1, path2) {
        return (path.extname(path1) == path.extname(path2));
    };
    var size_check = function (path1, path2) {
        var stats = fs.statSync(path1);
        var fileSizeInBytes = stats.size;
        var stats1 = fs.statSync(path2);
        var fileSizeInBytes1 = stats1.size;
        return (fileSizeInBytes == fileSizeInBytes1);
    };
    if (ext_check(path1, path2) && size_check(path1, path2) && compareExtensionType(path1, path2, path.extname(path1))) {
        check_map[path2] = true;
        if (map_result[path1] == undefined) {
            map_result[path1] = [];
        }
        map_result[path1].push(path2);
        counter++;
    }
}
function moveFile(src, dest) {
    var files_to_copy_array = src.split("\\");
    var filename = files_to_copy_array[files_to_copy_array.length - 1];
    fsMover.move(src, dest + "/" + filename);
}
function moveResource(type) {
    //console.log(map_result);
    function resourseToMove(resourseArray, dest) {
        resourseArray.forEach(function (element) {
            moveFile(element, dest);
        });
    }
    if (type == "duplicate") {
        var dest2 = config.paths.dest + "/trash";
        for (var key in map_result) {
            resourseToMove(map_result[key], dest2);
        }
    }
}
constructTask();
