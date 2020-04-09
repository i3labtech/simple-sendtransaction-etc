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
  .command('send [data]')
  .description('Registra informações em uma transação')
  .action(async (data) => {
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

    try {
      const txReceipt = await ethereum.registerTransaction(pkey, data);
      const dateNow = new Date();
      log('tx', txReceipt);
      messages.successTx(txReceipt);

      const successTransaction = {
        date: dateNow,
        tx: txReceipt,
        message: data,
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
  .command('balance [account]')
  .description('Consulta saldo de uma carteira')
  .action(async (account) => {
    const balance = await ethereum.getBalance(account);
    messages.balance(balance);
  });

program
  .command('import [private key]')
  .description('Salva em memória a chave privada')
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

    settings.privateKey = privateKey;
    saveJson(getAbsolutePath('data/settings.json'), settings);
  });

program
  .command('clearkey')
  .description('Limpa da memória a chave privada')
  .action(async () => {
    let { clearprvk } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'clearprvk',
        message: 'Tem certeza que deseja limpar a chave privada?',
      },
    ]);

    if (clearprvk) {
      const settings = getJson(getAbsolutePath('data/settings.json'));
      delete settings.privateKey;
      saveJson(getAbsolutePath('data/settings.json'), settings);
    }
  });

program
  .command('provider')
  .description('Limpa da memória a chave privada')
  .action(() => {});

program.parse(process.argv);
