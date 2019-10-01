import React, { Component } from 'react';
import { Animated, Alert, Platform, StyleSheet, View, DeviceEventEmitter } from 'react-native';
import { Container, Content, Header, Left, Body, Right, Title, Button, Icon, Text, Spinner, Footer, FooterTab } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { Voximplant } from "react-native-voximplant";
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles.js';
import io from 'socket.io-client';


// const socket = io('http://localhost:3000', {
// //   rejectUnauthorized: false,
//         reconnectionDelay: 1000,
//       reconnection:true,
//       reconnectionAttempts: 10,
//     //   transports: ['websocket'],
//       agent: false, // [2] Please don't set this to true
//       upgrade: false,
//       rejectUnauthorized: false
// });


let clientConfig = {};

clientConfig.saveLogsToFile = true; //ios only
clientConfig.enableVideo = true; // Android only option
clientConfig.sendVideo = true; // Android only option

let client = Voximplant.getInstance(clientConfig);

class ChatScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bgColor: '#EC0000',
            displayName: 'Anonymous',
            localVideoStreamId: '',
            remoteVideoStreamId: '',
            isVideoSent: false,
        }

        this.socket = io('http://localhost:3000', {
            reconnectionDelay: 1000,
            reconnection:true,
            agent: false, // [2] Please don't set this to true
            rejectUnauthorized: false
        });
        this.callId = null;
        this.callEvent = null;
        this.makeCall = this.makeCall.bind(this);
        this.endCall = this.endCall.bind(this);
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
        this.removeCall = this.removeCall.bind(this);
    }

    async componentDidMount() {

        const { navigation } = this.props;
        let that = this;

         const userLocation = navigation.state.params;


        this.socket.on('connection', () => {
            console.log("socket connected")

            // this.socket.emit('test')
            // this.socket.emit('connection', {})
            // this.socket.emit('connection', { data: 'Sami Joined!'});
        })

        this.socket.on('load', (data) => {

            console.log("User loaded and connected to system: ", data);
            
            this.socket.emit('match', { userLocation: {
                id: 'USER_ID_CONNECTING_HERE',
                location: userLocation
            }});
            
            // this.socket.emit('connection', { data: 'Sami Joined!'});
        })

        this.socket.on('paired', (data) => {

            console.log('CONNECT TO: ', data)
        })

        this.socket.on('connect_error', (err) => {
            console.log(err)
        })

        this.socket.on('disconnect', () => {
            console.log("Disconnected Socket!")
        })

        client.on(Voximplant.ClientEvents.IncomingCall, this._incomingCall);

        this.makeCall();
    }

    shouldComponentUpdate(nextProps, nextState){

        console.log('NEXT PROPS', nextProps);
        console.log('NEXT STATE', nextState);
        if(this.state.localVideoStreamId !== nextState){
            return true
        }

        return false;
    }

    componentWillUnmount() {

        console.log('component unmounted');

        this.callEvent = null;
        this.callId = null;

        this.setState({
            remoteVideoStreamId: null,
            localVideoStreamId: null,
            isVideoSent: false,
        });
        // this.props.navigation.navigate('Home');

        console.log(this.props.navigation);
        // this.props.navigation.navigate('Home');
        this.props.navigation.goBack();

        // console.log(client);

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

        /* @TODO
        *  replace .call("testuser1" ...) method with paramter from makeCall function 
        */

        // create and start a call
        let call = await client.call("5d915fbd0cdd879740ee097f", callSettings);
        // let call = await client.call("testuser1", callSettings);

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

    async endCall() {
        console.log('Hang Up!');
        this.callEvent.hangup();
    }

    removeCall(call) {
        console.log(`CallManager: removeCall: ${call.callId}`);
        if (this.callEvent && (this.callEvent.callId === call.callId)) {
            this.componentWillUnmount();
        } else if (this.call) {
            console.warn('CallManager: removeCall: call id mismatch');
        }
    }

    _onInfoRecieved(event) {
        console.log('_onInfoRecieved', event);
    }

    _onInfoUpdated(event) {
        console.log('_onInfoUpdated', event);
    }

    async _onCallConnected(event) {
        console.log('_onCallConnected', event)
    }

    _onCallDisconnected(event) {
        console.log('_onCallDisconnected', event);
        this.removeCall(event.call);
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
        // console.log('_onRemoteVideoAdded', event);
        this.setState({ remoteVideoStreamId: event.videoStream.id });
    }

    _onRemoteVideoStreamAdded(event){
        // console.log('_onRemoteVideoStreamAdded', event);
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

        // if (!this.state.remoteVideoStreamId) {
        //     return (<Spinner style={{ marginTop: 315 }} color='#1C1F29' />);
        // }

        return (
            <Container style={{ backgroundColor: 'white' }}>
                {/* <LinearGradient colors={['#EC0000', '#FFC900', '#FFF' ]} style={styles.linearGradient}> */}
                    {/* // <Content> */}
                        <View style={styles.view}>
                
                            
                            <Voximplant.VideoView
                                style={styles.videoStylesLocal}
                                videoStreamId={this.state.localVideoStreamId}
                                showOnTop={true}
                                scaleType={Voximplant.RenderScaleType.SCALE_FIT} />
                            {this.state.isVideoSent ? (
                                <React.Fragment>
                                    <Voximplant.VideoView
                                        style={styles.videoStyles}
                                        videoStreamId={this.state.remoteVideoStreamId}
                                        scaleType={Voximplant.RenderScaleType.SCALE_FILL} />
                                </React.Fragment>
                             ) : null}    

                        </View>
                    <Footer>
                        <FooterTab>
                            <Button onPress={this.endCall} style={styles.btnAction} full>
                                <Text style={styles.btnActionText}>NEXT</Text>
                                </Button>
                            </FooterTab>
                    </Footer>
                    {/* // </Content> */}
                {/* </LinearGradient> */}
            </Container>
        );
    }
}

// Later on in your styles..


export default ChatScreen;


// // <Container style={{ backgroundColor: 'white' }}>
// {/* <LinearGradient colors={['#EC0000', '#FFC900', this.state.bgColor ]} style={styles.linearGradient}> */ }
// <Content>
//     <View style={styles.view}>
//         {/* <Text style={{ color: "white", fontSize: 24, marginTop: 315 }}>{this.state.timer}</Text> */}
//         {/* <Spinner style={{ marginTop: 315 }} color='white' /> */}

//         <Voximplant.VideoView
//             style={styles.videoStylesLocal}
//             videoStreamId={this.state.localVideoStreamId}
//             showOnTop={true}
//             scaleType={Voximplant.RenderScaleType.SCALE_FIT} />
//         {this.state.isVideoSent ? (
//             <Voximplant.VideoView
//                 style={styles.videoStyles}
//                 videoStreamId={this.state.remoteVideoStreamId}
//                 scaleType={Voximplant.RenderScaleType.SCALE_FIT} />
//         ) : null}

//     </View>
// </Content>
// {/* </LinearGradient> */ }
//             </Container >