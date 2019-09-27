import { Alert } from 'react-native';
import { Voximplant, VIClient } from "react-native-voximplant";
import AsyncStorage from '@react-native-community/async-storage';

export default async function loginManager(client, that) {
  
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
      let authResult = await client.login(`${that.state.id}@hookie.janu101.voximplant.com`, `${that.state.password}`);
      
      console.log(authResult);

      const accessToken = ["@access_token", authResult.tokens.accessToken]
      const accessExpire = ["@access_expire", authResult.tokens.accessExpire]
      const refreshExpire = ["@refresh_expire", authResult.tokens.refreshExpire]
      const refreshToken = ["@refresh_token", authResult.tokens.refreshToken]
      const userName = ["@id", that.state.id]
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