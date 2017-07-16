//adapted from https://github.com/n4kz/react-native-material-ripple

import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { View, Animated, Easing, TouchableWithoutFeedback, StyleSheet } from 'react-native';

const radius = 10;
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,

    backgroundColor: 'transparent',
    overflow: 'hidden',
  },

  ripple: {
    width: radius * 2,
    height: radius * 2,
    borderRadius: radius,
    overflow: 'hidden',
    position: 'absolute',
  },
});


export default class Ripple extends PureComponent {
  static defaultProps = {
    ...TouchableWithoutFeedback.defaultProps,

    rippleColor: 'rgb(0, 0, 0)',
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

  constructor(props) {
    super(props);

    this.onLayout = this.onLayout.bind(this);
    this.onPress = this.onPress.bind(this);
    this.onPressIn = this.onPressIn.bind(this);
    this.onPressOut = this.onPressOut.bind(this);
    this.onLongPress = this.onLongPress.bind(this);
    this.renderRipple = this.renderRipple.bind(this);

    this.unique = 0;
    this.mounted = false;

    this.state = {
      ripples: [],
    };
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  onLayout(event) {
    let { onLayout } = this.props;

    if ('function' === typeof onLayout) {
      onLayout(event);
    }
  }

  onPress(event) {
    let { ripples } = this.state;
    let { onPress } = this.props;

    if (!ripples.length) {
      if ('function' === typeof onPress) {
        requestAnimationFrame(() => onPress(event));
      }

      this.startRipple(event);
    }
  }

  onLongPress(event) {
    let { onLongPress } = this.props;

    if ('function' === typeof onLongPress) {
      requestAnimationFrame(() => onLongPress(event));
    }

    this.startRipple(event);
  }

  onPressIn(event) {
    let { onPressIn } = this.props;

    if ('function' === typeof onPressIn) {
      onPressIn(event);
    }
  }

  onPressOut(event) {
    let { onPressOut } = this.props;

    if ('function' === typeof onPressOut) {
      onPressOut(event);
    }
  }

  startRipple(event, color, px, py, w, h, rag, inverse) {
    let { rippleDuration, rippleCentered, rippleSize } = this.props;

    let w2 = 0.5 * w;
    let h2 = 0.5 * h;

    let locationX = event.nativeEvent.pageX - px;
    let locationY = event.nativeEvent.pageY - py;

    let offsetX = Math.abs(w2 - locationX);
    let offsetY = Math.abs(h2 - locationY);

    const R = Math.sqrt(Math.pow(w2 + offsetX, 2) + Math.pow(h2 + offsetY, 2)) + 15;

    let ripple = {
      unique: this.unique++,
      progress: new Animated.Value(0),
      rippleColor: color,
      locationX,
      locationY,
      R,
      inverse: inverse == true,
    };

    Animated
      .timing(ripple.progress, {
        toValue: 1,
        easing: inverse ? Easing.in(Easing.ease) : Easing.out(Easing.ease),
        duration: rippleDuration,
        useNativeDriver: true,
      })
      .start(() => {
        if (this.mounted) {
          this.setState(({ ripples }) => ({ ripples: ripples.slice(1) }));
        }
        this.props.onEnd(inverse ? false : rag)
      });

    this.setState(({ ripples }) => ({ ripples: ripples.concat(ripple) }));
  }


  renderRipple({ unique, progress, locationX, locationY, R, rippleColor, inverse }) {
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

    if (inverse) {
      rippleStyle.transform = [{
          scale: progress.interpolate({
            inputRange: [0, 1],
            outputRange: [R / radius, 0.5 / radius],
          }),
        }];
    }

    return (
      <Animated.View style={[styles.ripple, rippleStyle]} key={unique} />
    );
  }

  render() {
    let { ripples } = this.state;
    let {
      delayLongPress,
      delayPressIn,
      delayPressOut,
      disabled,
      hitSlop,
      pressRetentionOffset,
      children,
      rippleContainerBorderRadius,
      onLayout: __ignored__,
      ...props
    } = this.props;

    let containerStyle = {
      borderRadius: rippleContainerBorderRadius,
    };

    return (
        <Animated.View {...props}>
          {children}

          { ripples.length > 0 &&
              <View style={[styles.container, containerStyle]}>
                {ripples.map(this.renderRipple)}
              </View>
            }
        </Animated.View>
    );
  }
}
