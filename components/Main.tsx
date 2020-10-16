import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { MainDrawerNavigator } from './DrawerNavigator';
import { connect, ConnectedProps } from 'react-redux';
import { loadAuthData } from '../redux/authActionCreators';
import { loadAppContextFromSettings } from '../redux/mainActionCreators';
import { configLocale } from '../modules/helpers';
import { AppContext } from '../modules/AppContext';
import { stateConstants } from '../modules/Constants';
import { View, ImageBackground, Text } from 'react-native';
import { ActivityIndicator, showMessages } from './MiscComponents';
import { RootState } from '../redux/configureStore';
import { AuthReducerState, OperationReducerState } from '../redux/reducerTypes';

const mapStateToProps = (state: RootState) => ({
  AUTH: state.AUTH,
  OPERATION: state.OPERATION,
  APPCONTEXT: state.APPCONTEXT
})

const mapDispatchToProps = {
  loadAuthData: () => loadAuthData(),
  loadAppContextFromSettings: () => loadAppContextFromSettings()
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>

/**
 * MainWrapper is mainly an HOC to serve as a context provider for language/theme/etc
 */
export class MainWrapper extends React.Component<PropsFromRedux> {

  componentDidMount() {
    this.props.loadAuthData();
    this.props.loadAppContextFromSettings();
  }

  render() {
    if (this.props.AUTH.isLoading || !this.props.APPCONTEXT.context) {
      return this.renderSecondarySplash();
    }

    return (
      <AppContext.Provider value={this.props.APPCONTEXT.context}>
        <Main auth={this.props.AUTH} operation={this.props.OPERATION}  />
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

export default connector(MainWrapper);

interface MainProps {
  operation: OperationReducerState,
  auth: AuthReducerState
}

class Main extends React.Component<MainProps> {
  static contextType = AppContext;
  //declare context: React.ContextType<typeof AppContext>;

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


