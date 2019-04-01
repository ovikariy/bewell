
import React from 'react';
import { ImageBackground, View } from 'react-native';
import { styles } from '../assets/styles/style';

/* Wrapper for a screen component; simplifies setting image background on various screens */
export class ScreenContainer extends React.Component {
  render() {
    if (this.props.imageBackgroundSource) {
      return (
        <ImageBackground
          source={this.props.imageBackgroundSource}
          style={[{ width: '100%', height: '100%' }, {...this.props.style}]}>
          <View style={[styles.container, styles.screenBackgroundOpacity]}>
            {this.props.children}
          </View>
        </ImageBackground>
      )
    }
    else {
      return (
        <View style={[styles.container, styles.screenBackgroundSolid, {...this.props.style}]}>
          {this.props.children}
        </View>
      )
    }
  }
}
