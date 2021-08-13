let server = require('./server.js');
exports.process=function(line){
    let command=line.split(' ');
    if(command[0]=='stop' || command[0]=='exit'){
        process.exit();
    }
    if(command[0]=='reload'){
        server.reload();
    }
    if(command[0]=='echo'){
        console.log(command[1]);
    }
    if(command[0]=='off'){
        server.setEnabled(false,command[1]);
    }
    if(command[0]=='on'){
        server.setEnabled(true);
    }
}