/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';

import './shim';
import {observer} from 'mobx-react';
import Header from './Component/Header';
import Home from './Component/Home';

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Header />
        <View>
          <Home />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3498db',
  },
});

export default observer(App);
