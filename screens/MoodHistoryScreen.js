import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import { styles } from '../assets/styles/style';
import * as ItemTypes from '../constants/ItemTypes';
import ItemHistory from '../components/ItemHistory';
import { moodRatingIcons } from '../constants/Constants';
import friendlyDate from '../constants/helpers';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';

const mapStateToProps = state => {
  return {
    mood: state.mood
  }
}

class MoodHistoryScreen extends Component {
  static navigationOptions = {
    title: 'Mood History'
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ScreenBackground imageBackgroundSource={require('../assets/images/home.jpg')}>
        <ScreenContent>
          <ItemHistory items={this.props.mood.moods} itemType={ItemTypes.MOOD}
            renderItem={(item, isSelectedItem) => { return this.renderHistoryItem(item, isSelectedItem) }} /* make sure the prop name and function name are different, otherwise will get called but the return from function is undefined */
          ></ItemHistory>
        </ScreenContent>
      </ScreenBackground>
    );
  }

  renderHistoryItem(item, isSelectedItem) {
    /* custom render item to show mood icon in the row */
    const ratingIcon = moodRatingIcons[item.rating] ? moodRatingIcons[item.rating] : {};
    return (
      <View style={styles.historyRow}>
        <Icon name={ratingIcon.icon} size={40} type='font-awesome' color={ratingIcon.color} />
        <View>
          <Text style={isSelectedItem ? [styles.historyRowTitle, styles.highlightText] : styles.historyRowTitle}>{friendlyDate(item.date)}</Text>
          <Text style={isSelectedItem ? [styles.historyRowSubtitle, styles.highlightText] : styles.historyRowSubtitle}>{item.note}</Text>
        </View>
      </View>
    );
  }
}

export default connect(mapStateToProps, null)(MoodHistoryScreen);


