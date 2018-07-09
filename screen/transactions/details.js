import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { Icon } from 'react-native-elements';
import {
  NasdaButton,
  SafeNasdaArea,
  NasdaCard,
  NasdaText,
  NasdaSpacing,
  NasdaLoading,
  NasdaSpacing20,
  NasdaHeader,
} from '../../NasdaComponents.js';
import PropTypes from 'prop-types';
import { Color } from '../Constants';
/** @type {AppStorage} */
let NasdaApp = require('../../NasdaApp');

export default class TransactionsDetails extends Component {
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
    let foundTx = props.navigation.state.params.transaction;
    // let foundTx = {};
    let from = [];
    let to = [];

    for (let input of foundTx.inputs) {
      from = from.concat(input.addresses);
    }
    for (let output of foundTx.outputs) {
      to = to.concat(output.addresses);
    }

    this.state = {
      isLoading: true,
      tx: foundTx,
      from,
      to,
    };
  }

  async componentDidMount() {
    console.log('transactions/details - componentDidMount');
    this.setState({
      isLoading: false,
    });
  }

  txMemo(hash) {
    if (NasdaApp.tx_metadata[hash] && NasdaApp.tx_metadata[hash]['memo']) {
      return ' | ' + NasdaApp.tx_metadata[hash]['memo'];
    }
    return '';
  }

  render() {
    if (this.state.isLoading) {
      return <NasdaLoading />;
    }

    return (
      <SafeNasdaArea>
        <NasdaHeader
          rightComponent={
            <Icon
              name="settings"
              color={Color.light_text}
              size={20}
            // onPress={() => this.props.navigation.navigate('DrawerToggle')}
            />
          }
          leftComponent={
            <Icon
              name="search"
              color={Color.light_text}
              size={20}
              // onPress={() => this.props.navigation.navigate('DrawerToggle')}
            />
          }
          centerComponent={{
            text: 'TRANSACTIONS',
            style: { color: Color.light_text, fontSize: 14 },
          }}
        />

        <NasdaCard
          title={'Transaction details'}
          style={{ alignItems: 'center', flex: 1 }}
        >
          {(() => {
            if (NasdaApp.tx_metadata[this.state.tx.hash]) {
              if (NasdaApp.tx_metadata[this.state.tx.hash]['memo']) {
                return (
                  <View>
                    <NasdaText h4>
                      {NasdaApp.tx_metadata[this.state.tx.hash]['memo']}
                    </NasdaText>
                    <NasdaSpacing20 />
                  </View>
                );
              }
            }
          })()}

          <NasdaText h4>From:</NasdaText>
          <NasdaText style={{ marginBottom: 10 }}>
            {this.state.from.join(', ')}
          </NasdaText>

          <NasdaText h4>To:</NasdaText>
          <NasdaText style={{ marginBottom: 10 }}>
            {this.state.to.join(', ')}
          </NasdaText>

          <NasdaText>Txid: {this.state.tx.hash}</NasdaText>
          <NasdaText>received: {this.state.tx.received}</NasdaText>
          <NasdaText>confirmed: {this.state.tx.confirmed}</NasdaText>
          <NasdaText>confirmations: {this.state.tx.confirmations}</NasdaText>
          <NasdaText>inputs: {this.state.tx.inputs.length}</NasdaText>
          <NasdaText>outputs: {this.state.tx.outputs.length}</NasdaText>

          <NasdaText style={{ marginBottom: 10 }} />
        </NasdaCard>

        {(() => {
          if (this.state.tx.confirmations === 0) {
            return (
              <NasdaButton
                onPress={() =>
                  this.props.navigation.navigate('RBF', {
                    txid: this.state.tx.hash,
                  })
                }
                title="Replace-By-Fee (RBF)"
              />
            );
          }
        })()}

        <NasdaButton
          icon={{ name: 'arrow-left', type: 'octicon' }}
          onPress={() => this.props.navigation.goBack()}
          title="Go back"
        />
      </SafeNasdaArea>
    );
  }
}

TransactionsDetails.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.function,
    navigate: PropTypes.func,
    state: PropTypes.shape({
      params: PropTypes.shape({
        transaction: PropTypes.object,
      }),
    }),
  }),
};
