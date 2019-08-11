/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { Animated, Alert, Platform, StyleSheet, Text, View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Container, Content, Header, Left, Body, Right, Title, Button, Icon, Input, Item, Spinner  } from 'native-base';
import { createStackNavigator, createAppContainer, createBottomTabNavigator } from "react-navigation";
import { Voximplant } from "react-native-voximplant";
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
        city: null,
      },
      id: null,
      password: null,
      authenticated: false,
      textHeading: 'Login',
      isReady: false,
      tokens: false
    }
    this.getLocation = this.getLocation.bind(this);
    this.getHelp = this.getHelp.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.changeUsername = this.changeUsername.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.navigateToChatScreen = this.navigateToChatScreen.bind(this);
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

      this.logout()

      Alert.alert(
        'Logged out!',
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

  login(){

    console.log(this.state);

    let clientConfig = {};
    let that = this;

    this.setState({
      isReady: false
    })

    clientConfig.enableVideo = true; // Android only option
    let client = Voximplant.getInstance(clientConfig);

    loginVox(client, that);

  }

  logout(){

    console.log(this.state);

    let clientConfig = {};
    let that = this;

    let client = Voximplant.getInstance(clientConfig);

    logoutVox(client, that);
    this.clearAsyncStorage()

  }

  changeUsername(e){
    this.setState({
        id: e
      }
    )
  }

  changePassword(e){
    this.setState({
        password: e
      }
    )
  }

  navigateToChatScreen(){
    this.props.navigation.navigate('Start Date');
  }

  componentDidMount(){

    this.login();
    // this.login()

    this.setState({
      isReady: true
    })

    AsyncStorage.getItem('@access_token').then(tokenVal => {

      console.log('---------CDM-------');
      console.log(tokenVal);
      console.log('---------CDM-------');

      if(tokenVal){
        this.setState({
          tokens: true
        })
      }

      console.log(this.state);

    });
  }

  clearAsyncStorage = async () => {
    AsyncStorage.clear();
  }

  render() {

    var loginForm = (
      <View style={styles.containerBody}>
        <Text style={styles.introText}>Hello there, please sign-in or register now!</Text>
        <Item regular>
          <Input
            autoCapitalize='none'
            placeholder='Username'
            onChangeText={this.changeUsername}
          />
        </Item>
        <Item regular>
          <Input
            secureTextEntry={true}
            placeholder='Password'
            onChangeText={this.changePassword}
          />
        </Item>
        <Button block dark onPress={this.login}>
          <Text style={styles.buttonSubmit}>Login</Text>
        </Button>
      </View>
    )

    var loadingIcon = (<Spinner style={styles.spinner} color='red' />);
      
    var loginFormNoTextInput = (
      <View style={styles.containerCenter}>
        {loadingIcon}
        <Text style={styles.introText}>...logging you in!</Text>
      </View>
    )

    var authenticatedView = (
      <View style={styles.containerBody}>
        <Text style={styles.introText}>{this.state.textHeading}</Text>
        <Button block dark onPress={this.navigateToChatScreen}>
          <Text style={styles.buttonSubmit}>Start my date!</Text>
        </Button>
      </View>
    )

    console.log(this.state);


    if (this.state.isReady !== true) {
      return loadingIcon;
    } 

    if (this.state.authenticated == true) {
      mainContentView = authenticatedView;
    }else{
      if(this.state.tokens){
        // mainContentView = loginFormNoTextInput;
        mainContentView = loginFormNoTextInput;
      }else{
        mainContentView = loginForm;
      }
    }


    return (
      <Container backgroundColor="#E2E2E2" style={ styles.container.backgroundColor } >
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
            <Title>BlindDatee</Title>
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
         
        </View>
        {/* <View style={styles.containerBody}>
          <Item regular>
            <Input 
              autoCapitalize='none'
              placeholder='Username' 
              onChangeText={this.changeUsername}
            />
          </Item>
          <Item regular>
            <Input 
              secureTextEntry={true}
              placeholder='Password' 
              onChangeText={this.changePassword}
            />
          </Item>
          <Button block dark onPress={this.login}>
            <Text style={styles.buttonSubmit}>Login</Text>
          </Button>
        </View> */}
        {mainContentView}

      </Container>
    );
  }
}

async function logoutVox(client, that){

  try {
    await client.disconnect();
    that.setState({
      authenticated: false,
      tokens: false
    })
  } catch (e) {
    //save error
    console.log(e);
  }

}

async function loginVox(client, that) {

  try {
    await client.disconnect();
  } catch (e) {
    //save error
    console.log(e);
  }
  

  try {
    let state = await client.getClientState();
    // console.log(state);

    if (state === Voximplant.ClientState.DISCONNECTED) {
      await client.connect();
    }

    try {
      const value = await AsyncStorage.getItem('@access_token');
      const username = await AsyncStorage.getItem('@id');
      // console.log(value);
      if (value !== null) {
        // user already logged in
        let authResultToken = await client.loginWithToken(`${username}@hookie.janu101.voximplant.com`, value );
        that.setState({
          authenticated: true,
          isReady: true
        });

        console.log(authResultToken);

        that.setState({
          textHeading: 'Hello ' + authResultToken.displayName + '!'
        });
        
        // that.props.navigation.navigate('Start Date');


      }else {

        let authResult = await client.login(`${that.state.id}@hookie.janu101.voximplant.com`, `${that.state.password}`);
        console.log(authResult);

        that.setState({
          textHeading: 'Hello ' + authResult.displayName,
          authenticated: true,
          isReady: true
        });

        const accessToken = ["@access_token", authResult.tokens.accessToken]
        const accessExpire = ["@access_expire", authResult.tokens.accessExpire]
        const refreshExpire = ["@refresh_expire", authResult.tokens.refreshExpire]
        const refreshToken = ["@refresh_token", authResult.tokens.refreshToken]
        const userName = ["@id", that.state.id]

        try {
          await AsyncStorage.multiSet([accessToken, accessExpire, refreshExpire, refreshToken, userName])

          that.setState({
            tokens: true
          });
        } catch (e) {
          //save error
          console.log('Asyncstorage issue: ');1
          console.log(e);

          that.setState({
            tokens: false
          });
        }

      }
    } catch (e) {
      // error reading value
    }

  } catch (e) {
    console.log(e.name + e.message);
    console.log(e);
    Alert.alert(
      'Error!',
      'Sorry something is not right, please try again?',
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
}

const TabNavigator = createBottomTabNavigator(
  {
    "Home": App,
    "Start Date": ChatScreen,
  }
);

export default createAppContainer(TabNavigator);

