const { join } = require('path');
const fs = require('fs');

const datastorage = './data';
if (!fs.existsSync(datastorage)) {
  fs.mkdirSync(datastorage);
}

module.exports.getAbsolutePath = (relativePath) => {
  return join(__dirname, relativePath);
};

module.exports.saveJson = (path, data) =>
  fs.writeFileSync(path, JSON.stringify(data, null, '\t'));

module.exports.getJson = (path) => {
  const data = fs.existsSync(path) ? fs.readFileSync(path) : null;
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};
