import { resolve } from "path";
import { rejects } from "assert";

const fs = require('fs-extra')
const fs1 = require('fs');
var config = require('../config');
var rimraf = require('rimraf');


export class structure {

    public source1 = config.paths.path1
    public source2 = config.paths.path2
    public destination = config.paths.dest
    public map_files_copied = {};
    public map_updated_dest = {};
    constructor() {

    }
    driver() {
        let self = this
        this.clearDest(config.paths.dest).then(async function () {

            await self.copyMap(self.source1, self.destination)
            await self.copyMap(self.source2, self.destination)
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
                        if (this.map_files_copied[file] == undefined) {
                            this.map_files_copied[file] = 0;
                        } else {
                            this.map_files_copied[file]++
                        }

                        if (this.map_files_copied[file] == 0) {
                            updated_destination = dest + "/" + file
                        } else {
                            if (file.indexOf(".") > -1) {
                                var file1 = file.replace(".", this.map_files_copied[file] + ".")

                                updated_destination = dest + "/" + file1
                            } else {
                                updated_destination = dest + "/" + file + "_" + this.map_files_copied[file]
                            }
                        }

                        this.map_files_copied[updated_source] = updated_destination
                        console.log(this.map_files_copied)
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