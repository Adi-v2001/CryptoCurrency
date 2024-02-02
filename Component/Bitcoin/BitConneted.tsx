const bitcoin = require('bitcoinjs-lib');
import ECPairFactory from 'ecpair';
import * as ecc from '@bitcoin-js/tiny-secp256k1-asmjs';
import '../../shim';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react';
import cryptoStore from '../../cryptoStore';

const ECPair = ECPairFactory(ecc);

interface utxo {
  hash: Buffer | null;
  index: string | null;
  nonWitnessUtxo: Buffer | null;
}

const BitConnected = () => {
  const [receiverAddress, setReceiverAddress] = useState('');
  const [amount, setAmount] = useState(0);

  const handleButtonPress = async () => {
    try {
      if (!receiverAddress || !amount) {
        Alert.alert('Please fill both fields');
        return;
      }
      if (amount > Number(cryptoStore.bitcoinBalance)) {
        Alert.alert('Insufficient funds');
        return;
      }
      if (!cryptoStore.bitcoinBalance) {
        return;
      }
      cryptoStore.setLoading(true);
      const network = bitcoin.networks.testnet;
      const recipientAddress = receiverAddress;
      const inputs: utxo[] = [];
      //Convert to satoshi
      const amountToSend = amount * 100000000;
      const fee = 0.00001 * 100000000;
      const change =
        cryptoStore.bitcoinBalance * 100000000 - (amountToSend + fee);
      const psbt = new bitcoin.Psbt({network});
      await Promise.all(
        cryptoStore.utxoDetails.map(async (tx: any) => {
          const utxo: utxo = {
            hash: null,
            index: null,
            nonWitnessUtxo: null,
          };
          utxo.hash = Buffer.from(tx.txid, 'hex').reverse();
          const hashHex = await cryptoStore.fetchRawTx(tx.txid);
          utxo.nonWitnessUtxo = Buffer.from(hashHex, 'hex');
          utxo.index = tx.vout;
          inputs.push(utxo);
        }),
      );
      inputs.forEach((input: any) => {
        psbt.addInput(input);
      });
      const amountToSendInteger = Math.floor(amountToSend);
      psbt.addOutput({
        address: recipientAddress,
        value: amountToSendInteger,
      });
      psbt.addOutput({
        address: cryptoStore.bitcoinAddress,
        value: change,
      });
      if (cryptoStore.bitcoinPrivateKey) {
        const keyPair = ECPair.fromPrivateKey(
          Buffer.from(cryptoStore.bitcoinPrivateKey, 'hex'),
          {network},
        );
        psbt.signAllInputs(keyPair);
        psbt.finalizeAllInputs();
        const rawTx = psbt.extractTransaction().toHex();
        cryptoStore.broadcastTransaction(rawTx);
      }
    } catch (error) {
      console.log('Error in handleButtonPress:', error);
      Alert.alert(
        'Transaction Error',
        'There was an error building or broadcasting the transaction.',
      );
    }
    cryptoStore.setLoading(false);
  };

  useEffect(() => {
    cryptoStore.fetchUtxoDetails();
  }, []);

  return (
    <View style={styles.wallet}>
      <Text style={styles.walletHeading}>Wallet Connected!</Text>
      <Text style={styles.amount}>
        {cryptoStore.bitcoinBalance?.toFixed(5)} TBTC
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter receiver address..."
        onChangeText={text => setReceiverAddress(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter amount in BTC..."
        onChangeText={text => setAmount(Number(text))}
        keyboardType="numeric"
      />
      {cryptoStore.loading ? (
        <ActivityIndicator style={styles.submit} />
      ) : (
        <TouchableOpacity onPress={handleButtonPress} style={styles.submit}>
          <Text style={styles.buttonHeading}>Send Transaction</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default observer(BitConnected);

const styles = StyleSheet.create({
  wallet: {
    height: 'auto',
    width: 300,
    backgroundColor: '#294E84',
    borderRadius: 30,
    alignItems: 'center',
    rowGap: 15,
  },
  walletHeading: {
    fontWeight: 'bold',
    fontSize: 25,
    marginTop: 15,
    color: 'white',
  },
  input: {
    height: 40,
    width: '75%',
    borderWidth: 2,
    borderColor: 'gray',
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 10,
  },
  submit: {
    width: '75%',
    height: 40,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonHeading: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  amount: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white',
  },
});
