var createStructure = require("./structure");
console.log(createStructure);
var AssetsConcatenator = /** @class */ (function () {
    function AssetsConcatenator() {
        this.CreateStructure = new createStructure.structure();
        this.CreateStructure.driver();
    }
    return AssetsConcatenator;
}());
var assetConcatenator = new AssetsConcatenator();
