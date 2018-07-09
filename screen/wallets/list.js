import React, { Component } from 'react';
import { 
  ListView, 
  View, 
  Dimensions, 
  TouchableOpacity, 
  TouchableHightlight,
  Text,
  Image
} from 'react-native';
import {
  ListItem
} from 'react-native-elements'
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  NasdaLoading,
  NasdaList,
  NasdaButton,
  SafeNasdaArea,
  NasdaCard,
  NasdaText,
  NasdaListItem,
  NasdaHeader,
  NasdaLabel,
  NasdaWalletItem
} from '../../NasdaComponents.js';
import { SegwitP2SHWallet } from '../../class';
import { Icon } from 'react-native-elements';
import { Color } from '../Constants.js'
import PropTypes from 'prop-types';

const {width, heigth} = Dimensions.get('window')

let EV = require('../../events');
/** @type {AppStorage} */
let NasdaApp = require('../../NasdaApp');

let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

export default class WalletsList extends Component {
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
    EV(EV.enum.WALLETS_COUNT_CHANGED, this.refreshFunction.bind(this));
    EV(EV.enum.WALLET_LOAD_FAILED, this.initWallets.bind(this));
  }

  async componentDidMount() {
    this.refreshFunction();
  } // end of componendDidMount

  initWallets() {
    NasdaApp.initWallets();
    this.refreshFunction();
  }

  refreshFunction() {
    this.setState(
      {
        isLoading: true,
      },
      () => {
        setTimeout(() => {
          let wallets = NasdaApp.getWallets();
          console.log(wallets);
          this.setState({
            isLoading: false,
            dataSource: ds.cloneWithRows(NasdaApp.getWallets()),
          });
        }, 1);
      },
    );
  }

  render() {
    const { navigate } = this.props.navigation;

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
            text: 'WALLET',
            style: { color: Color.light_text, fontSize: 14 },
          }}
        />
        <View style={styles.view} >
          <View style={styles.topContent} >
            <NasdaLabel>Hi Steve, your total balance</NasdaLabel>
            <View style={styles.row}>
              <FontAwesome name='bitcoin' color={Color.text} size={25} />
              <Text style={styles.totalBalance} >10.101010</Text>
            </View>
            <View style={styles.row}>
              <NasdaLabel>Last 24h: </NasdaLabel>
              <NasdaLabel style={{color: Color.positive}}>+ $9 250  21.3%</NasdaLabel>
            </View>
          </View>

          <View style={styles.send_receive}>
            <TouchableOpacity style={{ flex: 1 }} 
              onPress={() => {
                navigate('Send');
              }}>
              <View style={[styles.send_receive_button, {borderRightColor: 'white', borderRightWidth: 1}]}>
                <Image source={require('../../img/icon/ic_send.png')} style={{width: 60, height: 60}}/>
                <Text style={styles.send_receive_text}>Send Money</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1 }}
              onPress={() => {
                navigate('Receive');
              }}>
              <View style={[styles.send_receive_button, {borderLeftColor: 'white', borderLeftWidth: 1}]}>
                <Image source={require('../../img/icon/ic_receive.png')} style={{ width: 60, height: 60 }} />
                <Text style={styles.send_receive_text}>Request Money</Text>
              </View>
            </TouchableOpacity>
          </View>
          <ListView
            enableEmptySections
            maxHeight={290}
            dataSource={this.state.dataSource}
            renderRow={rowData => this.renderItem(rowData)}
          />
          {/* <NasdaButton
            icon={{ name: 'plus-small', type: 'octicon' }}
            onPress={() => {
              navigate('AddWallet');
            }}
            title="Add Wallet"
          /> */}
        </View>
      </SafeNasdaArea>
    );
  }

  renderItem(rowData) {
    const { navigate } = this.props.navigation;
    return (
      <NasdaWalletItem
        onPress={() => {
          navigate('WalletDetails', {
            address: rowData.getAddress(),
          });
        }}
        data={rowData}
      />
    );
  }
}

WalletsList.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

const styles = {
  view: {
    paddingLeft: 15,
    paddingRight: 15
  },
  topContent: {
    paddingLeft: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalBalance: {
    color: Color.normal,
    fontSize: 40,
    marginLeft: 10,
  },
  send_receive: {
    borderRadius: 10,
    backgroundColor: '#31306a',
    width: '100%',
    height: 130,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 15,
    paddingBottom: 15,
    marginTop: 20,
    marginBottom: 20,
  },
  send_receive_button: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  send_receive_text: {
    color: 'white',
    fontSize: 18,
  },
}
