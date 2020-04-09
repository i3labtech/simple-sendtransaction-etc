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
  const settings = getJson(settingsPath);
  if (!settings) {
    saveJson(settingsPath, {});
  }

  //TODO: Needs Refactor
  const logPath = getAbsolutePath('data/log.json');
  const log = getJson(logPath);
  if (!log) {
    saveJson(logPath, []);
  }
};
