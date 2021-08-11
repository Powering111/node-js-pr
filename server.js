const http=require('http');
const fs=require('fs');
const url=require('url');
const path=require('path');

const methods=require('./methods.js');

const rootDirectory = __dirname + '\\Files\\';
const htmlDirectory = rootDirectory + 'hypertext\\';
const resourceDirectory = rootDirectory + 'resources\\';
const styleDirectory = rootDirectory + 'style\\';


const hypertextExt = ['','.','.html'];
const resourceExt = ['.jpg','.jpeg','.png','.gif','.bmp','.mp3','.mp4'];


function respond(req,res){
    
    let parsedURL=url.parse(req.url,true);
    let filePath=parsedURL.pathname;
    if(filePath=='/') filePath='/index';

    let parsedPath=path.parse(filePath);
    console.log("Requested ",filePath);
    processExt(req,res,parsedPath);
}

function processExt(req,res,parsedPath){
    let ext=parsedPath.ext;
    if(hypertextExt.includes(ext)){
        respondHTML(req,res,parsedPath.name);
    }
    else if(resourceExt.includes(ext)){
        respondRES(req,res,parsedPath.base);
    }
    else if(ext==".css"){
        respondCSS(req,res,parsedPath.base);
    }
    else{
        respondInvalid(req,res);
    }
}

function respondHTML(req,res,name){
    let joinedPath=path.join(htmlDirectory,name+'.html');
        
    fs.readFile(joinedPath,"utf8",(err,data)=>{
        if(err)send404page(req, res);
        else sendData(req, res,data);
    });
}

function respondRES(req, res,basename){
    let joinedPath=path.join(resourceDirectory,basename);

    fs.readFile(joinedPath,(err,data)=>{
        if(err)send404(req, res,'404 Not Found');
        else send200(req, res,data);
        
    });
}

function respondCSS(req, res,basename){
    let joinedPath=path.join(styleDirectory,basename);
    fs.readFile(joinedPath,'utf8',(err,data)=>{
        if(err)send404(req, res,'404 Not Found');
        else send200(req, res,data);
    })
}

function respondInvalid(req, res){
    console.log("requested invalid file");
    res.writeHead(404,{'Content-Type':'text/html'});
    res.write("You have requested Invalid File.");
    res.end();
}


function sendData(req,res,data){
    for(let i=0;i<data.length;i++){
        if(data[i]=='$' && data[i+1]=='{'){
            
            let j=i+2;
            let funcName='';
            let hasArgument=false;
            let argument='';
            while(data[j]!='}'){
                if(!hasArgument){
                    if(data[j]==':'){
                        hasArgument=true;
                    }else{
                        funcName+=data[j];
                    }
                }
                else{
                    argument+=data[j];
                }
                j++;
            }

            let funcResult;
            if(funcName[0]=='_'){
                if(!hasArgument){
                    funcResult=methods[funcName](req,res);
                }
                else{
                    funcResult=methods[funcName](req,res,argument);
                }
            }
            else{
                if(!hasArgument){
                    funcResult=methods[funcName]();
                }else{
                    funcResult=methods[funcName](argument);
                }
            }
            data=data.substring(0,i)+funcResult+data.substring(j+2);
        }
    }
    send200(req,res,data);
}

function send200(req, res, data){
    res.writeHead(200,{'Content-Type':'text/html'});
    res.write(data);
    res.end();
}
function send404page(req, res){
    fs.readFile('./Files/hypertext/404.html',(err,data)=>{
        if(err){
            data='404 Not Found';
        }
        res.writeHead(404,{'Content-Type':'text/html'});
        res.write(data);
        res.end();
    });
}
function send404(req, res, message){
    res.writeHead(404);
    res.end(message);
}

http.createServer(respond).listen(80);
console.log('Started server');