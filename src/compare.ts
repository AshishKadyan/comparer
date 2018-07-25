const fs = require('fs');
const HtmlDiffer = require('html-differ').HtmlDiffer;
const logger = require('html-differ/lib/logger');
const equal = require("deep-equal");

function isOfSameSize (path1, path2): boolean {
    return fs.statSync(path1).size === fs.statSync(path2).size;
}

function isEqualHtml(path1: string, path2: string): boolean {
    console.log("comparing files " + path1 + " & " + path2 + " on HTML-differ");
    const html1 = fs.readFileSync(path1, 'utf-8');
    const html2 = fs.readFileSync(path2, 'utf-8');
    const options = {
        ignoreAttributes: [],
        compareAttributesAsJSON: [],
        ignoreWhitespaces: true,
        ignoreComments: true,
        ignoreEndTags: false,
        ignoreDuplicateAttributes: false
    };
    const htmlDiffer = new HtmlDiffer(options);
    const diff = htmlDiffer.diffHtml(html1, html2),
        isEqual = htmlDiffer.isEqual(html1, html2),
        res = logger.getDiffText(diff, { charsAroundDiff: 40 });
    // logger.logDiffText(diff, { charsAroundDiff: 40 });
    return isEqual;
}

function isEqualBinary(path1: string, path2: string): boolean {
    console.log("comparing files " + path1 + " & " + path2 + " on binary")
    if (!isOfSameSize(path1, path2)) {
        return false;
    }
    var data1 = fs.readFileSync(path1);
    const encoded1 = new Buffer(data1, 'binary').toString('base64');
    var data2 = fs.readFileSync(path2);
    const encoded2 = new Buffer(data2, 'binary').toString('base64');

    return encoded1 === encoded2;
}

function isEqualJson(path1, path2): boolean {
    console.log("comparing files " + path1 + " & " + path2 + " on assert deep-equal")
    const json1 = fs.readFileSync(path1, 'utf-8');
    const json2 = fs.readFileSync(path2, 'utf-8');
    const res = equal(JSON.stringify(json1), JSON.stringify(json2));
    console.log(res);
    return res;
}

export function compareExtensionType (path1: string, path2: string, ext: string): boolean {
    switch (ext) {
        case ".htm":
            return isEqualHtml(path1, path2);

        case ".html":
            return isEqualHtml(path1, path2);

        case ".json":
            return isEqualJson(path1, path2)

        default:
            return isEqualBinary(path1, path2);
    }
};
