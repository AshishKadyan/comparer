var fs = require('fs-extra');
var fs1 = require('fs');
var config = require('../config');
var rimraf = require('rimraf');
// rimraf(config.paths.dest, function () {
//     console.log('cleaned up destination directory');
// });
var source1 = config.paths.path1;
var source2 = config.paths.path2;
var destination = config.paths.dest;
var map_files_copied = {};
function copyMap(source, dest) {
    fs1.readdir(source, function (err, files) {
        var dest_file = "";
        var updated_destination = "";
        var updated_source = "";
        files.forEach(function (file) {
            var file_lowercase = file.toLowerCase();
            if (file_lowercase.indexOf("asset") > -1) {
                updated_source = source + ("/") + file;
                //  console.log(updated_source)
                copyMap(updated_source, dest);
            }
            else {
                if (file != "task.xml" && file != "practice.json") {
                    updated_source = source + "/" + file;
                    if (map_files_copied[file] == undefined) {
                        map_files_copied[file] = 0;
                    }
                    else {
                        map_files_copied[file]++;
                    }
                    if (map_files_copied[file] == 0) {
                        updated_destination = dest + "/" + file;
                    }
                    else {
                        if (file.indexOf(".") > -1) {
                            var file1 = file.replace(".", map_files_copied[file] + ".");
                            updated_destination = dest + "/" + file1;
                        }
                        else {
                            updated_destination = dest + "/" + file + "_" + map_files_copied[file];
                        }
                    }
                    copy(updated_source, updated_destination);
                }
            }
        });
    });
}
function copy(source, destination) {
    fs.copy(source, destination, function (err) {
        if (err) {
            console.log('An error occured while copying the folder.');
            return console.error(err);
        }
        console.log('Copy completed!');
    });
}
copyMap(source1, destination);
copyMap(source2, destination);
