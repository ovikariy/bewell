import React, { Component, ReactNode } from 'react';
import { Text, View, StyleProp, ViewStyle } from 'react-native';
import { friendlyDate, friendlyTime, isEmptyWidgetItem, groupBy, friendlyDay, formatDate } from '../modules/helpers';
import { AppContext } from '../modules/AppContext';
import { EmptyList, List } from './MiscComponents';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { WidgetBase, WidgetConfig } from '../modules/WidgetFactory';
import { StoreState } from '../redux/reducerTypes';
import { ItemBaseAssociativeArray } from '../modules/types';

interface ItemHistoryProps {
  store: StoreState,
  itemType: string
  config: WidgetConfig,
  style?: StyleProp<ViewStyle>;
  selectedItem?: WidgetBase
  onSelected: (item: WidgetBase) => void
  renderItem?: (item: WidgetBase, isSelectedItem: boolean) => ReactNode
}

class ItemHistory extends Component<ItemHistoryProps> {
  static contextType = AppContext;
  declare context: React.ContextType<typeof AppContext>;

  filterByItemType(items: ItemBaseAssociativeArray , itemType: string) {
    const result = [] as WidgetBase[];

    if (!items)
      return result;
    Object.keys(items).forEach((key: string) => {
      if (!items[key])
        return;
      const filtered = (items[key] as WidgetBase[]).filter((item: WidgetBase) => item.type === itemType);
      filtered.forEach((filteredItem: WidgetBase) => {
        if (!isEmptyWidgetItem(filteredItem))
          result.push(filteredItem);
      });
    });
    return result.sort((b: WidgetBase, a: WidgetBase) => a.date < b.date ? -1 : a.date > b.date ? 1 : 0);
  }

  render() {
    const language = this.context.language;

    const items = this.filterByItemType(this.props.store.items, this.props.itemType);
    if (!items || items.length <= 0)
      return <EmptyList />;


    const groupedByDayMap = groupBy(items, (item: WidgetBase) => friendlyDate(item.date, { language }), undefined);
    const groupedByDayArray = [] as WidgetBase[]; //TODO: this is a waste of resources to copy a map into an array because map cannot be passed as data to FlatList
    groupedByDayMap.forEach((item: WidgetBase) => groupedByDayArray.push(item));

    return (
      <View style={[{ marginTop: 20 }, { flex: 1 }, this.props.style]}>
        <List
          data={groupedByDayArray}
          renderItem={(item: any) => this.renderGroupedByDay(item.item)}
          keyExtractor={(item: WidgetBase[]) => item[0].date + ''} /* keyExtractor expects a string */
        />
      </View>
    );
  }

  renderGroupedByDay(daysData: WidgetBase[]) {
    const language = this.context.language;
    const styles = this.context.styles;

    return (
      <View style={[styles.flex]} key={daysData[0].date}>
        <View style={[styles.row, styles.centered, styles.dimBackground, { flex: 0 }]}>
          <Text style={[styles.titleText]}>
            {friendlyDay(daysData[0].date, { language })}</Text>
          <Text style={[styles.bodyText, { marginHorizontal: 20, color: styles.bodyText.color + '80' }]}>
            {formatDate(daysData[0].date, 'MMMM D')}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <List extraData={this.state} /* extraData={this.state} is needed for rerendering the list when item is pressed */
            data={daysData}
            horizontal={this.props.config.isHorizontalHistoryRow ? true : false}
            renderItem={(item: any) => this.renderItem(item.item)}
            keyExtractor={(item: WidgetBase) => item.id + ''} /* keyExtractor expects a string */
          />
        </View>
      </View>
    );
  }

  renderItem(item: WidgetBase) {
    const styles = this.context.styles;

    const isSelectedItem = (this.props.selectedItem && this.props.selectedItem.id === item.id) || false;
    /* all history screens have common functionality like selecting the row and deleteing the row but
    also can have custom fields to show for items so we allow each screen to customize item display */
    let customItemDisplay: ReactNode;
    if (this.props.renderItem)
      customItemDisplay = this.props.renderItem(item, isSelectedItem);

    else {
      customItemDisplay = <View style={styles.row}>
        <View style={[styles.flex]}>
          <Text style={isSelectedItem ? [styles.bodyText, styles.highlightColor] : styles.bodyText}>
            {friendlyTime(item.date)}</Text>
        </View>
      </View>;
    };

    return (
      <TouchableOpacity activeOpacity={0.7} style={{ marginHorizontal: 5 }} onPress={() => { this.props.onSelected(item); }} key={item.id + ''}>
        <View style={isSelectedItem ? [styles.highlightBackground, styles.row] : styles.row}>
          {customItemDisplay}
        </View>
      </TouchableOpacity>
    );
  };

}

export default ItemHistory;