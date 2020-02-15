

import React from 'react';
import { Platform, StatusBar, View, Text } from 'react-native';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import Main from './components/Main';
import { styles } from './assets/styles/style';

import { Provider } from 'react-redux';
import { ConfigureStore } from './redux/configureStore';
import { PersistGate } from 'redux-persist/es/integration/react';

const { persistor, store } = ConfigureStore();


export default class App extends React.Component {
  state = {
    isLoadingComplete: false
  };

  render() {
    if (!this.state.isLoadingComplete) {
      return <AppLoading
        startAsync={this.loadResourcesAsync}
        onError={this.handleLoadingError}
        onFinish={this.handleFinishLoading}
      />
    }
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor} preloadedState={false} >
          <View style={styles.flex}>
            {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
            <Main />
          </View>
        </PersistGate>
      </Provider>
    ) 
  } 

  loadResourcesAsync = async () => { 
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
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

  handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}


//TODO: disable persist? downsides?
//TODO: might need to dispatch operationClearRedux on load if preloadedState={false} doesn't help so that when the app loads it should be free 
//cleared from previous run. Check that it loads only requested data e.g. on HomeScreen. If need to dispatch something on load then 
//need to wrap Main in another connected component


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