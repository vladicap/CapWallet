import React, { Component } from 'react';
import {
  Image,
  Text,
  View,
  Dimensions,
  TouchableHighlight,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Icon } from 'react-native-elements';
import QRCode from 'react-native-qrcode';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Dash from 'react-native-dash';
import {
  NasdaLoading,
  SafeNasdaArea,
  NasdaPaper,
  NasdaHeader,
} from '../../NasdaComponents.js';
import { Color } from '../Constants';
import { getDate } from '../customAPI';
let EV = require('../../events');
let NasdaApp = require('../../NasdaApp');

export default class ReceiveDetails extends Component {
  static navigationOptions = {
    tabBarLabel: 'Receive',
    tabBarIcon: ({ tintColor, focused }) =>
      focused ? (
        <Image
          source={require('../../img/tabIcons/request_focus.png')}
          style={{ width: 25, height: 25 }}
        />
      ) : (
        <Image
          source={require('../../img/tabIcons/request.png')}
          style={{ width: 25, height: 25 }}
        />
      ),
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      wallets: null,
      selectedWalletIndex: 0,
    };

    EV(EV.enum.WALLETS_COUNT_CHANGED, () => {
      return this.componentDidMount();
    });
  }

  async componentDidMount() {
    console.log('wallets/details - componentDidMount');
    this.setState({
      wallets: NasdaApp.getWallets(),
      isLoading: false,
    });
  }

  render() {
    if (this.state.isLoading) {
      return <NasdaLoading />;
    }

    const { dateString, timeString, weekDay } = getDate();

    var address;
    var symbol;
    address = symbol = '';
    if (this.state.wallets !== null && this.state.wallets.length !== 0) {
      address = this.state.wallets[this.state.selectedWalletIndex].getAddress();
      symbol = this.state.wallets[this.state.selectedWalletIndex].getSymbol();
      console.log(this.state.wallets);
    } else {
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <Text>
            System error: Source wallet not found (this should never happen)
          </Text>
        </View>
      );
    }

    return (
      <SafeNasdaArea style={{ flex: 1, paddingTop: 20 }}>
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
            text: 'REQUEST MONEY',
            style: { color: Color.light_text, fontSize: 14 },
          }}
        />
        <KeyboardAwareScrollView
          style={styles.view}
          containerStyle={styles.container}
          innerRef={ref => (this.scroll = ref)}
        >
          <NasdaPaper
            wallets={this.state.wallets}
            initialWallet={this.state.selectedWalletIndex}
            onChangeWallet={index =>
              this.setState({
                selectedWalletIndex: index,
              })
            }
            icon={
              <Image
                source={require('../../img/icon/ic_receive.png')}
                style={{ width: 60, height: 60 }}
              />
            }
          >
            <Text style={{ color: Color.text, fontSize: 14, marginBottom: 5 }}>
              {symbol} ADDRESS
            </Text>
            <QRCode
              value={address}
              size={180}
              bgColor="white"
              fgColor={NasdaApp.settings.brandingColor}
            />
            <Text
              style={{ color: Color.text, fontSize: 12, marginTop: 5 }}
              selectable
            >
              {address}
            </Text>
            {/* <View style={styles.amountRowBetween} >
              <Feather name="minus" color={Color.mark} size={20} />
              <View style={styles.rowCenter}>
                <TextInput
                  ref={o => (this.amountInput = o)}
                  style={styles.amountTextInput}
                  onChangeText={this.filterAmountText}
                  fontSize={25}
                  textColor={Color.text}
                  value={this.state.amount}
                  placeholder="0.00"
                  onSubmitEditing={() => this.messageInput.focusInput()}
                />
                <Text
                  style={[
                    styles.amountTextInput,
                    {
                      marginLeft: 5,
                    },
                  ]}
                >
                  {this.state.wallets[this.state.selectedWalletIndex].symbol}
                </Text>
              </View>
              <Feather name="plus" color={Color.mark} size={20} />
            </View>
            <Text style={styles.fiatCurrency}>$350</Text> */}
            <Dash
              style={{
                width: '100%',
                height: 1,
                marginTop: 20,
                marginBottom: 10,
              }}
              dashThickness={1}
              dashColor={Color.light_gray}
            />
            <View style={styles.rowBetween} >
              <Text style={{ color: Color.text, fontSize: 12 }}>{weekDay}</Text>
              <Text style={{ color: Color.text, fontSize: 12 }}>TIME</Text>
            </View>
            <View style={styles.rowBetween} >
              <Text style={{ color: Color.mark, fontSize: 14 }}>
                {dateString}
              </Text>
              <Text style={{ color: Color.mark, fontSize: 14 }}>
                {timeString}
              </Text>
            </View>
          </NasdaPaper>

          <View style={[styles.rowCenter, { width: '100%' }]}>
            <TouchableHighlight underlayColor={Color.button_underlay}
              style={styles.button}
              // onPress={() => this.createTransaction()}
            >
              <Text style={{ color: 'white', fontSize: 16 }}>Share</Text>
            </TouchableHighlight>
          </View>
        </KeyboardAwareScrollView>
      </SafeNasdaArea>

      /* <SafeNasdaArea
        forceInset={{ horizontal: 'always' }}
        style={{ flex: 1, paddingTop: 20 }}
      >
        <NasdaSpacing />
        <NasdaCard
          title={'Share this address with payer'}
          style={{ alignItems: 'center', flex: 1 }}
        >
          <TextInput
            style={{ marginBottom: 20, color: 'white' }}
            editable
            value={this.state.address}
          />
          <QRCode
            value={this.state.address}
            size={150}
            bgColor="white"
            fgColor={NasdaApp.settings.brandingColor}
          />
        </NasdaCard>

        <NasdaButton
          icon={{ name: 'arrow-left', type: 'octicon' }}
          backgroundColor={NasdaApp.settings.buttonBackground}
          onPress={() => this.props.navigation.goBack()}
          title="Go back"
        />
      </SafeNasdaArea> */
    );
  }
}

const { height } = Dimensions.get('window');

const styles = {
  view: {
    width: '100%',
    height: '100%',
    paddingLeft: 15,
    paddingRight: 15,
  },
  container: {
    width: '100%',
    height: height,
    backgroundColor: 'green',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  columnLeft: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1,
  },
  rowBottom: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: '100%',
  },
  amountRowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 50,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullTextInput: {
    width: '100%',
    borderBottomColor: Color.light_gray,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountTextInput: {
    maxWidth: '80%',
    color: Color.text,
    fontSize: 25,
    minWidth: 50,
  },
  fiatCurrency: {
    color: Color.light_text,
    fontSize: 20,
  },
  button: {
    width: '80%',
    height: 50,
    borderRadius: 25,
    backgroundColor: Color.button,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
};
