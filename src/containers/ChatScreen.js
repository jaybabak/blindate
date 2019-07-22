import React, { Component } from 'react';
import { Animated, Alert, Platform, StyleSheet, Text, View } from 'react-native';
import { Container, Content, Header, Left, Body, Right, Title, Button, Icon, } from 'native-base';
import { createStackNavigator, createAppContainer, createBottomTabNavigator } from "react-navigation";

class ChatScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timer: 5,
            bgColor: '#8CC6FF'
        }
        this.tick = this.tick.bind(this);
    }

    componentDidMount() {

        const timerz = setInterval(() => {
            this.tick()
            if (this.state.timer == 0) {
                clearTimeout(timerz);
                this.setState({ bgColor: 'black', timer: '...' });
            }
        }, 1000)
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
                    </View>
                </Content>
            </Container>
        );
    }
}

export default ChatScreen;