const http=require('http');
const fs=require('fs');
const url=require('url');
const path=require('path');
const readline=require('readline');

const HTMLProcessor=require('./HTMLProcessor.js');
const commandProcessor=require('./commandProcessor.js');
const baseLoader = require('./baseLoader.js');
const log = require('./logger.js');

const rootDirectory = __dirname + '\\Files\\';
const htmlDirectory = rootDirectory + 'hypertext\\';
const resDirectory = rootDirectory + 'resources\\';
const styleDirectory = rootDirectory + 'style\\';

const htmlExt = ['','.','.html'];
const resExt = ['.jpg','.jpeg','.png','.gif','.bmp','.mp3','.mp4'];

let enabled=true;
let disabledMsg='';

function respond(req,res){
    if(!enabled){
        res.writeHead(500);
        res.end(disabledMsg);
        return;
    }

    let parsedURL=url.parse(req.url,true);
    let filePath=parsedURL.pathname;
    if(filePath=='/') filePath='/index';

    let parsedPath=path.parse(filePath);
    log.s("Requested "+filePath);

    processExt(req,res,parsedPath);
}

function processExt(req,res,parsedPath){
    if(htmlExt.includes(parsedPath.ext)){
        respondHTML(req,res,parsedPath.name);
    }
    else if(resExt.includes(parsedPath.ext)){
        respondRES(res,parsedPath.base);
    }
    else if(parsedPath.ext==".css"){
        respondCSS(res,parsedPath.base);
    }
    else{
        respondInvalid(res);
    }
}

function respondHTML(req,res,name){
    let joinedPath=path.join(htmlDirectory,name+'.html');
    
    fs.readFile(joinedPath,"utf8",(err,data)=>{
        if(err)send404page(res);
        else processAndSendHTML(req, res, data);
    });
}

function respondRES(res,basename){
    let joinedPath=path.join(resDirectory,basename);

    fs.readFile(joinedPath,(err,data)=>{
        if(err)send404(res,'404 Not Found');
        else send200(res,data);
        
    });
}

function respondCSS(res,basename){
    let joinedPath=path.join(styleDirectory,basename);
    fs.readFile(joinedPath,'utf8',(err,data)=>{
        if(err)send404(res,'404 Not Found');
        else send200(res, data);
    })
}

function respondInvalid(res){
    send404(res,'Invalid request.');
}



function processAndSendHTML(req,res,data){
    let processedData = HTMLProcessor.process(req,res,data,false);
    send200(res,processedData);
}

function send200(res, data){
    res.writeHead(200,{'Content-Type':'text/html'});
    res.write(data);
    res.end();
}

function send404page(res){
    fs.readFile('./Files/hypertext/404.html',(err,data)=>{
        if(err){
            data='404 Not Found';
        }
        send404(res,data);
    });
}
function send404(res, message){
    log.e("404 Not Found");
    res.writeHead(404);
    res.end(message);
}

exports.reload=function(){
    log.l('Reloading Server...');
    baseLoader.load();

}
exports.setEnabled=function(b,message=''){
    enabled=b;
    disabledMsg=message;
    log.l('Server is '+(b?'enabled':'disabled'));
}

log.l('Starting Server...');
baseLoader.load();

http.createServer(respond).listen(80);
const reader = readline.createInterface({input:process.stdin,output:process.stdout});
reader.on("line",commandProcessor.process);