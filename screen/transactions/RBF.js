import React, { Component } from 'react';
import { ActivityIndicator, View, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  NasdaSpacing20,
  NasdaButton,
  SafeNasdaArea,
  NasdaCard,
  NasdaText,
  NasdaFormInput,
  NasdaSpacing,
} from '../../NasdaComponents.js';
import PropTypes from 'prop-types';
/** @type {AppStorage} */
let NasdaApp = require('../../NasdaApp');

export default class RBF extends Component {
  static navigationOptions = {
    tabBarIcon: ({ tintColor, focused }) =>
      focused ? (
        <Image
          source={require('../../img/tabIcons/transaction_focus.png')}
          style={{ width: 25, height: 25 }}
        />
      ) : (
        <Image
          source={require('../../img/tabIcons/transaction.png')}
          style={{ width: 25, height: 25 }}
        />
      ),
  };

  constructor(props) {
    super(props);
    let txid;
    if (props.navigation.state.params)
      txid = props.navigation.state.params.txid;

    let sourceWallet;
    let sourceTx;
    for (let w of NasdaApp.getWallets()) {
      for (let t of w.getTransactions()) {
        if (t.hash === txid) {
          // found our source wallet
          sourceWallet = w;
          sourceTx = t;
          console.log(t);
        }
      }
    }

    let destinationAddress;
    for (let o of sourceTx.outputs) {
      if (o.addresses[0] === sourceWallet.getAddress()) {
        // change
        // nop
      } else {
        // DESTINATION address
        destinationAddress = o.addresses[0];
        console.log('dest = ', destinationAddress);
      }
    }

    if (!destinationAddress) {
      this.state = {
        isLoading: false,
        nonReplaceable: true,
      };
      return;
    }

    this.state = {
      isLoading: true,
      txid,
      sourceTx,
      sourceWallet,
      newDestinationAddress: destinationAddress,
      feeDelta: '',
    };
  }

  async componentDidMount() {
    let startTime = Date.now();
    console.log('send/details - componentDidMount');
    this.setState({
      isLoading: false,
    });
    let endTime = Date.now();
    console.log('componentDidMount took', (endTime - startTime) / 1000, 'sec');
  }

  createTransaction() {
    this.props.navigation.navigate('CreateRBF', {
      feeDelta: this.state.feeDelta,
      newDestinationAddress: this.state.newDestinationAddress,
      txid: this.state.txid,
      sourceTx: this.state.sourceTx,
      sourceWallet: this.state.sourceWallet,
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

    if (this.state.nonReplaceable) {
      return (
        <SafeNasdaArea style={{ flex: 1, paddingTop: 20 }}>
          <NasdaSpacing20 />
          <NasdaSpacing20 />
          <NasdaSpacing20 />
          <NasdaSpacing20 />
          <NasdaSpacing20 />

          <NasdaText h4>This transaction is not replaceable</NasdaText>

          <NasdaButton
            onPress={() => this.props.navigation.goBack()}
            title="Back"
          />
        </SafeNasdaArea>
      );
    }

    if (!this.state.sourceWallet.getAddress) {
      return (
        <SafeNasdaArea style={{ flex: 1, paddingTop: 20 }}>
          <NasdaText>
            System error: Source wallet not found (this should never happen)
          </NasdaText>
          <NasdaButton
            onPress={() => this.props.navigation.goBack()}
            title="Back"
          />
        </SafeNasdaArea>
      );
    }

    return (
      <SafeNasdaArea style={{ flex: 1, paddingTop: 20 }}>
        <NasdaSpacing />
        <NasdaCard
          title={'Replace By Fee'}
          style={{ alignItems: 'center', flex: 1 }}
        >
          <NasdaText>
            RBF allows you to increase fee on already sent but not confirmed
            transaction, thus speeding up mining
          </NasdaText>
          <NasdaSpacing20 />

          <NasdaText>
            From wallet '{this.state.sourceWallet.getLabel()}' ({this.state.sourceWallet.getAddress()})
          </NasdaText>
          <NasdaSpacing20 />

          <NasdaFormInput
            onChangeText={text =>
              this.setState({ newDestinationAddress: text })
            }
            placeholder={'receiver address here'}
            value={this.state.newDestinationAddress}
          />

          <NasdaFormInput
            onChangeText={text => this.setState({ feeDelta: text })}
            keyboardType={'numeric'}
            placeholder={'fee to add (in BTC)'}
            value={this.state.feeDelta + ''}
          />
        </NasdaCard>

        <View style={{ flex: 1, flexDirection: 'row', paddingTop: 20 }}>
          <View style={{ flex: 0.33 }}>
            <NasdaButton
              onPress={() => this.props.navigation.goBack()}
              title="Cancel"
            />
          </View>
          <View style={{ flex: 0.33 }} />
          <View style={{ flex: 0.33 }}>
            <NasdaButton
              onPress={() => this.createTransaction()}
              title="Create"
            />
          </View>
        </View>
      </SafeNasdaArea>
    );
  }
}

RBF.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.function,
    navigate: PropTypes.func,
    state: PropTypes.shape({
      params: PropTypes.shape({
        txid: PropTypes.string,
      }),
    }),
  }),
};
