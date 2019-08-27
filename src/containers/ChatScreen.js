import React, { Component } from 'react';
import { Animated, Alert, Platform, StyleSheet, View, DeviceEventEmitter } from 'react-native';
import { Container, Content, Header, Left, Body, Right, Title, Button, Icon, Text, Spinner } from 'native-base';
import { createStackNavigator, createAppContainer, createBottomTabNavigator } from "react-navigation";
import { Voximplant } from "react-native-voximplant";
import LinearGradient from 'react-native-linear-gradient';

let clientConfig = {};

clientConfig.saveLogsToFile = true; //ios only
clientConfig.enableVideo = true; // Android only option

let client = Voximplant.getInstance(clientConfig);

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

        // console.log(client);

        let that = this;

        makeCall(that)

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

async function makeCall(stateMap) {

    // console.log(client);

    const callSettings = {
        video: {
            sendVideo: true,
            receiveVideo: true,
        }
    };


    // create and start a call
    let call = await client.call("testuser1", callSettings);

    call.on(Voximplant.CallEvents.Connected, _onCallConnected);

    call.on(Voximplant.CallEvents.Failed, _failedCall);

    call.on(Voximplant.CallEvents.EndpointAdded, _onCallEndpointAdded);


    call.on(Voximplant.CallEvents.InfoReceived, _onInfoRecieved);

    client.on(Voximplant.ClientEvents.IncomingCall, _incomingCall);


    // client.on(Voximplant.ClientEvents.Failed, _failedCall);
}

function _onInfoRecieved(event) {
    console.log('_onInfoRecieved');
    console.log(event);
}

function _onCallDisconnected(event) {
    console.log('_onCallDisconnected');
    console.log(event);
}

function _onCallEndpointAdded(event) {
    console.log('_onCallEndpointAdded');
    console.log(event);
}

function _failedCall(event) {
    // console.log(statesMap)
    console.log(event);
    // 'event' here is the instance of
    // the Voximplant.CallEvents.Connected object;
    // use event.call to get the instance of Voximplant.Call
}

function _onCallConnected(event) {
    console.log(event);
    // 'event' here is the instance of
    // the Voximplant.CallEvents.Connected object;
    // use event.call to get the instance of Voximplant.Call
}

function _incomingCall(event) {
    console.log('======incoming call=======');
    console.log(event);
    const callSettings = {
        video: {
            sendVideo: event.video,
            receiveVideo: event.video
        }
    };
    event.call.answer(callSettings);
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