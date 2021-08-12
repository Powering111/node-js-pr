const methods=require('./Files/methods.js');
const baseLoader = require('./baseLoader.js');
const log = require('./logger.js');

exports.process=function(req,res,data){
    let variables = {hi:'hello'};
    let i,j;
    for(i=0;i<data.length-1;i++){
        
        if(data[i]=='$'){
            let funcResult;
            let funcName='',parameter='';
            let hasParameter=false,sendReqRes=false,sendVariables=false;
            if(data[i+1]=='#'){
                sendVariables=true;
            }
            if(data[i+1]=='{' || (data[i+1]=='#'&&data[i+2]=='{')){
                j=i;
                while(data[j]!='{')j++;
                j++;
                
                while(data[j]!='}'){
                    if(data[j]=='\n')break;
                    if(!hasParameter){
                        if(data[j]==':'){
                            hasParameter=true;
                        }else{
                            funcName+=data[j];
                        }
                    }
                    else{
                        parameter+=data[j];
                    }
                    j++;
                }

                funcName=funcName.trim();
                if(!funcName.match(/^[_]?[a-zA-Z]*$/i)){
                    log.w('funcName'+funcName+' is invalid');
                    continue;
                }
                if(!parameter.match(/^[a-zA-Z]*$/i)){
                    log.w('parameter '+parameter+' is invalid');
                    continue;
                }

                
                if(funcName[0]=='_'){
                    sendReqRes=true;
                }

                if(funcName==''){
                    if(parameter!=''){
                        funcResult=baseLoader.base(parameter);
                    }else continue;
                }
                else{
                    if(typeof methods[funcName] !== 'function'){
                        log.w('function '+funcName+' not exist');
                        continue;
                    }
    
                    funcResult=runFunction(
                    {funcName:funcName,sendReqRes:sendReqRes,hasParameter:hasParameter,sendVariables:sendVariables},
                    {req:req,res:res,parameter:parameter,variables:variables});
                }

            }else continue;

            data=replaceData(data,funcResult,i,j);
        }
        else if(data[i]=='#'&&(i==0||data[i-1]!='$')){
            let varName='',varValue='';
            let willChange=false;
            if(data[i+1]=='{'){
                let j=i+2;
                while(data[j]!='}'){
                    if(data[j]=='\n')continue;
                    if(!willChange){
                        if(data[j]=='='){
                            willChange=true;
                        }
                        else{
                            varName+=data[j];
                        }
                    }else{
                        varValue+=data[j];
                    }
                    j++;
                }

                varName=varName.trim();
                if(!varName.match(/^[a-zA-Z]+$/i)){
                    log.w('variable '+varName+' is invalid.');
                    continue;
                }
                if(willChange){
                    variables[varName]=varValue;
                    data=replaceData(data,'',i,j);
                }else{
                    if(typeof variables[varName]!=='undefined' && variables[varName]){
                        data=replaceData(data,variables[varName],i,j);
                    }else{
                        log.w('variable '+varName+' not exist');
                        continue;
                    }
                }
            }else continue;
        }
    }
    return data;
}

function replaceData(data,replacement,start,end){
    return data.substring(0,start)+replacement+data.substring(end+1);
}

function runFunction(options,values){
    let result;

    try{
        if(options.sendReqRes){
            if(options.hasParameter){
                if(options.sendVariables){
                    result=methods[options.funcName](values.req,values.res,values.parameter,values.variables);
                }else{
                    result=methods[options.funcName](values.req,values.res,values.parameter);
                }
            }else{
                if(options.sendVariables){
                    result=methods[options.funcName](values.req,values.res,values.variables);
                }else{
                    result=methods[options.funcName](values.req,values.res);
                }
            }
        }else{
            if(options.hasParameter){
                if(options.sendVariables){
                    result=methods[options.funcName](values.parameter,values.variables);
                }else{
                    result=methods[options.funcName](values.parameter);
                }
            }else{
                if(options.sendVariables){
                    result=methods[options.funcName](values.variables);
                }else{
                    result=methods[options.funcName]();
                }
            }
        }
        return result;
    }
    catch(err){
        log.e('Error while executing '+options.funcName+'\n\tPlease be sure that escape queries in HTML files have no problem.\n\tHere is error message:\n\t'+err);
    }
}