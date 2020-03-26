'use strict';

const request = require('request');
const _ = require('lodash');
const config = require('./config/config.js');
const fs = require('fs');
const async = require('async');

let log = null;
let entityNoSpecialChars = /^[^#<>\[\]|\{\}\/:]+$/;
let entityNotGeo = /[\d\s]+,[\d\s]+/;
let wikiRedirect = /^((To|From)[a-zA-Z ]+:)|([\w\s]+may refer to:)/i;
let requestWithDefaults;

const VALID_SEARCH_PROFILES = ['strict', 'normal', 'fuzzy', 'classic'];

function startup(logger) {
  log = logger;
  let defaults = {};

  if (typeof config.request.cert === 'string' && config.request.cert.length > 0) {
    defaults.cert = fs.readFileSync(config.request.cert);
  }

  if (typeof config.request.key === 'string' && config.request.key.length > 0) {
    defaults.key = fs.readFileSync(config.request.key);
  }

  if (typeof config.request.passphrase === 'string' && config.request.passphrase.length > 0) {
    defaults.passphrase = config.request.passphrase;
  }

  if (typeof config.request.ca === 'string' && config.request.ca.length > 0) {
    defaults.ca = fs.readFileSync(config.request.ca);
  }

  if (typeof config.request.proxy === 'string' && config.request.proxy.length > 0) {
    defaults.proxy = config.request.proxy;
  }

  if (typeof config.request.rejectUnauthorized === 'boolean') {
    defaults.rejectUnauthorized = config.request.rejectUnauthorized;
  }

  requestWithDefaults = request.defaults(defaults);
}

function _validateOptions(options) {
  let errors = [];

  if (typeof options.profile.value != 'string' || VALID_SEARCH_PROFILES.indexOf(options.profile.value) < 0) {
    errors.push({
      key: 'profile',
      message: "Search Profile must be either 'strict', 'normal', 'fuzzy' or 'classic'"
    });
  }

  let relatedCount = parseInt(options.relatedCount.value);
  if (_.isNaN(relatedCount) || relatedCount < 0) {
    errors.push({
      key: 'relatedCount',
      message: 'Related Topics must be an integer greater than or equal to 0'
    });
  }

  return errors;
}

function validateOptions(options, cb) {
  cb(null, _validateOptions(options));
}

function doLookup(entities, options, cb) {
  let errors = _validateOptions(options);

  if (
    _.isNaN(options.relatedCount) ||
    parseInt(options.relatedCount) < 0 ||
    options.profile == 'string' ||
    VALID_SEARCH_PROFILES.indexOf(options.profile) < 0
  ) {
    cb(
      _createJsonErrorPayload('Currently configured options are not valid.', null, '400', '2A', 'Invalid Options', {
        err: errors
      })
    );

    return;
  }

  let lookupResults = [];

  async.eachLimit(
    entities,
    20,
    function(entityObj, next) {
      if (
        entityObj.type == 'string' &&
        entityNoSpecialChars.test(entityObj.value) &&
        !entityNotGeo.test(entityObj.value)
      ) {
        _lookupEntity(entityObj, options, function(err, result) {
          if (err) {
            next(err);
          } else {
            lookupResults.push(result);
            log.debug('Printing out the Results %j', result);
            next(null);
          }
        });
      } else {
        lookupResults.push({ entity: entityObj, data: null }); //Cache the missed results
        next(null);
      }
    },
    function(err) {
      cb(err, lookupResults);
    }
  );
}

function _createJsonErrorPayload(msg, pointer, httpCode, code, title, meta) {
  return {
    errors: [_createJsonErrorObject(msg, pointer, httpCode, code, title, meta)]
  };
}

function _createJsonErrorObject(msg, pointer, httpCode, code, title, meta) {
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
}

function _lookupEntity(entityObj, options, cb) {
  let relatedCount = parseInt(options.relatedCount) + 1;
  let uri =
    'https://en.wikipedia.org/w/api.php?action=opensearch&limit=' +
    relatedCount +
    '&namespace=0&format=json&search=' +
    entityObj.value +
    '&profile=' +
    options.profile;

  log.debug({ uri: uri }, 'Checking to see if the query executes');

  requestWithDefaults(
    {
      uri: uri,
      method: 'GET',
      json: true
    },
    function(err, response, body) {
      // check for an error
      if (err) {
        log.error({ err: err }, 'Error executing HTTP request');
        cb({
          detail: 'Error executing HTTP request',
          err
        });
        return;
      }

      log.debug({ body: body }, 'REST Response Body');

      if (response.statusCode !== 200 || _.isUndefined(body) || _.isNull(body) || !_.isArray(body)) {
        let title = 'Unexpected result format';
        let code = 'Format error';

        if (_.has(body, 'error.info')) {
          title = body.error.info;
        }

        if (_.has(body, 'error.code')) {
          code = body.error.code;
        }
        cb(
          _createJsonErrorPayload(title, null, '500', '2A', code, {
            err: body
          })
        );
      } else if (body[3].length == 0) {
        cb(null, { entity: entityObj, data: null });
      } else {
        // The lookup results returned is an array of lookup objects with the following format
        log.trace({ body: body }, 'Checkign to see if it made it past the error handling');
        let relatedList = [];

        for (let i = 1; i < body[1].length; i++) {
          relatedList.push({
            link: body[3][i],
            label: body[1][i]
          });
        }

        //log.debug({para: body[2][0]}, "checking the paragraph");

        cb(null, {
          // Required: This is the entity object passed into the integration doLookup method
          entity: entityObj,
          displayValue: body[1][0],
          // Required: An object containing everything you want passed to the template
          data: {
            // Required: These are the tags that are displayed in your template
            summary: [body[1][0]],
            // Data that you want to pass back to the notification window details block
            details: {
              relatedCount: relatedCount,
              relatedList: relatedList
            }
          }
        });
      }
    }
  );
}

module.exports = {
  startup: startup,
  doLookup: doLookup,
  validateOptions: validateOptions
};
