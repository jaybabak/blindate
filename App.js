/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Animated, Alert, Platform, StyleSheet, Text, View} from 'react-native';
import { Container, Content, Header, Left, Body, Right, Title, Button, Icon, } from 'native-base';
import { createStackNavigator, createAppContainer, createBottomTabNavigator } from "react-navigation";

//api Key
// Geocoder.init('AIzaSyATx_dhLvGCK6TqL0s8oBQ7ri0lIi9GPSY');
// import { ChatScreen } from './src/containers/ChatScreen';

// const instructions = Platform.select({
//   ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
//   android:
//     'Double tap R on your keyboard to reload,\n' +
//     'Shake or press menu button for dev menu',
// });

type Props = {};
class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      location: {
        lat: '?',
        lon: '?',
        city: '?'
      }
    }
    this.getLocation = this.getLocation.bind(this);
  }

  getLocation() {

    var geoOptions = {
      enableHighAccuracy: true,
      maximumAge: 1000 * 60 * 60,
    }

    navigator.geolocation.setRNConfiguration(geoOptions);
    navigator.geolocation.requestAuthorization();

  

    var that = this;

    navigator.geolocation.requestAuthorization();
    navigator.geolocation.getCurrentPosition(function (data) {

      Alert.alert(
        'Success',
        'Grabbed location!',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false },
      );

      console.log(data);

      that.setState(state => ({
        location: {
          lat: data.coords.latitude,
          lon: data.coords.longitude
        }
      }));

    }, function () {

      Alert.alert(
        'Error Retrieving Location!',
        'Unable to locate you at the moment, please try again.',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false },
      );

    }, geoOptions);

  }

  render() {
    return (
      <Container style={{ backgroundColor: '#FFE6E6' }} >
        <Header noLeft>
          <Left>
            <Button transparent
              onPress={() => this.props.navigation.navigate('Home')}
            >
              <Icon
                style={{ fontSize: 26, color: 'red' }}
                type="FontAwesome"
                name="question-circle" />
            </Button>
          </Left>
          <Body>
            <Title>BlindDate</Title>
          </Body>
          <Right>
            <Button transparent
              onPress={this.getLocation}
            >
              <Icon
                type="FontAwesome"
                style={{ fontSize: 20, color: 'red' }}
                name="map-pin" />
            </Button>
          </Right>
        </Header>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: "black" }}>Are you ready for an adventure?</Text>
          <Text style={{ color: "black", marginTop: 15 }}>Click the "Start Date" tab.</Text>

          <Text style={{ color: "blue", marginTop: 20 }}>
            Your Latitude: {this.state.location.lat}
          </Text>
          <Text style={{ color: "blue" }}>
            Your Longitude: {this.state.location.lon}
          </Text>
        </View>
      </Container>
    );
  }
}

class ChatScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: 5,
      bgColor: '#8CC6FF'
    }
    this.tick = this.tick.bind(this);
  }

  componentDidMount(){

    const timerz = setInterval(() => {
      this.tick()
      if (this.state.timer == 0) {
        clearTimeout(timerz);
        this.setState({ bgColor: 'black', timer: '...' });
      }
    }, 1000)
  }
  
  tick(){
    this.setState({ timer: this.state.timer - 1 });
  }


  render() {
    return (
      <Container style={{ backgroundColor: this.state.bgColor }}>
        <Content padder>
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: "white", fontSize: 76, marginTop: 315 }}>{this.state.timer}</Text>
          </View>
        </Content>
      </Container>
    );
  }
}

{/* <Button transparent
  title="Go to Details"
  onPress={() => this.props.navigation.navigate('Details')}
>
  <Icon name='menu' />
</Button> */}


const TabNavigator = createBottomTabNavigator(
  {
    "Home": App,
    "Start Date": ChatScreen,
  }
);


export default createAppContainer(TabNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
