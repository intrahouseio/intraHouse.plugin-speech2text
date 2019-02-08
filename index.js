const rec = require('node-mic-record');
const request = require('request')

const Plugin = require('./lib/plugin');
const wit = require('./lib/wit');

const plugin = new Plugin();


function parseResult(text) {
  plugin.setDeviceValue('speech2text', text)
}

function listen() {
  const stream = rec.start(plugin.params);
  stream.on('end', listen);
  stream.pipe(wit(parseResult))
}

plugin.on('start', () => {
  listen();
});
