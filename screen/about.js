import React, { Component } from 'react';
import { ScrollView, Linking } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Icon } from 'react-native-elements';
import {
  NasdaLoading,
  NasdaSpacing20,
  NasdaButton,
  SafeNasdaArea,
  NasdaCard,
  NasdaText,
  NasdaHeader,
} from '../NasdaComponents';
import PropTypes from 'prop-types';
/** @type {AppStorage} */
let NasdaApp = require('../NasdaApp');

export default class About extends Component {
  static navigationOptions = {
    tabBarLabel: 'About',
    tabBarIcon: ({ tintColor, focused }) => (
      <Ionicons
        name={focused ? 'ios-settings' : 'ios-settings-outline'}
        size={26}
        style={{ color: tintColor }}
      />
    ),
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }

  async componentDidMount() {
    this.setState({
      isLoading: false,
    });
  }

  render() {
    if (this.state.isLoading) {
      return <NasdaLoading />;
    }

    return (
      <SafeNasdaArea forceInset={{ horizontal: 'always' }} style={{ flex: 1 }}>
        <NasdaHeader
          backgroundColor={NasdaApp.settings.brandingColor}
          leftComponent={
            <Icon
              name="menu"
              color="#fff"
              onPress={() => this.props.navigation.navigate('DrawerToggle')}
            />
          }
          centerComponent={{
            text: 'About',
            style: { color: '#fff', fontSize: 25 },
          }}
        />

        <NasdaCard>
          <ScrollView maxHeight={450}>
            <NasdaText h1>About</NasdaText>
            <NasdaSpacing20 />

            <NasdaText h4>
              Nasda Wallet is free and opensource Bitcoin wallet
            </NasdaText>
            <NasdaText>
              Warning: Alpha version, don't use to store large amouts!
            </NasdaText>
            <NasdaButton
              icon={{ name: 'octoface', type: 'octicon' }}
              onPress={() => {
                Linking.openURL('https://github.com/Overtorment/NasdaWallet');
              }}
              title="github.com/Overtorment/NasdaWallet"
            />

            <NasdaSpacing20 />
            <NasdaText h4>Licensed MIT</NasdaText>
            <NasdaSpacing20 />

            <NasdaText h3>Built with awesome:</NasdaText>
            <NasdaSpacing20 />
            <NasdaText h4>* React Native</NasdaText>
            <NasdaText h4>* Bitcoinjs-lib</NasdaText>
            <NasdaText h4>* blockcypher.com API</NasdaText>
            <NasdaText h4>* Nodejs</NasdaText>
            <NasdaText h4>* Expo</NasdaText>
            <NasdaText h4>* react-native-elements</NasdaText>
            <NasdaText h4>* rn-nodeify</NasdaText>
            <NasdaText h4>* bignumber.js</NasdaText>
            <NasdaText h4>* https://github.com/StefanoBalocco/isaac.js</NasdaText>
            <NasdaText h4>
              * Design by https://dribbble.com/chrometaphore
            </NasdaText>

            <NasdaButton
              onPress={() => {
                this.props.navigation.navigate('Selftest');
              }}
              title="Run self test"
            />
            <NasdaButton
              icon={{ name: 'arrow-left', type: 'octicon' }}
              title="Go Back"
              onPress={() => {
                this.props.navigation.goBack();
              }}
            />
          </ScrollView>
        </NasdaCard>
      </SafeNasdaArea>
    );
  }
}

About.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }),
};
