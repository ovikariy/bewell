import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import { Text } from 'react-native-elements';

it('renders correctly', () => {
  expect(renderer.create(
    <Text>Sample</Text>
  )).toMatchSnapshot();
});
