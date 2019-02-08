const request = require('request');

const witToken = process.env.WIT_TOKEN || 'Z3WU2WUIXKIX4IBMDWTQIEZKD6DKI5CY';

function wit(parseResult) {

  function response(err, resp, body) {
    parseResult(JSON.parse(body)._text);
  }

  return request.post({
    'url'     : 'https://api.wit.ai/speech?client=chromium&lang=en-us&output=json',
    'headers' : {
      'Accept'        : 'application/vnd.wit.20160202+json',
      'Authorization' : 'Bearer ' + witToken,
      'Content-Type'  : 'audio/wav'
    }
  }, response);
}


module.exports = wit;
