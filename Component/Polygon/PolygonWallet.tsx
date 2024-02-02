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
import PolygonConnect from './PolygonConnect';
import {observer} from 'mobx-react';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import {ethers} from 'ethers';

const PolygonWallet = () => {
  const handleInputChange = (text: string) => {
    cryptoStore.setPolygonPrivateKey(text);
  };

  const handleButtonPress = async () => {
    try {
      const provider = new ethers.JsonRpcProvider(
        'https://polygon-mumbai.g.alchemy.com/v2/Ec7d6Mw_ZdoeOr3jii1WO55mdcgh3936',
      );
      const signer = new ethers.Wallet(
        cryptoStore.polygonPrivateKey as string,
        provider,
      );
      const address = await signer.getAddress();
      cryptoStore.setPolygonAddress(address);
      const balance = await provider.getBalance(address);
      const etherBalance = ethers.formatEther(balance);
      cryptoStore.setPolygonBalance(etherBalance);
      cryptoStore.setPolygonSigner(signer);
    } catch (err: any) {
      if (
        err instanceof TypeError &&
        err.message.includes('invalid BytesLike value')
      ) {
        Alert.alert('Invalid private key!');
      } else {
        Alert.alert('An error occured!');
      }
    }
  };
  return (
    <>
      {cryptoStore.polygonAddress ? (
        <PolygonConnect />
      ) : (
        <View style={styles.wallet}>
          <Text style={styles.walletHeading}>Connect Polygon Wallet</Text>
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

export default observer(PolygonWallet);

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
    fontSize: 24,
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
