import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';
import { styles } from '../assets/styles/style';
import { ItemTypes } from '../constants/Constants';
import ItemHistory from '../components/ItemHistory';
import { sleepRatingIcons } from '../constants/Constants';
import { CustomIconRatingItem } from '../components/CustomIconRating';
import { friendlyDate, friendlyTime } from '../constants/helpers';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import moment  from 'moment';

const mapStateToProps = state => {
  return {
    [ItemTypes.SLEEP]: state[ItemTypes.SLEEP]
  }
}

class SleepHistoryScreen extends Component {
  static navigationOptions = {
    title: 'Sleep History'
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ScreenBackground imageBackgroundSource={require('../assets/images/home.jpg')}>
        <ScreenContent>
          <ItemHistory itemState={this.props[ItemTypes.SLEEP]} items={this.props[ItemTypes.SLEEP].items} itemType={ItemTypes.SLEEP}
            renderItem={(item, isSelectedItem) => { return this.renderHistoryItem(item, isSelectedItem) }} /* make sure the prop name and function name are different, otherwise will get called but the return from function is undefined */
          ></ItemHistory>
        </ScreenContent>
      </ScreenBackground>
    );
  }

  renderHistoryItem(item, isSelectedItem) {
    /* custom render item to show sleep icon in the row */
    const ratingIcon = sleepRatingIcons[item.rating] ? sleepRatingIcons[item.rating] : {};
    return (
      <View style={styles.historyRow}>
        <CustomIconRatingItem value={ratingIcon} size={40} />
        <View>
          <Text style={isSelectedItem ? [styles.historyRowTitle, styles.highlightText] : styles.historyRowTitle}>
            {friendlyDate(item.date)}</Text>
          <Text style={isSelectedItem ? [styles.historyRowBig, styles.highlightText] : styles.historyRowBig}>
            {friendlyTime(item.date)}</Text>
          <Text style={isSelectedItem ? [styles.historyRowSubtitle, styles.highlightText] : styles.historyRowSubtitle}>
            {(item.startDate) ? 'Bed time:  ' + moment(item.startDate).format('MMM D h:mm A') : ''}</Text>
          <Text style={isSelectedItem ? [styles.historyRowSubtitle, styles.highlightText] : styles.historyRowSubtitle}>
            {(item.endDate) ? 'Wake time: ' + moment(item.endDate).format('MMM D h:mm A') : ''}</Text>
        </View>
      </View>
    );
  }
}

export default connect(mapStateToProps, null)(SleepHistoryScreen);