import React, { Component } from 'react';
import { ActivityIndicator, View, ScrollView, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  NasdaSpacing,
  NasdaFormInput,
  NasdaButton,
  SafeNasdaArea,
  NasdaCard,
  NasdaText,
  NasdaFormLabel,
  NasdaPaper
} from '../../NasdaComponents.js';
import PropTypes from 'prop-types';
let EV = require('../../events');
/** @type {AppStorage} */
let NasdaApp = require('../../NasdaApp');

export default class WalletDetails extends Component {
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

    /**  @type {AbstractWallet}   */
    let wallet;

    for (let w of NasdaApp.getWallets()) {
      if (w.getAddress() === address) {
        // found our wallet
        wallet = w;
      }
    }

    this.state = {
      confirmDelete: false,
      isLoading: true,
      wallet,
    };
  }

  async componentDidMount() {
    this.setState({
      isLoading: false,
    });
  }

  async setLabel(text) {
    this.state.wallet.label = text;
    this.setState({
      labelChanged: true,
    }); /* also, a hack to make screen update new typed text */
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
      <SafeNasdaArea>
        <ScrollView contentContainerStyle={{paddingLeft: 15, paddingRight: 15}}>
        <NasdaPaper style={{ alignItems: 'center', flex: 1 }}>
        {/* <NasdaCard
          title={'Wallet Details'}
          style={{ alignItems: 'center', flex: 1 }}
        > */}
          <View style={{width: '100%'}}>
            <NasdaFormLabel>Address:</NasdaFormLabel>
            <NasdaFormInput
              value={this.state.wallet.getAddress()}
              editable={false}
            />

            <NasdaFormLabel>Type:</NasdaFormLabel>
            <NasdaFormInput
              value={this.state.wallet.getTypeReadable()}
              editable={false}
            />

            <NasdaFormLabel>Label:</NasdaFormLabel>
            <NasdaFormInput
              value={this.state.wallet.getLabel()}
              onChangeText={text => {
                this.setLabel(text);
              }}
            />
          </View>
        {/* </NasdaCard> */}
        </NasdaPaper>

        {(() => {
          if (this.state.confirmDelete) {
            return (
              <View style={{ alignItems: 'center' }}>
                <NasdaText h4>Are you sure?</NasdaText>
                <NasdaButton
                  icon={{ name: 'stop', type: 'octicon' }}
                  onPress={async () => {
                    NasdaApp.deleteWallet(this.state.wallet);
                    await NasdaApp.saveToDisk();
                    EV(EV.enum.TRANSACTIONS_COUNT_CHANGED);
                    EV(EV.enum.WALLETS_COUNT_CHANGED);
                    this.props.navigation.goBack();
                  }}
                  title="Yes, delete"
                />
                <NasdaButton
                  onPress={async () => {
                    this.setState({ confirmDelete: false });
                  }}
                  title="No, cancel"
                />
              </View>
            );
          } else {
            return (
              <View>
                <NasdaButton
                  icon={{ name: 'stop', type: 'octicon' }}
                  onPress={async () => {
                    this.setState({ confirmDelete: true });
                  }}
                  title="Delete this wallet"
                />
                <NasdaButton
                  onPress={() =>
                    this.props.navigation.navigate('WalletExport', {
                      address: this.state.wallet.getAddress(),
                    })
                  }
                  title="Export / backup"
                />
                <NasdaButton
                  icon={{ name: 'arrow-left', type: 'octicon' }}
                  onPress={async () => {
                    if (this.state.labelChanged) {
                      await NasdaApp.saveToDisk();
                      EV(EV.enum.WALLETS_COUNT_CHANGED); // TODO: some other event type?
                    }
                    this.props.navigation.goBack();
                  }}
                  title="Go back"
                />
              </View>
            );
          }
        })()}
        </ScrollView>
      </SafeNasdaArea>
    );
  }
}

WalletDetails.propTypes = {
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
