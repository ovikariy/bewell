import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import { styles } from '../assets/styles/style';
import * as ItemTypes from '../constants/ItemTypes';
import ItemHistory from '../components/ItemHistory';
import { moodRatingIcons } from '../constants/Lists';
import friendlyDate from '../constants/helpers';
import { ScreenContainer } from '../components/ScreenContainer';
import { HeaderOptions } from '../constants/Constants';

const mapStateToProps = state => {
  return {
    sleep: state.sleep
  }
}

class SleepHistoryScreen extends Component {
  static navigationOptions = {
    title: 'Sleep History',
    ...HeaderOptions
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ScreenContainer imageBackgroundSource={require('../assets/images/home.jpg')}>
        <View style={styles.screenBody}>
          <ItemHistory items={this.props.sleep.sleeps} itemType={ItemTypes.SLEEP}
            renderItem={(item) => { return this.renderHistoryItem(item) }} /* make sure the prop name and function name are different, otherwise will get called but the return from function is undefined */
          ></ItemHistory>
        </View>
      </ScreenContainer>
    );
  }

  renderHistoryItem(item) {
    /* custom render item to show sleep icon in the row */
    /* TODO: custom sleep icons */
    const ratingIcon = moodRatingIcons[item.rating] ? moodRatingIcons[item.rating] : {};
    return (
      <View style={styles.historyRow}>
        <Icon name={ratingIcon.icon} size={40} type='font-awesome' color={ratingIcon.color} />
        <View>
          <Text style={styles.historyRowTitle}>{friendlyDate(item.date)}</Text>
          <Text style={styles.historyRowSubtitle}>{item.note}</Text>
        </View>
      </View>
    );
  }
}

export default connect(mapStateToProps, null)(SleepHistoryScreen);