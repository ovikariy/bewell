import React from 'react';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import Main from './src/components/Main';
import { GlobalErrorBoundary } from './src/components/ErrorBoundary';

import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { fetchOverTheAirUpdate } from './src/modules/updates';
import { images } from './src/modules/constants';

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
      <GlobalErrorBoundary>
        <Provider store={store}>
          {/** don't add any <Views> or other wrappers here since the
         * top component has to be SafeAreaView to work well on iOS
         * which is used in Main */}
          <Main />
        </Provider>
      </GlobalErrorBoundary>
    );
  }
  
  loadResourcesAsync = async () => {
    fetchOverTheAirUpdate();
    await Promise.all([
      Asset.loadAsync(Object.keys(images).map(key => images[key])),
      Font.loadAsync({
        'open-sans-condensed-light': require('./src/assets/fonts/OpenSansCondensed-Light.ttf'),
        'bewellapp-icon-font': require('./src/assets/fonts/icomoon/bewellapp-icon-font.ttf')
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