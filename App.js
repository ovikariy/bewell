import React from 'react';
import { Platform, StatusBar, View, Text } from 'react-native';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset'
import * as Font from 'expo-font'
import * as Icon from '@expo/vector-icons'
import Main from './components/Main';
import { styles } from './assets/styles/style';

import { Provider } from 'react-redux';
import { ConfigureStore } from './redux/configureStore';
import { PersistGate } from 'redux-persist/es/integration/react';

import { runTests } from './modules/Tests'; //TODO: delete this 

const { persistor, store } = ConfigureStore();

export default class App extends React.Component {
  state = {
    isLoadingComplete: false
  };

  render() {
    //TODO: delete this 
    // runTests().then(() => {
    // });
    // return (<View><Text>Tests completed</Text></View>);

    if (!this.state.isLoadingComplete) {
      return <AppLoading
        startAsync={this._loadResourcesAsync}
        onError={this._handleLoadingError}
        onFinish={this._handleFinishLoading}
      />
    }
    return (
      <Provider store={store}>
        <PersistGate
          // loading={<AppLoading
          //     startAsync={this._loadResourcesAsync}
          //     onError={this._handleLoadingError}
          //     onFinish={this._handleFinishLoading}
          //   />}
          persistor={persistor}
        >
          <View style={styles.flex}>
            {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
            <Main />
          </View>
        </PersistGate>
      </Provider>
    )
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        /* Ionicons can be used like this:
            <Icon.Ionicons
              name={this.props.name}
              size={26}
              style={{ marginBottom: -3 }}
            /> */
        ...Icon.Ionicons.font,
        // also look at material-comminuty icons https://materialdesignicons.com/
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),

//default android fonts are:
/*
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


        'open-sans-condensed-light': require('./assets/fonts/OpenSansCondensed-Light.ttf'),
        'open-sans-condensed-bold': require('./assets/fonts/OpenSansCondensed-Bold.ttf'),

        //TODO: revisit fonts and remove unneeded ones

        'saira-extra-condensed-regular': require('./assets/fonts/SairaExtraCondensed-Regular.ttf'),
        'saira-extra-condensed-medium': require('./assets/fonts/SairaExtraCondensed-Medium.ttf'),
        'saira-extra-condensed-bold': require('./assets/fonts/SairaExtraCondensed-Bold.ttf'),
        'saira-extra-condensed-light': require('./assets/fonts/SairaExtraCondensed-Light.ttf'),
        'saira-extra-condensed-extra-light': require('./assets/fonts/SairaExtraCondensed-ExtraLight.ttf'),
        'saira-extra-condensed-semi-bold': require('./assets/fonts/SairaExtraCondensed-SemiBold.ttf'),
        'saira-extra-condensed-thin': require('./assets/fonts/SairaExtraCondensed-Thin.ttf'),

        'pt-sans-narrow-regular': require('./assets/fonts/PTSansNarrow-Regular.ttf'),
        
        

        'morning-app-icon-font': require('./assets/fonts/icomoon/morning-app-icon-font.ttf')
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}
