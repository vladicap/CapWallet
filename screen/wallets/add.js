import { SegwitP2SHWallet } from '../../class';
import React, { Component } from 'react';
import { ActivityIndicator, View, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  NasdaSpacing,
  NasdaButton,
  SafeNasdaArea,
  NasdaCard,
  NasdaText,
} from '../../NasdaComponents.js';
import PropTypes from 'prop-types';
let EV = require('../../events');
let NasdaApp = require('../../NasdaApp');

/*
  <Button
backgroundColor={NasdaApp.settings.buttonBackground}
large icon={{name: 'qrcode', type: 'font-awesome'}} title='Scan QR WIF as Legacy Address (P2PKH)'
onPress={() => {
  this.props.navigation.navigate('ScanQrWifLegacyAddress')
}}
/> */

export default class WalletsAdd extends Component {
  static navigationOptions = {
    tabBarLabel: 'Wallets',
    tabBarIcon: ({ tintColor, focused }) =>
      focused ? (
        <Image
          source={require('../../img/tabIcons/wallet_focus.png')}
          style={{ width: 25, height: 25 }}
        />
      ) : (
        <Image
          source={require('../../img/tabIcons/wallet.png')}
          style={{ width: 25, height: 25 }}
        />
      ),
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }

  async componentDidMount() {
    this.setState({
      isLoading: false,
    });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <SafeNasdaArea
        forceInset={{ horizontal: 'always' }}
        style={{ flex: 1, paddingTop: 40 }}
      >
        <NasdaSpacing />
        <NasdaCard title="Add Wallet">
          <NasdaText>
            You can either scan backup paper wallet (in WIF - Wallet Import
            Format), or create a new wallet. Segwit wallets supported by
            default.
          </NasdaText>

          <NasdaButton
            large
            icon={{ name: 'qrcode', type: 'font-awesome' }}
            title="Scan"
            onPress={() => {
              this.props.navigation.navigate('ScanQrWifSegwitP2SHAddress');
            }}
          />

          <NasdaButton
            large
            icon={{ name: 'bitcoin', type: 'font-awesome' }}
            title="Create"
            onPress={() => {
              this.props.navigation.goBack();
              setTimeout(async () => {
                let w = new SegwitP2SHWallet();
                w.setLabel('Nasdacoin');
                w.setSymbol('NSD')
                w.generate();
                NasdaApp.wallets.push(w);
                await NasdaApp.saveToDisk();
                EV(EV.enum.WALLETS_COUNT_CHANGED);
              }, 1);
            }}
          />
        </NasdaCard>

        <NasdaButton
          icon={{ name: 'arrow-left', type: 'octicon' }}
          title="Go Back"
          onPress={() => {
            this.props.navigation.goBack();
          }}
        />
      </SafeNasdaArea>
    );
  }
}

WalletsAdd.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }),
};
