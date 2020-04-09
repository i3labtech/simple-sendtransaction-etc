const { getJson, saveJson, getAbsolutePath } = require('./json');

module.exports.log = (type, message) => {
  let log = getJson(getAbsolutePath('data/log.json'));
  const newLog = {
    date: new Date(),
    type,
    message,
  };
  saveJson(getAbsolutePath('data/log.json'), log);
};
