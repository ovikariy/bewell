import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { MainDrawerNavigator } from './DrawerNavigator';
import { connect } from 'react-redux';
import { loadAuthData } from '../redux/authActionCreators';
import { stateConstants } from '../modules/Constants';
import { View, ImageBackground, Text } from 'react-native';
import { ActivityIndicator, showMessages } from './MiscComponents';

const mapStateToProps = state => {
  return { 
    [stateConstants.OPERATION]: state[stateConstants.OPERATION],
    [stateConstants.AUTH]: state[stateConstants.AUTH] };
}

const mapDispatchToProps = dispatch => ({
  loadAuthData: () => dispatch(loadAuthData())
});

export class Main extends React.Component {
  componentDidMount() {
    this.props.loadAuthData();
  }

  render() {
    showMessages(this.props[stateConstants.OPERATION]);

    if (!this.props[stateConstants.AUTH].isLoadingComplete) {
      return this.renderSecondarySplash();
    }

    return <NavigationContainer>
      <MainDrawerNavigator auth={this.props[stateConstants.AUTH]} />
    </NavigationContainer>
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