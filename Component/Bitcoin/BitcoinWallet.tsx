import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import cryptoStore from '../../cryptoStore';
const bitcoin = require('bitcoinjs-lib');
import ECPairFactory from 'ecpair';
import * as ecc from '@bitcoin-js/tiny-secp256k1-asmjs';
import '../../shim';
import BitConnected from './BitConneted';
import {observer} from 'mobx-react';

const BitcoinWallet = () => {
  const handleInputChange = (text: string) => {
    cryptoStore.setBitcoinPrivateKey(text || '');
  };

  function isValidBitcoinPrivateKey(privateKey: string) {
    if (!/^[0-9a-fA-F]{64}$/.test(privateKey)) {
      return false;
    }
    const maxPrivateKey =
      'fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364140';
    const privateKeyNum = BigInt('0x' + privateKey);
    const maxPrivateKeyNum = BigInt('0x' + maxPrivateKey);

    if (privateKeyNum <= 0 || privateKeyNum >= maxPrivateKeyNum) {
      return false;
    }

    return true;
  }

  const handleButtonPress = () => {
    //To make a testnet wallet

    // const network = bitcoin.networks.testnet;
    // const ECPair = ECPairFactory(ecc);
    // const keypair = ECPair.makeRandom({network});
    // const pubkey = keypair.publicKey;
    // const addressObject = bitcoin.payments.p2pkh({pubkey, network});
    // console.log('bitcoin address', addressObject.address);
    // console.log('private key', keypair.privateKey?.toString('hex'));
    if (cryptoStore.bitcoinPrivateKey) {
      if (!isValidBitcoinPrivateKey(cryptoStore.bitcoinPrivateKey as string)) {
        Alert.alert('Not a valid private key');
        return;
      }
      try {
        const network = bitcoin.networks.testnet;
        const ECPair = ECPairFactory(ecc);
        const keyPair = ECPair.fromPrivateKey(
          Buffer.from(cryptoStore.bitcoinPrivateKey, 'hex'),
          {network},
        );
        const {address} = bitcoin.payments.p2pkh({
          pubkey: keyPair.publicKey,
          network,
        });
        cryptoStore.setBitcoinAddress(address);
      } catch (err) {
        console.log('An error occured', err);
      }
    }
  };

  return (
    <>
      {cryptoStore.bitcoinAddress ? (
        <BitConnected />
      ) : (
        <View style={styles.wallet}>
          <Text style={styles.walletHeading}>Connect Bitcoin Wallet</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter private key..."
            onChangeText={handleInputChange}
            secureTextEntry={true}
          />
          <TouchableOpacity onPress={handleButtonPress} style={styles.submit}>
            <Text style={styles.buttonHeading}>Submit</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default observer(BitcoinWallet);

const styles = StyleSheet.create({
  wallet: {
    height: 200,
    width: 300,
    backgroundColor: '#294E84',
    borderRadius: 30,
    alignItems: 'center',
    rowGap: 20,
  },
  walletHeading: {
    fontWeight: 'bold',
    fontSize: 25,
    marginTop: 15,
    color: 'white',
  },
  input: {
    height: 40,
    width: '84%',
    borderWidth: 2,
    borderColor: 'gray',
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 10,
  },
  submit: {
    width: '84%',
    height: 40,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonHeading: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
});
