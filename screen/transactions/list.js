import React, { Component } from 'react';
import { ListView, Image, TouchableOpacity, View, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import {
  NasdaLoading,
  SafeNasdaArea,
  NasdaHeader,
  NasdaTransactionItem,
} from '../../NasdaComponents.js';
import PropTypes from 'prop-types';
import { Color, TransactionType } from '../Constants';
let EV = require('../../events');
/** @type {AppStorage} */
let NasdaApp = require('../../NasdaApp');

let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

var intervalId = null;

export default class TransactionsList extends Component {
  static navigationOptions = {
    tabBarLabel: 'Transactions',
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
    this.state = {
      isLoading: true,
      walletIndex: 0,
      walletSymbols: ['ALL'],
      types: [
        TransactionType.ALL,
        TransactionType.RECEIVED,
        TransactionType.SENT,
      ],
      type: TransactionType.ALL,
    };

    EV(EV.enum.TRANSACTIONS_COUNT_CHANGED, this.refreshFunction.bind(this));
  }

  async componentDidMount() {
    console.log('transaction/list- componentDidMount');
    intervalId = setInterval(() => this.refresh(), 10000);
    // this.refresh();
    this.refreshFunction();
    this.setState({
      walletIndex: this.state.wallets.length,
    });
  } // end

  refreshFunction() {
    this.setState(
      {
        isLoading: true,
      },
      () => {
        setTimeout(() => {
          let wallets = NasdaApp.getWallets();
          var symbols = [];
          for (var i = 0; i < wallets.length; i++) {
            symbols.push(wallets[i].getSymbol());
          }
          symbols.push('ALL');
          if (this.state.walletIndex >= symbols.length) {
            this.setState({
              walletIndex: symbols.length - 1,
            });
          }
          this.setState({
            isLoading: false,
            wallets: wallets,
            walletSymbols: symbols,
            transactions: NasdaApp.getTransactionsByFilter(
              this.state.walletIndex,
              this.state.type,
            ),
          });
        }, 1);
      },
    );
  }

  filterWallet(index) {
    this.setState({
      walletIndex: index,
      transactions: NasdaApp.getTransactionsByFilter(index, this.state.type),
    });
  }

  filterType(type) {
    this.setState({
      type: type,
      transactions: NasdaApp.getTransactionsByFilter(
        this.state.walletIndex,
        type,
      ),
    });
  }

  // refresh() {
  //   this.setState(
  //     {
  //       isLoading: true,
  //     },
  //     async function() {
  //       let that = this;
  //       setTimeout(async function() {
  //         // more responsive
  //         let noErr = true;
  //         try {
  //           await NasdaApp.fetchWalletTransactions();
  //           await NasdaApp.fetchWalletBalances();
  //         } catch (err) {
  //           noErr = false;
  //           console.warn(err);
  //         }
  //         if (noErr) await NasdaApp.saveToDisk(); // caching
  //         EV(EV.enum.WALLETS_COUNT_CHANGED); // TODO: some other event type?

  //         that.setState({
  //           isLoading: false,
  //           dataSource: ds.cloneWithRows(NasdaApp.getTransactions()),
  //         });
  //       }, 10);
  //     },
  //   );
  // }

  async refresh() {
    let noErr = true;
    try {
      await NasdaApp.fetchWalletTransactions();
      await NasdaApp.fetchWalletBalances();
    } catch (err) {
      noErr = false;
      console.warn(err);
    }
    if (noErr) await NasdaApp.saveToDisk(); // caching
    EV(EV.enum.WALLETS_COUNT_CHANGED); // TODO: some other event type?

    this.setState({
      dataSource: ds.cloneWithRows(NasdaApp.getTransactions()),
    });
    console.log("refresh Transactions");
  }

  render() {
    if (this.state.isLoading) {
      return <NasdaLoading />;
    }

    let dataSource = ds.cloneWithRows(this.state.transactions);

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
        <View style={styles.view}>
          <View style={styles.rowContainerBetween}>
            <View style={styles.rowLeft}>
              {this.state.types.map(type => (
                <TouchableOpacity onPress={() => this.filterType(type)}>
                  <Text
                    style={[
                      styles.symbolButton,
                      {
                        backgroundColor: this.state.type === type ? Color.mark : 'transparent',
                        color: this.state.type === type ? 'white' : Color.light_text,
                      },
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.rowLeft}>
              {this.state.walletSymbols.map((symbol, index) => (
                <TouchableOpacity onPress={() => this.filterWallet(index)}>
                  <Text
                    style={[
                      styles.symbolButton,
                      {
                        backgroundColor:
                          this.state.walletIndex === index
                            ? Color.mark
                            : 'transparent',
                        color:
                          this.state.walletIndex === index
                            ? 'white'
                            : Color.light_text,
                      },
                    ]}
                  >
                    {symbol}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <ListView
            style={{ height: 360 }}
            enableEmptySections
            dataSource={dataSource}
            renderRow={this.renderItem}
          />
        </View>
      </SafeNasdaArea>
    );
  }

  renderItem = rowData => {
    const { navigate } = this.props.navigation;
    return (
      <NasdaTransactionItem
        onPress={() => {
          navigate('TransactionDetails', { transaction: rowData });
        }}
        data={rowData}
      />
    );
  };
}

TransactionsList.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

const styles = {
  view: {
    width: '100%',
    height: '100%',
    paddingLeft: 15,
    paddingRight: 15,
  },
  rowContainerBetween: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  symbolButton: {
    fontSize: 12,
    marginLeft: 3,
    marginRight: 3,
    paddingLeft: 3,
    paddingRight: 3,
    borderRadius: 3,
  },
};
