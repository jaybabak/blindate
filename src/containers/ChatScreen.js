import React, { Component } from 'react';
import { Animated, Alert, Platform, StyleSheet, View, DeviceEventEmitter } from 'react-native';
import { Container, Content, Header, Left, Body, Right, Title, Button, Icon, Text, Spinner } from 'native-base';
import { createStackNavigator, createAppContainer, createBottomTabNavigator } from "react-navigation";
import { Voximplant } from "react-native-voximplant";
import LinearGradient from 'react-native-linear-gradient';

class ChatScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timer: 5,
            bgColor: '#707070',
            displayName: 'Anonymous'
        }
        this.tick = this.tick.bind(this);
    }

    componentDidMount() {

        let clientConfig = {};
        let that = this;

        clientConfig.enableVideo = true; // Android only option
        let client = Voximplant.getInstance(clientConfig);

        console.log(client);
        
        const timerz = setInterval(() => {
            this.tick()
            if (this.state.timer == 0) {
                clearTimeout(timerz);
                this.setState({ bgColor: '#FFFFFF', timer: '...' });
            }
        }, 1000)
    }

    tick() {
        this.setState({ timer: this.state.timer - 1 });
    }


    render() {
        return (
            <Container style={{ backgroundColor: this.state.bgColor }}>
                <LinearGradient colors={['#FFFFFF', '#CED1D8', this.state.bgColor ]} style={styles.linearGradient}>
                    <Content padder>
                        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                            {/* <Text style={{ color: "white", fontSize: 24, marginTop: 315 }}>{this.state.timer}</Text> */}
                            <Spinner style={{ marginTop: 315 }} color='white' />
       
                        </View>
                    </Content>
                </LinearGradient>
            </Container>
        );
    }
}

async function login(client, that) {
    try {
        let state = await client.getClientState();
        console.log(state);

        if (state === Voximplant.ClientState.DISCONNECTED) {
                await client.connect();
        }

        let authResult = await client.login("testuser1@hookie.janu101.voximplant.com", "123456");
        console.log(authResult);

        // that.setState({
        //     displayName: authResult.displayName
        // });

    } catch (e) {
        console.log(e.name + e.message);
        console.log(e);
    }
}

// Later on in your styles..
var styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5
    },
    buttonText: {
        fontSize: 18,
        fontFamily: 'Gill Sans',
        textAlign: 'center',
        margin: 10,
        color: '#ffffff',
        backgroundColor: 'transparent',
    },
});

export default ChatScreen;