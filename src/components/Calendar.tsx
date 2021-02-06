import React, { ReactNode } from 'react';
import { View, Text, StyleProp, ViewStyle } from 'react-native';
import { sizes } from '../assets/styles/style';
import { AppContext } from '../modules/appContext';
import moment from 'moment';

/**
 * @description display a calendar layout of dates with optional custom control under the dates
 * @param props.data should be an array of items that requite displaying a custom control and should contain at least a date property in ISO string e.g. {"date":"2021-02-02T07:16:37.339Z","id":"9271e300-b721-489a-8ddf-1267469c01a1","type":"MOOD","rating":0}
 * @param props.renderItem function should be provided that will accept props.data.item
 */
export const Calendar = (props: { selectedDate: Date, data: any[], renderItem?: (item: any) => ReactNode }) => {
  const appContext = React.useContext(AppContext);
  const styles = appContext.styles;

  const selectedDate = props.selectedDate || Date.now();

  return (
    <View>
      <View {...props} style={{ flexDirection: 'row', marginVertical: sizes[10], paddingHorizontal: sizes[10], backgroundColor: styles.titleText.color }}>
        {renderHeader()}
      </View>
      <View style={{ flexDirection: 'row', margin: sizes[10] }}>
        {renderDays()}
      </View>
    </View>
  );

  /** render header cells e.g. Sun Mon ... Sat */
  function renderHeader() {
    return <View style={{ flex: 1, flexDirection: 'row' }}>
      {moment.weekdaysShort().map(weekdayName => {  /**TODO: test with language */
        return <View key={weekdayName} style={[{
          flex: 1 / 7, alignItems: 'center', paddingVertical: 10
        }]}>
          <Text style={[styles.bodyTextLarge, styles.highlightColor]}>{weekdayName}</Text>
        </View>;
      })}
    </View>;
  }

  /* render day cells e.g. for Jan 2021:
  *
  *   empty empty empty empty empty   1     2
  *     3     4     5     6     7     8     9
  *    10    11    12    13    14    15    16
  *    17    18    19    20    21    22    23
  *    24    25    26    27    28    29    30
  *    31
  *
  * with custom cell content
  */
  function renderDays() {
    //TODO: do we need to use UTC dates? Test with a record that falls on a time that wouldn't show in a month if UTC wasn't used
    /** collect each weekday's cells into arrays and display them vertically side by side starting with sundays */
    const tempDate = moment(selectedDate);
    const totalDaysInMonth = tempDate.daysInMonth();

    const weekdayGroups = [[], [], [], [], [], [], []]; /** 0 = sunday, 1 = monday etc like in moment.day() below */
    for (let i = 1; i <= totalDaysInMonth; i++) {
      tempDate.set('date', i); /** increment by day */
      const tempDateString = tempDate.format('YYYY-MM-DD');
      const dayOfWeek = tempDate.day();

      /** if sundays array starts with date 1 then show content otherwise need to pad that column with an empty cell as the first element
       * if mondays array start with date 2 then same as above and repeat for each weekday */
      if (weekdayGroups[dayOfWeek].length === 0 && i > dayOfWeek)
        weekdayGroups[dayOfWeek].push(renderDayContent(i + 100));

      const matchingItem = props.data.find(item => item.date.startsWith(tempDateString));
      if (matchingItem && props.renderItem) {
        const customDisplay = props.renderItem(matchingItem);
        weekdayGroups[dayOfWeek].push(renderDayContent(i, i, customDisplay));
      }
      else
        weekdayGroups[dayOfWeek].push(renderDayContent(i, i));
    }

    // /** display each weekday group vertically */
    const month = [];
    for (const weekdayGroup of weekdayGroups) {
      month.push(<View key={month.length} style={{ flexDirection: 'column', flex: 1 / 7 }}>
        {weekdayGroup}
      </View>);
    };
    return month;
  }

  /**
   * @description display date number, number and custom control underneath or a blank cell
   */
  function renderDayContent(key: any, dayNumber?: number, customContent?: ReactNode) {
    return (
      <View key={key} style={{ flexDirection: 'column', alignItems: 'center', minHeight: 60 }}>
        {dayNumber && <Text style={styles.bodyText}>{dayNumber}</Text>}
        {customContent}
      </View>

    );
  }
};