#! /usr/bin/env node
const program = require('commander');
const inquirer = require('inquirer');

const package = require('./package.json');

const { bootstrap } = require('./bootstrap');
const messages = require('./messages');
const ethereum = require('./ethereum');

const { getJson, saveJson, getAbsolutePath } = require('./json');
const { log } = require('./logger');

bootstrap();
program.version(package.version);

program
  .command('send <data>')
  .option(`-t, --testnet`, 'Direciona transação para rede de teste')
  .description('Registra informações em uma transação')
  .action(async (data, { testnet }) => {
    const settings = getJson(getAbsolutePath('data/settings.json'));
    let pkey = null;
    if (!settings || !settings.privateKey) {
      let { privateKey } = await inquirer.prompt([
        {
          type: 'input',
          name: 'privateKey',
          message: messages.needsPrivateKey,
        },
      ]);

      if (!privateKey) {
        messages.errorNeedsPrivateKey();
        return;
      }
      pkey = privateKey;
    } else {
      pkey = settings.privateKey;
    }

    const network = !testnet
      ? settings.provider.mainnet
      : settings.provider.testnet;

    try {
      const txReceipt = await ethereum.registerTransaction(network, pkey, data);
      const dateNow = new Date();
      log('tx', txReceipt);
      messages.successTx(txReceipt);

      const successTransaction = {
        date: dateNow,
        tx: txReceipt,
        message: data,
        network: testnet ? "testnet" : "classic"
      };

      let tx = getJson(getAbsolutePath('data/tx.json'));
      tx = [successTransaction, ...tx];
      saveJson(getAbsolutePath('data/tx.json'), tx);
    } catch (error) {
      log('error', error.message);
      messages.error(error);
    }
  });

program
  .command('balance <account>')
  .option(`-t, --testnet`, 'Direciona transação para rede de teste', () => true)
  .description('Consulta saldo de uma carteira')
  .action(async (account, { testnet }) => {
    const settings = getJson(getAbsolutePath('data/settings.json'));

    const network = !testnet
      ? settings.provider.mainnet
      : settings.provider.testnet;

    const balance = await ethereum.getBalance(network, account);
    messages.balance(balance);
  });

program
  .command(`import <private_key>`)
  .description('Importa sua chave privada')
  .action(async (privateKey) => {
    const settings = getJson(getAbsolutePath('data/settings.json'));
    if (settings.privateKey) {
      let { overridepvtk } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overridepvtk',
          message:
            'Já existe uma chave privada configurada, Deseja substituir ?',
        },
      ]);
      if (!overridepvtk) return;
    }

    try {
      const publickey = await ethereum.getPublicKey(privateKey);
      settings.privateKey = privateKey;
      settings.publickey = publickey;
      messages.successImportKey(publickey);
      saveJson(getAbsolutePath('data/settings.json'), settings);
    } catch (error) {
      messages.error(error);
    }
  });

program
  .command('export <folderPath>')
  .description('Exporta base de dados ')
  .option('-p, --privatekey', 'Exportar chave privada', () => true)
  .option('-t, --txs', 'Exportar registros de transações', () => true)
  .option('-l, --logs', 'Exportar logs da aplicação', () => true)
  .action(async (pathDestination, { privatekey, txs, logs }) => {

    if (privatekey) {
      const settings = getJson(getAbsolutePath('data/settings.json'));
      if (settings && settings.privateKey) {
        const keys = {
          privateKey: settings.privateKey,
          publicKey: settings.publicKey,
        };
        saveJson(`${pathDestination}/privatekey.bkp`, keys);
      } else {
        messages.notFoundPrivateKey();
      }
    }
    if (txs) {
      const tx = getJson(getAbsolutePath('data/tx.json'));
      if (tx) {
        saveJson(`${pathDestination}/tx.bkp`, tx);
      } else {
        messages.notFoundTxFile();
      }
    }
    if (logs) {
      const log = getJson(getAbsolutePath('data/log.json'));
      if (log) {
        saveJson(`${pathDestination}/log.bkp`, log);
      } else {
        messages.notFoundLogFile();
      }
    }
  });

program
  .command('clear')
  .description('Limpa base de dados ')
  .option('-p, --privatekey', 'Limpa chave privada', () => true)
  .option('-t, --txs', 'Limpa registros de transações', () => true)
  .option('-l, --logs', 'Limpa logs da aplicação', () => true)
  .action(async ({ privatekey, txs, logs }) => {
    if (privatekey) {
      let { clearprvk } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'clearprvk',
          message: 'Tem certeza que deseja limpar a chave privada?',
        },
      ]);

      if (clearprvk) {
        let settings = getJson(getAbsolutePath('data/settings.json'));
        delete settings.privateKey;
        delete settings.publickey;
        saveJson(getAbsolutePath('data/settings.json'), settings);
      }
    }
    if (txs) {
      let { cleartxs } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'cleartxs',
          message: 'Tem certeza que deseja limpar as transações ?',
        },
      ]);

      if (cleartxs) {
        let txs = getJson(getAbsolutePath('data/tx.json'));
        txs = [];
        saveJson(getAbsolutePath('data/tx.json'), txs);
      }
    }
    if (logs) {
      let { clearlogs } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'clearlogs',
          message: 'Tem certeza que deseja limpar os log ?',
        },
      ]);

      if (clearlogs) {
        let log = getJson(getAbsolutePath('data/log.json'));
        log = [];
        saveJson(getAbsolutePath('data/log.json'), log);
      }
    }
  });

program.parse(process.argv);
