import { createAppContainer, createStackNavigator } from 'react-navigation';

import Main from './pages/Main';
import User from './pages/User';

const pages = { Main, User };

const Routes = createAppContainer(
  createStackNavigator(pages, {
    headerBackTitleVisible: false,
    defaultNavigationOptions: {
      headerStyle: { backgroundColor: '#7159c1' },
      headerTintColor: '#fff',
    },
  })
);

export default Routes;
