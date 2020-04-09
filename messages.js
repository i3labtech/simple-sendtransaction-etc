const package = require('./package.json');
const chalk = require('chalk');

module.exports.hello = () => {
  console.log(
    `${chalk.blue(
      `Bem vindo ao Registrador Ethereum Classic v${package.version} da i3 Tech Lab.`
    )}`
  );
};

module.exports.balance = (balance) => {
  console.log(`${chalk.blueBright(`Seu Saldo é de: Ξ ${balance}`)}`);
};

module.exports.needsPrivateKey = () => {
  console.log(
    `${chalk.yellowBright(`É necessário informar a sua chave privada`)}`
  );
};

module.exports.errorNeedsPrivateKey = () => {
  console.log(
    `${chalk.redBright(
      `Você precisa informar a chave privada. Encerrando aplicação...`
    )}`
  );
};

module.exports.error = (error) => {
  console.log(
    `${chalk.redBright(
      `Infelizmente ocorreu um erro na execução: ${error.message}`
    )}`
  );
};

module.exports.successTx = (tx) => {
  console.log(
    `${chalk.greenBright(`Transação realizada com sucesso. Hash: ${tx}`)}`
  );
};
