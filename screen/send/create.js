import React, { Component } from 'react';
import { TextInput, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text, FormValidationMessage, Icon } from 'react-native-elements';
import {
  NasdaLoading,
  NasdaSpacing20,
  NasdaButton,
  SafeNasdaArea,
  NasdaCard,
  NasdaText,
  NasdaSpacing,
  NasdaHeader,
} from '../../NasdaComponents.js';
import PropTypes from 'prop-types';
let BigNumber = require('bignumber.js');
let NasdaApp = require('../../NasdaApp');

export default class SendCreate extends Component {
  static navigationOptions = {
    tabBarIcon: ({ tintColor, focused }) =>
      focused ? (
        <Image
          source={require('../../img/tabIcons/send_focus.png')}
          style={{ width: 25, height: 25 }}
        />
      ) : (
        <Image
          source={require('../../img/tabIcons/send.png')}
          style={{ width: 25, height: 25 }}
        />
      ),
  };

  constructor(props) {
    super(props);
    console.log('send/create constructor');
    this.state = {
      isLoading: true,
      amount: props.navigation.state.params.amount,
      fee: props.navigation.state.params.fee,
      address: props.navigation.state.params.address,
      memo: props.navigation.state.params.memo,
      fromAddress: props.navigation.state.params.fromAddress,
      broadcastErrorMessage: '',
    };

    let fromWallet = false;
    for (let w of NasdaApp.getWallets()) {
      if (w.getAddress() === this.state.fromAddress) {
        fromWallet = w;
        break;
      }
    }
    this.state['fromWallet'] = fromWallet;
  }

  async componentDidMount() {
    console.log('send/create - componentDidMount');
    console.log('address = ', this.state.address);

    let utxo;
    let satoshiPerByte;
    let tx;

    try {
      await this.state.fromWallet.fetchUtxo();
      utxo = this.state.fromWallet.utxo;
      let startTime = Date.now();

      tx = this.state.fromWallet.createTx(
        utxo,
        this.state.amount,
        this.state.fee,
        this.state.address,
        this.state.memo,
      );
      let endTime = Date.now();
      console.log('create tx ', (endTime - startTime) / 1000, 'sec');

      let bitcoin = require('bitcoinjs-lib');
      let txDecoded = bitcoin.Transaction.fromHex(tx);
      let txid = txDecoded.getId();
      console.log('txid', txid);
      console.log('txhex', tx);

      NasdaApp.tx_metadata = NasdaApp.tx_metadata || {};
      NasdaApp.tx_metadata[txid] = {
        txhex: tx,
        memo: this.state.memo,
      };
      NasdaApp.saveToDisk();

      let feeSatoshi = new BigNumber(this.state.fee);
      feeSatoshi = feeSatoshi.mul(100000000);
      satoshiPerByte = feeSatoshi.div(Math.round(tx.length / 2));
      satoshiPerByte = Math.round(satoshiPerByte.toString(10));
    } catch (err) {
      console.log(err);
      return this.setState({
        isError: true,
        errorMessage: JSON.stringify(err.message),
      });
    }

    this.setState({
      isLoading: false,
      size: Math.round(tx.length / 2),
      tx,
      satoshiPerByte,
    });
  }

  async broadcast() {
    let result = await this.state.fromWallet.broadcastTx(this.state.tx);
    console.log('broadcast result = ', result);
    if (typeof result === 'string') {
      result = JSON.parse(result);
    }
    if (result && result.error) {
      this.setState({
        broadcastErrorMessage: JSON.stringify(result.error),
        broadcastSuccessMessage: '',
      });
    } else {
      this.setState({ broadcastErrorMessage: '' });
      this.setState({
        broadcastSuccessMessage:
          'Success! TXID: ' + JSON.stringify(result.result),
      });
    }
  }

  render() {
    if (this.state.isError) {
      return (
        <SafeNasdaArea>
          <NasdaHeader
            rightComponent={
              <Icon
                name="settings"
                color={Color.text}
                size={20}
              // onPress={() => this.props.navigation.navigate('DrawerToggle')}
              />
            }
            leftComponent={
              <Icon
                name="search"
                color={Color.text}
                size={20}
              // onPress={() => this.props.navigation.navigate('DrawerToggle')}
              />
            }
            centerComponent={{
              text: 'WALLET',
              style: { color: Color.text, fontSize: 14 },
            }}
          />
          <NasdaCard
            title={'Create Transaction'}
            style={{ alignItems: 'center', flex: 1 }}
          >
            <NasdaText>
              Error creating transaction. Invalid address or send amount?
            </NasdaText>
            <FormValidationMessage>
              {this.state.errorMessage}
            </FormValidationMessage>
          </NasdaCard>
          <NasdaButton
            onPress={() => this.props.navigation.goBack()}
            title="Go back"
          />
        </SafeNasdaArea>
      );
    }

    if (this.state.isLoading) {
      return <NasdaLoading />;
    }

    return (
      <SafeNasdaArea>
        <NasdaHeader
          rightComponent={
            <Icon
              name="settings"
              color={Color.text}
              size={20}
            // onPress={() => this.props.navigation.navigate('DrawerToggle')}
            />
          }
          leftComponent={
            <Icon
              name="search"
              color={Color.text}
              size={20}
            // onPress={() => this.props.navigation.navigate('DrawerToggle')}
            />
          }
          centerComponent={{
            text: 'WALLET',
            style: { color: Color.text, fontSize: 14 },
          }}
        />

        <NasdaCard
          title={'Create Transaction'}
          style={{ alignItems: 'center', flex: 1 }}
        >
          <NasdaText>
            This is transaction hex, signed and ready to be broadcast to the
            network. Continue?
          </NasdaText>

          <TextInput
            style={{
              borderColor: '#ebebeb',
              borderWidth: 1,
              marginTop: 20,
              color: '#ebebeb',
            }}
            maxHeight={70}
            multiline
            editable={false}
            value={this.state.tx}
          />

          <NasdaSpacing20 />

          <NasdaText style={{ paddingTop: 20 }}>
            To: {this.state.address}
          </NasdaText>
          <NasdaText>Amount: {this.state.amount} BTC</NasdaText>
          <NasdaText>Fee: {this.state.fee} BTC</NasdaText>
          <NasdaText>TX size: {this.state.size} Bytes</NasdaText>
          <NasdaText>satoshiPerByte: {this.state.satoshiPerByte} Sat/B</NasdaText>
          <NasdaText>Memo: {this.state.memo}</NasdaText>
        </NasdaCard>

        <NasdaButton
          icon={{ name: 'megaphone', type: 'octicon' }}
          onPress={() => this.broadcast()}
          title="Broadcast"
        />

        <NasdaButton
          icon={{ name: 'arrow-left', type: 'octicon' }}
          onPress={() => this.props.navigation.goBack()}
          title="Go back"
        />

        <FormValidationMessage>
          {this.state.broadcastErrorMessage}
        </FormValidationMessage>
        <Text style={{ padding: 20, color: '#090' }}>
          {this.state.broadcastSuccessMessage}
        </Text>
      </SafeNasdaArea>
    );
  }
}

SendCreate.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.function,
    state: PropTypes.shape({
      params: PropTypes.shape({
        amount: PropTypes.string,
        fee: PropTypes.string,
        address: PropTypes.string,
        memo: PropTypes.string,
        fromAddress: PropTypes.string,
      }),
    }),
  }),
};
