import React, { Component } from 'react';
import { Animated, Alert, Platform, StyleSheet, View, DeviceEventEmitter } from 'react-native';
import { Container, Content, Header, Left, Body, Right, Title, Button, Icon, Text, Spinner, Footer, FooterTab, Item, Input } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles.js';

class RegisterScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }

        this.goBack = this.goBack.bind(this);
    }

    componentDidMount() {
        console.log('register screen')
    }

    goBack(){
        this.props.navigation.goBack();
    }

    render() {

        return (
            <Container style={{ backgroundColor: 'white' }}>
                <Header noLeft>
                    <Left>
                        <Button transparent
                            onPress={this.goBack}
                        >
                            <Icon
                                style={styles.iconQuestion}
                                type="FontAwesome"
                                name="arrow-left" />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Register</Title>
                    </Body> 
                    <Right>
        
                    </Right>
                </Header>
                <LinearGradient colors={['#E6E6E6', '#FFFFFF', '#E2E2E2']} style={styles.linearGradient}>
                    {/* <Content> */}
                        <View style={styles.view}>
                            <View style={styles.container}>
                                <Item regular style={styles.formWrapper}>
                                    <Input
                                        style={styles.formItem}
                                        autoCapitalize='none'
                                        placeholder='First name'
                                        onChangeText={this.changeUsername}
                                    />
                                </Item>
                                <Item regular style={styles.formWrapper}>
                                    <Input
                                        style={styles.formItem}
                                        autoCapitalize='none'
                                        placeholder='Last name'
                                        onChangeText={this.changeUsername}
                                    />
                                </Item>
                                <Item regular style={styles.formWrapper}>
                                    <Input
                                        style={styles.formItem}
                                        autoCapitalize='none'
                                        placeholder='Email address'
                                        onChangeText={this.changeUsername}
                                    />
                                </Item>
                                <Item regular style={styles.formWrapper}>
                                    <Input
                                        style={styles.formItem}
                                        secureTextEntry={true}
                                        placeholder='Password'
                                        onChangeText={this.changePassword}
                                    />
                                </Item>
                                <Item regular style={styles.formWrapper}>
                                    <Input
                                        style={styles.formItem}
                                        secureTextEntry={true}
                                        placeholder='Phone number'
                                        onChangeText={this.changePassword}
                                    />
                                </Item>
                                <Button style={styles.buttonSubmitBtn} block onPress={this.navigateToRegisterScreen}>
                                    <Text style={styles.buttonSubmit}>Sign Up</Text>
                                </Button>
                            </View>

                        </View>
                    {/* <Footer>
                        <FooterTab>
                            <Button style={styles.btnAction} full>
                                <Text style={styles.btnActionText}>Register Now</Text>
                                </Button>
                            </FooterTab>
                    </Footer> */}
                    {/* </Content> */}
                </LinearGradient>
            </Container>
        );
    }
}

// Later on in your styles..
export default RegisterScreen;