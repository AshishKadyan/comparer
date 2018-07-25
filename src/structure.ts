import { resolve } from "path";
import { rejects } from "assert";

const fs = require('fs-extra')
const fs1 = require('fs');
var config = require('../config');
var rimraf = require('rimraf');


class structure {
    public source1 = config.paths.path1
    public source2 = config.paths.path2
    public destination = config.paths.dest
    public map_files_copied = {};
    public map_updated_dest = {};
    constructor() {
        this.clearDest(config.paths.dest).then(async function () {

            await this.copyMap(this.source1, this.destination)
            await this.copyMap(this.source2, this.destination)
        }).then(function () {
            console.log(this.map_updated_dest)
        })



    }
    clearDest(dest) {
        return new Promise((resolve, reject) => {
            rimraf(dest, function () {
                console.log('cleaned up ' + dest + ' directory');
                resolve();
            });
        })

    }

    copyMap(source, dest) {
        fs1.readdir(source, (err, files) => {
            var dest_file = ""

            var updated_destination = ""
            var updated_source = ""
            files.forEach(file => {
                var file_lowercase = file.toLowerCase()
                if (file_lowercase.indexOf("asset") > -1) {
                    updated_source = source + ("/") + file
                    //  console.log(updated_source)
                    this.copyMap(updated_source, dest);
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
                        this.copy(updated_source, updated_destination)

                    }
                }


            });
        })

    }

    copy(source, destination) {
        fs.copy(source, destination, function (err) {
            if (err) {
                console.log('An error occured while copying the folder.')
                return console.error(err)
            }
            console.log('Copy completed!')
        });
    }
};

module.exports = structure;

// let createStructure = new structure();
// createStructure.clearDest(config.paths.dest).then(async function () {

//     await createStructure.copyMap(source1, destination)
//     await createStructure.copyMap(source2, destination)
// }).then(function () {
//     console.log(map_updated_dest)
// })
