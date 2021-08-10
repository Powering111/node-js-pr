var http=require('http');
var fs=require('fs');
var url=require('url');
console.log('program started.');

http.createServer(function(req,res){
    console.log("requested");

    var q=url.parse(req.url,true);
    if(q.pathname=='/') q.pathname="/index";

    var filename='.'+q.pathname+".html";
    
    
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
                var post=Object.fromEntries(params);
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
console.log('server started.');