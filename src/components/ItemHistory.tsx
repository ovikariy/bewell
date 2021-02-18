import React, { Component, ReactNode } from 'react';
import { Text, View, StyleProp, ViewStyle } from 'react-native';
import { friendlyDate, friendlyTime, groupBy, friendlyDay, formatDate } from '../modules/utils';
import { AppContext } from '../modules/appContext';
import { EmptyList, List } from './MiscComponents';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { WidgetBase, WidgetConfig } from '../modules/widgetFactory';
import { sizes } from '../assets/styles/style';

interface ItemHistoryProps {
  items: WidgetBase[],
  itemType: string
  config: WidgetConfig,
  style?: StyleProp<ViewStyle>;
  selectedItem?: WidgetBase
  onSelected: (item: WidgetBase) => void
  renderItem?: (item: WidgetBase, isSelectedItem: boolean) => ReactNode
}

class ItemHistory extends Component<ItemHistoryProps> {
  static contextType = AppContext;
  context!: React.ContextType<typeof AppContext>;

  render() {
    const language = this.context.language;

    const items = this.props.items;
    if (!items || items.length <= 0)
      return <EmptyList />;

    const sorted = items.slice(0).reverse(); /** sort without reversing the original array */

    const groupedByDayMap = groupBy(sorted, (item: WidgetBase) => friendlyDate(item.date, { language }), undefined);
    const groupedByDayArray = Array.from(groupedByDayMap.values());

    return (
      <View style={[{ marginTop: sizes[20] }, { flex: 1 }, this.props.style]} >
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
        <View style={[styles.row, styles.centered, styles.listItemContainer, { minHeight: 'auto', flex: 0 }]}>
          <Text style={[styles.titleText]}>
            {friendlyDay(daysData[0].date, { language })}</Text>
          <Text style={[styles.bodyText, { marginHorizontal: sizes[20], color: styles.bodyText.color + '80' }]}>
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
      <TouchableOpacity activeOpacity={0.7} style={{ marginHorizontal: sizes[5] }} onPress={() => { this.props.onSelected(item); }} key={item.id + ''}>
        <View style={isSelectedItem ? [styles.highlightBackground, styles.row] : styles.row}>
          {customItemDisplay}
        </View>
      </TouchableOpacity>
    );
  };

}

export default ItemHistory;