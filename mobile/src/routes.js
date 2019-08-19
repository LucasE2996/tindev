import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import Login from './pages/Login';
import Main from './pages/Main';

export default createAppContainer(
    createSwitchNavigator({
        Login,
        Main
    })
);

/**
 * To navigate through pages with 'return' opiton we should use createStackNavigator
 * instead of createSwitchNavigator
 * 
 * The createSwitchNavigator do not have animation and 'return' option or any animation
 * and other stuff that usually a page navigation has, so it should be used as login page
 */