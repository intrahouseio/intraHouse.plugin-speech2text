const request = require('request');

function wit(parseResult, params) {

  function response(err, resp, body) {
    parseResult(JSON.parse(body)._text);
  }

  return request.post({
    'url'     : 'https://api.wit.ai/speech?client=chromium&lang=en-us&output=json',
    'headers' : {
      'Accept'        : 'application/vnd.wit.20160202+json',
      'Authorization' : 'Bearer ' + params.wit_token,
      'Content-Type'  : 'audio/wav'
    }
  }, response);
}


module.exports = wit;
