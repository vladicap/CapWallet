import React, { Component } from 'react';
import { ActivityIndicator, View, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import QRCode from 'react-native-qrcode';
import {
  NasdaSpacing,
  NasdaButton,
  SafeNasdaArea,
  NasdaCard,
  NasdaText,
} from '../../NasdaComponents.js';
import PropTypes from 'prop-types';
/** @type {AppStorage} */
let NasdaApp = require('../../NasdaApp');

export default class WalletExport extends Component {
  static navigationOptions = {
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

    let address = props.navigation.state.params.address;
    let wallet;

    for (let w of NasdaApp.getWallets()) {
      if (w.getAddress() === address) {
        // found our wallet
        wallet = w;
      }
    }

    this.state = {
      isLoading: true,
      wallet,
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

    /*

          <NasdaText style={{marginBottom: 10}}>
            WIF stands for Wallet Import Format. Backup your WIF (also shown on QR) in a safe place.
          </NasdaText>

          <Divider style={{ backgroundColor: '#ebebeb', marginBottom:20, }} />

    */

    return (
      <SafeNasdaArea style={{ flex: 1, paddingTop: 20 }}>
        <NasdaSpacing />
        <NasdaCard
          title={'Wallet Export'}
          style={{ alignItems: 'center', flex: 1 }}
        >
          <NasdaText>Address: {this.state.wallet.getAddress()}</NasdaText>
          <NasdaText>WIF: {this.state.wallet.getSecret()}</NasdaText>

          <QRCode
            value={this.state.wallet.getSecret()}
            size={300}
            bgColor={'white'}
            fgColor={NasdaApp.settings.brandingColor}
          />
        </NasdaCard>

        <NasdaButton
          icon={{ name: 'arrow-left', type: 'octicon' }}
          onPress={() => this.props.navigation.goBack()}
          title="Go back"
        />
      </SafeNasdaArea>
    );
  }
}

WalletExport.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.shape({
      params: PropTypes.shape({
        address: PropTypes.string,
      }),
    }),
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }),
};
