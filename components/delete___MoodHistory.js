import React, { Component } from 'react';
import { View, Text, FlatList, TouchableNativeFeedback, Alert, ToastAndroid } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import { styles } from '../assets/styles/style';
import * as Animatable from 'react-native-animatable';
import { moodRatingIcons } from '../constants/Lists';

class MoodHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedHistoryItem: -1
    }
  }

  handleDeletePress() {
    Alert.alert(
      'Delete this item from history?',
      'Are you sure you wish to delete this item from history?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'OK',
          onPress: () => this.deleteMood()
        }
      ],
      { cancelable: false }
    );
  }

  deleteMood() {
    if (this.state.selectedHistoryItem < 0) {
      alert("Select mood to delete");
      return;
    }
    this.props.handleDeleteMood(this.state.selectedHistoryItem);
    this.setState({ selectedHistoryItem: -1 })
    ToastAndroid.show('Mood deleted', ToastAndroid.LONG);
  }

  renderDeleteButton() {
    return <Button type='clear' icon={{ name: 'close-circle-outline', type:'material-community', size: 40 }}
      onPress={() => { this.handleDeletePress() }}
    />
  }

  render() {
    const moods = this.props.moods;
    const renderMoodItem = ({ item, index }) => {
      const ratingIcon = moodRatingIcons[item.rating] ? moodRatingIcons[item.rating] : {};
      const isSelectedItem = this.state.selectedHistoryItem === item.id;
      return (
        //TODO: TouchableNativeFeedback only works on Android, use something else if iOS
        <TouchableNativeFeedback onPress={() => { this.setState({ selectedHistoryItem: item.id }) }}>
          <View style={isSelectedItem ? [styles.highlight, styles.historyRow] : styles.historyRow}>
            <Icon name={ratingIcon.icon} size={40} type='font-awesome' color={ratingIcon.color} />
            <View>
              <Text style={styles.historyRowTitle}>{this.friendlyDate(item.date)}</Text>
              <Text style={styles.historyRowSubtitle}>{item.note}</Text>
            </View>
            <View style={styles.historyRowButtons}>
              {isSelectedItem ? this.renderDeleteButton() : <View></View>}
            </View>
          </View>
        </TouchableNativeFeedback>
      );
    }

    return (
      (moods && moods.length > 0) ?
        <Animatable.View animation="fadeInUp" duration={2000}>
          <FlatList extraData={this.state} /* extraData={this.state} is needed for rerendering the list when item is pressed; TODO: look for a way to only re-render list item */
            data={moods}
            renderItem={renderMoodItem}
            keyExtractor={item => item.id + ''} /* keyExtractor expects a string */
          />
        </Animatable.View> : <View></View>
    )
  }

  friendlyDate(date) {
    const moodDate = new Date(date);
    const moodDateShortString = moodDate.getFullYear() + moodDate.getMonth() + moodDate.getDate();
    const moodDateTimeString = moodDate.getHours() + ':' + moodDate.getMinutes();

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (moodDateShortString === (today.getFullYear() + today.getMonth() + today.getDate()))
      return 'Today at ' + moodDateTimeString;
    if (moodDateShortString === (yesterday.getFullYear() + yesterday.getMonth() + yesterday.getDate()))
      return 'Yesterday at ' + moodDateTimeString;
    return moodDate.toLocaleString();
  }
}

export default MoodHistory;
