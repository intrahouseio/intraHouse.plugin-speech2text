const rec = require('node-mic-record');
const record = require('node-record-lpcm16');
const request = require('request')

const Detector = require('snowboy').Detector;
const Models = require('snowboy').Models;

const Writer = require('wav').Writer;

const Plugin = require('./lib/plugin');
const wit = require('./lib/wit');
const yandex = require('./lib/yandex');

const STORE = {
  flag: false,
  buffer: [],
  stream: null,
};

const plugin = new Plugin();


function parseResult(text) {
  plugin.setDeviceValue('speech2text', text)
}

function listen_noise() {
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
    listen_noise();
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

function error() {
  plugin.debug('error')
}

function silence() {
  if (STORE.flag) {
    STORE.stream.push(null);
    STORE.stream = null;
    STORE.flag = false;
    plugin.debug('End Recording')
  }
}

function sound(buffer) {
  if (STORE.flag) {
    STORE.stream.push(buffer);
    plugin.debug('...recording')
  }
}

function hotword(index, hotword, buffer) {
  if (STORE.flag === false) {
    STORE.flag = true;
    plugin.debug('hotword detection')
    STORE.stream = new Writer({
      sampleRate: 16000,
      channels: 1
    });

    switch (plugin.params.type) {
      case 'yandex':
        STORE.stream.pipe(yandex(parseResult, plugin.params));
        break;
      case 'wit':
        STORE.stream.pipe(wit(parseResult, plugin.params));
        break;
      default:
        STORE.stream.pipe(yandex(parseResult, plugin.params));
        break;
    }

    STORE.stream.push(buffer);
    plugin.debug('...recording')
  }
}

function getFile({ hw_path, hw_file }) {
  if (hw_file === 'custom') {
    return hw_file || './models/jarvis.pmdl';
  }
  return `./models/${hw_file}.pmdl`;
}

function listen_hotword() {
  const models = new Models();
  models.add({
    file: getFile(plugin.params),
    sensitivity: plugin.params.hw_sensitivity,
    hotwords : 'house'
  });

  const detector = new Detector({
    resource: "./node_modules/snowboy/resources/common.res",
    models: models,
    audioGain: parseFloat(plugin.params.hw_audiogain),
    applyFrontend: plugin.params.hw_applyfrontend,
  });

  detector.on('error', error);
  detector.on('silence', silence);
  detector.on('sound', sound);
  detector.on('hotword', hotword);

  const stream = record.start({
    threshold: 0,
    silence: 1.0,
    verbose: false
  });
  stream.pipe(detector);
  plugin.debug('Start Recording')
}

plugin.on('start', () => {
  plugin.setChannels([{ id: 'speech2text', desc: 'speech2text' }]);

  if (plugin.params.mode === 'hotword') {
    listen_hotword();
  } else {
    listen_noise();
  }
});
