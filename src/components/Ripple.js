//adapted from https://github.com/n4kz/react-native-material-ripple

import PropTypes from "prop-types";
import React, { PureComponent } from "react";
import { View, 
         Animated, 
         Easing, 
         TouchableWithoutFeedback, 
         StyleSheet,
         findNodeHandle,
         UIManager } from "react-native";


const radius = 10;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,

    backgroundColor: "transparent",
    overflow: "hidden",
  },
  ripple: {
    width: radius * 2,
    height: radius * 2,
    borderRadius: radius,
    overflow: "hidden",
    position: "absolute",
  },
});


export default class Ripple extends PureComponent {
  static defaultProps = {
    ...TouchableWithoutFeedback.defaultProps,

    rippleColor: "rgb(0, 0, 0)",
    rippleOpacity: 0.30,
    rippleDuration: 400,
    rippleSize: 0,
    // rippleContainerBorderRadius: 0,
    // rippleCentered: false,
    // rippleSequential: false,
    // disabled: false,
  };

  static propTypes = {
    ...Animated.View.propTypes,
    ...TouchableWithoutFeedback.propTypes,

    rippleColor: PropTypes.string,
    rippleOpacity: PropTypes.number,
    rippleDuration: PropTypes.number,
    rippleSize: PropTypes.number,
    // rippleContainerBorderRadius: PropTypes.number,
    // rippleCentered: PropTypes.bool,
    // rippleSequential: PropTypes.bool,
    // disabled: PropTypes.bool,
  };

  constructor (props) {
    super(props);

    this.renderRipple = this.renderRipple.bind(this);

    this.unique = 0;
    this.mounted = false;

    this.state = {
      layout: undefined,
      ripples: [],
    };
  }

  componentDidMount () {
    this.mounted = true;
  }

  componentWillUnmount () {
    this.mounted = false;
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.color === undefined && nextProps.color !== undefined) {
      this.startRipple(nextProps.color, false);
    } else if (this.props.color !== undefined && nextProps.color === undefined) {
      this.props.onColor(undefined);
      this.startRipple(this.props.color, true);
    }
  }

  onRegisterOrigin = (event) => {
    this.touchX = event.nativeEvent.pageX;
    this.touchY = event.nativeEvent.pageY;
    return false; // avoid capturing the event
  }

  onLayout = (event) => {
    UIManager.measure(findNodeHandle(this.ref), (x, y, width, height, px, py) => this.setState({
      layout: {x: px, y: py, width, height}
    }))
  }

  startRipple (color, inverse) {
    const { layout } = this.state
    if (layout) {
      const { rippleDuration, rippleCentered, rippleSize } = this.props

      let w2 = 0.5 * layout.width;
      let h2 = 0.5 * layout.height;

      let locationX = this.touchX - layout.x;
      let locationY = this.touchY - layout.y;

      let offsetX = Math.abs(w2 - locationX);
      let offsetY = Math.abs(h2 - locationY);

      const R = Math.sqrt(Math.pow(w2 + offsetX, 2) + Math.pow(h2 + offsetY, 2)) + 15;

      let ripple = {
        unique: this.unique++,
        progress: new Animated.Value(inverse ? 1 : 0),
        rippleColor: color,
        locationX,
        locationY,
        R,
      };

      Animated.timing(ripple.progress, {
        toValue: inverse ? 0 : 1,
        easing: inverse ? Easing.in(Easing.ease) : Easing.out(Easing.ease),
        duration: rippleDuration,
        useNativeDriver: true,
      }).start(() => {
        if (this.mounted) {
          this.setState(({ ripples }) => ({ ripples: ripples.slice(1) }));
        }

        this.props.onColor(this.props.color)
      })

      this.setState(({ ripples }) => ({ ripples: ripples.concat(ripple) }));
    }
  }

  renderRipple({ unique, progress, locationX, locationY, R, rippleColor }) {
    let { rippleOpacity } = this.props;

    let rippleStyle = {
      position: "absolute",
      top: locationY,
      left: locationX,
      backgroundColor: rippleColor,

      transform: [{
        scale: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0.5 / radius, R / radius],
        }),
      }],

      opacity: 1,
    };

    return (
      <Animated.View style={ [styles.ripple, rippleStyle] } key={ unique } />
    );
  }

  render() {
    const { ripples, layout, backgroundColor } = this.state;
    const {
      color,

      delayLongPress,
      delayPressIn,
      delayPressOut,
      disabled,
      hitSlop,
      pressRetentionOffset,
      children,
      rippleContainerBorderRadius,
      onLayout,
      ...props
    } = this.props;

    const containerStyle = {
      borderRadius: rippleContainerBorderRadius,
    };

    return (
      <TouchableWithoutFeedback ref      = { ref => this.ref = ref }
                                onLayout = { this.onLayout }>
        <Animated.View onStartShouldSetResponderCapture = { this.onRegisterOrigin }
                       {...props}>
          { children }

          { (ripples.length > 0) &&
              <View style={ [styles.container, containerStyle] }>
                { ripples.map(this.renderRipple) }
              </View> }
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}
