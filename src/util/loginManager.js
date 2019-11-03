import { Alert } from 'react-native';
import { Voximplant } from 'react-native-voximplant';
import AsyncStorage from '@react-native-community/async-storage';
import isEmpty from 'validator/lib/isEmpty';
import isEmail from 'validator/lib/isEmail';
import isByteLength from 'validator/lib/isByteLength';
import isLength from 'validator/lib/isLength';
import isAlpha from 'validator/lib/isAlpha';
import isMobilePhone from 'validator/lib/isMobilePhone';
const axios = require('axios');

const dev = 'http://localhost:3000';
const prod = 'http://darpa.monster';

/**
 * LOGIN TO VOX API/SDK [DEFAULT] - Registers the user and creates a new user in the database
 * @param {string} client The current voximplant instance
 * @param {string} that The current state object from the higher order component (App.js?)
 */
const loginVox = async function(client, that) {
	try {
		//destroy any existing voximplant session that might have been hanging around
		await client.disconnect();
		//Grabs the current client state (If disconnected than connect to voximplant service)
		let state = await client.getClientState();
		if (state === Voximplant.ClientState.DISCONNECTED) {
			await client.connect();
		}

		//Login to voximplant service
		let authResult = await client.login(
			`${that.state.user._id}@hookie.janu101.voximplant.com`,
			`${that.state.user._id}`
		);

		//If successful login to voximplant service than proceed to set the accesstoken, refresh etc..
		const accessToken = ['@access_token', authResult.tokens.accessToken];
		const accessExpire = ['@access_expire', authResult.tokens.accessExpire];
		const refreshExpire = [
			'@refresh_expire',
			authResult.tokens.refreshExpire
		];
		const refreshToken = ['@refresh_token', authResult.tokens.refreshToken];
		const userName = ['@id', that.state.user._id];

		//Asyncronoushly set all the above values to the AsyncStorage
		await AsyncStorage.multiSet([
			accessToken,
			accessExpire,
			refreshExpire,
			refreshToken,
			userName
		]);

		//Update the state and the UI to show the authenticated screens
		that.setState({
			tokens: true
		});

		return true;
	} catch (e) {
		//Console and alert the error message if something goes wrong
		console.log(e.name + e.message);
		console.log(e);

		Alert.alert(
			'Oops!',
			'Error connecting to the P2P service provider. Please try again later.',
			[
				{
					text: 'Cancel',
					onPress: () => console.log('Cancel Pressed'),
					style: 'cancel'
				},
				{ text: 'OK', onPress: () => console.log('OK Pressed') }
			],
			{ cancelable: false }
		);

		that.setState({
			authenticated: false,
			isReady: true
		});

		return false;
	}
};

/**
 * LOGIN TO THE VOXIMPLANT API [BASIC]- Registers the user and creates a new user in the database
 * @param {string} client The current voximplant instance
 * @param {string} that The current state object from the higher order component (App.js?)
 */
const loginVoxBasic = async function(client, that) {
	try {
		//destroy any existing voximplant session that might have been hanging around
		await client.disconnect();
		//Grabs the current client state (If disconnected than connect to voximplant service)
		let state = await client.getClientState();
		if (state === Voximplant.ClientState.DISCONNECTED) {
			await client.connect();
		}

		//Grabs the user ID since it's the voximplant username
		const username = await AsyncStorage.getItem('@id');

		//Login to voximplant
		let authResult = await client.login(
			`${username}@hookie.janu101.voximplant.com`,
			`${username}`
		);

		//If successful login to voximplant service than proceed to set the accesstoken, refresh etc..
		const accessToken = ['@access_token', authResult.tokens.accessToken];
		const accessExpire = ['@access_expire', authResult.tokens.accessExpire];
		const refreshExpire = [
			'@refresh_expire',
			authResult.tokens.refreshExpire
		];
		const refreshToken = ['@refresh_token', authResult.tokens.refreshToken];

		//Asyncronoushly set all the above values to the AsyncStorage
		await AsyncStorage.multiSet([
			accessToken,
			accessExpire,
			refreshExpire,
			refreshToken
		]);

		//Update the state and the UI to show the authenticated screens
		that.setState({
			tokens: true,
			authenticated: true,
			isReady: true
		});

		return true;
	} catch (e) {
		console.log(e.name + e.message);
		console.log(e);

		Alert.alert(
			'Oops!',
			'Error connecting to the server. Please try again later.',
			[
				{
					text: 'Cancel',
					onPress: () => console.log('Cancel Pressed'),
					style: 'cancel'
				},
				{ text: 'OK', onPress: () => console.log('OK Pressed') }
			],
			{ cancelable: false }
		);

		that.setState({
			authenticated: false,
			isReady: true
		});

		return false;
	}
};

/**
 * CREATE USER METHOD - Registers the user and creates a new user in the database
 * @param {string} user This is the user object being passed
 */
const addUser = async function(user) {
	console.log(user);
	var submitUserForm;
	try {
		//HTTP Request object
		const settings = {
			method: 'post',
			url: 'http://localhost:3000/register-user',
			data: {
				user
			}
		};
		//Make the requst
		submitUserForm = await axios(settings);
		//Return the user object returned from server along with the access token
		return submitUserForm;
	} catch (e) {
		console.log(e);
	}
};

/**
 * AUTHENTICATED USER ROUTE - Grabs current user and all non-sensitive fields
 * @param {string} accesstoken Pass a valid accesstokent to retieve the current user
 */
