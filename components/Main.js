import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { MainDrawerNavigator } from './DrawerNavigator';
import { connect } from 'react-redux';
import { loadAuthData } from '../redux/authActionCreators';
import { loadAppContextFromSettings } from '../redux/mainActionCreators';
import { configLocale } from '../modules/helpers';
import { AppContext } from '../modules/AppContext';
import { stateConstants, WellKnownStoreKeys } from '../modules/Constants';
import { View, ImageBackground, Text } from 'react-native';
import { ActivityIndicator, showMessages } from './MiscComponents';

const mapStateToProps = state => {
  return {
    [stateConstants.OPERATION]: state[stateConstants.OPERATION],
    [stateConstants.AUTH]: state[stateConstants.AUTH],
    [stateConstants.APPCONTEXT]: state[stateConstants.APPCONTEXT]
  };
}

const mapDispatchToProps = dispatch => ({
  loadAuthData: () => dispatch(loadAuthData()),
  loadAppContextFromSettings: (key) => dispatch(loadAppContextFromSettings(key))
});
/**
 * MainWrapper is mainly an HOC to serve as a context provider for language/theme/etc
 */
export class MainWrapper extends React.Component {

  componentDidMount() {
    this.props.loadAuthData();
    this.props.loadAppContextFromSettings();
  }

  render() {
    if (this.props[stateConstants.AUTH].isLoading || !this.props[stateConstants.APPCONTEXT].context) {
      return this.renderSecondarySplash();
    }

    return (
      <AppContext.Provider value={this.props[stateConstants.APPCONTEXT].context}>
        <Main auth={this.props[stateConstants.AUTH]}
          operation={this.props[stateConstants.OPERATION]}  />
      </AppContext.Provider>
    )
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
          <ActivityIndicator style={{ marginTop: 150 }} />
          <Text style={{ marginTop: 20, color: 'white' }}>{}</Text>
        </View>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainWrapper);

class Main extends React.Component {
  static contextType = AppContext;

  render() {
    configLocale(this.context.locale);
    showMessages(this.props.operation, this.context);  /* global error and success message handler */

    return (
      <NavigationContainer>
        <MainDrawerNavigator auth={this.props.auth} />
      </NavigationContainer>
    )
  }
}


