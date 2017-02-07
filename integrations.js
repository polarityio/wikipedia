'use strict';

var request = require('request');
var _ = require('lodash');
var async = require('async');
var log = null;
var entityNoSpecialChars = /^[^#<>\[\]|\{\}\/:]+$/;
var entityNotGeo = /[\d\s]+,[\d\s]+/;

function startup(logger) {
    log = logger;
}


function doLookup(entities, options, cb) {
    let entitiesWithNoData = [];
    let lookupResults = [];

    async.each(entities, function (entityObj, next) {
        if (entityObj.type == "string" &&
            entityNoSpecialChars.test(entityObj.value) &&
            !entityNotGeo.test(entityObj.value)) {
            _lookupEntity(entityObj, options, function (err, result) {
                if (err) {
                    next(err);
                } else {
                    lookupResults.push(result); log.debug("Printing out the Results %j", result);
                    next(null);
                }
            });
        } else {
            lookupResults.push({entity: entityObj, data: null}); //Cache the missed results
            next(null);
        }
    }, function (err) {
        cb(err, lookupResults);
    });
}




var _createJsonErrorPayload = function (msg, pointer, httpCode, code, title, meta) {
    return {
        errors: [
            _createJsonErrorObject(msg, pointer, httpCode, code, title, meta)
        ]
    }
};

// function that creates the Json object to be passed to the payload
var _createJsonErrorObject = function (msg, pointer, httpCode, code, title, meta) {
    let error = {
        detail: msg,
        status: httpCode.toString(),
        title: title,
        code: 'Wiki_' + code.toString()
    };

    if (pointer) {
        error.source = {
            pointer: pointer
        };
    }

    if (meta) {
        error.meta = meta;
    }

    return error;
};


function _lookupEntity(entityObj, options, cb) {
    var relatedCount = ( _.isNaN(options.relatedCount) )? 5 : (parseInt(options.relatedCount) + 1);
    let uri = 'https://en.wikipedia.org/w/api.php?action=opensearch&limit='+relatedCount+'&namespace=0&format=json&search=' + entityObj.value + '&profile=' + options.profile;
    log.debug("Checking to see if the query executes %j", uri );

    request({
        uri: uri,
        method: 'GET',
        json: true
    }, function (err, response, body) {
        // check for an error
        if (err) {
            cb(err);
            return;
        }

        log.debug("Printing out Body %j", body);

        if (response.statusCode !== 200 ||
             _.isUndefined(body) || 
             _.isNull(body) || 
            !_.isArray(body) ||  
             body.length < 4 
        ){
	  var title = "Unexpected result format";
          var code = "Format error";
          if(_.includes(body, body.error)) {
                title = body.error.info;
                code = body.error.code;
          }

          cb( _createJsonErrorPayload(title, null, '201', '2A', code, {
                err: body
            }));
                return;
        
        } else if( body[2].length == 0){
            cb(null, {entity: entityObj, data:null});
            return;

        }

        // The lookup results returned is an array of lookup objects with the following format
        else {   
		
			var relatedList = new Array();
			for(var i = 1; i < body[1].length; i++){
				relatedList.push( {
					"link": body[3][i],
					"label": body[1][i]
				});
			}
		
			cb(null, {
            // Required: This is the entity object passed into the integration doLookup method
            entity: entityObj,
            // Required: An object containing everything you want passed to the template
            data: {
                // Required: this is the string value that is displayed in the template
                entity_name: entityObj.value,
                // Required: These are the tags that are displayed in your template
                summary: [body[0]],
                // Data that you want to pass back to the notification window details block
                details: {
                    para: body[2][0],
					relatedCount: relatedCount,
					relatedList: relatedList
                }
            }
        }); }

    });
}



module.exports = {
    startup:startup,
    doLookup: doLookup
};




