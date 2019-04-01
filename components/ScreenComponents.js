
import React from 'react';
import { ImageBackground, View, ScrollView, KeyboardAvoidingView } from 'react-native';
import { styles, Colors } from '../assets/styles/style';
import { RoundIconButton } from '../components/FormFields';

/* Wrapper for a screen component; simplifies setting image background on various screens */
export class ScreenBackground extends React.Component {
  render() {
    if (this.props.imageBackgroundSource) {
      return (
        <ImageBackground
          source={this.props.imageBackgroundSource}
          style={[{ width: '100%', height: '100%', paddingBottom: 10 }, {...this.props.style}]}>
          <View style={[styles.container, styles.screenBackgroundOpacity]}>
            {this.props.children}
          </View>
        </ImageBackground>
      )
    }
    else {
      return (
        <View style={[styles.container, styles.screenBackgroundSolid, {...this.props.style, paddingBottom: 10}]}>
          {this.props.children}
        </View>
      )
    }
  }
}

/* Wrapper for a screen content; simplifies setting keyboard avoid view with scrollview on various screens */
export class ScreenContent extends React.Component {
  render() {
    if (this.props.isKeyboardAvoidingView) {
      return (
        <KeyboardAvoidingView
          style={styles.screenBody}
          behavior="padding"
          keyboardVerticalOffset={40}
          enabled
        >
          <ScrollView>
            {this.props.children}
          </ScrollView>
        </KeyboardAvoidingView>
      )
    }
    else {
      return (
        <View style={styles.screenBody}>
          {this.props.children}
        </View>
      )
    }
  }
}

export const ScreenActions = (props) => {
  return (
    <View style={styles.floatingButtonBar}>
      {/* <RoundIconButton
        name='history'
        color={Colors.secondaryButton}
        onPress={() => props.navigation.navigate(props.itemName + 'History')}
      /> */}
      <RoundIconButton
        name='check'
        disabled={!props.canSave}
        color={props.canSave ? Colors.primaryButton : Colors.tintColor}
        onPress={props.onPressSave}
      />
    </View>
  )
}
