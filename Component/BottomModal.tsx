import {observer} from 'mobx-react';
import React, {useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import BottomDrawer, {
  BottomDrawerMethods,
} from 'react-native-animated-bottom-drawer';
import Icon from 'react-native-vector-icons/FontAwesome5';
import cryptoStore from '../cryptoStore';
import BitcoinWallet from './Bitcoin/BitcoinWallet';
import PolygonWallet from './Polygon/PolygonWallet';

const BottomModal = () => {
  const bottomDrawerRef = useRef<BottomDrawerMethods>(null);

  const toggleSwitch = () => {
    cryptoStore.setIsSwitchedToPolygon(!cryptoStore.isSwitchedToPolygon);
    cryptoStore.setBitcoinPrivateKey('');
    cryptoStore.setBitcoinAddress('');
    cryptoStore.setPolygonPrivateKey('');
    cryptoStore.setPolygonAddress('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.sub}>Click to open wallet.</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => bottomDrawerRef.current?.open()}>
          <View style={styles.button}>
            <Icon name="wallet" size={30} color="white" />
          </View>
        </TouchableOpacity>
      </View>
      <BottomDrawer ref={bottomDrawerRef}>
        <View style={styles.contentContainer}>
          <View style={styles.swithContainer}>
            {cryptoStore.isSwitchedToPolygon ? (
              <Text style={styles.switchText}>Back to Bitcoin Wallet?</Text>
            ) : (
              <Text style={styles.switchText}>Switch to Polygon Wallet?</Text>
            )}
            <Switch
              trackColor={{false: '#767577', true: '#19CB95'}}
              thumbColor={cryptoStore.isSwitchedToPolygon ? 'white' : 'white'}
              value={cryptoStore.isSwitchedToPolygon}
              onValueChange={toggleSwitch}
            />
          </View>
          {cryptoStore.isSwitchedToPolygon ? (
            <PolygonWallet />
          ) : (
            <BitcoinWallet />
          )}
        </View>
      </BottomDrawer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    marginTop: 40,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#DAD6D6',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  button: {
    backgroundColor: '#873e23',
    height: 60,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
  },
  sub: {
    fontWeight: 'bold',
    fontSize: 30,
    color: 'white',
    textAlign: 'center',
  },
  swithContainer: {
    display: 'flex',
    flexDirection: 'row',
    margin: 25,
    columnGap: 10,
  },
  switchText: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 23,
  },
});

export default observer(BottomModal);
