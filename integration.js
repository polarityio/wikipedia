'use strict';
let _ = require('lodash');
let rest = require('unirest');
let async = require('async');
let utils = require('util');

let Logger;
//https://en.wikipedia.org/wiki/Wikipedia:Naming_conventions_(technical_restrictions)
var titleReg = /[^#<>\[\]|\{\}]+/;



function startup(logger){
    Logger = logger;
}


var doLookup = function(entities, options, cb){
    Logger.info(entities);
    if(typeof cb !== 'function'){
        return;
    }

    var entityResults = new Array();


    async.each(entities, function(entity, done){
        Logger.info("Checking: " + entity.value);
                if(titleReg.test(entity.value) &&
            !entity.isIP &&
            !entity.isHash &&
            !entity.isEmail &&
            !entity.isURL &&
            !entity.isHTMLTag &&
            !entity.isGeo){
                    Logger.info("Looking up: " + entity.value);
            rest.get("https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=" + encodeURI(_.capitalize(_.toLower(entity.value))))
            .end(function(response){
                if( _.isObject(response.body) && _.isObject(response.body.query)){

                    var resultsObject = response.body;
                    var tags = new Array();
                    var text = {};
                    _.forEach(_.values(resultsObject.query.pages), function(page){
                        if(_.has(page, "pageid") &&
                            page.pageid > 0 &&
                            page.extract != "" &&
                            !page.extract.match(/^(To|From)[a-zA-Z ]+:/i))
                        {
                            entityResults.push({
                                entity: entity,
                                displayValue: _.capitalize(_.toLower(entity.value)),
                                data: {
                                    summary: [ page.title ],
                                    details: page
                                }
                            });
                        }
                    });
                    done();
                }
            });
        }else{
            done();
        }
    },function(){
        cb(null, entityResults);
    });
};


module.exports = {
    doLookup: doLookup,
    startup: startup
};
