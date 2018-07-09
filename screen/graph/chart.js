import React, { Component } from 'react';
import RN, { View } from 'react-native';
import {
  Svg,
  Circle,
  Polygon,
  Polyline,
  Path,
  Rect,
  LinearGradient,
  Line,
  Text,
  Defs,
  Stop,
  ClipPath
} from 'react-native-svg';
import { Color } from '../Constants.js';

class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scale: 1,
      max: 0,
      min: 0,
      space: 0,
      lineCount: 0,
    }
  }

  componentDidMount() {
    this.calcScaler(this.props.data.market);
  }

  componentWillReceiveProps(newProps) {
    this.calcScaler(newProps.data.market);
  }

  calcScaler = data => {
    var max = -1;
    var min = 99999999999;
    data.map((element, index) => {
      if (element.y > max) max = element.y;
      if (element.y < min) min = element.y;
    });
    var space = (max - min) / 6;
    const breakers = [1000, 500, 250, 100, 50, 10, 1];
    for (var i = 0; i < breakers.length; i++) {
      if (space >= breakers[i]) {
        const multi = Math.ceil(space / breakers[i]);
        space = breakers[i] * multi;
        break;
      }
    }
    const maxMulti = Math.ceil(max / space);
    const minMulti = Math.floor(min / space);
    this.setState({
      scale: (maxMulti - minMulti) * space,
      max: maxMulti * space,
      min: minMulti * space,
      space: space,
      lineCount: maxMulti - minMulti + 1,
    });
  }

  // renderDots = config => {
  //   const { data, width, height, borderRadius } = config
  //   return (
  //     <Circle
  //       key={Math.random()}
  //       cx={(i + 1) * (width - paddingRight) / data.length}
  //       cy={((height / 4 * 3 * (1 - ((x - Math.min(...data)) / this.calcScaler(data)))) + borderRadius)}
  //       r="4"
  //       fill={this.props.chartConfig.color(0.7)}
  //     />)
  // }

  // renderShadow = config => {
  //   if (this.props.bezier) {
  //     return this.renderBezierShadow(config)
  //   }
  //   const { data, width, height, paddingRight, borderRadius, labels } = config
  //   return (
  //     <Polygon
  //       points={data.map((x, i) =>
  //       ((i + 1) * (width - paddingRight) / data.length) +
  //       ',' +
  //        (((height / 4 * 3 * (1 - ((x - Math.min(...data)) / this.calcScaler(data)))) + borderRadius))
  //     ).join(' ') + ` ${width - paddingRight},${(height / 4 * 3) + borderRadius} ${width / labels.length},${(height / 4 * 3) + borderRadius}`}
  //       fill="url(#fillShadowGradient)"
  //       strokeWidth={0}
  //     />)
  // }

  renderLine = config => {
    // if (this.props.bezier) {
    //   return this.renderBezierLine(config)
    // }
    const { width, height, borderRadius = 16, data, backgroundFill } = config;
    const points = data.map((x, i) =>
      (i * width / (data.length - 1)) +
      ',' +
      ((((height - borderRadius * 2) * (1 - ((x.y - this.state.min) / this.state.scale)))) + borderRadius))
    points.push(width + ',' + height, 0 + ',' + height)

    return (
      <Polyline
        points={points.join(' ')}
        fill="none"
        stroke={'transparent'}
        strokeWidth={1}
        fill={backgroundFill}
        clipPath="url(#clip)"
      />
    );
  };

  // getBezierLinePoints = config => {
  //   const { width, height, borderRadius, data } = config
  //   const x = i => Math.floor((i + 1) * (width - borderRadius) / data.length)
  //   const y = i => Math.floor(((height / 4 * 3 * (1 - ((data[i] - Math.min(...data)) / this.calcScaler(data)))) + borderRadius))
  //   return [`M${x(0)},${y(0)}`].concat(data.slice(0, -1).map((_, i) => {
  //     const x_mid = (x(i) + x(i + 1)) / 2
  //     const y_mid = (y(i) + y(i + 1)) / 2
  //     const cp_x1 = (x_mid + x(i)) / 2
  //     const cp_x2 = (x_mid + x(i + 1)) / 2
  //     return `Q ${cp_x1}, ${y(i)}, ${x_mid}, ${y_mid}` +
  //     ` Q ${cp_x2}, ${y(i + 1)}, ${x(i + 1)}, ${y(i + 1)}`
  //   })).join(' ')
  // }

  // renderBezierLine = config => {
  //   return (
  //     <Path
  //       d={this.getBezierLinePoints(config)}
  //       fill="none"
  //       stroke={this.props.chartConfig.color(0.2)}
  //       strokeWidth={3}
  //     />
  //   )
  // }

  // renderBezierShadow = config => {
  //   const { width, height, borderRadius, labels } = config
  //   return (
  //     <Path
  //       d={this.getBezierLinePoints(config) +
  //         ` L${width},${(height / 4 * 3) + borderRadius} L${width / labels.length},${(height / 4 * 3) + borderRadius} Z`}
  //       fill="url(#fillShadowGradient)"
  //       strokeWidth={0}
  //     />)
  // }

  renderHorizontalLines = config => {
    const { count, space, width, height, borderRadius = 16 } = config
    return [...Array(count)].map((_, i) => {
      return (
        <Line
          key={Math.random()}
          x1={0}
          y1={borderRadius + space * i / this.state.scale * (height - borderRadius * 2)}
          x2={width}
          y2={borderRadius + space * i / this.state.scale * (height - borderRadius * 2)}
          stroke={this.props.chartConfig.color(0.2)}
          strokeWidth={1}
        />
      );
    });
  };

  renderHorizontalLabels = config => {
    const { count, space, width, height, borderRadius = 16, xLabelsOffset = 10, yLabelsOffset = 1, currency = '$' } = config
    return [...Array(count)].map((_, i) => {
      return (
        <Text
          key={Math.random()}
          x={xLabelsOffset}
          y={space * i / this.state.scale * (height - borderRadius * 2) - yLabelsOffset}
          fontSize={12}
          fill={this.props.chartConfig.color(0.5)}
        >{currency}{space * (count - i - 1) + this.state.min}
        </Text>
      );
    });
  };

  // renderVerticalLabels = config => {
  //   const { labels, width, height, borderRadius, horizontalOffset = 0 } = config
  //   const fontSize = 12
  //   return labels.map((label, i) => {
  //     return (
  //       <Text
  //         key={Math.random()}
  //         x={(width - labels.length * (i + 1)) + horizontalOffset}
  //         y={(height * 3 / 4) + borderRadius + (fontSize / 2)}
  //         fontSize={fontSize}
  //         fill={this.props.chartConfig.color(0.5)}
  //         textAnchor="middle"
  //       >{label}
  //       </Text>
  //     )
  //   })
  // }

  // renderVerticalLines = config => {
  //   const { data, width, height, borderRadius } = config
  //   return [...Array(data.length)].map((_, i) => {
  //     return (
  //       <Line
  //         key={Math.random()}
  //         x1={Math.floor(width / data.length * (i + 1))}
  //         y1={0}
  //         x2={Math.floor(width / data.length * (i + 1))}
  //         y2={height - (height / 4) + borderRadius}
  //         stroke={this.props.chartConfig.color(0.2)}
  //         strokeDasharray="5, 10"
  //         strokeWidth={1}
  //       />
  //     )
  //   })
  // }

  renderDefs = config => {
    const { width, height, backgroundColor, backgroundFill, borderRadius = 16 } = config
    return (
      <Defs>
        <ClipPath id="clip">
          <Rect x="0" y="0" width="100%" height="100%" rx={borderRadius} ry={borderRadius} />
        </ClipPath>

        {/* <LinearGradient id="backgroundGradient" x1="0" y1={height} x2={width} y2={0}>
          <Stop offset="0" stopColor={backgroundColor} />
          <Stop offset="1" stopColor={backgroundColor} />
        </LinearGradient>
        <LinearGradient id="fillShadowGradient" x1={0} y1={0} x2={0} y2={height}>
          <Stop offset="0" stopColor={backgroundFill}/>
          <Stop offset="1" stopColor={backgroundFill}/>
        </LinearGradient> */}
      </Defs>
    )
  }

  render() {
    const { data, withShadow = true, withDots = true, style = {} } = this.props
    const { borderRadius = 16,backgroundColor, backgroundFill, width, height } = this.props.chartConfig

    return (
      <View style={[style, {backgroundColor: backgroundColor, borderRadius: borderRadius}]}>
        <View style={[styles.header, { width: width }]}>
          <View style={styles.columnLeft}>
            <RN.Text style={styles.heading1} numberOfLines={1}>{this.props.data.currency} {this.props.data.currentPrice}</RN.Text>
            <RN.Text style={styles.label} numberOfLines={1}>{this.props.data.coin} price</RN.Text>
          </View>
          <View style={[styles.columnRight, { flex: 1 }]}>
            <RN.Text style={styles.heading1} numberOfLines={1}>{this.props.data.sinceLastDay} {this.props.data.currency}</RN.Text>
            <RN.Text style={styles.label} numberOfLines={1}>Since last day</RN.Text>
          </View>
          <View style={styles.columnRight}>
            <RN.Text style={styles.heading1} numberOfLines={1}>{this.props.data.balance}</RN.Text>
            <RN.Text style={styles.label} numberOfLines={1}>Total {this.props.data.symbol} Balance</RN.Text>
          </View>
        </View>
        <Svg height={height} width={width}>
          {this.renderDefs({
            ...this.props.chartConfig,
          })}
          <Rect width="100%" height={height} rx={borderRadius} ry={borderRadius} fill={backgroundColor}/>
          {/* {this.renderVerticalLines({
            ...config,
            data: data.datasets[0].data,
          })}
          {this.renderVerticalLabels({
            ...config,
            labels: data.labels,
          })} */}
          {this.renderLine({
            ...this.props.chartConfig,
            data: data.market,
          })}
          {this.renderHorizontalLines({
            ...this.props.chartConfig,
            count: this.state.lineCount,
            space: this.state.space,
          })}
          {this.renderHorizontalLabels({
            ...this.props.chartConfig,
            count: this.state.lineCount,
            space: this.state.space,
          })}
          {/* {withShadow && this.renderShadow({
            ...config,
            data: data.datasets[0].data,
            paddingRight,
            borderRadius,
            labels: data.labels
          })} */}
          {/* {withDots && this.renderDots({
            ...config,
            ...this.props.chartConfig,
            data: this.props.data
          })} */}
        </Svg>
      </View>
    );
  }
}

const styles = {
  header: {
    flexDirection: 'row',
    padding: 8,
  },
  columnLeft: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 8,
  },
  columnRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    padding: 8,
  },
  heading1: {
    fontSize: 20,
    color: Color.light_text,
  },
  label: {
    fontSize: 12,
    color: Color.light_text,
  },
};

export default Chart;
