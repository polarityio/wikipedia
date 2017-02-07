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
        if (entityObj.type == "string" &&
            !entityObj.isIPv4 &&
            !entityObj.isIP &&
            !entityObj.Latitude &&
            !entityObj.Longitude &&
            !entityObj.isIPv6 &&
            !entityObj.isHex &&
            !entityObj.MD5 &&
            !entityObj.SHA1 &&
            !entityObj.SHA256 &&
            !entityObj.SHA512 &&
            !entityObj.isHash &&
            !entityObj.isEmail &&
            !entityObj.isURL &&
            !entityObj.isHTMLTag &&
            !entityObj.isGeo) {
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





function _lookupEntity(entityObj, options, cb) {
    let uri = 'https://en.wikipedia.org/w/api.php?action=opensearch&limit=5&namespace=0&format=json&search=' + entityObj.value + '&profile=' + options.profile;
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

        if (response.statusCode !== 200) {
            cb(body);
            return;
        }

        if (_.isUndefined(body) || _.isNull(body) || _.isNull(body[1]) || _.isEmpty(body[0]) ||_.isEmpty(body[1])) {
            return;
        }

        // The lookup results returned is an array of lookup objects with the following format
        else {   cb(null, {
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
                    list1: body[1][1],
                    list2: body[1][2],
                    list3: body[1][3],
                    list4: body[1][4],
                    list5: body[1][5],
                    url1: body[3][1],
                    url2: body[3][2],
                    url3: body[3][3],
                    url4: body[3][4],
                    url5: body[3][5]
                }
            }
        }); }

    });
}



module.exports = {
    startup:startup,
    doLookup: doLookup
};




