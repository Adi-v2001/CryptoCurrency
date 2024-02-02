import axios from 'axios';
import {ethers} from 'ethers';
import {makeAutoObservable, runInAction} from 'mobx';
import {Alert, Linking} from 'react-native';

class CryptoStore {
  bitcoinPrice = null;
  usdtPrice = null;
  isSwitchedToPolygon = false;
  bitcoinPrivateKey: string | undefined = undefined;
  polygonPrivateKey: string | undefined = undefined;
  bitcoinAddress: string | null = null;
  polygonAddress: string | null = null;
  utxoDetails: any = null;
  bitcoinBalance: number | null = null;
  polygonBalance: string | null = null;
  polygonSigner: ethers.Wallet | null = null;
  loading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchBitcoinPrice() {
    try {
      const response = await fetch('https://api.coincap.io/v2/assets/bitcoin');
      const data = await response.json();
      runInAction(() => {
        this.bitcoinPrice = data.data?.priceUsd;
      });
    } catch (error) {
      runInAction(() => {
        this.bitcoinPrice = null;
      });
      console.log('Error fetching Bitcoin price:', error);
    }
  }

  async fetchUsdtPrice() {
    try {
      const response = await fetch('https://api.coincap.io/v2/assets/tether');
      const data = await response.json();
      runInAction(() => {
        this.usdtPrice = data.data?.priceUsd;
      });
    } catch (error) {
      runInAction(() => {
        this.usdtPrice = null;
      });
      console.log('Error fetching USDT price:', error);
    }
  }

  async fetchUtxoDetails() {
    try {
      // const res = await fetch(
      //   `https://api.blockcypher.com/v1/btc/test3/addrs/${this.bitcoinAddress}/full`,
      // );
      // const data = await res.json();
      const utxo = await fetch(
        `https://blockstream.info/testnet/api/address/${this.bitcoinAddress}/utxo`,
      );
      const utxoData = await utxo.json();
      let balance = 0;
      utxoData.map((singleutxo: any) => {
        balance += singleutxo.value;
      });
      runInAction(() => {
        this.utxoDetails = utxoData;
        this.bitcoinBalance = balance / 100000000;
      });
    } catch (err) {
      console.log('An error occured', err);
    }
  }

  async broadcastTransaction(txHex: string) {
    const testnetApiEndpoint =
      'https://api.blockchair.com/bitcoin/testnet/push/transaction';
    const broadcastUrl = `${testnetApiEndpoint}`;
    axios
      .post(broadcastUrl, {data: txHex})
      .then(response => {
        Alert.alert(
          'Transaction successful! Click button to follow your transaction',
          response.data.data.transaction_hash,
          [
            {text: 'Close', onPress: () => console.log('Alert closed')},
            {
              text: 'Follow Link',
              onPress: () =>
                Linking.openURL(
                  `https://live.blockcypher.com/btc-testnet/tx/${response.data.data.transaction_hash}`,
                ),
            },
          ],
        );
      })
      .catch(error => {
        Alert.alert('Error broadcasting testnet transaction!');
        console.error('Error broadcasting testnet transaction:', error);
      });
  }

  async fetchRawTx(txId: string) {
    try {
      const response = await fetch(
        `https://api.blockcypher.com/v1/btc/test3/txs/${txId}?includeHex=true`,
      );
      const data = await response.json();
      return data.hex;
    } catch (error) {
      console.error('Error: ', error);
    }
  }

  setIsSwitchedToPolygon(isSwitched: boolean) {
    runInAction(() => {
      this.isSwitchedToPolygon = isSwitched;
    });
  }

  setBitcoinPrivateKey(bitcoinPrivateKey: string) {
    runInAction(() => {
      this.bitcoinPrivateKey = bitcoinPrivateKey;
    });
  }

  setBitcoinAddress(bitcoinAddress: string) {
    runInAction(() => {
      this.bitcoinAddress = bitcoinAddress;
    });
  }

  setPolygonPrivateKey(polygonPrivateKey: string) {
    runInAction(() => {
      this.polygonPrivateKey = polygonPrivateKey;
    });
  }

  setPolygonAddress(polygonAddress: string) {
    runInAction(() => {
      this.polygonAddress = polygonAddress;
    });
  }

  setPolygonSigner(polygonSigner: ethers.Wallet) {
    runInAction(() => {
      this.polygonSigner = polygonSigner;
    });
  }

  setPolygonBalance(polygonBalance: string) {
    runInAction(() => {
      this.polygonBalance = polygonBalance;
    });
  }

  setLoading(value: boolean) {
    runInAction(() => {
      this.loading = value;
    });
  }
}

const cryptoStore = new CryptoStore();
export default cryptoStore;
