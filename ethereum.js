const { providers, utils, Wallet } = require('ethers');

const provider = new providers.JsonRpcProvider(
  'https://rinkeby.infura.io/v3/4fa24f5f832a4ef684f3ac124da90c9e'
  //'https://www.ethercluster.com/etc'
);

module.exports.registerTransaction = async (key, message) => {
  try {
    const messageBytes = utils.toUtf8Bytes(message);
    const messageHex = utils.hexlify(messageBytes);

    //const pk = '3A1F564C58574448FF137A94BCDC774062D437B56BF0C05641548160B1A2A8B0';
    const wallet = new Wallet(key, provider);

    const tx = await wallet.sendTransaction({
      to: wallet.address,
      data: messageHex,
    });

    const receipt = await tx.wait();
    return receipt.transactionHash;
  } catch (error) {
    throw error;
  }
};

module.exports.getBalance = async (address) => {
  let balance = await provider.getBalance(address);
  return utils.formatEther(balance);
};
