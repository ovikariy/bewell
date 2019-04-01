import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ToastAndroid, View } from 'react-native';
import * as ItemTypes from '../constants/ItemTypes';
import ItemHistory from '../components/ItemHistory';
import { styles } from '../assets/styles/style';
import { ScreenContainer } from '../components/ScreenContainer';
import { HeaderOptions } from '../constants/Constants';

const mapStateToProps = state => {
  return {
    gratitude: state.gratitude
  }
}

class GratitudeHistoryScreen extends Component {
  static navigationOptions = {
    title: 'Gratitude History',
    ...HeaderOptions
  };

  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.gratitude.errMess)
      ToastAndroid.show(this.props.gratitude.errMess, ToastAndroid.LONG);

    return (
      <ScreenContainer imageBackgroundSource={require('../assets/images/home.jpg')}>
        <View style={styles.screenBody}>
          <ItemHistory items={this.props.gratitude.gratitudes} itemType={ItemTypes.GRATITUDE}></ItemHistory>
        </View>
      </ScreenContainer>
    );
  }
}

export default connect(mapStateToProps, null)(GratitudeHistoryScreen);


