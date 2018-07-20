"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createCSVFile = require('csv-file-creator');
var fs = require('fs');
var filehound = require('filehound');
var config = require('../config');
var path = require('path');
var map_result = {};
var path1 = config.paths.path1;
var path2 = config.paths.path2;
var counter = 1;
var result = [];
var check_map = {};
function path_finder(path) {
    return new Promise(function (resolve, reject) {
        var files = filehound.create()
            .paths(path)
            .find();
        //  console.log(files)
        resolve(files);
    });
}
Promise.all([path_finder(path1), path_finder(path2)]).then(function (values) {
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
            if (!check_map[element2])
                comparer(element, element2); // compare files of folder asset1 and asset2
        });
    });
    values[1].forEach(function (element, outer_index) {
        values[1].forEach(function (element2, inner_index) {
            if (inner_index > outer_index) {
                if (!check_map[element2])
                    comparer(element, element2); // compare files in folder asset1
            }
        });
    });
}).then(prepare_result);
function prepare_result() {
    var counter = 0;
    for (var key in map_result) {
        result.push([]);
        result[counter].push(key);
        map_result[key].forEach(function (element) {
            result[counter].push(element);
        });
        counter++;
    }
    console.log(result);
    createCSVFile('result.csv', result);
}
function comparer(path1, path2) {
    var encodedImage1 = "";
    var encodedImage2 = "";
    var return_binary = function (path) {
        var data = fs.readFileSync(path);
        var encoded = new Buffer(data, 'binary').toString('base64');
        return encoded;
    };
    var ext_check = function (path1, path2) {
        return (path.extname(path1) == path.extname(path2));
    };
    var size_check = function (path1, path2) {
        var stats = fs.statSync(path1);
        var fileSizeInBytes = stats.size;
        var stats1 = fs.statSync(path1);
        var fileSizeInBytes1 = stats.size;
        // if (fileSizeInBytes == fileSizeInBytes1) {
        //     console.log(fileSizeInBytes + "   " + fileSizeInBytes1)
        // }
        return (fileSizeInBytes == fileSizeInBytes1);
    };
    var size_check = function (path1, path2) {
        var stats1 = fs.statSync(path1);
        var fileSizeInBytes1 = stats1.size;
        var stats2 = fs.statSync(path2);
        var fileSizeInBytes2 = stats2.size;
        return (fileSizeInBytes1 == fileSizeInBytes2);
    };
    if (ext_check(path1, path2) && size_check(path1, path2)) {
        console.log("comparing files " + path1 + " & " + path2);
        var path1_binary = return_binary(path1);
        var path2_binary = return_binary(path2);
        if (path1_binary == path2_binary) {
            check_map[path2] = true;
            if (map_result[path1] == undefined) {
                map_result[path1] = [];
            }
            map_result[path1].push(path2);
            counter++;
        }
    }
}
