import React, { Component } from 'react';
import {  ActivityIndicator, BackHandler, StatusBar, Dimensions, Platform, ScrollView, StyleSheet, View, TextInput, Image, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { Container, Header, Left, Body, Right, Content, Card, CardItem, Text, Title, Item, Label, Toast, Icon } from 'native-base';
import LoginService from '../../../services/LoginService/LoginService';
// import { LAT, LONG, LOC_ERROR } from '../../../Utility/GeoLocation';
import { ActivityIndicatorUtility } from '../../../Utility/ActivityIndicatorUtility';
import OfflineNotice from '../../../Utility/OfflineNotice';
import Loader from '../../../Utility/Loader';
import * as utilities from '../../../Utility/utilities';
import * as app from '../../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class InstituteLoginScreen extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			isConnected: true,
			username: '',
			password: '',
			borderBottomColorPassword: '#757575',
			borderBottomColorUserName: '#757575',
			loading: false,
			loaderText: 'Logging in...',
		};
	}

	componentWillMount() {
		this.setState({ isConnected: app.ISNETCONNECTED });
	}

	componentDidMount() {
		BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
		this._showNetErrMsg();
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
	}

	handleBackPress = () => {
		this.setState({ loading: false });
		this.props.navigation.navigate('HomeScreen');
		return true;
	}

	_showNetErrMsg() {
		if (!app.ISNETCONNECTED) {
			utilities.showToastMsg('No network available! Please check the connectivity settings and try again.');
		}
	}

	closeActivityIndicator() {
		setTimeout(() => {
			this.setState({ animating: false, loading: false });
		});
	}

	validateUserName() {
		let lUserName = this.state.username;
		let res = utilities.checkSpecialChar(lUserName);
		return res;
	}

	callForAPI = async () => {
		this.setState({ loading: true });
		let lUserName = this.state.username;
		let lPassword = this.state.password;
		let lDeviceType = Platform.OS;
		// let lat = LAT; // this.state.latitude;
		// let long = LONG; //this.state.longitude;
		// console.log('lat : ' + LAT);
		const formData = new FormData();
		formData.append('institute_username', lUserName);
		formData.append('password', lPassword);

		console.log(formData);
		console.log(formData);
		var lUrl = app.URL + 'institute-login';
		console.log(lUrl);
		fetch(lUrl, {
			method: 'POST',
			headers: app.HEADER,
			body: formData,
		}).then(res => {
			res.json().then(response => {
				this.setState({ loading: false });
				console.log(response);

				if (response.status === 400) {
					utilities.showToastMsg(response.message);
				} else if (response.status === 200) {
					utilities.showToastMsg(response.message);
					response.data.access_token = res.headers.map.accesstoken
					response.data.loginedBy = "Institute";
					AsyncStorage.setItem('USERDATA', JSON.stringify(response.data));
					this.props.navigation.navigate('InstituteMainScreen');
				} else {
					utilities.showToastMsg(response.message);
				}
			})
		}).catch((err) => {
			this.setState({ loading: false });
			utilities.showToastMsg(err);
			console.log(err);

		})
		// var loginApiObj = new LoginService();

		// this.setState({ loading: true });

		// await loginApiObj.instituteLogin(formData);
		// var lResponseData = loginApiObj.getRespData();
		// this.closeActivityIndicator();
		// ;
		// console.log(lResponseData);
		// if (!lResponseData) {
		// 	utilities.showToastMsg('Something went wrong. Please try again later');
		// } else if (lResponseData.status == "false") {
		// 	//	output JSON = {"status":"false","message":"User not found!"}
		// 	utilities.showToastMsg('Wrong login credentials! Please check and try again');
		// } else if (lResponseData.status == '1') {
		// 	utilities.showToastMsg('Login as institute successful');
		// 	try {
		// 		await AsyncStorage.setItem('USERDATA', JSON.stringify(lResponseData));
		// 		this.props.navigation.navigate('InstituteMainScreen');
		// 	} catch (error) {
		// 		console.warn(error);
		// 	}
		// } else {
		// 	utilities.showToastMsg('Something went wrong. Please try again later');
		// }
	}

	_onPressButton() {
		let lUserName = this.state.username;
		let lPassword = this.state.password;
		var isValidUName = '';
		var isValidPassword = '';
		if (lUserName == '' && lPassword == '') {
			// this.showToastMsg('Enter user name');
			utilities.showToastMsg('Enter user name & password');
		}
		else if (lUserName == '') {
			// this.showToastMsg('Enter user name');
			utilities.showToastMsg('Enter user name');
		}
		else if (lPassword == '') {
			// this.showToastMsg('Enter password');
			utilities.showToastMsg('Enter password');
		} else if (lUserName && lPassword) {
			isValidUName = this.validateUserName();
			if (isValidUName) {
				this.callForAPI();
			} else {
				utilities.showToastMsg('Wrong login credentials! Please check and try again');
			}
		} else {
			alert('Server error');
		}
	}

	_showHeader() {
		if (Platform.OS == 'ios') {
			return (
				<Header style={{ backgroundColor: '#434e7c' }}>
					<Left style={{ flex: 0.1 }}>
						<TouchableOpacity onPress={() => this.props.navigation.navigate('HomeScreen')}>
							<Icon type="FontAwesome" name="long-arrow-left" style={{ fontSize: 25, color: '#FFFFFF', paddingLeft: 10, paddingRight: 10 }} />
						</TouchableOpacity>
					</Left>
					<Body style={{ flex: 0.9 }}>
						<Title style={{ color: '#FFFFFF' }}>{app.title}</Title>
					</Body>

				</Header>
			)
		} else {
			return (
				<Header style={{ backgroundColor: '#434e7c' }}>
					<Left style={{ flex: 0.1 }}>
						<TouchableOpacity onPress={() => this.props.navigation.navigate('HomeScreen')}>
							<Icon type="FontAwesome" name="long-arrow-left" style={{ fontSize: 25, color: '#FFFFFF', paddingLeft: 10, paddingRight: 10 }} />
						</TouchableOpacity>
					</Left>
					<Body style={{ flex: 0.9, alignItems: 'center' }}>
						<Title style={{ color: '#FFFFFF', fontSize: 16 }}>{app.title}</Title>
					</Body>

				</Header>
			)
		}
	}

	render() {
	return (
		<View style={styles.container}>
			<StatusBar backgroundColor="#434e7c" barStyle="light-content" />
			{this._showHeader()}
			<OfflineNotice />
			<Loader loading={this.state.loading} text={this.state.loaderText} />

			<ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
				<View style={styles.cardContainer}>
					<Text style={styles.loginTitle}>Institute Login</Text>

					<View style={styles.inputWrapper}>
						<TextInput
							style={[styles.input, { borderBottomColor: this.state.borderBottomColorUserName }]}
							placeholder="Username"
							placeholderTextColor="#999"
							onFocus={() => this.setState({ borderBottomColorUserName: '#434e7c' })}
							onBlur={() => {
								this.setState({ borderBottomColorUserName: '#757575' });
								this.validateUserName();
							}}
							onChangeText={(username) => this.setState({ username })}
						/>

						<TextInput
							style={[styles.input, { borderBottomColor: this.state.borderBottomColorPassword }]}
							placeholder="Password"
							placeholderTextColor="#999"
							secureTextEntry
							onFocus={() => this.setState({ borderBottomColorPassword: '#434e7c' })}
							onBlur={() => this.setState({ borderBottomColorPassword: '#757575' })}
							onChangeText={(password) => this.setState({ password })}
						/>
					</View>

					<TouchableOpacity style={styles.loginButton} onPress={() => this._onPressButton()}>
						<Text style={styles.loginButtonText}>LOGIN</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</View>
	);
}

};


const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f9f9f9',
	},

	scrollContainer: {
		flexGrow: 1,
		justifyContent: 'center',
		padding: 20,
	},

	cardContainer: {
		backgroundColor: '#fff',
		padding: 20,
		borderRadius: 12,
		elevation: 4,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
	},

	loginTitle: {
		fontSize: 22,
		fontWeight: '600',
		color: '#434e7c',
		marginBottom: 25,
		textAlign: 'center',
	},

	inputWrapper: {
		marginBottom: 30,
	},

	input: {
		height: 50,
		borderBottomWidth: 1.5,
		marginBottom: 20,
		fontSize: 16,
		color: '#333',
	},

	loginButton: {
		backgroundColor: '#434e7c',
		borderRadius: 8,
		paddingVertical: 12,
		alignItems: 'center',
	},

	loginButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
});

