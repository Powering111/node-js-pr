const http=require('http');
const fs=require('fs');
const url=require('url');
const path=require('path');
const rootDirectory = __dirname + '\\Files';
const htmlDirectory = rootDirectory + '\\hypertext\\';
const resourceDirectory = rootDirectory + '\\resources\\';

const hypertextExt = ['','.','.html'];
const resourceExt = ['.jpg','.jpeg','.png','.gif','.bmp','.mp3','.mp4'];

function respond(req,res){
    
    let parsedURL=url.parse(req.url,true);
    let filePath=parsedURL.pathname;
    if(filePath=='/') filePath='/index';

    
    
    let parsedPath=path.parse(filePath);
    console.log(parsedPath);

    if(hypertextExt.includes(parsedPath.ext)){
        let joinedPath=path.join(htmlDirectory,filePath);
        if(joinedPath.indexOf(htmlDirectory)!==0){
            console.log('invalid request!');
            return;
        }
        console.log(joinedPath);
    }
    if(resourceExt.includes(parsedPath.ext)){

    }
}

http.createServer(respond).listen(80);
console.log('Started server');