const getUser = async function(accessToken) {
	//HTTP Request object
	const settings = {
		headers: { Authorization: `Bearer ${accessToken}` },
		method: 'get',
		url: 'http://localhost:3000/api/find-match'
	};

	//Make the requst
	const submitGetUser = await axios(settings);
	//Return the user object returned from server
	return submitGetUser;
};

/**
 * VALIDATE REGISTRATION FORM - Validates the user fields such as email, password, number etc..
 * @param {string} user This is the user object being passed to the validate function
 */
const validateUser = async function(user) {
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
		console.log('incorrect email');
		errors.email = true;
		errors.success = false;
	}

	//Password Validation
	if (
		isEmpty(user.password) ||
		!isLength(user.password, { min: 6, max: 20 })
	) {
		console.log('incorrect password must be between 6 and 20 characters');
		errors.password = true;
		errors.success = false;
	}

	//First Name Validation
	if (
		isEmpty(user.name) ||
		!isAlpha(user.name, 'en-US') ||
		!isLength(user.name, { min: 2, max: 30 })
	) {
		console.log('incorrect first name between 2 and 30');
		errors.name = true;
		errors.success = false;
	}

	//Last Name Validation
	if (
		isEmpty(user.lastName) ||
		!isAlpha(user.lastName, 'en-US') ||
		!isLength(user.lastName, { min: 2, max: 30 })
	) {
		console.log('incorrect last name between 2 and 30');
		errors.lastName = true;
		errors.success = false;
	}

	return errors;
};

/**
 * VALIDATE LOGIN FORM - Validates the user login form
 * @param {string} user This is the user object being passed to the validate function
 */
const validateLoginForm = async function(user) {
	var errors = {
		success: true,
		email: false,
		password: false
	};

	//Email Validation
	if (isEmpty(user.email) || !isEmail(user.email)) {
		console.log('Incorrect email');
		errors.email = true;
		errors.success = false;
	}

	//Password Validation
	if (
		isEmpty(user.password) ||
		!isLength(user.password, { min: 6, max: 20 })
	) {
		console.log('Incorrect password, must be between 6 and 20 characters');
		errors.password = true;
		errors.success = false;
	}

	return errors;
};

/**
 * LOGIN USER METHOD - Logs the user into the app:
 * @param {string} email This is the id/email of the user currently logging in.
 * @param {string} password The users existing password to succesfully login
 * @param {string} that The current state object from the higher order component (App.js?)
 */
const loginUser = async function(email, password, that) {
	//Validate the user email and password fields
	var form = await validateLoginForm(that.state);

	//If form has issues or not successful, notify the user with alert message
	if (!form.success) {
		Alert.alert(
			'Cannot leave blank',
			'Must enter a valid email/password',
			[
				{
					text: 'Cancel',
					onPress: () => console.log('Cancel Pressed'),
					style: 'cancel'
				},
				{ text: 'OK', onPress: () => console.log('OK Pressed') }
			],
			{ cancelable: false }
		);
		return form;
	}

	//HTTP Request object to authenticate user
	const settings = {
		method: 'post',
		url: 'http://localhost:3000/login',
		data: {
			email: email,
			password: password
		}
	};

	//Make the request
	const submitLoginForm = await axios(settings);

	//If successful
	if (submitLoginForm.data.success) {
		//Console if successful login and set the access token recieved from server
		console.log(submitLoginForm);
		try {
			await AsyncStorage.setItem(
				'@app_access_token',
				submitLoginForm.data.accessToken
			);
		} catch (err) {
			console.log(err);
		}

		return submitLoginForm.data;
	} else {
		//Notify if credentials are incorrect
		Alert.alert(
			'Sorry incorrect credentials',
			'Either the user or password did not match with our records, try again.',
			[
				{
					text: 'Cancel',
					onPress: () => console.log('Cancel Pressed'),
					style: 'cancel'
				},
				{ text: 'OK', onPress: () => console.log('OK Pressed') }
			],
			{ cancelable: false }
		);
		return submitLoginForm.data;
	}
};

/**
 * UPDATE USER METHOD - Update the user value input:
 * @param {string} email This is the id/email of the user you would like to update.
 * @param {string} field This is the field that you would like to be updated: location, email, etc...
 * @param {string} value The value that you will like to replace the existing field value with.
 */
const updateUser = async function(email, field, value) {
	try {
		//Must have a valid access-token to ensure client is logged in
		const accessToken = await AsyncStorage.getItem('@app_access_token');

		//HTTP Request object
		const settings = {
			headers: { Authorization: `Bearer ${accessToken}` },
			method: 'post',
			url: 'http://localhost:3000/api/update',
			data: {
				email: email,
				field: field,
				value: value
			}
		};

		//Make the request
		const submitUpdateForm = await axios(settings);
		//Return the data
		return submitUpdateForm.data;
	} catch (err) {
		//Alert the user incase something went wrong
		Alert.alert(
			'Error',
			'Unable to update user location fields longitude and lattitude.',
			[
				{
					text: 'Cancel',
					onPress: () => console.log('Cancel Pressed'),
					style: 'cancel'
				},
				{ text: 'OK', onPress: () => console.log('OK Pressed') }
			],
			{ cancelable: false }
		);

		console.log(err);
	}
};

module.exports.loginVox = loginVox;
module.exports.loginVoxBasic = loginVoxBasic;
module.exports.getUser = getUser;
module.exports.loginUser = loginUser;
module.exports.addUser = addUser;
module.exports.validateUser = validateUser;
module.exports.updateUser = updateUser;
