import React, { Component } from 'react';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { Loading } from './MiscComponents';
import { styles } from '../assets/styles/style';
import * as Animatable from 'react-native-animatable';
import { removeFromRedux, persistRedux } from '../redux/mainActionCreators';
import { friendlyDate, friendlyTime, getStorageKeyFromDate, isEmptyItem } from '../modules/helpers';
import { text } from '../modules/Constants';
import { View, Text, FlatList, TouchableNativeFeedback, Alert, ToastAndroid } from 'react-native';

const mapDispatchToProps = dispatch => ({
  remove: (itemType, id) => dispatch(removeFromRedux(itemType, id)),
  persistRedux: (state) => dispatch(persistRedux(state))
});

class ItemHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedHistoryItem: null
    }
  }

  handleDeletePress() {
    Alert.alert(
      text.listItems.DeleteThisItem,
      text.listItems.AreYouSureDeleteThisItem,
      [
        {
          text: text.general.Cancel,
          style: text.general.Cancel
        },
        {
          text: text.general.Ok,
          onPress: () => this.remove()
        }
      ],
      { cancelable: false }
    );
  }

  remove() {

    if (!this.state.selectedHistoryItem) {
      alert(text.listItems.SelectItemToDelete);
      return;
    }
    const storeKey = getStorageKeyFromDate(this.state.selectedHistoryItem.date);
    this.props.remove(storeKey, this.state.selectedHistoryItem.id);
    this.props.persistRedux(this.props.state);
    this.setState({ selectedHistoryItem: null })
  }

  renderDeleteButton() {
    return <View>
      <Button type='clear'
        icon={{ name: 'close-circle-outline', type: 'material-community', size: 40 }}
        onPress={() => { this.handleDeletePress() }}
      />
    </View>
  }

  filterByItemType(store, itemType) {
    const data = [];
    if (!store)
      return data;
    Object.keys(store).forEach((key) => {
      const filtered = store[key].filter((item) => item.type == itemType);
      filtered.forEach((filteredItem) => {
        if (!isEmptyItem(filteredItem))
          data.push(filteredItem);
      });
    });
    return data.sort(function (x, y) {
      return new Date(y.date) - new Date(x.date);
    });
  }

  render() {
    if (this.props.state.isLoading) {
      return (<Loading />);
    }

    if (this.props.state.errMess) {
      ToastAndroid.show(this.props.state.errMess, ToastAndroid.LONG);
    }

    if (this.props.state.successMess) {
      ToastAndroid.show(this.props.state.successMess, ToastAndroid.LONG);
    }

    const items = this.filterByItemType(this.props.state.store, this.props.itemType);
    if (!items || items.length <= 0) {
      return (
        <View style={[styles.centered, styles.flex, { marginTop: 40 }]} >
          <Text style={styles.subTitleText}>Oops...looks like we don't have any items here</Text>
        </View>
      );
    }

    const renderItem = ({ item, index }) => {
      const isSelectedItem = (this.state.selectedHistoryItem && this.state.selectedHistoryItem.id === item.id);

      /* all history screens have common functionality like selecting the row and deleteing the row but
      also can have custom fields to show for items so we allow each screen to customine item display */
      let customItemDisplay;
      if (this.props.renderItem) {
        customItemDisplay = this.props.renderItem(item, isSelectedItem);
      }
      else {
        customItemDisplay = <View style={styles.flex}>
          <Text style={isSelectedItem ? [styles.titleText, styles.highlightText] : styles.titleText}>
            {friendlyDate(item.date)}</Text>
          <Text style={isSelectedItem ? [styles.bodyText, styles.highlightText] : styles.bodyText}>
            {friendlyTime(item.date)}</Text>
          <Text style={isSelectedItem ? [styles.subTitleText, styles.highlightText] : styles.subTitleText}>
            {item.note}</Text>
        </View>
      };

      return (
        //TODO: TouchableNativeFeedback only works on Android, use something else if iOS
        <TouchableNativeFeedback onPress={() => { this.setState({ selectedHistoryItem: item }) }}>
          <View style={isSelectedItem ? [styles.highlightBackground, styles.row] : styles.row}>
            {customItemDisplay}
            <View style={styles.alignEnd}>
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