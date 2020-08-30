import React from 'react';
import { Platform, StatusBar, View, Text } from 'react-native';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import Main from './components/Main';

import { Provider } from 'react-redux';
import { ConfigureStore } from './redux/configureStore';

const { store } = ConfigureStore();

interface AppState {
  isLoading: boolean
}

interface AppProps {}

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
      />
    }
    return (
      <Provider store={store}>
        <View style={{ flex: 1 }}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <Main />
        </View>
      </Provider>
    )
  }

  loadResourcesAsync = async () => {
    Promise.all([
      Asset.loadAsync([
        require('./assets/images/logo_small.png'),
        require('./assets/images/splash.png'),
        require('./assets/images/icon.png'),
        require('./assets/images/header.jpg'),
        require('./assets/images/arrow-up.png'),
        
      ]),
      Font.loadAsync({
        'open-sans-condensed-light': require('./assets/fonts/OpenSansCondensed-Light.ttf'),
        'open-sans-condensed-bold': require('./assets/fonts/OpenSansCondensed-Bold.ttf'),
        'saira-extra-condensed-regular': require('./assets/fonts/SairaExtraCondensed-Regular.ttf'),
        'saira-extra-condensed-medium': require('./assets/fonts/SairaExtraCondensed-Medium.ttf'),
        'saira-extra-condensed-bold': require('./assets/fonts/SairaExtraCondensed-Bold.ttf'),
        'saira-extra-condensed-light': require('./assets/fonts/SairaExtraCondensed-Light.ttf'),
        'saira-extra-condensed-extra-light': require('./assets/fonts/SairaExtraCondensed-ExtraLight.ttf'),
        'saira-extra-condensed-semi-bold': require('./assets/fonts/SairaExtraCondensed-SemiBold.ttf'),
        'saira-extra-condensed-thin': require('./assets/fonts/SairaExtraCondensed-Thin.ttf'),
        'pt-sans-narrow-regular': require('./assets/fonts/PTSansNarrow-Regular.ttf'),
        'morning-app-icon-font': require('./assets/fonts/icomoon/morning-app-icon-font.ttf')
        //TODO: revisit fonts and remove unneeded ones
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