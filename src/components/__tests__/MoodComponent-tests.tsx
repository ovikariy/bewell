import 'react-native';
import * as mocks from '../../__mocks__/misc'; /** special mocks */
import React from 'react';
import renderer from 'react-test-renderer';
import { MoodComponent, MoodComponentWidgetType } from '../MoodComponent';
import { ItemTypes } from '../../modules/constants';
import { CreateWidgetFactory } from '../../modules/widgetFactory';
import { defaultAppContext } from '../../modules/appContext';

it('MoodComponent renders correctly', () => {
  const mood: MoodComponentWidgetType = {
    date: mocks.StableDate.toUTCString(),
    dateCreated: mocks.StableDate.toUTCString(),
    id: 'mood1',
    type: ItemTypes.MOOD,
  };
  const widgetFactory = CreateWidgetFactory(defaultAppContext);

  expect(renderer.create(
    <MoodComponent value={mood} onChange={() => { }} config={widgetFactory[ItemTypes.MOOD].config} selectedDate={mocks.StableDate} />
  )).toMatchSnapshot();

  mood.rating = 1;
  expect(renderer.create(
    <MoodComponent value={mood} onChange={() => { }} config={widgetFactory[ItemTypes.MOOD].config} selectedDate={mocks.StableDate}
      isSelected={true} key={mood.id} onSelected={() => { }} />
  )).toMatchSnapshot();
});
