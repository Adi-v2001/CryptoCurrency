import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

function Header() {
  return (
    <View style={styles.parent}>
      <View style={styles.container}>
        <Text style={styles.heading}>C</Text>
        <View>
          <Text style={styles.sub}>rypto</Text>
          <Text style={styles.sub}>urrency</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 150,
    color: 'white',
    marginRight: 8,
  },
  parent: {
    alignItems: 'center',
    marginTop: 50,
  },
  sub: {
    fontWeight: 'bold',
    fontSize: 40,
    color: 'white',
  },
});

export default Header;
