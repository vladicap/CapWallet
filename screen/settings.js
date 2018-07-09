/* global alert */
import React, { Component } from 'react';
import { ScrollView, View, Image } from 'react-native';
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
} from '../NasdaComponents';
import PropTypes from 'prop-types';
/** @type {AppStorage} */
let NasdaApp = require('../NasdaApp');
let prompt = require('../prompt');

export default class Settings extends Component {
  static navigationOptions = {
    tabBarLabel: 'Settings',
    tabBarIcon: ({ tintColor, focused }) =>
      focused ? (
        <Image
          source={require('../img/tabIcons/graph_focus.png')}
          style={{ width: 25, height: 25 }}
        />
      ) : (
        <Image
          source={require('../img/tabIcons/graph.png')}
          style={{ width: 25, height: 25 }}
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
      storageIsEncrypted: await NasdaApp.storageIsEncrypted(),
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
            text: 'Settings',
            style: { color: '#fff', fontSize: 25 },
          }}
        />

        <NasdaCard>
          <ScrollView maxHeight={450}>
            <NasdaSpacing20 />

            {(() => {
              if (this.state.storageIsEncrypted) {
                return (
                  <View>
                    <NasdaText>Storage: encrypted</NasdaText>
                    <NasdaButton
                      onPress={() =>
                        this.props.navigation.navigate('PlausibleDeniability')
                      }
                      title="Plausible deniability..."
                    />
                  </View>
                );
              } else {
                return (
                  <View>
                    <FormValidationMessage>
                      Storage: not encrypted
                    </FormValidationMessage>
                    <NasdaButton
                      icon={{ name: 'shield', type: 'octicon' }}
                      onPress={async () => {
                        this.setState({ isLoading: true });
                        let p1 = await prompt(
                          'Password',
                          'Create the password you will use to decrypt the storage',
                        );
                        if (!p1) {
                          this.setState({ isLoading: false });
                          return;
                        }
                        let p2 = await prompt(
                          'Password',
                          'Re-type the password',
                        );
                        if (p1 === p2) {
                          await NasdaApp.encryptStorage(p1);
                          this.setState({
                            isLoading: false,
                            storageIsEncrypted: await NasdaApp.storageIsEncrypted(),
                          });
                        } else {
                          this.setState({ isLoading: false });
                          alert('Passwords do not match. Please try again');
                        }
                      }}
                      title="Encrypt storage"
                    />
                  </View>
                );
              }
            })()}

            <NasdaButton
              onPress={() => this.props.navigation.navigate('About')}
              title="About"
            />
          </ScrollView>
        </NasdaCard>
      </SafeNasdaArea>
    );
  }
}

Settings.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};
