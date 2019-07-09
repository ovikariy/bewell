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
          <View style={styles.container}>
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
              color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
            /> */
        ...Icon.Ionicons.font,
        // also look at material-comminuty icons https://materialdesignicons.com/
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
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
