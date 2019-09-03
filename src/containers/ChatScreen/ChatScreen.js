import React, { Component } from 'react';
import { Animated, Alert, Platform, StyleSheet, View, DeviceEventEmitter } from 'react-native';
import { Container, Content, Header, Left, Body, Right, Title, Button, Icon, Text, Spinner } from 'native-base';
import { createStackNavigator, createAppContainer, createBottomTabNavigator } from "react-navigation";
import { Voximplant, Preview } from "react-native-voximplant";
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles.js';

let clientConfig = {};

clientConfig.saveLogsToFile = true; //ios only
clientConfig.enableVideo = true; // Android only option
clientConfig.sendVideo = true; // Android only option

let client = Voximplant.getInstance(clientConfig);

class ChatScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timer: 5,
            bgColor: '#EC0000',
            displayName: 'Anonymous',
            localVideoStreamId: '',
            remoteVideoStreamId: '',
            isVideoSent: false,
        }

        this.callId = null;
        this.callEvent = null;
        this.makeCall = this.makeCall.bind(this);
        this._onInfoRecieved = this._onInfoRecieved.bind(this);
        this._onCallDisconnected = this._onCallDisconnected.bind(this);
        this._onCallEndpointAdded = this._onCallEndpointAdded.bind(this);
        this._failedCall = this._failedCall.bind(this);
        this._onCallConnected = this._onCallConnected.bind(this);
        this._onLocalVideoAdded = this._onLocalVideoAdded.bind(this);
        this._onRemoteVideoAdded = this._onRemoteVideoAdded.bind(this);
        this._onRemoteVideoStreamAdded = this._onRemoteVideoStreamAdded.bind(this);
        this._incomingCall = this._incomingCall.bind(this);
        this._onInfoUpdated = this._onInfoUpdated.bind(this);
    }

    componentDidMount() {

        // console.log(client);

        let that = this;

        client.on(Voximplant.ClientEvents.IncomingCall, this._incomingCall);

        // Voximplant.EndpointEvents.

        this.makeCall(false);
    }


    async sendVideo(doSend) {
        try {
            await this.callEvent.sendVideo(doSend);
            this.setState({ isVideoSent: doSend });
            // console.log(this.callEvent);
        } catch (e) {
            console.warn(`Failed to sendVideo(${doSend}) due to ${e.code} ${e.message}`);
        }
    }

    async receiveVideo(doSend) {
        try {
            await this.callEvent.receiveVideo(doSend);
            this.setState({ isVideoSent: doSend });
            // console.log(this.callEvent);
        } catch (e) {
            console.warn(`Failed to receiveVideo(${doSend}) due to ${e.code} ${e.message}`);
        }
    }

    async makeCall() {

        const callSettings = {
            video: {
                sendVideo: true,
                receiveVideo: true,
            }
        };

        // create and start a call
        let call = await client.call("testuser1", callSettings);
        // setting the current call to callEvent variable
        this.callEvent = call;
        // all event handlers for a call object
        call.on(Voximplant.CallEvents.LocalVideoStreamAdded, this._onLocalVideoAdded);
        call.on(Voximplant.CallEvents.Connected, this._onCallConnected);
        call.on(Voximplant.CallEvents.Disconnected, this._onCallDisconnected);
        call.on(Voximplant.CallEvents.Failed, this._failedCall);
        call.on(Voximplant.CallEvents.EndpointAdded, this._onCallEndpointAdded);
        call.on(Voximplant.CallEvents.InfoReceived, this._onInfoRecieved);
    }

    _onInfoRecieved(event) {
        console.log('_onInfoRecieved');
        console.log(event);
    }

    _onInfoUpdated(event) {
        console.log('_onInfoUpdated');
        console.log(event);
    }

    async _onCallConnected(event) {
        console.log('_onCallConnected')
        console.log(event);
    }

    _onCallDisconnected(event) {
        console.log('_onCallDisconnected');
        console.log(event);
    }

    _incomingCall(event) {
        console.log('======incoming call=======', event);
        
        const callSettings = {
            video: {
                sendVideo: true,
                receiveVideo: true
            }
        };
        event.call.answer(callSettings);
    }


    _onCallEndpointAdded(event) {
        console.log('_onCallEndpointAdded', event);

        this._setupEndpointListeners(event.endpoint, true);
    }

    _onEndpointInfoUpdated = (event) => {
        console.log('_onEndpointInfoUpdated', event);
        event.endpoint.on(Voximplant.EndpointEvents.RemoteVideoStreamAdded, this._onEndpointRemoteVideoStreamAdded);
    };

    _onEndpointRemoved = (event) => {
        this._setupEndpointListeners(event.endpoint, false);
    };


    _onEndpointRemoteVideoStreamAdded = (event) => {
        console.log(event);
        this.setState({ 
            remoteVideoStreamId: event.videoStream.id,
            isVideoSent: true
         });
    };

    _onEndpointRemoteVideoStreamRemoved = (event) => {
        console.log(event);
    };

    _failedCall(event) {
        console.log('_failedCall', event);
    }

 
    _onLocalVideoAdded(event) {
        console.log('_onLocalVideoAdded', event);
        this.setState({
            localVideoStreamId: event.videoStream.id,
        })
    }

    _onRemoteVideoAdded(event){
        console.log('_onRemoteVideoAdded', event);
        this.setState({ remoteVideoStreamId: event.videoStream.id });
    }

    _onRemoteVideoStreamAdded(event){
        console.log('_onRemoteVideoStreamAdded', event);
        this.setState({ remoteVideoStreamId: event.videoStream.id });
    }

    _setupEndpointListeners(endpoint, on) {
        Object.keys(Voximplant.EndpointEvents).forEach((eventName) => {
            const callbackName = `_onEndpoint${eventName}`;
            if (typeof this[callbackName] !== 'undefined') {
                endpoint[(on) ? 'on' : 'off'](eventName, this[callbackName]);
            }
        });
    }


    render() {
        return (
            <Container style={{ backgroundColor: '#FFF' }}>
                {/* <LinearGradient colors={['#EC0000', '#FFC900', this.state.bgColor ]} style={styles.linearGradient}> */}
                    <Content>
                        <View style={styles.view}>
                            {/* <Text style={{ color: "white", fontSize: 24, marginTop: 315 }}>{this.state.timer}</Text> */}
                            {/* <Spinner style={{ marginTop: 315 }} color='white' /> */}
                            
                            <Voximplant.VideoView
                                style={styles.videoStyles}
                                videoStreamId={this.state.localVideoStreamId}
                                // showOnTop={true}
                                scaleType={Voximplant.RenderScaleType.SCALE_FIT} />
                            {this.state.isVideoSent ? (
                                <Voximplant.VideoView
                                    style={styles.videoStyles}
                                    showOnTop={true}
                                    videoStreamId={this.state.remoteVideoStreamId}
                                    scaleType={Voximplant.RenderScaleType.SCALE_FIT} />
                             ) : null}    

                        </View>
                    </Content>
                {/* </LinearGradient> */}
            </Container>
        );
    }
}

// Later on in your styles..


export default ChatScreen;