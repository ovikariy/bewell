
import React, { ReactNode } from 'react';
import { ImageBackground, View, KeyboardAvoidingView, Platform, Image, ViewProps, StatusBar } from 'react-native';
import { Spacer, ParagraphText, LoadingScreeenOverlay } from './MiscComponents';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContext } from '../modules/appContext';
import { images } from '../modules/constants';

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
  const context = React.useContext(AppContext);
  const language = context.language;
  const styles = context.styles;
  const theme = context.theme;
  return (
    <ImageBackground source={images.header} style={[{ height: 250 }, props.style]} />
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
