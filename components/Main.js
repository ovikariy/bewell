import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { MainDrawerNavigator } from './DrawerNavigator';

function Main() {
  return (
    <NavigationContainer>
      <MainDrawerNavigator/>
    </NavigationContainer>
  );
}
 
export default Main;