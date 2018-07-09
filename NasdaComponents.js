/** @type {AppStorage} */
import React, { Component } from 'react';
import { SafeAreaView } from 'react-navigation';
import {
  Button,
  FormLabel,
  FormInput,
  Card,
  Text,
  Header,
  List,
  ListItem,
} from 'react-native-elements';
import { Color } from './screen/Constants.js'
import {
  ActivityIndicator,
  ListView,
  View,
  Dimensions,
  Platform,
  TouchableHighlight,
  TouchableOpacity,
  Image
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
let NasdaApp = require('./NasdaApp');

const { width, heigth } = Dimensions.get('window')

export class NasdaButton extends Component {
  render() {
    return (
      <Button
        {...this.props}
        style={{
          marginTop: 20,
          borderRadius: 6,
        }}
        borderRadius={10}
        backgroundColor={Color.button}
      />
    );
  }
  /* icon={{name: 'home', type: 'octicon'}} */
}

export class SafeNasdaArea extends Component {
  render() {
    return (
      <SafeAreaView
        {...this.props}
        forceInset={{ horizontal: 'always' }}
        style={{ flex: 1, backgroundColor: NasdaApp.settings.brandingColor }}
      />
    );
  }
}

export class NasdaCard extends Component {
  render() {
    return (
      <Card
        {...this.props}
        titleStyle={{ color: 'white' }}
        containerStyle={{ backgroundColor: NasdaApp.settings.buttonBackground }}
        wrapperStyle={{ backgroundColor: NasdaApp.settings.buttonBackground }}
      />
    );
  }
}

export class NasdaText extends Component {
  render() {
    return <Text {...this.props} style={{ color: 'white' }} />;
  }
}

export class NasdaLabel extends Component {
  render() {
    var color = Color.light_text
    if (this.props.style !== undefined && this.props.style.color !== undefined) {
      color = this.props.style.color
    }
    return <Text {...this.props} style={[this.props.style, { color: color, fontSize: 12 }]} />
  }
}

export class NasdaTitle extends Component {
  render() {
    return <Text {...this.props} style={{ color: Color.normal, fontSize: 14 }} />
  }
}

export class NasdaListItem extends Component {
  render() {
    return (
      <ListItem
        {...this.props}
        containerStyle={styles.listItem}
        titleStyle={{ color: 'white', fontSize: 18 }}
        subtitleStyle={{ color: 'white' }}
      />
    );
  }
}

export class NasdaFormLabel extends Component {
  render() {
    return <FormLabel {...this.props} labelStyle={{ color: 'black' }} />;
  }
}

export class NasdaFormInput extends Component {
  render() {
    return <FormInput {...this.props} inputStyle={{ color: 'black' }} />;
  }
}

export class NasdaHeader extends Component {
  render() {
    return (
      <Header
        {...this.props}
        backgroundColor={NasdaApp.settings.brandingColor}
        height={40}
        statusBarProps={{ barStyle: 'light-content' }}
        outerContainerStyles={{ height: Platform.OS === 'ios' ? 80 : 80, borderBottomWidth: 0 }}
      />
    );
  }
}

export class NasdaSpacing extends Component {
  render() {
    return (
      <View
        {...this.props}
        style={{ height: 60, backgroundColor: NasdaApp.settings.brandingColor }}
      />
    );
  }
}

export class NasdaSpacing20 extends Component {
  render() {
    return (
      <View
        {...this.props}
        style={{ height: 20, backgroundColor: NasdaApp.settings.brandingColor }}
      />
    );
  }
}

export class NasdaListView extends Component {
  render() {
    return <ListView {...this.props} />;
  }
}

export class NasdaList extends Component {
  render() {
    return (
      <List
        {...this.props}
        containerStyle={{ backgroundColor: NasdaApp.settings.brandingColor }}
      />
    );
  }
}

export class NasdaView extends Component {
  render() {
    return (
      <View
        {...this.props}
        containerStyle={{ backgroundColor: NasdaApp.settings.brandingColor }}
      />
    );
  }
}

export class NasdaLoading extends Component {
  render() {
    return (
      <SafeNasdaArea>
        <View style={{ flex: 1, paddingTop: 200 }}>
          <ActivityIndicator />
        </View>
      </SafeNasdaArea>
    );
  }
}

export class NasdaWalletItem extends Component {
  render() {
    return (
      <TouchableHighlight {...this.props} style={[styles.item, this.props.style]} underlayColor='#232951'>
        <View style={styles.row}>
          <FontAwesome name='bitcoin' color={Color.mark} size={20} />
          <View style={[styles.column, { marginLeft: 10 }]} >
            {/* <Text>{this.props.data.} */}
            <Text style={{ color: '#f2f3f8', fontSize: 14 }} >{this.props.data.getLabel()} </Text>
            <Text style={{ color: '#f2f3f8', fontSize: 14 }} >{this.props.data.getBalance()} {this.props.data.getSymbol()} </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

export class NasdaTransactionItem extends Component {
  render() {
    const { style, data } = this.props;
    const type = data.value > 0 ? 'Received' : 'Sent';
    const color = data.value > 0 ? Color.positive : Color.negative;
    const date = data.received
      .replace(['T'], ' ')
      .replace(['Z'], ' ')
      .split('.')[0];

    const icon =
      data.value > 0
        ? require('./img/icon/transaction_received.png')
        : require('./img/icon/transaction_sent.png');

    return (
      <TouchableHighlight {...this.props} underlayColor='#232951'>
        <View style={[styles.item, style]}>
          <View style={styles.row}>
            <Image source={icon} style={styles.transactionIcon}/>
            <View style={[styles.column, { marginLeft: 10 }]}>
              <Text style={{ color: 'white', fontSize: 16 }}>{data.label}</Text>
              <Text style={{ color: Color.light_text, fontSize: 14 }}>{date}</Text>
            </View>
          </View>
          <View style={styles.columnRight}>
            <Text style={{ color: color, fontSize: 14 }}>{data.value / 100000000} {data.symbol}</Text>
            <Text style={{ color: Color.light_text, fontSize: 14 }}>{type}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

export class NasdaPaper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonIndex: this.props.initialWallet,
      circleColor: this.props.circleColor ? this.props.circleColor : Color.mark,
    }
  }
  render() {
    return (
      <View style={styles.paper}>
        <View style={styles.paperButtonGroup}>
          {this.props.wallets !== undefined &&
            this.props.wallets !== null &&
            this.props.wallets.map((wallet, index) => (
              <TouchableOpacity
                onPress={() => {
                    this.setState({ buttonIndex: index });
                    if (this.props.onChangeWallet !== undefined) {
                      this.props.onChangeWallet(index);
                    }
                  }}
              >
                <Text
                  style={[
                    styles.paperButton,
                    {
                      backgroundColor: this.state.buttonIndex === index ? Color.mark : 'transparent',
                      color: this.state.buttonIndex === index ? 'white' : Color.light_text,
                    }
                  ]}
                >
                  {wallet.symbol}
                </Text>
              </TouchableOpacity>
            ))
          }
        </View>
        <Image style={styles.outline} source={require('./img/outline_top.png')} />
        <View {...this.props} style={[styles.paperContent, this.props.style]} />
        <Image
          style={styles.outline}
          source={require('./img/outline_bottom.png')}
        />
        <View style={styles.paperHeader} >
          <View
            style={[
              styles.paperCircle,
              { backgroundColor: this.state.circleColor },
            ]}
          >
            {this.props.icon !== undefined && this.props.icon}
          </View>
        </View>
      </View>
    );
  }
}

export class NasdaIcon extends Component {
  render() {
    var size = 30;
    if (this.props.size !== undefined) {
      size = this.props.size;
    }
    var bkColor = Color.mark;
    if (this.props.backgroundColor !== undefined) {
      bkColor = this.props.backgroundColor;
    }
    return (
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size,
          backgroundColor: bkColor,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {this.props.icon}
      </View>
    );
  }
}

const styles = {
  listItem: {
    borderRadius: 10,
    backgroundColor: '#1b1f39',
    width: width - 30,
    height: 80,
    marginLeft: 15,
    marginRight: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    borderBottomWidth: 0,
  },
  item: {
    borderRadius: 10,
    backgroundColor: Color.item,
    width: '100%',
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  column: {
    flexDirection: 'column',
    alignItems: "flex-start",
    justifyContent: 'center',
  },
  columnRight: {
    flexDirection: 'column',
    alignItems: "flex-end",
    justifyContent: 'center',
  },
  paper: {
    width: '100%',
  },
  paperHeader: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paperCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paperButtonGroup: {
    width: '100%',
    height: 40,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    padding: 5,
  },
  paperButton: {
    fontSize: 12,
    marginLeft: 3,
    marginRight: 3,
    paddingLeft: 3,
    paddingRight: 3,
    borderRadius: 3,
  },
  outline: {
    width: '100%',
    height: 15,
  },
  paperContent: {
    paddingTop: 30,
    backgroundColor: 'white',
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 5,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 350,
  },
  transactionIcon: {
    width: 35,
    height: 35,
  },
};
