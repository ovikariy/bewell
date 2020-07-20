
import React from 'react';
import { ImageBackground, View, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Spacer, ParagraphText } from './MiscComponents';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContext } from '../modules/AppContext';

/* Wrapper for a screen component; simplifies setting image background on various screens */
export const ScreenBackground = (props) => {
  const appContext = React.useContext(AppContext);
  const styles = appContext.styles;

  if (props.imageBackgroundSource) {
    return (
      <SafeAreaView style={styles.flex}>
        <ImageBackground
          source={props.imageBackgroundSource}
          style={styles.flex}>
          <View style={styles.screenContainer}>
            {props.children}
          </View>
        </ImageBackground>
      </SafeAreaView>
    )
  }
  else {
    return (
      <SafeAreaView style={styles.screenContainer}>
        {props.children}
      </SafeAreaView>
    )
  }
}

/* Commnly used large header with image background, app name and logo */
export const ScreenHeader = (props) => {
  const appContext = React.useContext(AppContext);
  const language = appContext.language;
  const styles = appContext.styles;

  return (
    <ImageBackground source={require('../assets/images/header.jpg')} style={[{ height: 250 }, props.style]}>
      <View style={[styles.centered, styles.flex, styles.centeredVertical]}>
        <Image source={require('../assets/images/logo_small.png')} style={[styles.logoImage]} />
        <Spacer height={30} />
        <ParagraphText style={[styles.heading, styles.brightColor, styles.appName]}>{language.appName}</ParagraphText>
      </View>
    </ImageBackground>
  )
}

/* Wrapper for a screen content; simplifies setting keyboard avoid view on various screens */
export const ScreenContent = (props) => {
  const appContext = React.useContext(AppContext);
  const styles = appContext.styles;

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
