const http=require('http');
const fs=require('fs');
const url=require('url');
const path=require('path');
const async=require('async');

const rootDirectory = __dirname + '\\Files\\';
const htmlDirectory = rootDirectory + 'hypertext\\';
const resourceDirectory = rootDirectory + 'resources\\';
const styleDirectory = rootDirectory + 'style\\';
const baseDirectory = rootDirectory + 'base\\';


const hypertextExt = ['','.','.html'];
const resourceExt = ['.jpg','.jpeg','.png','.gif','.bmp','.mp3','.mp4'];


function respond(req,res){
    
    let parsedURL=url.parse(req.url,true);
    let filePath=parsedURL.pathname;
    if(filePath=='/') filePath='/index';

    let parsedPath=path.parse(filePath);
    console.log(parsedPath);
    
    if(hypertextExt.includes(parsedPath.ext)){
        respondHTML(res,parsedPath.name);
    }
    else if(resourceExt.includes(parsedPath.ext)){
        respondRES(res,parsedPath.base);
    }
    else if(parsedPath.ext==".css"){
        respondCSS(res,parsedPath.base);
    }
    else{
        respondInvalid(res);
    }
}

function respondHTML(res,name){
    let joinedPath=path.join(htmlDirectory,name+'.html');
        
    fs.readFile(joinedPath,"utf8",(err,data)=>{
        if(err)send404page(res);
        else sendData(res,data);
    });
}

function respondRES(res,basename){
    let joinedPath=path.join(resourceDirectory,basename);

    fs.readFile(joinedPath,(err,data)=>{
        if(err)send404(res);
        else send200(res,data);
        
    });
}

function respondCSS(res,basename){
    let joinedPath=path.join(styleDirectory,basename);
    fs.readFile(joinedPath,'utf8',(err,data)=>{
        if(err)send404(res);
        else send200(res,data);
    })
}


function replaceAll(str,from,to){
    return str.split(from).join(to);
}

function readAsync(fileName, callback) {
    fs.readFile(fileName, 'utf8', callback);
}
function readBase(name,callback){
    readAsync(baseDirectory+name+".html",callback);
}
function readListedBase(baseFiles,callback){
    async.map(baseFiles,readBase,callback);
}
let baseFiles=['menu','image','header'];
function sendData(res,data){
    readListedBase(baseFiles,  function(err, basedatas) {
        if(err){
            console.log("error");
            return;
        }
        
        for(i in baseFiles){
            data=replaceAll(data,"${"+baseFiles[i]+"}",basedatas[i]);
        }
        
        send200(res,data);
    });
    
}

function send200(res,data){
    res.writeHead(200,{'Content-Type':'text/html'});
    res.write(data);
    res.end();
}
function send404page(res){
    fs.readFile('./Files/hypertext/404.html',(err,data)=>{
        if(err){
            data='404 Not Found';
        }
        res.writeHead(404,{'Content-Type':'text/html'});
        res.write(data);
        res.end();
    });
}
function send404(res){
    res.writeHead(404);
    res.end('404 Not Found');
}

http.createServer(respond).listen(80);
console.log('Started server');