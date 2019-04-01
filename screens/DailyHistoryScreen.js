import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadItems, deleteItem } from '../redux/CommonActionCreators';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import { styles } from '../assets/styles/style';
import { moodRatingIcons } from '../constants/Constants';
import friendlyDate from '../constants/helpers';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';

const mapDispatchToProps = dispatch => ({
  loadItems: (itemType) => dispatch(loadItems(itemType)),
  deleteItem: (itemType, id) => dispatch(deleteItem(itemType, id))
});

const mapStateToProps = state => {
  return {
    sleep: state.sleep,
    mood: state.mood,
    gratitude: state.gratitude,
    note: state.note,
    dream: state.dream
  }
}

class DailyHistoryScreen extends Component {
  static navigationOptions = {
    title: 'History'
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ScreenBackground imageBackgroundSource={require('../assets/images/home.jpg')}>
        <ScreenContent>
          {/* <ItemHistory items={this.props.allItems}
            renderItem={(item, isSelectedItem) => { return this.renderHistoryItem(item, isSelectedItem) }} 
          /> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(DailyHistoryScreen);


