"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var filehound = require('filehound');
var config = require('../config');
var path = require('path');
var map = {};
var path1 = config.paths.path1;
var path2 = config.paths.path2;
var counter = 1;
var check_map = {};
function pathFinder(path) {
    return new Promise(function (resolve, reject) {
        var files = filehound.create()
            .paths(path)
            .ext('gif', 'png', 'htm', 'xml', 'jpg', 'jpeg', 'bmp', 'svg', 'lnk', 'cur', 'ico', ',mp3', 'mso', 'thmx', 'mp4', 'ogg', 'wmv', 'wav', 'pdf', 'xlsr', 'accdb', 'db', 'dotx', 'docx', 'xsl', 'xlsx', 'wmf', 'txt', 'js', 'html', 'json', 'xml', 'ts', 'mp3')
            .find();
        resolve(files);
    });
}
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
}).then(function () {
    console.log(map);
    // console.log(check_map)
});
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
    if (ext_check(path1, path2)) {
        var path1_binary = return_binary(path1);
        var path2_binary = return_binary(path2);
        if (path1_binary == path2_binary) {
            check_map[path2] = true;
            if (map[path1] == undefined) {
                map[path1] = [];
            }
            map[path1].push(path2);
            counter++;
        }
    }
}
