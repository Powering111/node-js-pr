const http=require('http');
const fs=require('fs');
const url=require('url');

let allowedPath=['/index','/about','/writename','/repl'];

function respond(req,res){
    
    console.log("requested");
    
    let parsedURL=url.parse(req.url,true);
    let filePath=parsedURL.pathname;
    
    if(filePath=='/') filePath='/index';
    if(allowedPath.includes(filePath)){

    }
    
}


http.createServer(function(req,res){
    console.log("requested");

    var q=url.parse(req.url,true);
    if(q.pathname=='/') q.pathname="/index";
    console.log(q);
    var filename='./sources'+q.pathname+".html";
    
    
    fs.readFile(filename,function(err,data){
        if(err){
            res.writeHead(404,{'Content-Type':'text/html'});
            res.end("404: File Not Found");
            return;
        }
        if(q.pathname=='/writename'){
            var post_data='';
            req.on('data',function(chunk){
                post_data+=chunk;
            });
            req.on('end',function(){
                const params=new URLSearchParams(post_data);
                console.log(post_data);
                console.log(params);
                var post=Object.fromEntries(params);
                console.log(post);
                console.log("received post data");
                res.writeHead(200,{'Content-Type':'text/html'});

                res.end(data+"your name is "+post.name);
            });
        }
        else{
            res.writeHead(200,{'Content-Type':'text/html'});
            res.write(data);
            res.end();
            return;
        }
    })
}).listen(80);

console.log('Started server');