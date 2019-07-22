import { createStackNavigator, createAppContainer, createBottomTabNavigator } from "react-navigation";
import App from '../../App';
import ChatScreen from '../containers/ChatScreen';

const TabNavigator = createBottomTabNavigator(
    {
        "Home": App,
        "Start Date": ChatScreen,
    }
);

export default TabNavigator;
