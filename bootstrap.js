const { getJson, saveJson, getAbsolutePath } = require('./json');
const messages = require('./messages');

messages.hello();

module.exports.bootstrap = () => {
  //TODO: Needs Refactor
  const txpath = getAbsolutePath('data/tx.json');
  const txs = getJson(txpath);
  if (!txs) {
    saveJson(txpath, []);
  }

  //TODO: Needs Refactor
  const settingsPath = getAbsolutePath('data/settings.json');
  let settings = getJson(settingsPath);
  if (!settings) {
    settings = {
      provider: {
        mainnet: 'https://www.ethercluster.com/etc',
        testnet:
          'https://rinkeby.infura.io/v3/4fa24f5f832a4ef684f3ac124da90c9e',
      },
    };
    saveJson(settingsPath, settings);
  }

  //TODO: Needs Refactor
  const logPath = getAbsolutePath('data/log.json');
  const log = getJson(logPath);
  if (!log) {
    saveJson(logPath, []);
  }
};
