import 'react-native';
import * as mocks from '../../__mocks__/misc'; /** special mocks */
import React from 'react';
import renderer from 'react-test-renderer';
import { NoteComponent, NoteComponentWidgetType } from '../NoteComponent';
import { ItemTypes } from '../../modules/constants';
import { CreateWidgetFactory } from '../../modules/widgetFactory';
import { defaultAppContext } from '../../modules/appContext';

it('NoteComponent renders correctly', () => {
  const note: NoteComponentWidgetType = {
    date: mocks.StableDate.toUTCString(),
    dateCreated: mocks.StableDate.toUTCString(),
    id: 'sleep1',
    type: ItemTypes.NOTE
  };
  const widgetFactory = CreateWidgetFactory(defaultAppContext);

  expect(renderer.create(
    <NoteComponent value={note} onChange={() => { }} config={widgetFactory[ItemTypes.NOTE].config} selectedDate={mocks.StableDate} />
  )).toMatchSnapshot();

  note.note = `"testing note's line 1
  line 2
  line 3
  "`;

  expect(renderer.create(
    <NoteComponent value={note} onChange={() => { }} config={widgetFactory[ItemTypes.NOTE].config} selectedDate={mocks.StableDate}
      isSelected={true} key={note.id} onSelected={() => { }} />
  )).toMatchSnapshot();
});
