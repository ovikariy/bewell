import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { MainDrawerNavigator } from './DrawerNavigator';
import { connect, ConnectedProps } from 'react-redux';
import { loadAuthData } from '../redux/authActionCreators';
import { loadAppContextFromSettings } from '../redux/mainActionCreators';
import { configLocale } from '../modules/utils';
import { AppContext } from '../modules/appContext';
import { View, ImageBackground, Text, Platform, StatusBar } from 'react-native';
import { ActivityIndicator, showMessages } from './MiscComponents';
import { RootState } from '../redux/store';
import { AuthState, OperationState } from '../redux/reducerTypes';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { sizes } from '../assets/styles/style';

const mapStateToProps = (state: RootState) => ({
  AUTH: state.AUTH,
  OPERATION: state.OPERATION,
  APPCONTEXT: state.APPCONTEXT
});

const mapDispatchToProps = {
  loadAuthData,
  loadAppContextFromSettings
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

/**
 * MainWrapper is mainly an HOC to serve as a context provider for language/theme/etc
 */
export class MainWrapper extends React.Component<PropsFromRedux> {

  componentDidMount() {
    this.props.loadAuthData();
    this.props.loadAppContextFromSettings();
  }

  render() {
    if (this.props.AUTH.isLoading || !this.props.APPCONTEXT)
      return this.renderSecondarySplash();


    return (
      <AppContext.Provider value={this.props.APPCONTEXT}>
        {/** don't add any <Views> or other wrappers here since the
         * top component has to be SafeAreaView to work well on iOS
         * which is used in Main */}
        <Main auth={this.props.AUTH} operation={this.props.OPERATION} />
      </AppContext.Provider>
    );
  }

  renderSecondarySplash() {
    /* wait for authentication data to load before showing the navigator
    otherwise the navigator might start with another screen e.g. HomeScreen
    for a second before showing login screen;
    we do this here NOT in app.js because this component already subscribes to
    state change through the <Provider> */
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ImageBackground style={{ flex: 1 }}
          source={require('../assets/images/splash.png')}
        />
        <View style={{ position: 'absolute', alignSelf: 'center' }}>
          <ActivityIndicator style={{ marginTop: sizes[150] }} />
          <Text style={{ marginTop: sizes[20], color: 'white' }}>{}</Text>
        </View>
      </View>
    );
  }
}

export default connector(MainWrapper);

interface MainProps {
  operation: OperationState,
  auth: AuthState
}

class Main extends React.Component<MainProps> {
  static contextType = AppContext;
  context!: React.ContextType<typeof AppContext>;

  render() {
    configLocale(this.context.locale);
    showMessages(this.props.operation, this.context);  /* global error and success message handler */

    const styles = this.context.styles;
    const statusBarStyle = this.context.theme.colors.statusBarText === 'light' ? 'light-content' : 'dark-content';

    /** ActionSheetProvider is used to showActionSheetWithOptions e.g. on SystemSettings dropdowns */
    return (
      <ActionSheetProvider>
        <NavigationContainer>
          <SafeAreaProvider>
            <SafeAreaView style={[styles.safeAreaView]}>
              <StatusBar barStyle={statusBarStyle} backgroundColor={styles.safeAreaView.backgroundColor} />
              <MainDrawerNavigator auth={this.props.auth} />
            </SafeAreaView>
          </SafeAreaProvider>
        </NavigationContainer>
      </ActionSheetProvider>
    );
  }
}


