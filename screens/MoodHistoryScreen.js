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
    mood: state.mood
  }
}

class MoodHistoryScreen extends Component {
  static navigationOptions = {
    title: 'Mood History',
    ...HeaderOptions
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ScreenContainer imageBackgroundSource={require('../assets/images/home.jpg')}>
        <View style={styles.screenBody}>
          <ItemHistory items={this.props.mood.moods} itemType={ItemTypes.MOOD}
            renderItem={(item) => { return this.renderHistoryItem(item) }} /* make sure the prop name and function name are different, otherwise will get called but the return from function is undefined */
          ></ItemHistory>
        </View>
      </ScreenContainer>
    );
  }

  renderHistoryItem(item) {
    /* custom render item to show mood icon in the row */
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

export default connect(mapStateToProps, null)(MoodHistoryScreen);


