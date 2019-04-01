import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ToastAndroid, View } from 'react-native';
import * as ItemTypes from '../constants/ItemTypes';
import ItemHistory from '../components/ItemHistory';
import { ScreenContainer } from '../components/ScreenContainer';
import { HeaderOptions } from '../constants/Constants';
import { styles } from '../assets/styles/style';

const mapStateToProps = state => {
  return {
    dream: state.dream
  }
}

class DreamHistoryScreen extends Component {
  static navigationOptions = {
    title: 'Dream History',
    ...HeaderOptions
  };

  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.dream.errMess)
      ToastAndroid.show(this.props.dream.errMess, ToastAndroid.LONG);

    return (
      <ScreenContainer imageBackgroundSource={require('../assets/images/home.jpg')}>
        <View style={styles.screenBody}>
          <ItemHistory items={this.props.dream.dreams} itemType={ItemTypes.DREAM}></ItemHistory>
        </View>
      </ScreenContainer>

    );
  }
}

export default connect(mapStateToProps, null)(DreamHistoryScreen);


