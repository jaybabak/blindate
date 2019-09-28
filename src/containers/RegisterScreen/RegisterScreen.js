import React, { Component } from 'react';
import { Animated, Alert, Platform, StyleSheet, View, DeviceEventEmitter } from 'react-native';
import { Container, Content, Header, Left, Body, Right, Title, Button, Icon, Text, Spinner, Footer, FooterTab, Item, Input, Toast } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import loginManager from '../../util/loginManager';
import styles from './styles.js';

class RegisterScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            avatar: 'https://i.ibb.co/7J4pNLr/profilephoto.png',
            name: '',
            lastName: '',
            password: '',
            email: '',
            mobileNumber: '',
            status: 'OFFLINE',
            location: {
                type: 'Point',
                coordinates: [0,0]
            },
            errors: {}
        }

        this.goBack = this.goBack.bind(this);
        this.changeField = this.changeField.bind(this);
        this.submitRegistrationForm = this.submitRegistrationForm.bind(this);
    }

    componentDidMount() {
        console.log('register screen')
    }

    goBack(){
        this.props.navigation.goBack();
    }

    async submitRegistrationForm(){

        var form = await loginManager.validateUser(this.state);

        this.setState({
            errors: form
        })

        /*
        * FORM FAILED
        */
        if(form.success == false){
            //alert message for user if errors with form
            Alert.alert(
                    'Please check credentials!',
                    'Review the registration form.',
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
            return;
        }

        const formResult = await loginManager.addUser(this.state, this);


        /*
        * USER EMAIL IS NOT UNIQUE
        */

        if(formResult.data.success == true){
            Alert.alert(
                'Successfully Signed up!.',
                'Proceed to login form now.',
                [
                {
                    text: 'Cancel',
                    onPress: () => this.props.navigation.navigate('Home'),
                    style: 'cancel',
                },
                { text: 'OK', onPress: () => this.props.navigation.navigate('Home') },
                ],
                { cancelable: false },
            );
        }

        /*
        * USER EMAIL IS NOT UNIQUE
        */

        if(formResult.data.message.code == 11000){
            Alert.alert(
                'Sorry that email is taken.',
                'Try a differnt email address.',
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
        }


    }

    changeField(e, ref){
        var state = {};
        state[e] = ref;
        this.setState(state);
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
                <LinearGradient colors={['#FFFFFF', '#FFFFFF', '#E6E6E6']} style={styles.linearGradient}>
                    {/* <Content> */}
                        <View style={styles.view}>
                            <View style={styles.container}>
                                <Item error={this.state.errors.name ? true : false} style={styles.formWrapper}>
                                    <Input
                                        style={styles.formItem}
                                        autoCapitalize='none'
                                        placeholder='First name'
                                        onChangeText={(value) => this.changeField('name', value)} 
                                    />
                                </Item>
                                <Item error={this.state.errors.lastName ? true : false} style={styles.formWrapper}>
                                    <Input
                                        style={styles.formItem}
                                        autoCapitalize='none'
                                        placeholder='Last name'
                                        onChangeText={(value) => this.changeField('lastName', value)} 
                                    />
                                </Item>
                                <Item error={this.state.errors.email ? true : false} style={styles.formWrapper}>
                                    <Input
                                        style={styles.formItem}
                                        autoCapitalize='none'
                                        placeholder='Email address'
                                        onChangeText={(value) => this.changeField('email', value)} 
                                    />
                                </Item>
                                <Item error={this.state.errors.password ? true : false} style={styles.formWrapper}>
                                    <Input
                                        style={styles.formItem}
                                        secureTextEntry={true}
                                        placeholder='Password'
                                        onChangeText={(value) => this.changeField('password', value)} 
                                    />
                                </Item>
                                <Item error={this.state.errors.mobileNumber ? true : false} style={styles.formWrapper}>
                                    <Input
                                        style={styles.formItem}
                                        placeholder='01-514-239-3439'
                                        onChangeText={(value) => this.changeField('mobileNumber', value)} 
                                    />
                                </Item>
                                <Button style={styles.buttonSubmitBtn} block onPress={this.submitRegistrationForm}>
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