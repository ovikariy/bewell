import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { MainDrawerNavigator } from './DrawerNavigator';
import { connect } from 'react-redux';
import { loadAuthData } from '../redux/authActionCreators';
import { stateConstants } from '../modules/Constants';

const mapStateToProps = state => {
  return { [stateConstants.AUTH]: state[stateConstants.AUTH] };
}

const mapDispatchToProps = dispatch => ({
  loadAuthData: () => dispatch(loadAuthData())
});

export class Main extends React.Component {
  componentDidMount() {
    this.props.loadAuthData();
  }

  render() {
    return <NavigationContainer>
      <MainDrawerNavigator auth={this.props[stateConstants.AUTH]} />
    </NavigationContainer>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);