const fs = require("fs")

const log = require('./logger.js');
const HTMLProcessor=require('./HTMLProcessor.js');

const basename=['header','image','menu','title'];
let baseData=Array();

exports.load=function(){

    let loadedbase=0;
    basename.forEach((item)=>{
        let path = './Files/base/'+item+'.html';
        fs.readFile(path,'utf8',function(err,data){
            if(err){
                log.e(item+' Not Found');
                process.exit(1);
            }
            baseData[item]=data;

            loadedbase++;
            log.p('Loaded '+item,'Base Data',loadedbase,basename.length);
        });
    });
}

exports.base=function(req,res,name){
    log.w('base');
    return HTMLProcessor.process(req,res,baseData[name],true);
}