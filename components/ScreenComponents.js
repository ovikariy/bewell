
import React from 'react';
import { ImageBackground, View, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { text } from '../modules/Constants';
import { styles } from '../assets/styles/style';
import { Spacer, ParagraphText } from './MiscComponents';

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

/* Commnly used large header with image background, app name and logo */
export const ScreenHeader = (props) => {
  return (
    <ImageBackground source={require('../assets/images/header.jpg')} style={{ height: 250 }}>
      <View style={[styles.centered, styles.flex, styles.centeredVertical]}>
        <Image source={require('../assets/images/logo_small.png')} style={[styles.logoImage]} />
        <Spacer height={30} />
        <ParagraphText style={[styles.heading, styles.appName]}>{text.app.name}</ParagraphText>
      </View>
    </ImageBackground>
  )
}

/* Wrapper for a screen content; simplifies setting keyboard avoid view on various screens */
export const ScreenContent = (props) => {
  /* don't use ScrollView as wrapper here, only where actually a list is needed */
  if (props.isKeyboardAvoidingView) {
    return (<KeyboardAvoidingView {...props} style={[styles.screenBodyContainer, props.style]} enabled
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      keyboardVerticalOffset={40} >
      {props.children}
    </KeyboardAvoidingView>
    )
  }

  return (<View {...props} style={[styles.screenBodyContainer, props.style]} >
    {props.children}
  </View>
  )
}
