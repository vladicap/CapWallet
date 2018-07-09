import { TabNavigator } from 'react-navigation';

import transactions from './screen/transactions';
import wallets from './screen/wallets';
import send from './screen/send';
import graph from './screen/graph';
import receive from './screen/receive';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Color } from './screen/Constants'

/**
 *
 * @type {AppStorage}
 */
let NasdaApp = require('./NasdaApp');

const Tabs = TabNavigator(
  {
    Transactions: {
      screen: transactions,
      path: 'trans',
    },
    Send: {
      screen: send,
      path: 'cart',
    },
    Wallets: {
      screen: wallets,
      path: 'wallets',
    },
    Receive: {
      screen: receive,
      path: 'receive',
    },
    Graph: {
      screen: graph,
      path: 'graph',
    },
  },
  {
    tabBarPosition: 'bottom',
    animationEnabled: false,
    initialRouteName: 'Wallets',
    // initialRouteName: 'Graph',
    swipeEnabled: false,
    tabBarOptions: {
      showLabel: false,
      showIcon: true,
      activeTintColor: 'white',
      activeBackgroundColor: 'transparent',
      inactiveBackgroundColor: 'transparent',
      inactiveTintColor: 'black',
      style: {
        backgroundColor: Color.background,
        height: 50,
        borderColor: 'transparent',
        shadowColor: 'transparent',
        shadowRadius: 0,
        shadowOffset: {
          height: 0,
        }
      },
      indicatorStyle: {
        opacity: 0
      }
    },
  },
);

export default Tabs;
