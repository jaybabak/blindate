import React, { Component } from 'react';
import { Animated, Alert, Platform, StyleSheet, View, DeviceEventEmitter } from 'react-native';
import { Container, Content, Header, Left, Body, Right, Title, Button, Icon, Text } from 'native-base';
import { createStackNavigator, createAppContainer, createBottomTabNavigator } from "react-navigation";
import { Voximplant } from "react-native-voximplant";

class ChatScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timer: 5,
            bgColor: '#8CC6FF',
            displayName: 'Anonymous'
        }
        this.tick = this.tick.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    componentDidMount() {

        let clientConfig = {};
        let that = this;

        clientConfig.enableVideo = true; // Android only option
        let client = Voximplant.getInstance(clientConfig);

        login(client, that);

        const timerz = setInterval(() => {
            this.tick()
            if (this.state.timer == 0) {
                clearTimeout(timerz);
                this.setState({ bgColor: 'black', timer: '...' });
            }
        }, 1000)
    }

    onClick() {

        let clientConfig = {};
        let that = this;

        clientConfig.enableVideo = true; // Android only option
        let client = Voximplant.getInstance(clientConfig);

        login(client, that);
    }


    tick() {
        this.setState({ timer: this.state.timer - 1 });
    }


    render() {
        return (
            <Container style={{ backgroundColor: this.state.bgColor }}>
                <Content padder>
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ color: "white", fontSize: 76, marginTop: 315 }}>{this.state.timer}</Text>
                        {/* <Button onPress={this.onClick}><Text>Retry Logging In</Text></Button> */}
                    </View>
                </Content>
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

export default ChatScreen;