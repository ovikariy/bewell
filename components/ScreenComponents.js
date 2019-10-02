
import React from 'react';
import { ImageBackground, View, ScrollView, KeyboardAvoidingView } from 'react-native';
import { styles } from '../assets/styles/style';

/* Wrapper for a screen component; simplifies setting image background on various screens */
export const ScreenBackground = (props) => {
  if (props.imageBackgroundSource) {
    return (
      <ImageBackground
        source={props.imageBackgroundSource}
        style={styles.flex}>
        <View style={styles.screenContainer}>
          {props.children}
        </View>
      </ImageBackground>
    )
  }
  else {
    return (
      <View style={styles.screenContainer}>
        {props.children}
      </View>
    )
  }
}

/* Wrapper for a screen content; simplifies setting keyboard avoid view with scrollview on various screens */
export const ScreenContent = (props) => {
  if (props.isKeyboardAvoidingView) {
    return (
      <KeyboardAvoidingView
        {...props} enabled behavior="padding" keyboardVerticalOffset={40}
        style={[styles.screenBodyContainer, props.style]}
      >
        <ScrollView>
          {props.children}
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }
  else {
    return (
      <View {...props} style={[styles.screenBodyContainer, props.style]} >
        {props.children}
      </View>
    )
  }
}
