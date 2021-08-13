const url = require('url');
const log = require('./logger.js');
/**
 * When requested by GET method, use this for GET values
 * @param req request object
 * @returns parsed GET variables object
 */
exports.GET=function(req){
    if(req.method!=='GET'){
        log.w('method is not GET');
    }
    let parsedURL=url.parse(req.url,true);
    let query=parsedURL.query;
    return query;
}

exports.POST=function(req){
    
}