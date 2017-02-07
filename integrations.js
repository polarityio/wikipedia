'use strict';

var request = require('request');
var _ = require('lodash');
var async = require('async');
var log = null;

function startup(logger) {
    log = logger;
}


function doLookup(entities, options, cb) {
    let entitiesWithNoData = [];
    let lookupResults = [];

    async.each(entities, function (entityObj, next) {
        if (entityObj.type == "string") {
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
    let uri = 'https://en.wikipedia.org/w/api.php?action=opensearch&limit=5&namespace=0&format=json&search=' + entityObj.value + '&profile=' + options.profile;
    log.debug("Checking to see if the query executes %j", uri );
	var relatedCount = ( _.isNaN(options.relatedCount) )? 5 : options.relatedCount;

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

        if (response.statusCode !== 200) {
            cb(body);
            return;
        }

        if (_.isUndefined(body) || _.isNull(body) || _.isNull(body[2]) || _.isEmpty(body[0]) ||_.isEmpty(body[1]) || _.isEmpty(body[2])) {
            return;
        }

        else if(_.includes(body, body.error)) {
            done(_createJsonErrorPayload(body.error.info, null, '201', '2A', body.error.code, {
                err: err
            }));
            return;
        }

        // The lookup results returned is an array of lookup objects with the following format
        else {   
		
			var relatedList = new Array();
			for(var i = 0; i < body[1].length && i < resultCount; i++){
				relatedList[] = {
					"link": body[3],
					"label": body[1]
				}
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




