const request = require('request');
const parser = require('xml2json');

const witToken = process.env.WIT_TOKEN || 'Z3WU2WUIXKIX4IBMDWTQIEZKD6DKI5CY';

function yandex(parseResult) {

  function response(err, resp, body) {
    parseResult(body);
  }

  return request.post({
    'url'     : 'https://asr.yandex.net/asr_json?uuid=01ae13cb744628b58fb536d496daa1e6&key=069b6659-984b-4c5f-880e-aaedcfd84102&topic=queries',
    'headers' : {
      'content-Type'  : 'audio/x-wav'
    }
  }, response);
}


module.exports = yandex;
