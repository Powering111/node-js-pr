const fs = require("fs")

const log = require('./logger.js');
const HTMLProcessor=require('./HTMLProcessor.js');

const basename=['header','image','menu','title'];
let baseData=Array();

exports.load=function(){
    initialize();
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
    return HTMLProcessor.process(req,res,baseData[name],true);
}

function initialize(){
    log.s('checking Files...');

    make('./Files/');
    make('./Files/base/');
    make('./Files/hypertext/');
    make('./Files/resources/');
    make('./Files/style/');
    basename=fs.readdirSync('./Files/base/');

    if(fs.existsSync('./Files/hypertext/index.html')){
        return;
    }else{
        log.l('index.html not exists. Creating with "Hello World"');
        fs.writeFileSync('./Files/hypertext/index.html','Hello World');
    }
}

function make(dir){
    if(fs.existsSync(dir)){
        return;
    }else{
        log.l('Directory '+dir+' not exist. Creating directory...');
        fs.mkdirSync(dir);
    }
}