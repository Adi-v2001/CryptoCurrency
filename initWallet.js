const cw = require('crypto-wallets');

const walletA = cw.generateWallet('ETH');
const walletB = cw.generateWallet('ETH');

console.log('WalletA: ', walletA);
console.log('WalletB: ', walletB);
