const request = require('request');
const parseString = require('xml2js').parseString;


function yandex(parseResult, params) {

  function response(err, resp, body) {
    parseString(body, function (err, result) {
      try {
        if (result.recognitionResults.$.success === '0') {
          parseResult('');
        } else {
          parseResult(result.recognitionResults.variant[0]['_']);
        }
      } catch (e) {
        parseResult('');
      }
    });
  }

  return request.post({
    'url'     : `https://asr.yandex.net/asr_xml?uuid=01ae13cb744628b58fb536d496daa1e6&key=${params.yandex_token}&topic=queries`,
    'headers' : {
      'content-Type'  : 'audio/x-wav'
    }
  }, response);
}


module.exports = yandex;
