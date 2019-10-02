import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';
import { styles } from '../assets/styles/style';
import { ItemTypes, widgetConfig, stateConstants, text } from '../modules/Constants';
import ItemHistory from '../components/ItemHistory';
import { CustomIconRatingItem } from '../components/CustomIconRating';
import { friendlyDate, friendlyTime } from '../modules/helpers';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import moment from 'moment';

const mapStateToProps = state => {
  return {
    [stateConstants.OPERATION]: state[stateConstants.OPERATION]
  }
}

class SleepHistoryScreen extends Component {
  static navigationOptions = {
    title: text.sleepHistoryScreen.title
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ScreenBackground imageBackgroundSource={require('../assets/images/home.jpg')}>
        <ScreenContent>
          <ItemHistory
            itemState={this.props[stateConstants.OPERATION]}
            items={this.props[stateConstants.OPERATION].items[ItemTypes.SLEEP]}
            itemType={ItemTypes.SLEEP}
            renderItem={(item, isSelectedItem) => { return this.renderHistoryItem(item, isSelectedItem) }} /* make sure the prop name and function name are different, otherwise will get called but the return from function is undefined */
          ></ItemHistory>
        </ScreenContent>
      </ScreenBackground>
    );
  }

  renderHistoryItem(item, isSelectedItem) {
    /* custom render item to show sleep icon in the row */
    const sleepRatingIcons = widgetConfig[ItemTypes.SLEEP].icons;
    const ratingIcon = sleepRatingIcons[item.rating] ? sleepRatingIcons[item.rating] : {};
    return (
      <View style={styles.row}>
        <CustomIconRatingItem value={ratingIcon} size={40} />
        <View>
          <Text style={isSelectedItem ? [styles.titleText, styles.highlightText] : styles.titleText}>
            {friendlyDate(item.date)}</Text>
          <Text style={isSelectedItem ? [styles.bodyText, styles.highlightText] : styles.bodyText}>
            {friendlyTime(item.date)}</Text>
          <Text style={isSelectedItem ? [styles.subTitleText, styles.highlightText] : styles.subTitleText}>
            {(item.startDate) ? text.sleepHistoryScreen.bedTime + moment(item.startDate).format('MMM D h:mm A') : ''}</Text>
          <Text style={isSelectedItem ? [styles.subTitleText, styles.highlightText] : styles.subTitleText}>
            {(item.endDate) ? text.sleepHistoryScreen.wakeTime + moment(item.endDate).format('MMM D h:mm A') : ''}</Text>
        </View>
      </View>
    );
  }
}

export default connect(mapStateToProps, null)(SleepHistoryScreen);