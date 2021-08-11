const color = require('./color.js');

/**log */
exports.l=function(comment){
    console.log(color.Magenta+comment+color.Reset);
}

/**debug */
exports.d=function(comment,name="DEBUG"){
    console.log(color.Black+name+' : '+comment+color.Reset);
}

/**server */
exports.s=function(comment,name='SERVER'){
    console.log(color.Green+name+' : '+comment+color.Reset);
}

/**error */
exports.e=function(comment,name='ERROR'){
    console.log(color.Red+name+' : '+comment+color.Reset);
}

/**comment with name */
exports.n=function(comment,name){
    console.log(color.Blue+name+" : "+comment+color.Reset);
}

/**progress
 * @param progress now progress.
 * @param max max progress.
 */
exports.p=function(comment,name,progress,max){
    console.log(color.Cyan+name+' : '+comment+' \t('+progress+' / '+max+')'+color.Reset);
}

/**custom log
 * @col color name in color.js
 */
exports.c=function(comment,name,col){
    console.log(color[col]+name+' : '+comment+color.Reset);
}

/**warning */
exports.w=function(comment,name='WARNING'){
    console.log(color.Yellow+name+' : '+comment+color.Reset);
}