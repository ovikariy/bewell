import React, { Component } from 'react';
import { Button } from 'react-native-elements';
import { styles } from '../assets/styles/style';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import { loadItems, deleteItem } from '../redux/CommonActionCreators';
import { View, Text, FlatList, TouchableNativeFeedback, Alert, ToastAndroid } from 'react-native';

const mapDispatchToProps = dispatch => ({
  loadItems: (itemType) => dispatch(loadItems(itemType)),
  deleteItem: (itemType, id) => dispatch(deleteItem(itemType, id))
});

class ItemHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedHistoryItem: -1
    }
  }
  
  componentDidMount() {
    this.props.loadItems(this.props.itemType);
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
          onPress: () => this.deleteItem()
        }
      ],
      { cancelable: false }
    );
  }

  deleteItem() {
    if (this.state.selectedHistoryItem < 0) {
      alert("Select item to delete");
      return;
    }
    this.props.deleteItem(this.props.itemType, this.state.selectedHistoryItem);
    this.setState({ selectedHistoryItem: -1 })
    ToastAndroid.show('Item deleted', ToastAndroid.LONG);
  }

  renderDeleteButton() {
    return <Button type='clear' icon={{ name: 'close-circle-outline', type: 'material-community', size: 40 }}
      onPress={() => { this.handleDeletePress() }}
    />
  }

  render() {
    const items = this.props.items;
    if (!items || items.length <= 0) {
      return (
        <View style={{ marginTop: 40, alignItems: "center" }} ><Text>No items to show</Text></View>
      );
    }

    const renderItem = ({ item, index }) => {

      const isSelectedItem = this.state.selectedHistoryItem === item.id;

      /* all history screens have common functionality like selecting the row and deleteing the row but
      also can have custom fields to show for items so we allow each screen to customine item display */
      let customItemDisplay;
      if (this.props.renderItem) {
        customItemDisplay = this.props.renderItem(item);
      }
      else {
        customItemDisplay = <View>
          <Text style={styles.historyRowTitle}>{friendlyDate(item.date)}</Text>
          <Text style={styles.historyRowSubtitle}>{item.note}</Text>
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
        <Animatable.View animation="fadeInUp" duration={2000}>
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