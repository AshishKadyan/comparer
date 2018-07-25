var createStructure=require("./structure")
var ProcessDuplicates=require("./processDuplicates")
class AssetsConcatenator{
    public CreateStructure;
    public ProcessDupli;
    
constructor(){

}

async driver(){
    this.CreateStructure=new createStructure.structure();
    await this.CreateStructure.driver();
    this.ProcessDupli=new ProcessDuplicates.processDuplicates();
    await this.ProcessDupli.driver();
}

}
let assetConcatenator=new AssetsConcatenator();
assetConcatenator.driver();