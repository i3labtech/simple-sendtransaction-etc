const { providers, utils, Wallet } = require('ethers');

module.exports.registerTransaction = async (network, key, message) => {
  try {
    const provider = new providers.JsonRpcProvider(network);

    const messageBytes = utils.toUtf8Bytes(message);
    const messageHex = utils.hexlify(messageBytes);

    const wallet = new Wallet(key, provider);

    const tx = await wallet.sendTransaction({
      to: wallet.address,
      data: messageHex
    });

    const receipt = await tx.wait();
    return receipt.transactionHash;
  } catch (error) {
    throw error;
  }
};

module.exports.getBalance = async (network, address) => {
  const provider = new providers.JsonRpcProvider(network);

  const balance = await provider.getBalance(address);
  // TODO: Possivel problema com trycatch
  return utils.formatEther(balance);
};

module.exports.getPublicKey = async (privateKey) => {
  try {
    const wallet = new Wallet(privateKey);
    return await wallet.getAddress();
  } catch (error) {
    throw error;
  }
};
