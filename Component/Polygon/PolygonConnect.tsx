import {
  ActivityIndicator,
  Alert,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {observer} from 'mobx-react';
import cryptoStore from '../../cryptoStore';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import {ethers} from 'ethers';

const PolygonConnect = () => {
  const [receiverAddress, setReceiverAddress] = useState('');
  const [amount, setAmount] = useState(0);

  const handleButtonPress = async () => {
    if (Number(cryptoStore.polygonBalance) < amount) {
      Alert.alert('Insufficient funds!');
      return;
    }
    if (cryptoStore.polygonSigner) {
      try {
        cryptoStore.setLoading(true);
        const tx = await cryptoStore.polygonSigner.sendTransaction({
          to: receiverAddress,
          value: ethers.parseUnits(amount.toString(), 'ether'),
        });
        Alert.alert(
          'Transaction successful! Click button to follow your transaction',
          tx.hash,
          [
            {text: 'Close', onPress: () => console.log('Alert closed')},
            {
              text: 'Follow Link',
              onPress: () =>
                Linking.openURL(`https://mumbai.polygonscan.com/tx/${tx.hash}`),
            },
          ],
        );
      } catch (err) {
        Alert.alert('Error sending transaction!');
      }
      cryptoStore.setLoading(false);
    }
  };

  return (
    <View style={styles.wallet}>
      <Text style={styles.walletHeading}>Wallet Connected!</Text>
      <Text style={styles.amount}>
        {Number(cryptoStore.polygonBalance).toFixed(5) ?? 'NAN'} MATIC
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

export default observer(PolygonConnect);

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
