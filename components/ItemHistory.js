import React, { Component } from 'react';
import { FlatList, Text, ToastAndroid, TouchableHighlight, View, ScrollView } from 'react-native';
import { styles } from '../assets/styles/style';
import { friendlyDate, friendlyTime, isEmptyItem, groupBy, friendlyDay, formatDate } from '../modules/helpers';
import { Loading, EmptyList, showMessages } from './MiscComponents';
import { text } from '../modules/Constants';

class ItemHistory extends Component {
  constructor(props) {
    super(props);
  }

  filterByItemType(store, itemType) {
    const result = [];
    if (!store)
      return result;
    Object.keys(store).forEach((key) => {
      const filtered = store[key].filter((item) => item.type == itemType);
      filtered.forEach((filteredItem) => {
        if (!isEmptyItem(filteredItem))
          result.push(filteredItem);
      });
    });
    return result.sort(function (x, y) {
      return new Date(y.date) - new Date(x.date);
    });
  }

  render() {
    if (this.props.state.isLoading) {
      return (<Loading />);
    }

    showMessages(this.props.state);

    const items = this.filterByItemType(this.props.state.store, this.props.itemType);
    if (!items || items.length <= 0) {
      return <EmptyList />
    }

    return (
      <View style={[{ marginTop: 20 }, this.props.style]}>
        {this.renderGroupedByDay(items)}
      </View>
    )
  }

  renderGroupedByDay(items) {
    const rows = [];

    const groupedByDay = groupBy(items, item => friendlyDate(item.date));
    groupedByDay.forEach(data => {

      rows.push(
        <View key={data[0].date}>
          <View style={[styles.row, styles.centered, styles.dimBackground]}>
            <Text style={[styles.titleText]}>
              {friendlyDay(data[0].date)}</Text>
            <Text style={[styles.bodyText, { marginHorizontal: 20, color: styles.bodyText.color + '80' }]}>
              {formatDate(data[0].date, 'MMMM D')}</Text>
          </View>
          <FlatList extraData={this.state} /* extraData={this.state} is needed for rerendering the list when item is pressed; TODO: look for a way to only re-render list item */
            data={data}
            horizontal={this.props.config.isHorizontalHistoryRow ? true : false}
            renderItem={(item, index) => this.renderItem(item, index)}
            keyExtractor={item => item.id + ''} /* keyExtractor expects a string */
          />
        </View>
      );
    });

    return rows;
  }


  renderItem({ item, index }) {
    const isSelectedItem = (this.props.selectedItem && this.props.selectedItem.id === item.id);
    /* all history screens have common functionality like selecting the row and deleteing the row but
    also can have custom fields to show for items so we allow each screen to customize item display */
    let customItemDisplay;
    if (this.props.renderItem) {
      customItemDisplay = this.props.renderItem(item, isSelectedItem);
    }
    else {
      customItemDisplay = <View style={styles.row}>
        <View style={[styles.flex]}>
          <Text style={isSelectedItem ? [styles.bodyText, styles.highlightText] : styles.bodyText}>
            {friendlyTime(item.date)}</Text>
          <Text style={isSelectedItem ? [styles.subTitleText, styles.highlightText] : styles.subTitleText}>
            {item.note}</Text>
        </View>
      </View>
    };

    return (
      <TouchableHighlight onPress={() => { this.props.onSelected(item) }} key={item.id + ''}>
        <View style={isSelectedItem ? [styles.highlightBackground, styles.row] : styles.row}>
          {customItemDisplay}
        </View>
      </TouchableHighlight>
    );
  };

}

export default ItemHistory;