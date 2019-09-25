import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import { Text } from 'react-native-elements';
//import Widget from '../components/Widget';

it('works', () => {
  expect(1).toBe(1);
});

it('renders correctly', () => {
  expect(renderer.create(
    <Text>Sample</Text>
  )).toMatchSnapshot();
});

// it('renders correctly', () => {
//   expect(renderer.create(
//     <Widget key={1}
//       itemTypeName='MOOD'
//       dailyData={{}}
//       selectedDate={new Date().toLocaleString()}
//       navigation={{}}
//       onChange={(itemTypeName, newWidgetDailyData) => { }} />
//   )).toMatchSnapshot();
// });