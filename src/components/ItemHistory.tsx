import React, { ReactNode, useState } from 'react';
import { Text, View, StyleProp, ViewStyle } from 'react-native';
import { friendlyTime, groupBy, friendlyDay, formatDate } from '../modules/utils';
import { AppContext } from '../modules/appContext';
import { List } from './MiscComponents';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { WidgetBase, WidgetConfig } from '../modules/widgetFactory';
import { sizes } from '../assets/styles/style';
import { Calendar } from './Calendar';

interface ItemHistoryProps {
  items: WidgetBase[],
  itemType: string,
  config: WidgetConfig,
  style?: StyleProp<ViewStyle>,
  selectedItem?: WidgetBase,
  onSelected: (item: WidgetBase) => void,
  renderItem?: (item: WidgetBase, isSelectedItem: boolean) => ReactNode,
  renderCalendarItem?: (item: WidgetBase) => ReactNode,
  navigation: any
}

export const ItemHistory = (props: ItemHistoryProps) => {
  const context = React.useContext(AppContext);
  const language = context.language;
  const styles = context.styles;

  const [selectedDate, setSelectedDate] = useState(new Date());

  const showCalendarComponent = props.renderCalendarItem ? true : false;

  const items = !showCalendarComponent ? props.items : filterItemsByMonth(selectedDate, props.items); /** only show current month's items */

  /** need double sort: 1) widget records need to be sorted as they were added but reversed and 2) day groups need to be sorted by date descending */

  /** 1st sort as the widget records were added but reversed */
  const sorted = items.slice(0).reverse(); /** items.slice(0).reverse() sorts without reversing the original array which is what we want but items.reverse() does */

  const groupedByDayMap = groupBy(sorted, (item: WidgetBase) => item.date.substring(0, 10), undefined); /** group by first 10 chars e.g. 2020-01-01 */
  const groupedByDayArray = Array.from(groupedByDayMap.values()) as [WidgetBase[]];

  /** 2st sort day groups by the date of the group's first element */
  groupedByDayArray.sort((a, b) => a[0].date < b[0].date ? 1 : a[0].date > b[0].date ? -1 : 0);

  return (
    <View style={[{ flex: 1, marginTop: showCalendarComponent ? 0 : sizes[40] }, props.style]} >
      <List
        ListHeaderComponent={showCalendarComponent &&
          <Calendar data={items}
            onItemPress={(date, item) => { props.navigation.navigate('DayView', { date: item ? item.date : date }); }}
            selectedDate={selectedDate}
            onSelectedDateChanged={(newDate) => selectedDateChanged(newDate)}
            renderItem={props.renderCalendarItem}
          />}
        data={groupedByDayArray}
        renderItem={(item: any) => renderGroupedByDay(item.item)}
        keyExtractor={(item: WidgetBase[]) => item[0].date + ''} /* keyExtractor expects a string */
      />
    </View>
  );

  function selectedDateChanged(newDate: Date | undefined) {
    if (!newDate)
      return;
    setSelectedDate(newDate);
  }

  function filterItemsByMonth(matchMonthWith: Date, items: WidgetBase[]) {
    const yearToMatch = matchMonthWith.getFullYear();
    const monthToMatch = matchMonthWith.getMonth();
    return items.filter(item => {
      const itemDate = new Date(item.date);
      /** getFullYear and getMonth gives locale values which we need for comparison */
      return (itemDate.getFullYear() === yearToMatch && itemDate.getMonth() === monthToMatch);
    });
  }

  function renderGroupedByDay(daysData: WidgetBase[]) {
    return (
      <View style={[styles.flex]} key={daysData[0].date}>
        <View style={[styles.row, styles.centered, styles.listItemContainer, { minHeight: 'auto', flex: 0 }]}>
          <Text style={[styles.titleText]}>
            {friendlyDay(daysData[0].date, { language })}</Text>
          <Text style={[styles.bodyText, { marginHorizontal: sizes[20], color: styles.bodyText.color + '80' }]}>
            {formatDate(daysData[0].date, 'MMMM D')}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <List //extraData={this.state} /* extraData={this.state} is needed for rerendering the list when item is pressed */
            data={daysData}
            horizontal={props.config.isHorizontalHistoryRow ? true : false}
            renderItem={(item: any) => renderItem(item.item)}
            keyExtractor={(item: WidgetBase) => item.id + ''} /* keyExtractor expects a string */
          />
        </View>
      </View>
    );
  }

  function renderItem(item: WidgetBase) {

    const isSelectedItem = (props.selectedItem && props.selectedItem.id === item.id) || false;
    /* all history screens have common functionality like selecting the row and deleting the row but
    also can have custom fields to show for items so we allow each screen to customize item display */
    let customItemDisplay: ReactNode;
    if (props.renderItem)
      customItemDisplay = props.renderItem(item, isSelectedItem);

    else {
      customItemDisplay = <View style={styles.row}>
        <View style={[styles.flex]}>
          <Text style={isSelectedItem ? [styles.bodyText, styles.highlightColor] : styles.bodyText}>
            {friendlyTime(item.date)}</Text>
        </View>
      </View>;
    };

    return (
      <TouchableOpacity activeOpacity={0.7} style={{ marginHorizontal: sizes[5] }} onPress={() => { props.onSelected(item); }} key={item.id + ''}>
        <View style={[styles.row, { paddingTop: 0 }, isSelectedItem && styles.highlightBackground]}>
          {customItemDisplay}
        </View>
      </TouchableOpacity>
    );
  };

};