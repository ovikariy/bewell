import React, { ReactNode } from 'react';
import { View, Text } from 'react-native';
import { sizes } from '../assets/styles/style';
import { AppContext } from '../modules/appContext';
import moment from 'moment';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MonthPicker } from './DatetimeComponents';

export interface CalendarProps {
  selectedDate: Date, data: any[],
  renderItem?: (item: any) => ReactNode,
  onItemPress?: (date: string, item: any) => void,
  onSelectedDateChanged: (date?: Date) => void;
}
/**
 * @description display a calendar layout of dates with optional custom control under the dates
 * @param props.data array of items that requite displaying a custom control and should contain at least a date property in ISO string e.g. {"date":"2021-02-02T07:16:37.339Z","id":"9271e300-b721-489a-8ddf-1267469c01a1","type":"MOOD","rating":0}
 * @param props.renderItem function that accepts props.data.item and returns a node
 */
export const Calendar = (props: CalendarProps) => {
  const appContext = React.useContext(AppContext);
  const styles = appContext.styles;

  return (
    <View>
      <MonthPicker selectedDate={props.selectedDate} onChange={(newDate) => props.onSelectedDateChanged(newDate)} />
      <View {...props} style={styles.calendarHeaderContainer}>
        {renderWeekDays()}
      </View>
      <View style={[styles.calendarBodyContainer]}>
        {renderDays()}
      </View>
    </View>
  );

  /** render Sun Mon ... Sat */
  function renderWeekDays() {
    return <View style={{ flex: 1, flexDirection: 'row' }}>
      {
        moment.weekdaysShort().map(weekdayName =>
          <View key={weekdayName} style={{ flex: 1 / 7, alignItems: 'center', paddingVertical: sizes[10] }}>
            <Text style={[styles.titleText, styles.brightColor, { fontSize: sizes[18] }]}>{weekdayName}</Text>
          </View>)
      }
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
    /** collect each weekday's cells into arrays and display them vertically side by side starting with sundays */
    const tempDate = moment(props.selectedDate);

    const totalDaysInMonth = tempDate.daysInMonth();
    const weekdayGroups = [[], [], [], [], [], [], []] as ReactNode[][]; /** 0 = sunday, 1 = monday etc like in moment.day() below */
    for (let i = 1; i <= totalDaysInMonth; i++) {
      tempDate.set('date', i); /** increment by day */
      const tempDateString = tempDate.toDate().toLocaleDateString();
      const dayOfWeek = tempDate.day();

      /** if sundays array starts with date 1 then show content otherwise need to pad that column with an empty cell as the first element
       * if mondays array start with date 2 then same as above and repeat for each weekday */
      if (weekdayGroups[dayOfWeek].length === 0 && i > dayOfWeek + 1)
        weekdayGroups[dayOfWeek].push(renderDayContent(tempDateString, i + 100));

      let matchingItem;
      for (let i = props.data.length - 1; i >= 0; i--) {
        if (new Date(props.data[i].date).toLocaleDateString() === tempDateString) {
          matchingItem = props.data[i]; /** TODO: don't break here but collect multi items for the day and pass them to the render item so in there can sum up or pick latest value  */
          break;
        }
      }
      if (matchingItem && props.renderItem) {
        const customDisplay = props.renderItem(matchingItem);
        weekdayGroups[dayOfWeek].push(renderDayContent(tempDateString, i, i, matchingItem, customDisplay));
      }
      else
        weekdayGroups[dayOfWeek].push(renderDayContent(tempDateString, i, i));
    }

    /** display each weekday group vertically */
    const month = [];
    for (const weekdayGroup of weekdayGroups) {
      month.push(<View key={month.length} style={{ flexDirection: 'column', flex: 1 / 7 }}>
        {weekdayGroup}
      </View>);
    };
    return month;
  }

  /**
   * @description display date number and custom control underneath or a blank cell
   */
  function renderDayContent(date: string, key: any, dayNumber?: number, item?: any, customContent?: ReactNode) {
    return (
      <TouchableOpacity key={key} onPress={() => dayNumber && props.onItemPress ? props.onItemPress(date, item) : {}}>
        <View style={styles.calendarDayContainer}>
          {dayNumber && <Text style={[styles.bodyTextTiny, { fontWeight: customContent ? 'bold' : undefined }]}>{dayNumber}</Text>}
          {customContent}
        </View>
      </TouchableOpacity>
    );
  }
};