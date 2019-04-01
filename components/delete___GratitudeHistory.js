import React, { Component } from 'react';
import { View, Text, FlatList, TouchableNativeFeedback, Alert, ToastAndroid } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import { styles } from '../assets/styles/style';
import * as Animatable from 'react-native-animatable';
import { friendlyDateFormat } from '../shared/helpers';
import * as constants from '../constants/Constants';

class GratitudeHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedHistoryItem: -1
    }
  }

  handleDeletePress() {
    Alert.alert(
      constants.DeleteThisItemFromHistory,
      constants.AreYouSureDeleteThisItemFromHistory,
      [
        {
          text: constants.Cancel
        },
        {
          text: constants.Ok,
          onPress: () => this.deleteGratitude()
        }
      ],
      { cancelable: false }
    );
  }

  deleteGratitude() {
    if (this.state.selectedHistoryItem < 0) {
      alert(constants.SelectItemToDelete);
      return;
    }
    this.props.handleDeleteGratitude(this.state.selectedHistoryItem);
    this.setState({ selectedHistoryItem: -1 })
    ToastAndroid.show(constants.HistoryItemDeleted, ToastAndroid.LONG);
  }

  renderDeleteButton() {
    return <Button type='clear' icon={{ name: 'close-circle-outline', type:'material-community', size: 40 }}
      onPress={() => { this.handleDeletePress() }}
    />
  }

  render() {
    const gratitudes = this.props.gratitudes;
    const renderGratitudeItem = ({ item, index }) => {
      const isSelectedItem = this.state.selectedHistoryItem === item.id;
      return (
        //TODO: TouchableNativeFeedback only works on Android, use something else if iOS
        <TouchableNativeFeedback onPress={() => { this.setState({ selectedHistoryItem: item.id }) }}>
          <View style={isSelectedItem ? [styles.highlight, styles.historyRow] : styles.historyRow}>
            <View>
              <Text style={styles.historyRowTitle}>{friendlyDateFormat(item.date)}</Text>
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
      (gratitudes && gratitudes.length > 0) ?
        <Animatable.View animation="fadeInUp" duration={2000}>
          <FlatList extraData={this.state} /* extraData={this.state} is needed for rerendering the list when item is pressed; TODO: look for a way to only re-render list item */
            data={gratitudes}
            renderItem={renderGratitudeItem}
            keyExtractor={item => item.id + ''} /* keyExtractor expects a string */
          />
        </Animatable.View> : <View></View>
    )
  }
}

export default GratitudeHistory;
