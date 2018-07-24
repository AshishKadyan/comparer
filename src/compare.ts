const fs = require('fs');
const HtmlDiffer = require('html-differ').HtmlDiffer;
const logger = require('html-differ/lib/logger');
const equal = require("deep-equal")

var size_check = function (path1, path2) {
    const stats = fs.statSync(path1)
    const fileSizeInBytes = stats.size
    const stats1 = fs.statSync(path2)
    const fileSizeInBytes1 = stats1.size
    if (fileSizeInBytes == fileSizeInBytes1)
        console.log("file size equal")
    return (fileSizeInBytes == fileSizeInBytes1)

}
function compareHTML(path1: string, path2: string) {
    console.log("comparing files " + path1 + " & " + path2 + " on HTML-differ")
    var html1 = fs.readFileSync(path1, 'utf-8');
    var html2 = fs.readFileSync(path2, 'utf-8');
    var options = {
        ignoreAttributes: [],
        compareAttributesAsJSON: [],
        ignoreWhitespaces: true,
        ignoreComments: true,
        ignoreEndTags: false,
        ignoreDuplicateAttributes: false
    };
    var htmlDiffer = new HtmlDiffer(options);
    var diff = htmlDiffer.diffHtml(html1, html2),
        isEqual = htmlDiffer.isEqual(html1, html2),
        res = logger.getDiffText(diff, { charsAroundDiff: 40 });
    // logger.logDiffText(diff, { charsAroundDiff: 40 });

    return isEqual
}
function compareBinary(path1: string, path2: string) {
    console.log("comparing files " + path1 + " & " + path2 + " on binary")
    if (!size_check(path1, path2)) {
        return false
    }
    var data1 = fs.readFileSync(path1)
    const encoded1 = new Buffer(data1, 'binary').toString('base64');
    var data2 = fs.readFileSync(path2)
    const encoded2 = new Buffer(data2, 'binary').toString('base64');
    return (encoded1 == encoded2)
}
function compareJSON(path1, path2) {
    console.log("comparing files " + path1 + " & " + path2 + " on assert deep-equal")
    var json1 = fs.readFileSync(path1, 'utf-8');
    var json2 = fs.readFileSync(path2, 'utf-8');
    var res = equal(JSON.stringify(json1), JSON.stringify(json2))
    console.log(res)
    return res;
}
var abc = {
    compareExtensionType: function (path1: string, path2: string, ext: string) {

        switch (ext) {
            case ".htm":
                return compareHTML(path1, path2);

            case ".html":
                return compareHTML(path1, path2);

            case ".json":
                return compareJSON(path1, path2)

            default:
                return compareBinary(path1, path2);
        }
    }
}
module.exports = abc;
