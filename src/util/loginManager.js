import { Alert } from 'react-native';
import { Voximplant } from "react-native-voximplant";
import AsyncStorage from '@react-native-community/async-storage';
import isEmpty from 'validator/lib/isEmpty';
import isEmail from 'validator/lib/isEmail';
import isByteLength from 'validator/lib/isByteLength';
import isLength from 'validator/lib/isLength';
import isAlpha from 'validator/lib/isAlpha';
import isMobilePhone from 'validator/lib/isMobilePhone';
const axios = require('axios');


//LOGIN TO VOX API/SDK
const loginVox = async function (client, that){

    console.log('Yayyyy login vox class');

      try {
    await client.disconnect();
    let state = await client.getClientState();

    if (state === Voximplant.ClientState.DISCONNECTED) {
      await client.connect();
    }

    const value = await AsyncStorage.getItem('@access_token');
    const refreshToken = await AsyncStorage.getItem('@refresh_token');
    const username = await AsyncStorage.getItem('@id');

    if (value) {
      // user already logged in
      let authResultToken = await client.loginWithToken(`${username}@hookie.janu101.voximplant.com`, value );
      console.log('Token Set');

      that.setState({
        authenticated: true,
        isReady: true,
        textHeading: 'Ready ' + authResultToken.displayName + '?'
      });

    }else {
      
      that.clearAsyncStorage();
      let authResult = await client.login(`${that.state.email}@hookie.janu101.voximplant.com`, `${that.state.password}`);
      
      console.log(authResult);

      const accessToken = ["@access_token", authResult.tokens.accessToken]
      const accessExpire = ["@access_expire", authResult.tokens.accessExpire]
      const refreshExpire = ["@refresh_expire", authResult.tokens.refreshExpire]
      const refreshToken = ["@refresh_token", authResult.tokens.refreshToken]
      const userName = ["@id", that.state.email]
      await AsyncStorage.multiSet([accessToken, accessExpire, refreshExpire, refreshToken, userName])

      that.setState({
        tokens: true,
        textHeading: 'Hello ' + authResult.displayName,
        authenticated: true,
        isReady: true
      });
    }
  } catch (e) {
    console.log(e.name + e.message);
    console.log(e);

    that.setState({
      authenticated: false,
      isReady: true
    });
  }
}

//CREATE USER METHOD
const addUser = async function (user, that){

    console.log(user);

    const settings = {
        method: 'post',
        url: 'http://localhost:3000/register-user',
        data: {
            user
        }
    }

    const submitUserForm = await axios(settings);

    return submitUserForm;


}

//VALIDATE USER
const validateUser = async function (user){

    var errors = {
        success: true,
        email: false,
        password: false,
        name: false,
        lastName: false,
        mobileNumber: false
    };

    //Email Validation
    if (isEmpty(user.email) || !isEmail(user.email)) {
        console.log('incorrect email')
        errors.email = true
        errors.success = false;
    }

    //Password Validation
    if (isEmpty(user.password) || !isLength(user.password, { min: 6, max: 20 })) {
        console.log('incorrect password must be between 6 and 20 characters')
        errors.password = true
        errors.success = false;
    }

    //First Name Validation
    if (isEmpty(user.name) || !isAlpha(user.name, 'en-US') || !isLength(user.name, { min: 2, max: 30 })) {
        console.log('incorrect first name between 2 and 30')
        errors.name = true
        errors.success = false;
    }

    //Last Name Validation
    if (isEmpty(user.lastName) || !isAlpha(user.lastName, 'en-US') || !isLength(user.lastName, { min: 2, max: 30 })) {
        console.log('incorrect last name between 2 and 30')
        errors.lastName = true
        errors.success = false;
    }

    return errors;
}

//VALIDATE USER
const validateLoginForm = async function (user){

    var errors = {
        success: true,
        email: false,
        password: false
    };

    //Email Validation
    if (isEmpty(user.email) || !isEmail(user.email)) {
        console.log('incorrect email')
        errors.email = true
        errors.success = false;
    }

    //Password Validation
    if (isEmpty(user.password) || !isLength(user.password, { min: 6, max: 20 })) {
        console.log('incorrect password must be between 6 and 20 characters')
        errors.password = true
        errors.success = false;
    }

    return errors;
}

//LOGIN USER METHOD
const loginUser = async function (vox, email, password, that){

    var form = await validateLoginForm(that.state);

    if(!form.success){

        Alert.alert(
            'Cannot leave blank',
            'Must enter a valid email/password',
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
        return form;
    }
    

    const settings = {
        method: 'post',
        url: 'http://localhost:3000/login',
        data: {
            email: email,
            password: password
        }
    }

    const submitLoginForm = await axios(settings);

    if(submitLoginForm.data.success){
        that.setState({
          isReady: true
        })

        await that.setStorageData('app_access_token', submitLoginForm.data.accessToken);
        
        return submitLoginForm.data;
        // var getToken = await that.getStorageData('app_access_token');
        // console.log(getToken);
    }

    if(submitLoginForm.data.success == false){

        that.setState({
          isReady: true
        })
        
        Alert.alert(
            'Sorry incorrect credentials',
            'Either the user or password did not match with our records, try again.',
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
        
        return submitLoginForm.data;
    }
}


module.exports.loginVox = loginVox;
module.exports.loginUser = loginUser;
module.exports.addUser = addUser;
module.exports.validateUser = validateUser;