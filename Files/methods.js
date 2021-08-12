
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

exports.useVar=function(variables){
    return variables['hi'];
}