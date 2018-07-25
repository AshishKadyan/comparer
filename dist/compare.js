"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var HtmlDiffer = require('html-differ').HtmlDiffer;
var logger = require('html-differ/lib/logger');
var equal = require("deep-equal");
function isOfSameSize(path1, path2) {
    return fs.statSync(path1).size === fs.statSync(path2).size;
}
function isEqualHtml(path1, path2) {
    console.log("comparing files " + path1 + " & " + path2 + " on HTML-differ");
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
    var diff = htmlDiffer.diffHtml(html1, html2), isEqual = htmlDiffer.isEqual(html1, html2), res = logger.getDiffText(diff, { charsAroundDiff: 40 });
    // logger.logDiffText(diff, { charsAroundDiff: 40 });
    return isEqual;
}
function isEqualBinary(path1, path2) {
    console.log("comparing files " + path1 + " & " + path2 + " on binary");
    if (!isOfSameSize(path1, path2)) {
        return false;
    }
    var data1 = fs.readFileSync(path1);
    var encoded1 = new Buffer(data1, 'binary').toString('base64');
    var data2 = fs.readFileSync(path2);
    var encoded2 = new Buffer(data2, 'binary').toString('base64');
    return encoded1 === encoded2;
}
function isEqualJson(path1, path2) {
    console.log("comparing files " + path1 + " & " + path2 + " on assert deep-equal");
    var json1 = fs.readFileSync(path1, 'utf-8');
    var json2 = fs.readFileSync(path2, 'utf-8');
    var res = equal(JSON.stringify(json1), JSON.stringify(json2));
    console.log(res);
    return res;
}
function compareExtensionType(path1, path2, ext) {
    switch (ext) {
        case ".htm":
            return isEqualHtml(path1, path2);
        case ".html":
            return isEqualHtml(path1, path2);
        case ".json":
            return isEqualJson(path1, path2);
        default:
            return isEqualBinary(path1, path2);
    }
}
exports.compareExtensionType = compareExtensionType;
;
