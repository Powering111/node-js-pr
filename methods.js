exports.menu=function(){
    return `<div class="menubar">
        <a href="index" class="menubtn">HOME</a>
        <a href="about" class="menubtn">ABOUT</a>
        <a href="repl" class="menubtn">JAVASCRIPT</a>
    </div>`;
}
exports.header=function(){
    return `<meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <link rel="stylesheet" href="style.css">`;
}
exports.image=function(){
    return '<img src="hello.jpg" alt="hello" width="500px">';
}

exports.shownumber=function(a){
    let ret='';
    for(let i=1;i<=a;i++){
        ret+=i;
        ret+=' ';
    }
    return ret;
}

exports._ip=function(req,res){
    return '당신의 아이피 주소는 '+(req.headers['x-forwarded-for']||req.connection.remoteAddress)+' 입니다.';
}