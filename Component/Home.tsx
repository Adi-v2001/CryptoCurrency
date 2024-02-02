import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import cryptoStore from '../cryptoStore';
import {observer} from 'mobx-react';
import BottomModal from './BottomModal';
import {Image} from 'react-native';

const Home = () => {
  useEffect(() => {
    const fetchPrices = () => {
      cryptoStore
        .fetchBitcoinPrice()
        .catch(err => console.log('An error occured', err));
      cryptoStore
        .fetchUsdtPrice()
        .catch(err => console.log('An error occured', err));
    };
    fetchPrices();
    const intervalId = setInterval(fetchPrices, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Live Prices</Text>
      <View style={styles.card}>
        <Image
          source={{
            uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1024px-Bitcoin.svg.png',
          }}
          style={styles.image}
        />
        <Text style={styles.currency}>BTC</Text>
        <Text style={styles.price}>
          ${Number(cryptoStore.bitcoinPrice).toFixed(3)}
        </Text>
      </View>
      <View style={styles.card}>
        <Image
          source={{
            uri: 'https://creazilla-store.fra1.digitaloceanspaces.com/icons/3516745/tether-logo-icon-md.png',
          }}
          style={styles.image}
        />
        <Text style={styles.currency}>USDT</Text>
        <Text style={styles.price}>
          ${Number(cryptoStore.usdtPrice).toFixed(3)}
        </Text>
      </View>
      <BottomModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: 'center',
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  image: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: 10,
  },
  card: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#873e23',
    width: '80%',
    height: 60,
    borderRadius: 50,
    padding: 15,
    marginTop: 10,
    borderWidth: 2,
    borderColor: 'white',
  },
  price: {
    marginLeft: 'auto',
    color: 'white',
    fontWeight: 'bold',
  },
  currency: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default observer(Home);
