
import React, { ReactNode } from 'react';
import { ImageBackground, View, KeyboardAvoidingView, Platform, Image, ViewProps, StatusBar } from 'react-native';
import { Spacer, ParagraphText, LoadingScreeenOverlay } from './MiscComponents';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContext } from '../modules/appContext';

/* Wrapper for a screen component; simplifies setting styles e.g. background image on various screens */
export const ScreenBackground = (props: { isLoading?: boolean, children: ReactNode }) => {
  const appContext = React.useContext(AppContext);
  const styles = appContext.styles;

  return (
    <KeyboardAvoidingView {...props} style={[styles.screenContainer]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={40} >
      {props.isLoading ?
        <LoadingScreeenOverlay /> : <View />}
      {props.children}
    </KeyboardAvoidingView>
  );
};

/* Commnly used large header with image background, app name and logo */
export const ScreenImageHeader = (props: ViewProps) => {
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
  );
};

interface ScreenContentProps extends ViewProps {
  children: ReactNode
  isKeyboardAvoidingView?: boolean
}
/* Wrapper for a screen content; simplifies setting keyboard avoid view on various screens */
export const ScreenContent = (props: ScreenContentProps) => {
  const { styles } = React.useContext(AppContext);

  return (<View {...props} style={[styles.screenBodyContainer, props.style]} >
    {props.children}
  </View>
  );
};
