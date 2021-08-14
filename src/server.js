const http=require('http');
const fs=require('fs');
const url=require('url');
const path=require('path');
const readline=require('readline');

const HTMLProcessor=require('./HTMLProcessor.js');
const commandProcessor=require('./commandProcessor.js');
const Loader = require('./Loader.js');
const log = require('./logger.js');
const liveProcessor=require('./live.js');

const rootDirectory = __dirname + '\\Files\\';
const htmlDirectory = rootDirectory + 'hypertext\\';
const resDirectory = rootDirectory + 'resources\\';
const styleDirectory = rootDirectory + 'style\\';
const scriptDirectory = rootDirectory + 'script\\';

const htmlExt = ['','.','.html'];
const resExt = ['.jpg','.jpeg','.png','.gif','.bmp','.mp3','.mp4','.ico'];

let enabled=true;
let disabledMsg='';

function respond(req,res){
    if(!enabled){
        send500(res,disabledMsg);
        return;
    }
    let parsedURL=url.parse(req.url,true);
    let filePath=parsedURL.pathname;
    if(filePath=='/') filePath='/index';

    let parsedPath=path.parse(filePath);
    
    if(req.method=='GET'){
        req.GET=parsedURL.query;
    }
    if(req.method=='POST'){
        let post_data='';
            req.on('data',function(chunk){
                post_data+=chunk;
            });
            req.on('end',function(){
                const params=new URLSearchParams(post_data);
                let post=Object.fromEntries(params);
                log.s('Requested '+filePath+' [POST]');
                req.POST=post;
                processExt(req,res,parsedPath);
            });
    }
    else{
        log.s("Requested "+filePath);
        processExt(req,res,parsedPath);
    }
}

function processExt(req,res,parsedPath){
    if(htmlExt.includes(parsedPath.ext)){
        respondHTML(req,res,parsedPath.name);
    }
    else if(resExt.includes(parsedPath.ext)){
        respondRES(res,parsedPath.base,parsedPath.ext);
    }
    else if(parsedPath.ext==".css"){
        respondCSS(res,parsedPath.base);
    }
    else if(parsedPath.ext==".js"){
        respondJS(res,parsedPath.base);
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

function respondRES(res,basename,extension){
    let joinedPath=path.join(resDirectory,basename);
    
    let contentType='application/octet-stream';
    switch(extension){
        case '.jpg':
        case '.jpeg':
            contentType='image/jpeg';
            break;
        case '.png':
            contentType='image/png';
            break;
        case '.gif':
            contentType='image/gif';
            break;
        case '.bmp':
            contentType='image/bmp';
            break;
        case '.mp3':
            contentType='audio/mp3';
            break;
        case '.mp4':
            contentType='video/mp4';
            break;
        case '.ico':
            contentType='image/x-icon';
            break;
    }
    fs.readFile(joinedPath,(err,data)=>{
        if(err)send404(res,'404 Not Found');
        else send200(res,data,contentType);
        
    });
}

function respondCSS(res,basename){
    let joinedPath=path.join(styleDirectory,basename);
    fs.readFile(joinedPath,'utf8',(err,data)=>{
        if(err)send404(res,'404 Not Found');
        else send200(res, data,'text/css');
    })
}

function respondJS(res,basename){
    let joinedPath=path.join(scriptDirectory,basename);
    fs.readFile(joinedPath,'utf8',(err,data)=>{
        if(err)send404(res,'404 Not Found');
        else send200(res, data,'application/js');
    })
}

function respondInvalid(res){
    send404(res,'Invalid request.');
}


function processAndSendHTML(req,res,data){
    console.log('processing HTML');
    try{
        let processedData = HTMLProcessor.process(req,res,data,false);
        send200(res,processedData);
    }catch(e){
        log.e(e);
        send500(res,'Document has an error.');
    }
}

function send200(res, data, type='text/html'){
    res.writeHead(200,{'Content-Type':type});
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

function send500(res,message){
    res.writeHead(500);
    res.end(message);
}

exports.reload=function(){
    log.l('Reloading Server...');
    Loader.load();

}
exports.setEnabled=function(b,message=''){
    enabled=b;
    disabledMsg=message;
    log.l('Server is '+(b?'enabled':'disabled'));
}


log.l('NODEJS SERVER STARTING');
log.s('current Directory : '+__dirname);
Loader.load();
log.l('Starting '+Loader.getSetting().name);

let httpServer;
try{
    let port = Loader.getSetting().port;
    httpServer=http.createServer(respond);
    httpServer.listen(port);
}
catch(e){
    console.log(e);
    process.exit(1);
}

if(Loader.getSetting().useCommands){
    const reader = readline.createInterface({input:process.stdin,output:process.stdout});
    reader.on("line",commandProcessor.process);
}

if(Loader.getSetting().useLiveServer){
    liveProcessor.init(httpServer);
}