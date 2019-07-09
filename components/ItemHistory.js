import React, { Component } from 'react';
import { Button } from 'react-native-elements';
import { styles, Colors } from '../assets/styles/style';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import { deleteItem } from '../redux/CommonActionCreators';
import { View, Text, FlatList, TouchableNativeFeedback, Alert, ToastAndroid, ActivityIndicator } from 'react-native';
import { friendlyDate, friendlyTime } from '../constants/helpers';
import * as Constants from '../constants/Constants';
import { Loading } from './FormFields';

const mapDispatchToProps = dispatch => ({
  deleteItem: (itemType, id) => dispatch(deleteItem(itemType, id))
});

class ItemHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedHistoryItem: -1
    }
  }

  handleDeletePress() {
    Alert.alert(
      Constants.Messages.DeleteThisItemFromHistory,
      Constants.Messages.AreYouSureDeleteThisItemFromHistory,
      [
        {
          text: Constants.Cancel,
          style: Constants.Cancel
        },
        {
          text: Constants.Ok,
          onPress: () => this.deleteItem()
        }
      ],
      { cancelable: false }
    );
  }

  deleteItem() {
    if (this.state.selectedHistoryItem < 0) {
      alert(Constants.Messages.SelectItemToDelete);
      return;
    }
    this.props.deleteItem(this.props.itemType, this.state.selectedHistoryItem);
    this.setState({ selectedHistoryItem: -1 })
  }

  renderDeleteButton() {
    return <View>
      <Button type='clear'
        icon={{ name: 'close-circle-outline', type: 'material-community', size: 40 }}
        onPress={() => { this.handleDeletePress() }}
      />
    </View>
  }
  render() {
    if (this.props.itemState.isLoading) {
      return (<Loading />);
    }

    if (this.props.itemState.errMess) {
      ToastAndroid.show(this.props.itemState.errMess, ToastAndroid.LONG);
    }

    if (this.props.itemState.successMess) {
      ToastAndroid.show(this.props.itemState.successMess, ToastAndroid.LONG);
    }

    const items = this.props.items;
    if (!items || items.length <= 0) {
      return (
        <View style={{ marginTop: 40, alignItems: "center" }} >
          <Text style={{ color: Colors.tintColor }}>No items to show</Text>
        </View>
      );
    }

    const renderItem = ({ item, index }) => {

      const isSelectedItem = this.state.selectedHistoryItem === item.id;

      /* all history screens have common functionality like selecting the row and deleteing the row but
      also can have custom fields to show for items so we allow each screen to customine item display */
      let customItemDisplay;
      if (this.props.renderItem) {
        customItemDisplay = this.props.renderItem(item, isSelectedItem);
      }
      else {
        customItemDisplay = <View>
          <Text style={isSelectedItem ? [styles.historyRowTitle, styles.highlightText] : styles.historyRowTitle}>
            {friendlyDate(item.date)}</Text>
          <Text style={isSelectedItem ? [styles.historyRowBig, styles.highlightText] : styles.historyRowBig}>
            {friendlyTime(item.date)}</Text>
          <Text style={isSelectedItem ? [styles.historyRowSubtitle, styles.highlightText] : styles.historyRowSubtitle}>
            {item.note}</Text>
        </View>
      };

      return (
        //TODO: TouchableNativeFeedback only works on Android, use something else if iOS
        <TouchableNativeFeedback onPress={() => { this.setState({ selectedHistoryItem: item.id }) }}>
          <View style={isSelectedItem ? [styles.highlight, styles.historyRow] : styles.historyRow}>
            {customItemDisplay}
            <View style={styles.historyRowButtons}>
              {isSelectedItem ? this.renderDeleteButton() : <View></View>}
            </View>
          </View>
        </TouchableNativeFeedback>
      );
    };

    return (
      (items && items.length > 0) ?
        <Animatable.View animation="fadeInUp" duration={500}>
          <FlatList extraData={this.state} /* extraData={this.state} is needed for rerendering the list when item is pressed; TODO: look for a way to only re-render list item */
            data={items}
            renderItem={renderItem}
            keyExtractor={item => item.id + ''} /* keyExtractor expects a string */
          />
        </Animatable.View> : <View></View>
    )
  }
}

export default connect(null, mapDispatchToProps)(ItemHistory);