const http=require('http');
const fs=require('fs');
const url=require('url');
const path=require('path');
const async=require('async');

const rootDirectory = __dirname + '\\Files\\';
const htmlDirectory = rootDirectory + 'hypertext\\';
const resourceDirectory = rootDirectory + 'resources\\';
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
        let joinedPath=path.join(htmlDirectory,parsedPath.name+'.html');
        if(joinedPath.indexOf(htmlDirectory)!==0){
            console.log('invalid request!');
            return;
        }

        fs.readFile(joinedPath,"utf8",(err,data)=>{
            if(err)send404(res);
            else sendData(res,data);
        });
    }

    if(resourceExt.includes(parsedPath.ext)){
        console.log("resource");
        let joinedPath=path.join(resourceDirectory,parsedPath.base);
        if(joinedPath.indexOf(resourceDirectory)!==0){
            console.log('invalid request!');
            return;
        }

        fs.readFile(joinedPath,(err,data)=>{
            if(err)send404(res);
            else send200(res,data);
            
        });
    }

}

function replaceAll(str,from,to){
    return str.split(from).join(to);
}

function readAsync(fileName, callback) {
    console.log("reading "+fileName);
    fs.readFile(fileName, 'utf8', callback);
}
function readBase(name,callback){
    readAsync(baseDirectory+name+".html",callback);
}
let baseFiles=['menu','image'];
function sendData(res,data){
    async.map(baseFiles, readBase, function(err, basedatas) {
        if(err){
            console.log("error");
            return;
        }
        console.log(basedatas);
        for(i in baseFiles){
            console.log("${"+baseFiles[i]+"}");
            data=replaceAll(data,"${"+baseFiles[i]+"}",basedatas[i]);
        }
        console.log(data);
        send200(res,data);
    });
    
}

function send200(res,data){
    res.writeHead(200,{'Content-Type':'text/html'});
    res.write(data);
    res.end();
}

function send404(res){
    console.log("HTTP 404");
    fs.readFile('./Files/hypertext/404.html',(err,data)=>{
        if(err){
            data='404 Not Found';
        }
        res.writeHead(404,{'Content-Type':'text/html'});
        res.write(data);
        res.end();
    });
    
}

http.createServer(respond).listen(80);
console.log('Started server');