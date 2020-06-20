import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { MainDrawerNavigator } from './DrawerNavigator';
import { connect } from 'react-redux';
import { loadAuthData } from '../redux/authActionCreators';
import { load } from '../redux/mainActionCreators';
import { configLocale, LanguageContext } from '../modules/helpers';
import { stateConstants, WellKnownStoreKeys } from '../modules/Constants';
import { View, ImageBackground, Text } from 'react-native';
import { ActivityIndicator, showMessages } from './MiscComponents';
import { translations } from '../modules/translations';

const mapStateToProps = state => {
  return {
    [stateConstants.OPERATION]: state[stateConstants.OPERATION],
    [stateConstants.AUTH]: state[stateConstants.AUTH],
    [WellKnownStoreKeys.SETTINGS]: state[stateConstants.STORE].items[WellKnownStoreKeys.SETTINGS]
  };
}

const mapDispatchToProps = dispatch => ({
  loadAuthData: () => dispatch(loadAuthData()),
  load: (key) => dispatch(load(key))
});

export class Main extends React.Component {
  static contextType = LanguageContext;

  componentDidMount() {
    this.props.loadAuthData();
    this.props.load(WellKnownStoreKeys.SETTINGS);
  }

  render() {
    const language = this.getLanguage();

    configLocale(language);
    showMessages(this.props[stateConstants.OPERATION], translations[language]);  /* global error and success message handler */

    if (this.props[stateConstants.AUTH].isLoading) {
      return this.renderSecondarySplash();
    }

    return (
      <LanguageContext.Provider value={translations[language]}>
        <NavigationContainer>
          <MainDrawerNavigator auth={this.props[stateConstants.AUTH]} />
        </NavigationContainer>
      </LanguageContext.Provider>
    )
  }

  getLanguage() {
    const userSelectedLanguage = this.props[WellKnownStoreKeys.SETTINGS] ? this.props[WellKnownStoreKeys.SETTINGS].find((setting) => setting.id == 'language') : null; //TODO: move 'language' into constant
    if (userSelectedLanguage)
      return userSelectedLanguage.value;
    return 'en'; //TODO: get from defaults. don't get from device in case no translation available
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

export default connect(mapStateToProps, mapDispatchToProps)(Main);