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

type Props = {
  styles: styles,
  navigator: navigator
};
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
    this.getHelp = this.getHelp.bind(this);
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

  getHelp() {
      Alert.alert(
        'Need Help?',
        'Help screen will be available soon!',
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
  }

  render() {
    return (
      <Container style={ styles.container.backgroundColor } >
        <Header noLeft>
          <Left>
            <Button transparent
              onPress={ this.getHelp }
            >
              <Icon
                style={ styles.iconQuestion }
                type="FontAwesome"
                name="question-circle" />
            </Button>
          </Left>
          <Body>
            <Title>BlindDate</Title>
          </Body>
          <Right>
            <Button transparent
              onPress={ this.getLocation }
            >
              <Icon
                type="FontAwesome"
                style={ styles.iconLocation }
                name="map-pin" />
            </Button>
          </Right>
        </Header>
        <View style={styles.container}>
          <Text style={ styles.blackText }>Are you ready for an adventure?</Text>
          <Text style={ styles.introText }>Click the "Start Date" tab.</Text>
          <Text style={ styles.introText2 }>
            Your Latitude: {this.state.lat }
          </Text>
          <Text style={ styles.blueText }>
            Your Longitude: { this.state.lon}
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

