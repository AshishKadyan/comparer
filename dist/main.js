var createStructure = require("./structure");
console.log(createStructure);
var AssetsConcatenator = /** @class */ (function () {
    function AssetsConcatenator() {
        console.log(createStructure.structure);
        this.CreateStructure = new createStructure.structure();
    }
    return AssetsConcatenator;
}());
var assetConcatenator = new AssetsConcatenator();
console.log(assetConcatenator);
