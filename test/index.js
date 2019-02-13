const child = require('child_process');
const modulepath = './index.js';

const unitid = 'speech2text'

const params = {
  channels: 2,
  recordProgram: 'rec',
  silence: '1.5',
  recordtimeout: 10,
  thresholdStart: '2.85',
  thresholdEnd: '3.0',
  verbose: false,
  type: 'wit',
  wit_token: 'Z3WU2WUIXKIX4IBMDWTQIEZKD6DKI5CY',
  yandex_token: '069b6659-984b-4c5f-880e-aaedcfd84102',
  mode: 'hotword',
  hw_sensitivity: '0.5',
  hw_file: 'alisa',
  hw_audiogain: '0.8',
  hw_applyfrontend: false,
}

const system = {

}

const config = [];

const ps = child.fork(modulepath, [unitid]);

ps.on('message', data => {
  if (data.type === 'get' && data.tablename === `system/${unitid}`) {
    ps.send({ type: 'get', system });
  }

  if (data.type === 'get' && data.tablename === `params/${unitid}`) {
    ps.send({ type: 'get', params });
  }

  if (data.type === 'get' && data.tablename === `config/${unitid}`) {
    ps.send({ type: 'get', config: {} });
  }

  if (data.type === 'data') {
    console.log('-------------data-------------', new Date().toLocaleString());
    console.log(data.data);
    console.log('');
  }

  if (data.type === 'channels') {
    console.log('-----------channels-----------', new Date().toLocaleString());
    console.log(data.data);
    console.log('');
  }

  if (data.type === 'debug') {
    console.log('-------------debug------------', new Date().toLocaleString());
    console.log(data.txt);
    console.log('');
  }
});

ps.on('close', code => {
  console.log('close');
});

ps.send({type: 'debug', mode: true });
