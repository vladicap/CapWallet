/* global alert */
import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Icon } from 'react-native-elements';
import {
  NasdaLoading,
  NasdaButton,
  SafeNasdaArea,
  NasdaCard,
  NasdaText,
  NasdaHeader,
} from '../NasdaComponents';
import PropTypes from 'prop-types';
/** @type {AppStorage} */
let NasdaApp = require('../NasdaApp');
let prompt = require('../prompt');
let EV = require('../events');

export default class PlausibleDeniability extends Component {
  static navigationOptions = {
    tabBarLabel: 'Plausible Deniability',
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
            text: 'Plausible Deniability',
            style: { color: '#fff', fontSize: 25 },
          }}
        />

        <NasdaCard>
          <ScrollView maxHeight={450}>
            <NasdaText>
              Under certain circumstances, you might be forced to disclose a
              password. To keep your coins safe, NasdaWallet can create another
              encrypted storage, with a different password. Under the pressure,
              you can disclose this password to a 3rd party. If entered in
              NasdaWallet, it will unlock new 'fake' storage. This will seem
              legit to a 3rd party, but will secretly keep your main storage
              with coins safe.
            </NasdaText>

            <NasdaText />

            <NasdaText>
              New storage will be fully functional, and you can store some
              minimum amounts there so it looks more believable.
            </NasdaText>

            <NasdaButton
              icon={{ name: 'shield', type: 'octicon' }}
              title="Create fake encrypted storage"
              onPress={async () => {
                let p1 = await prompt(
                  'Create a password',
                  'Password for fake storage should not match password for your main storage',
                );
                if (p1 === NasdaApp.cachedPassword) {
                  return alert(
                    'Password for fake storage should not match password for your main storage',
                  );
                }

                if (!p1) {
                  return;
                }

                let p2 = await prompt('Retype password');
                if (p1 !== p2) {
                  return alert('Passwords do not match, try again');
                }

                await NasdaApp.createFakeStorage(p1);
                EV(EV.enum.WALLETS_COUNT_CHANGED);
                EV(EV.enum.TRANSACTIONS_COUNT_CHANGED);
                alert('Success');
                this.props.navigation.navigate('Wallets');
              }}
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

PlausibleDeniability.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }),
};
