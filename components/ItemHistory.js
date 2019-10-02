import React, { Component } from 'react';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { Loading } from './MiscComponents';
import { styles, colors } from '../assets/styles/style';
import * as Animatable from 'react-native-animatable';
import { deleteItem } from '../redux/mainActionCreators';
import { friendlyDate, friendlyTime } from '../modules/helpers';
import { text } from '../modules/Constants';
import { View, Text, FlatList, TouchableNativeFeedback, Alert, ToastAndroid } from 'react-native';

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
      text.listItems.DeleteThisItem,
      text.listItems.AreYouSureDeleteThisItem,
      [
        {
          text: text.general.Cancel,
          style: text.general.Cancel
        },
        {
          text: text.general.Ok,
          onPress: () => this.deleteItem()
        }
      ],
      { cancelable: false }
    );
  }

  deleteItem() {
    if (this.state.selectedHistoryItem < 0) {
      alert(text.listItems.SelectItemToDelete);
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
          <Text style={{ color: colors.tintColor }}>No items to show</Text>
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
        <TouchableNativeFeedback onPress={() => { this.setState({ selectedHistoryItem: item.id }) }}>
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