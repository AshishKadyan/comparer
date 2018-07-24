import { resolve } from "path";
import { rejects } from "assert";

const fs = require('fs-extra')
const fs1 = require('fs');
var config = require('../config');
var rimraf = require('rimraf');

var source1 = config.paths.path1
var source2 = config.paths.path2
var destination = config.paths.dest
var map_files_copied = {};
var map_updated_dest={};


function clearDest(dest) {
    return new Promise((resolve, reject) => {
        rimraf(dest, function () {
            console.log('cleaned up ' + dest + ' directory');
            resolve();
        });
    })

}

function copyMap(source, dest) {
    fs1.readdir(source, (err, files) => {
        var dest_file = ""

        var updated_destination = ""
        var updated_source = ""
        files.forEach(file => {
            var file_lowercase = file.toLowerCase()
            if (file_lowercase.indexOf("asset") > -1) {
                updated_source = source + ("/") + file
                //  console.log(updated_source)
                copyMap(updated_source, dest);
            } else {
                if (file != "task.xml" && file != "practice.json") {
                    updated_source = source + "/" + file
                    if (map_files_copied[file] == undefined) {
                        map_files_copied[file] = 0;
                    } else {
                        map_files_copied[file]++
                    }

                    if (map_files_copied[file] == 0) {
                        updated_destination = dest + "/" + file
                    } else {
                        if (file.indexOf(".") > -1) {
                            var file1 = file.replace(".", map_files_copied[file] + ".")

                            updated_destination = dest + "/" + file1
                        } else {
                            updated_destination = dest + "/" + file + "_" + map_files_copied[file]
                        }
                    }
             
                    map_updated_dest[updated_source] = updated_destination
                    console.log(map_updated_dest)
                    copy(updated_source, updated_destination)

                }
            }


        });
    })

}

function copy(source, destination) {
    fs.copy(source, destination, function (err) {
        if (err) {
            console.log('An error occured while copying the folder.')
            return console.error(err)
        }
        console.log('Copy completed!')
    });
}
clearDest(config.paths.dest).then(async function () {

    await copyMap(source1, destination)
    await copyMap(source2, destination)
}).then(function(){
    console.log(map_updated_dest)
})
