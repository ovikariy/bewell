import 'react-native';
import * as mocks from '../../__mocks__/misc'; /** special mocks */
import React from 'react';
import renderer from 'react-test-renderer';
import { SleepCalendarComponent, SleepComponent, SleepComponentProps, SleepComponentWidgetType, SleepHistoryComponent, SleepHistoryComponentProps } from '../SleepComponent';
import { ItemTypes } from '../../modules/constants';
import { CreateWidgetFactory } from '../../modules/widgetFactory';
import { defaultAppContext } from '../../modules/appContext';

it('SleepComponent renders correctly', () => {
  const sleep: SleepComponentWidgetType = {
    date: mocks.StableDate.toUTCString(),
    dateCreated: mocks.StableDate.toUTCString(),
    id: 'sleep1',
    type: ItemTypes.SLEEP
  };
  const widgetFactory = CreateWidgetFactory(defaultAppContext);

  const sleepComponentProps: SleepComponentProps = {
    value: sleep,
    onChange: () => { },
    config: widgetFactory[ItemTypes.SLEEP].config,
    selectedDate: mocks.StableDate
  };

  expect.assertions(4);

  expect(renderer.create(
    <SleepComponent {...sleepComponentProps} />
  )).toMatchSnapshot();

  sleep.rating = 1;
  sleep.startDate = mocks.StableDate.toISOString();
  sleep.endDate = new Date(mocks.StableDate.getDate() + 1).toISOString();

  sleepComponentProps.isSelected = true;
  sleepComponentProps.onSelected = () => { };

  expect(renderer.create(
    <SleepComponent {...sleepComponentProps} />
  )).toMatchSnapshot();

  const sleepHistoryComponentProps: SleepHistoryComponentProps = {
    item: sleep,
    isSelectedItem: true,
    config: widgetFactory[ItemTypes.SLEEP].config
  };

  expect(renderer.create(
    <SleepHistoryComponent {...sleepHistoryComponentProps} />
  )).toMatchSnapshot();

  expect(renderer.create(
    <SleepCalendarComponent {...sleepHistoryComponentProps} />
  )).toMatchSnapshot();

});
