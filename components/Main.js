import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import MainDrawerNavigator from './DrawerNavigator';

export default createAppContainer(createSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Main: MainDrawerNavigator
}));