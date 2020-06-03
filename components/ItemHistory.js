import React, { Component } from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import { styles } from '../assets/styles/style';
import { friendlyDate, friendlyTime, isEmptyWidgetItem, groupBy, friendlyDay, formatDate } from '../modules/helpers';
import { Loading, EmptyList, List } from './MiscComponents';


class ItemHistory extends Component {
  constructor(props) {
    super(props);
  }

  filterByItemType(items, itemType) {
    const result = [];
    if (!items)
      return result;
    Object.keys(items).forEach((key) => {
      if (!items[key])
        return;
      const filtered = items[key].filter((item) => item.type == itemType);
      filtered.forEach((filteredItem) => {
        if (!isEmptyWidgetItem(filteredItem))
          result.push(filteredItem);
      });
    });
    return result.sort(function (x, y) {
      return new Date(y.date) - new Date(x.date);
    });
  }

  render() {
    if (this.props.state.isLoading) {  //TODO: isLoading will always be false because split items from operation reducer so take this out or change
      return (<Loading />);
    }

    const items = this.filterByItemType(this.props.state.items, this.props.itemType);
    if (!items || items.length <= 0) {
      return <EmptyList />
    }

    const groupedByDayMap = groupBy(items, item => friendlyDate(item.date));
    const groupedByDayArray = []; //TODO: this is a waste of resources to copy a map into an array because map cannot be passed as data to FlatList
    groupedByDayMap.forEach(item => groupedByDayArray.push(item));

    return (
      <View style={[{ marginTop: 20 }, { flex: 1 }, this.props.style]}>
        <List
          data={groupedByDayArray}
          renderItem={(daysData, index) => this.renderGroupedByDay(daysData.item, daysData.index)}
          keyExtractor={item => item[0].date + ''} /* keyExtractor expects a string */
        />
      </View>
    )
  }

  renderGroupedByDay(daysData) {
    return (
      <View style={[styles.flex]} key={daysData[0].date}>
        <View style={[styles.row, styles.centered, styles.dimBackground, { flex: 0 }]}>
          <Text style={[styles.titleText]}>
            {friendlyDay(daysData[0].date)}</Text>
          <Text style={[styles.bodyText, { marginHorizontal: 20, color: styles.bodyText.color + '80' }]}>
            {formatDate(daysData[0].date, 'MMMM D')}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <List extraData={this.state} /* extraData={this.state} is needed for rerendering the list when item is pressed; TODO: look for a way to only re-render list item */
            data={daysData}
            horizontal={this.props.config.isHorizontalHistoryRow ? true : false}
            renderItem={(item, index) => this.renderItem(item, index)}
            keyExtractor={item => item.id + ''} /* keyExtractor expects a string */
          />
        </View>
      </View>
    )
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
          <Text style={isSelectedItem ? [styles.bodyText, styles.highlightColor] : styles.bodyText}>
            {friendlyTime(item.date)}</Text>
          <Text style={isSelectedItem ? [styles.subTitleText, styles.highlightColor] : styles.subTitleText}>
            {item.note}</Text>
        </View>
      </View>
    };

    return (
      <TouchableHighlight style={{marginHorizontal: 5}} onPress={() => { this.props.onSelected(item) }} key={item.id + ''}>
        <View style={isSelectedItem ? [styles.highlightBackground, styles.row] : styles.row}>
          {customItemDisplay}
        </View>
      </TouchableHighlight>
    );
  };

}

export default ItemHistory;