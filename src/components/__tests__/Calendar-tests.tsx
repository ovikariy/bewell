import 'react-native';
import * as mocks from '../../__mocks__/misc'; /** special mocks */
import React from 'react';
import renderer from 'react-test-renderer';
import { Calendar, CalendarProps } from '../Calendar';

it('Calendar renders correctly', () => {
  const calendarProps: CalendarProps = {
    data: [],
    selectedDate: mocks.StableDate,
    onSelectedDateChanged: () => {},
  };

  expect(renderer.create(
    <Calendar {...calendarProps} />
  )).toMatchSnapshot();

  calendarProps.onItemPress = () => {};
  calendarProps.renderItem = () =>  <React.Fragment/>;

  expect(renderer.create(
    <Calendar {...calendarProps} />
  )).toMatchSnapshot();
});
