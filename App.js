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
import ChatScreen from './src/containers/ChatScreen';
import styles from './styles.js';

type Props = {};
class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      location: {
        lat: null,
        lon: null,
        city: null
      }
    }
    this.getLocation = this.getLocation.bind(this);
  }

  getLocation() {

    navigator.geolocation.getCurrentPosition(
      (position) => {
          this.setState({
          lat:position.coords.latitude,
          lon: position.coords.longitude,
          city: position.timestamp
        })
      },
      (error) => {
        console.log(error);
      },
      {
        enableHighAccuracy: true, 
        timeout: 30000
      }
    )
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
            Your Latitude: {this.state.lat}
          </Text>
          <Text style={{ color: "blue" }}>
            Your Longitude: {this.state.lon}
          </Text>
        </View>
      </Container>
    );
  }
}


const TabNavigator = createBottomTabNavigator(
  {
    "Home": App,
    "Start Date": ChatScreen,
  }
);


export default createAppContainer(TabNavigator);


  //ALERT BOX
  //     Alert.alert(
  //       'Error Retrieving Location!',
  //       'Unable to locate you at the moment, please try again.',
  //       [
  //         {
  //           text: 'Cancel',
  //           onPress: () => console.log('Cancel Pressed'),
  //           style: 'cancel',
  //         },
  //         { text: 'OK', onPress: () => console.log('OK Pressed') },
  //       ],
  //       { cancelable: false },
  //     );