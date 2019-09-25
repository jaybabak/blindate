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
import { Voximplant, VIClient } from "react-native-voximplant";
import ChatScreen from './src/containers/ChatScreen/ChatScreen';
import RegisterScreen from './src/containers/RegisterScreen/RegisterScreen';
import styles from './styles.js';
const axios = require('axios');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: {
        lat: null,
        lon: null
      },
      locationNow: '',
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
    this.getStorageData = this.getStorageData.bind(this);
    this.setStorageData = this.setStorageData.bind(this);
    this.changeUsername = this.changeUsername.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.navigateToChatScreen = this.navigateToChatScreen.bind(this);
    this.navigateToRegisterScreen = this.navigateToRegisterScreen.bind(this);
  }

  componentDidMount(){
    this.setState({
      isReady: true
    })
    
    
    this.getLocation()
  
    this.login();
  }

  async getLocation() {

    navigator.geolocation.getCurrentPosition(
      async (position) => {

          this.setState({ 
            location: {
              lat:position.coords.latitude,
              lon: position.coords.longitude
            },
            locationNow: `Your location is: ${position.coords.latitude}/${position.coords.longitude}`
          });

          /* CODE FOR CHECKING USER LOCATION AND UPDATING DB
          * check first to see if async value is stored lat/lon
          * if no value is stored than set the lat/lon and also update the db
          */
       
          // try {
          //   console.log('getting location from async storage');
          //   var lat = await this.getStorageData('lat');
          //   var lon = await this.getStorageData('lon');
            
          //   console.log(lat, lon);
          //   if((!lat || !lon) && (lat !== position.coords.latitude || lon !== position.coords.lat)){

          //     await this.setStorageData('lat', position.coords.latitude);
          //     await this.setStorageData('lon', position.coords.longitude);

              /*
              * LEFT OFF HERE MAKING A HIT TO THE UPDATE ENDPOINT TO UPDATE THE USER IF LAT/LONG HAS CHANGED OR NOT BEEN SET
              * -- CANNOT COMPLETE UNTIL USER IS AUTHENTICATED AND HAS ACCESS TOKEN AS AUTHORIZATION TO UPDATE USER VALUE
              **/

              // var settings = {
              //       method: 'post',
              //       url: 'http://localhost:3000/api/update',
              //       data: {
              //         email: 'Fred@hotmail.com',
              //         field: 'location',
              //         value: {
              //           lat: "0",
              //           lon: "0"
              //         }
              //       }
              //     }

              // const updateUserLocationInDB = await axios(settings);

              // console.log(updateUserLocationInDB);
              // console.log('updated user location in db');
      

          //   }else {
          //     console.log('Location same as previous location');
          //   }
          // } catch (e) {
          //   console.log(e);
          //   // saving error
          // }
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

  async getStorageData(key){
    try {
      const value = await AsyncStorage.getItem(key)
      if(value !== null) {
        // value previously stored
        return value;
      }else {
        return null;
      }
    } catch(e) {
      // error reading value
    }
  }

  async setStorageData(key, storeValue){
    try {
      const value = await AsyncStorage.setItem(key, storeValue)
      return 'Stored successfully!';
    } catch(e) {
      console.error(e);
      return false;
      // error reading value
    }
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

    // console.log(this.state);

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

    // console.log(this.state);

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
    this.props.navigation.navigate('Start Date', this.state.location); //pass params to this object to pass current vixomplant instance
  }

  navigateToRegisterScreen(){
    console.log('Navigating to screen!');
    this.props.navigation.navigate('Register'); //pass params to this object to pass current vixomplant instance
  }


  clearAsyncStorage = async () => {
    AsyncStorage.clear();
  }

  render() {

    var loadingIcon = (<Spinner style={styles.spinner} color='#F39034' />);

    if (this.state.isReady !== true) {
      return loadingIcon;
    }

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
        <Button style={styles.buttonSubmit} block dark onPress={this.login}>
          <Text style={styles.whiteText}>Login</Text>
        </Button>

        <Button style={styles.buttonRegister} block bordered danger onPress={this.navigateToRegisterScreen}>
          <Text style={styles.whiteText}>Sign-up with a new account!</Text>
        </Button>
      </View>
    )

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
        <Text>{this.state.locationNow}</Text>
      </View>
    )

    // console.log(this.state.authenticated);
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
        {/* <View style={styles.container}>

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
      const refreshToken = await AsyncStorage.getItem('@refresh_token');
      const username = await AsyncStorage.getItem('@id');

      // console.log(value);
      // console.log(username);
      // console.log(refreshToken);
      if (value) {
        // user already logged in
        let authResultToken = await client.loginWithToken(`${username}@hookie.janu101.voximplant.com`, value );

        that.setState({
          authenticated: true,
          isReady: true
        });

        // console.log(authResultToken);

        that.setState({
          textHeading: 'Ready ' + authResultToken.displayName + '?'
        });
        
        // that.props.navigation.navigate('Start Date');


      }else {
        
        that.clearAsyncStorage();

        let authResult = await client.login(`${that.state.id}@hookie.janu101.voximplant.com`, `${that.state.password}`);
        
        console.log('------');
        console.log(authResult);
        console.log('------');

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
      that.setState({
        authenticated: false,
        isReady: true
      });
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
    that.setState({
      authenticated: false,
      isReady: true
    });
  }
}

const HomeStack = createStackNavigator(
  {
  "Home": App,
  "Start Date": ChatScreen,
  "Register": RegisterScreen,
  },
  {
    headerMode: 'none'
  }
);


const TabNavigator = createBottomTabNavigator(
  {
    "Home": App,
    "Start Date": ChatScreen,
  },
  {
    tabBarOptions: {
      activeBackgroundColor: '#1C1F29',
      labelStyle: {
        fontSize: 12,
        color: 'white',
        paddingBottom: 15,
        textTransform: 'uppercase'
      },
      style: {
        backgroundColor: '#1C1F29',
        paddingBottom: 0,
        height: 50,
        borderTopColor: 'black'
        // marginBottom: 20
      }
    }
  }
);

export default createAppContainer(HomeStack);

