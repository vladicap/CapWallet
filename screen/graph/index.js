/* global alert */
import React, { Component } from 'react';
import { ScrollView, View, Image, Dimensions, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Icon, FormValidationMessage } from 'react-native-elements';
import {
  NasdaLoading,
  NasdaSpacing20,
  NasdaButton,
  SafeNasdaArea,
  NasdaCard,
  NasdaText,
  NasdaHeader,
} from '../../NasdaComponents';
import Chart from './chart';
import PropTypes from 'prop-types';
import { Color } from '../Constants.js';
import { getBitcoinMarketPrice } from '../customAPI';
/** @type {AppStorage} */
let NasdaApp = require('../../NasdaApp');
let prompt = require('../../prompt');

const width = Dimensions.get('window').width;

const durationTypes = [
  {
    label: '1W',
    param: '1weeks',
  },
  {
    label: '1M',
    param: '1months',
  },
  {
    label: '3M',
    param: '3months',
  },
  {
    label: '6M',
    param: '6months',
  },
  {
    label: '1Y',
    param: '1years',
  },
  {
    label: 'ALL',
    param: 'all',
  },
];

export default class CryptoGraph extends Component {
  static navigationOptions = {
    tabBarLabel: 'Settings',
    tabBarIcon: ({ tintColor, focused }) =>
      focused ? (
        <Image
          source={require('../../img/tabIcons/graph_focus.png')}
          style={{ width: 25, height: 25 }}
        />
      ) : (
        <Image
          source={require('../../img/tabIcons/graph.png')}
          style={{ width: 25, height: 25 }}
        />
      ),
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      bitcoinMarket: [],
      timespan: 'all',
    };
  }

  async componentDidMount() {
    let wallets = NasdaApp.getWallets();
    console.log(wallets[0].balance)
    const market = await getBitcoinMarketPrice();
    this.setState({
      wallets: wallets,
      isLoading: false,
      bitcoinMarket: market,
      currentPrice: market[market.length - 1].y.toFixed(1),
      sinceLastDay: (market[market.length - 1].y - market[market.length - 2].y).toFixed(1),
      balance: wallets[0].balance,
    });
    console.log(this.state.bitcoinMarket);
  }

  async updateChart(timespan) {
    const market = await getBitcoinMarketPrice(timespan);
    this.setState({
      timespan: timespan,
      bitcoinMarket: market,
      balance: this.state.wallets[0].balance,
    });
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
            text: 'PRICE',
            style: { color: Color.light_text, fontSize: 14 },
          }}
        />
        <View style={styles.view}>
          <View style={styles.durationView}>
            {
              durationTypes.map(type => (
                <TouchableOpacity onPress={() => this.updateChart(type.param)} style={[styles.durationButton, {backgroundColor: this.state.timespan === type.param ? Color.mark : 'transparent',}]}>
                  <Text
                    style={
                      {
                        color: this.state.timespan === type.param ? 'white' : Color.light_text,
                      }
                    }
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))
            }
          </View>
          <ScrollView contentContainerStyle={styles.chart} showsVerticalScrollIndicator={false}>
            <Chart
              data={{
                currentPrice: this.state.currentPrice,
                sinceLastDay: this.state.sinceLastDay,
                balance: this.state.balance * this.state.currentPrice,
                symbol: 'BTC',
                coin: 'Bitcoin',
                currency: '$',
                market: this.state.bitcoinMarket,
              }}
              chartConfig={{
                width: width - 30,
                height: 200,
                backgroundColor: Color.chart_background,
                backgroundFill: Color.button,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              }}
            />
          </ScrollView>
        </View>
      </SafeNasdaArea>
    );
  }
}

// CryptoGraph.propTypes = {
//   navigation: PropTypes.shape({
//     navigate: PropTypes.func,
//   }),
// };

const styles = {
  view: {
    width: '100%',
    paddingLeft: 15,
    paddingRight: 15,
  },
  chart: {
    paddingBottom: 90,
  },
  durationView: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  durationButton: {
    flex: 1,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
};
