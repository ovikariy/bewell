import React from 'react';
import { Platform, StatusBar, View, Text } from 'react-native';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import Main from './src/components/Main';

import { Provider } from 'react-redux';
import { store } from './src/redux/store';

interface AppState {
  isLoading: boolean
}

interface AppProps { }

export default class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      isLoading: true
    };
  }

  render() {
    if (this.state.isLoading) {
      return <AppLoading
        startAsync={this.loadResourcesAsync}
        onError={this.handleLoadingError}
        onFinish={this.handleFinishLoading}
      />;
    }
    return (
      <Provider store={store}>
        <View style={{ flex: 1 }}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <Main />
        </View>
      </Provider>
    );
  }

  loadResourcesAsync = async () => {
    await Promise.all([
      Asset.loadAsync([
        require('./src/assets/images/logo_small_color.png'),
        require('./src/assets/images/logo_small.png'),
        require('./src/assets/images/splash.png'),
        require('./src/assets/images/icon.png'),
        require('./src/assets/images/header.jpg'),
        require('./src/assets/images/arrow-up.png'),
      ]),
      Font.loadAsync({
        'open-sans-condensed-light': require('./src/assets/fonts/OpenSansCondensed-Light.ttf'),
        'morning-app-icon-font': require('./src/assets/fonts/icomoon/morning-app-icon-font.ttf')
      }),
    ]);
  };

  handleLoadingError = (error: Error) => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  handleFinishLoading = () => {
    this.setState({ isLoading: false });
  };
}

/* default android fonts are:
  sans-serif,
  notoserif,
  sans-serif,
  sans-serif-light,
  sans-serif-thin,
  sans-serif-condensed,
  sans-serif-medium,
  serif,
  Roboto,
  monospace,
*/