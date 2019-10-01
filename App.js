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
import ChatScreen from './src/containers/ChatScreen/ChatScreen';
import RegisterScreen from './src/containers/RegisterScreen/RegisterScreen';
import styles from './styles.js';
import loginManager from './src/util/loginManager';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: {
        lat: null,
        lon: null
      },
      locationNow: '',
      email: '',
      password: '',
      authenticated: false,
      textHeading: '...',
      isReady: false,
      tokens: false,
      errors: {},
      user: {}
    }
    this.getLocation = this.getLocation.bind(this);
    this.onLogout = this.onLogout.bind(this);
    this.login = this.login.bind(this);
    this.getStorageData = this.getStorageData.bind(this);
    this.setStorageData = this.setStorageData.bind(this);
    this.changeUsername = this.changeUsername.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.navigateToChatScreen = this.navigateToChatScreen.bind(this);
    this.navigateToRegisterScreen = this.navigateToRegisterScreen.bind(this);
  }

  async componentDidMount(){

    let clientConfig = {};
    let client = Voximplant.getInstance(clientConfig);
    
    clientConfig.enableVideo = true;

    

    // // const value = await AsyncStorage.getItem('app_access_token');
    // const value = await AsyncStorage.getItem('@app_access_token');
    // console.log('APP ACCESS TOKEN', value);

    // if(value){
    //   const getUserData = await loginManager.getUser();
    //   console.log(getUserData);

    //   await this.setStorageData('@id', getUserData.data.user._id);

    //   //try to login to vox
    //   var voxLogin = await loginManager.loginVox(client, this);
    //   console.log(voxLogin);
      
    //   // if(voxLogin){
    //   //   this.setState({
    //   //     isReady: true,
    //   //     authenticated: true
    //   //   })
    //   // }else {
    //   //   this.setState({
    //   //     isReady: true,
    //   //     authenticated: false
    //   //   });
    //   // }
    // }else {
      this.setState({
        isReady: true
      })

    // }
    

    this.getLocation()
    // this.login(); //auto tries to login the user and bring them to homepage
    // need to add a new click handler for login if empty than return error and prevent subission
    // otherwise login

  }

  componentWillUnmount(){
    console.log('component unmounted main APP');
  }

  async login(){
    
    let that = this;
    let clientConfig = {};
    let client = Voximplant.getInstance(clientConfig);
    
    clientConfig.enableVideo = true;

    this.setState({
      isReady: false
    })

    try{

      var loginResults = await loginManager.loginUser(that.state.email, that.state.password, that);

      if(loginResults.success == true){
        console.log('Succesful login results!', loginResults);
        this.setState({
          authenticated: true,
          accessToken: loginResults.accessToken,
        })
        
        var getUserData = await loginManager.getUser(this);
        this.setState({
          user: getUserData.data.user
        })

        //try to login to vox
        var voxLogin = await loginManager.loginVox(client, that);
        console.log(voxLogin);
        if(voxLogin){
          this.setState({
            isReady: true
          })
        }
      }
      else {
        this.setState({
          errors: loginResults,
          isReady: true,
          password: ''          
        })
        // console.log('Failed login results!', loginResults);
      }
    }
    catch(err){
      this.setState({
        isReady: true
      })

      Alert.alert(
          'Sorry something is wrong',
          'Please check your connection and try again.',
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
      console.log(err);
    }
  }

  //CURRENTLY THE LOG OUT FUNCTION
  async onLogout() {
    let clientConfig = {};
    let client = Voximplant.getInstance(clientConfig);

    try {
      await client.disconnect();
      this.clearAsyncStorage()
      this.setState({
        authenticated: false,
        tokens: false,
        email: '',
        password: ''
      })

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
    } catch (e) {
      console.log(e);
    }
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
      },
      (error) => {
          Alert.alert(
          'Error Retrieving Location',
          'Could not determine your location, ensure location services are turned on.',
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
        console.log(error);
      },
      {
        enableHighAccuracy: true, 
        timeout: 30000
      }
    ) 
  }

  navigateToChatScreen(){
    this.props.navigation.navigate('Start Date', this.state.location); //pass params to this object to pass current vixomplant instance
  }

  navigateToRegisterScreen(){
    this.props.navigation.navigate('Register'); //pass params to this object to pass current vixomplant instance
  }

  changeUsername(e){
    this.setState({
        email: e
      }
    )
  }

  changePassword(e){
    this.setState({
        password: e
      }
    )
  }

  async clearAsyncStorage() {
    AsyncStorage.clear();
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
      console.log(e);
      return null;
    }
  }

  async setStorageData(key, storeValue){
    try {
      const value = await AsyncStorage.setItem(key, storeValue)
      if(value !== null) {
        return value;
      }else {
        return null;
      }
    } catch(e) {
      console.error(e);
      return null;
    }
  }

  render() {

    var loadingIcon = (<Spinner style={styles.spinner} color='#F39034' />);

    if (this.state.isReady !== true) {
      return loadingIcon;
    }

    var loginForm = (
      <View style={styles.containerBody}>
        <Text style={styles.introText}>Hello there, please sign-in or register now!</Text>
        <Item error={this.state.errors.email ? true : false} regular>
          <Input autoCapitalize='none' placeholder={this.state.email ? this.state.email : 'mail@example.com'} onChangeText={ this.changeUsername }/>
        </Item>
        <Item error={this.state.errors.password ? true : false} regular>
          <Input secureTextEntry={true} placeholder='Password' onChangeText={ this.changePassword }/>
        </Item>
        <Button style={styles.buttonSubmit} block dark onPress={ this.login }>
          <Text style={styles.whiteText}>Login</Text>
        </Button>
        <Button onPress={ this.navigateToRegisterScreen } style={ styles.buttonRegister } block bordered danger >
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
            <Button onPress={ this.onLogout } transparent>
              <Icon style={ styles.iconQuestion } type="FontAwesome" name="question-circle" />
            </Button>
          </Left>
          <Body>
            <Title>BlindDatee</Title>
          </Body>
          <Right>
            <Button onPress={ this.getLocation } transparent >
              <Icon type="FontAwesome" style={ styles.iconLocation } name="map-pin" />
            </Button>
          </Right>
        </Header>
        {mainContentView}
      </Container>
    );
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

export default createAppContainer(HomeStack);
