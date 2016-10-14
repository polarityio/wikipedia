'use strict';
var _ = require('lodash');
var rest = require('unirest');
var async = require('async');
var utils = require('util');

//https://en.wikipedia.org/wiki/Wikipedia:Naming_conventions_(technical_restrictions)
var titleReg = /[^#<>\[\]|\{\}]+/;


var doLookup = function(entities, options, cb){
    if(typeof cb !== 'function'){
        return;
    }

    var entityResults = new Array();


    async.each(entities, function(entity, done){
		if(titleReg.test(entity.value) &&
            !entity.isIP &&
            !entity.isHash &&
            !entity.isEmail &&
            !entity.isURL &&
            !entity.isHTMLTag &&
            !entity.isGeo){
            rest.get("https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=" + entity.value)
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
                                entity: _.capitalize(entity.value),
                                data: {
                                    entity_name: _.capitalize(entity.value),
                                    tags: [ page.title ],
                                    details: page
                                }
                            });
                        }
                    });

                    console.log("===================================");
                    done();
                }
            });
        }else{
            done();
        }

    },function(){
        cb(null, entityResults.length, entityResults);
    });



};

var doDetailedLookup = function(entities, cb){

    var results = new Array();
    entities.forEach(function(entity){
        results.push({
            entity: entity.value,
            result: "Test integration enriched info"
        })
    });

    cb(null, entities.length, results);
};



module.exports = {
    doLookup: doLookup,
    doDetailedLookup: doDetailedLookup
};