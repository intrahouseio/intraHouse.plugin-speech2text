const rec = require('node-mic-record');
const request = require('request')

const Plugin = require('./lib/plugin');
const wit = require('./lib/wit');
const yandex = require('./lib/yandex');

const plugin = new Plugin();


function parseResult(text) {
  plugin.setDeviceValue('speech2text', text)
}

function listen() {
  plugin.debug('Start Recording');
  let timer = null;
  const stream = rec.start(plugin.params);

  stream.on('data', () => {
    if (timer === null) {
      plugin.debug('...recording');
      timer = setTimeout(rec.stop, plugin.params.recordtimeout * 1000)
    }
  });
  stream.on('end', () => {
    plugin.debug('End Recording');
    clearTimeout(timer);
    listen();
  });

  switch (plugin.params.type) {
    case 'yandex':
      stream.pipe(yandex(parseResult, plugin.params));
      break;
    case 'wit':
      stream.pipe(wit(parseResult, plugin.params));
      break;
    default:
      stream.pipe(yandex(parseResult, plugin.params));
      break;
  }
}

plugin.on('start', () => {
  plugin.setChannels([{ id: 'speech2text', desc: 'speech2text' }]);
  listen();
});
