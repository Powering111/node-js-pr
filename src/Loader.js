const fs = require("fs")

const log = require('./logger.js');
const HTMLProcessor=require('./HTMLProcessor.js');

let basename;
let baseData=Array();

let setting={'name':'Server','port':80,'log':true,'useCommands':true};

exports.load=function(){
    initialize();
    let loadedbase=0;
    basename.forEach((item)=>{
        let path = __dirname+'/Files/base/'+item;
        fs.readFile(path,'utf8',function(err,data){
            if(err){
                log.e(path+' Not Found');
                return;
            }
            baseData[item]=data;

            loadedbase++;
            log.p('Loaded '+item,'Base Data',loadedbase,basename.length);
        });
    });
}

exports.base=function(req,res,name){
    name+='.html';
    if(typeof baseData[name] ==='undefined'){
        log.w('baseData.'+name+' is undefined');
        return '';
    }else{
        return HTMLProcessor.process(req,res,baseData[name],true);
    }
}

function initialize(){
    log.s('Checking files...');

    make(__dirname+'/Files/');
    make(__dirname+'/Files/base/');
    make(__dirname+'/Files/hypertext/');
    make(__dirname+'/Files/resources/');
    make(__dirname+'/Files/style/');
    basename=fs.readdirSync(__dirname+'/Files/base/');

    if(!fs.existsSync(__dirname+'/Files/hypertext/index.html')){
        log.l('index.html not exist. Creating with "Hello World"');
        fs.writeFileSync(__dirname+'/Files/hypertext/index.html','Hello World');
    }

    if(!fs.existsSync(__dirname+'/Files/config.ini')){
        log.l('config.ini not exist. Creating');
        fs.writeFileSync(__dirname+'/Files/config.ini',JSON.stringify(setting));
    }

    fs.readFile(__dirname+'/Files/config.ini','utf8',function(err,data){
        if(err){
            log.e('error reading config.ini');
        }
        setting=JSON.parse(data);
        console.log(setting);
    })
    log.s('Checking files... done');
}

exports.getSetting = () => setting;

function make(dir){
    if(fs.existsSync(dir)){
        return;
    }else{
        log.l('Directory '+dir+' not exist. Creating directory...');
        fs.mkdirSync(dir);
    }
}