import React, { Component } from 'react';
import { Alert, StatusBar, BackHandler, Dimensions, Platform, Button, StyleSheet, View, TextInput, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Container, Header, Left, Body, Right, Content, Card, CardItem, Text, Title, Item, Label, Toast } from 'native-base';
import LoginService from '../../../services/LoginService/LoginService';
import Icon from 'react-native-vector-icons/FontAwesome';
// import { LAT, LONG, LOC_ERROR } from '../../../Utility/GeoLocation';
import OfflineNotice from '../../../Utility/OfflineNotice';
import Loader from '../../../Utility/Loader';
import * as utilities from '../../../Utility/utilities';
import * as app from '../../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from "react-native-modal";
import { Col, Grid } from "react-native-easy-grid";

export default class VerifierLoginScreen extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			username: '',
			password: '',
			borderBottomColorPassword: '#757575',
			borderBottomColorUserName: '#757575',
			loading: false,
			loaderText: 'Logging in...',
			modalVisible: false,
			isModalVisible: false,
			isForgot: false,
		};
	}

	toggleModal = () => {
		this.setState({ isModalVisible: !this.state.isModalVisible });
	};

	componentDidMount() {
		console.log(this.props);
		BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
	}

	handleBackPress = () => {
		this.props.navigation.navigate('HomeScreen');
		return true;
	}

	setModalVisible(visible) { this.setState({ modalVisible: visible }); 
	console.log("Modal")}
	showToastMsg = (msg) => {
		Toast.show({
			text: msg,
			style: { position: 'absolute', bottom: 10, left: 10, right: 10, borderRadius: 5, margin: 20 }
		});
	}

	forgotPasswordApi = () => {
		this.setState({ loading: true })
		console.log("clicked===");
		if (!this.state.email_id) {
			this.setState({ loading: false })
			utilities.showToastMsg('Email cannot be empty.')
			return;
		} else if (utilities.checkEmail(this.state.email_id)) {
			this.setState({ email_idError: '' })
			const formData = new FormData();
			formData.append('type', 'forgotPassword');
			formData.append('email_id', this.state.email_id);
			formData.append('user_type', 1);
			console.log(formData);
			fetch(`${app.URL}passwordReset`, {
				method: 'POST',
				headers: {
					'Content-Type': 'multipart\/form-data',
					'Accept': 'application/json',
					'apikey': app.HEADER.apikey,
				},
				body: formData,
			}).then(res => res.json())
				.then(response => {
					this.setState({ loading: false })
					console.log(response);
					if (response.status == 200) {
						// this.toggleModal();
						this.setState({modalVisible: false});
						utilities.showToastMsg(response.message);
						this.props.navigation.navigate('VerifierLoginScreen');
					} else if (response.status == 409) { utilities.showToastMsg(response.message); }
					else if (response.status == 422) { utilities.showToastMsg(response.message); }
					else if (response.status == 400) { utilities.showToastMsg(response.message); }
					else if (response.status == 403) { utilities.showToastMsg(response.message); this.props.navigation.navigate('VerifierLoginScreen') }
					else if (response.status == 405) { utilities.showToastMsg(response.message); }
					else if (response.status == 500) { utilities.showToastMsg(response.message); }
				})
				.catch(error => {
					this.setState({ loading: false })
					console.log(error);
				});
		} else {
			this.setState({ loading: false })
			this.setState({ email_idError: 'Email is not proper.' })
		}
	}

	async closeActivityIndicator() {
		await setTimeout(() => {
			this.setState({ animating: false, loading: false });
		});
	}

	validateUserName() {
		let lUserName = this.state.username;
		let res = utilities.checkSpecialChar(lUserName);
		return res;
	}

	async callForAPI() {
		let lUserName = this.state.username;
		let lPassword = this.state.password;
		let lDeviceType = Platform.OS;
		// console.log('lat : ' + LAT);
		const formData = new FormData();
		formData.append('username', lUserName);
		formData.append('password', lPassword);
		// formData.append('device_type', lDeviceType);
		// formData.append('lat', this.props.navigation.state.params.LAT);
		// formData.append('long', this.props.navigation.state.params.LONG);
		console.log(formData);

		var loginApiObj = new LoginService();

		this.setState({ loading: true });
		await loginApiObj.doLogin(formData);
		var lResponseData = await loginApiObj.getRespData();
		console.log(lResponseData);

		if (lResponseData.status == 200) {
			this.closeActivityIndicator();
			lResponseData.data.loginedBy = "Verifier";
			await AsyncStorage.setItem('USERDATA', JSON.stringify(lResponseData.data));
			this.props.navigation.navigate('VerifierMainScreen');
		} else if (lResponseData.status == 402) {
			this.closeActivityIndicator();
			utilities.showToastMsg(lResponseData.message)
		} else if (lResponseData.status === 400) {
			utilities.showToastMsg(lResponseData.message)
			this.closeActivityIndicator();
		} else {
			utilities.showToastMsg(lResponseData.message)
			this.closeActivityIndicator();
		}

		// if (!lResponseData) {
		// 	this.closeActivityIndicator();
		// 	utilities.showToastMsg('Something went wrong. Please try again later');
		// }
		// else if (lResponseData.status == "false") {
		// 	this.closeActivityIndicator();
		// 	utilities.showToastMsg('Wrong login credentials! Please check and try again');
		// }
		// else if (lResponseData.is_verified == '0' && lResponseData.status == '0') {

		// 	setTimeout(() => {
		// 		Alert.alert(
		// 			'Verify email id',
		// 			'Verify email id and login again to SeQR scan',
		// 			[
		// 				{ text: 'OK' },
		// 			],
		// 			{ cancelable: false }
		// 		);
		// 	})
		// }
		// else if (lResponseData.status == '1') {
		// 	this.closeActivityIndicator();
		// 	utilities.showToastMsg('Login as verifier successful');
		// 	try {
		// 		await AsyncStorage.setItem('USERDATA', JSON.stringify(lResponseData));
		// 		this.props.navigation.navigate('VerifierMainScreen');
		// 	} catch (error) {
		// 		console.log(error);
		// 	}
		// } else {
		// 	this.closeActivityIndicator();
		// 	utilities.showToastMsg('Something went wrong. Please try again later');
		// }
	}

	async _onPressButton() {
		// alert(app.ISNETCONNECTED);
		let lUserName = this.state.username;
		let lPassword = this.state.password;
		var isValidUName = '';
		var isValidPassword = '';
		if (lUserName == '' && lPassword == '') {
			utilities.showToastMsg('Enter user name & password');
			return;
		}
		else if (lUserName == '') {
			utilities.showToastMsg('Enter user name');
			return;
		} else if (lPassword == '') {
			utilities.showToastMsg('Enter password');
		}
		else if (lUserName && lPassword) {
			isValidUName = await this.validateUserName();
			if (isValidUName) {
				this.callForAPI();
			} else {
				utilities.showToastMsg('Wrong login credentials! Please check and try again');
			}
		} else {
			alert('Server error');
		}
	}

	_showOffline() {
		if (!app.ISNETCONNECTED) {
			return (
				<OfflineNotice />
			)
		}
	}

	_showHeader() {
		if (Platform.OS == 'ios') {
			return (
				<Header style={{ backgroundColor: '#b8b200' }}>
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
				<Header style={{ backgroundColor: '#b8b200' }}>
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
			{this._showHeader()}
			<OfflineNotice />
			<StatusBar barStyle="light-content" />

			<Loader loading={this.state.loading} text={this.state.loaderText} />

			<View style={styles.innerContainer}>
				<Card style={styles.card}>
					<CardItem header style={styles.cardHeader}>
						<Text style={styles.cardTitle}>Verifier Login</Text>
					</CardItem>

					<View style={styles.inputSection}>
						<TextInput
							style={[styles.input, { borderBottomColor: this.state.borderBottomColorUserName }]}
							placeholder='Username'
							placeholderTextColor='#999'
							onFocus={() => this.setState({ borderBottomColorUserName: '#b8b200' })}
							onBlur={() => this.setState({ borderBottomColorUserName: '#ccc' })}
							onChangeText={(username) => this.setState({ username })}
						/>

						<TextInput
							style={[styles.input, { borderBottomColor: this.state.borderBottomColorPassword }]}
							placeholder='Password'
							placeholderTextColor='#999'
							secureTextEntry={true}
							onFocus={() => this.setState({ borderBottomColorPassword: '#b8b200' })}
							onBlur={() => this.setState({ borderBottomColorPassword: '#ccc' })}
							onChangeText={(password) => this.setState({ password })}
						/>
					</View>

					<TouchableOpacity onPress={() => this._onPressButton()} style={styles.loginButton}>
						<Text style={styles.loginButtonText}>LOGIN</Text>
					</TouchableOpacity>

					<View style={styles.linksContainer}>
						<TouchableOpacity onPress={() => this.setModalVisible(true)}>
							<Text style={styles.linkText}>Forgot Password?</Text>
						</TouchableOpacity>

						<TouchableOpacity onPress={() => this.props.navigation.navigate('SignUpScreen')}>
							<Text style={styles.linkText}>Sign Up</Text>
						</TouchableOpacity>
					</View>
				</Card>
			</View>

			<Modal isVisible={this.state.modalVisible}>
				<View style={styles.modalContent}>
					<View style={styles.modalHeader}>
						<Text style={styles.modalTitle}>Reset Password</Text>
						<TouchableOpacity onPress={() => this.setModalVisible(false)}>
							<Icon name="times" size={20} color="black" />
						</TouchableOpacity>
					</View>

					<Text style={styles.modalText}>Enter your registered email:</Text>
					<TextInput
						style={styles.modalInput}
						placeholder="Email"
						placeholderTextColor="#999"
						onChangeText={(email_id) => this.setState({ email_id })}
					/>
					{this.state.email_idError ? (
						<Text style={styles.errorText}>{this.state.email_idError}</Text>
					) : null}

					<Button
						title="Submit"
						disabled={!this.state.email_id}
						onPress={this.forgotPasswordApi}
						color="#b8b200"
					/>
				</View>
			</Modal>
		</View>
	);
}


};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},
	innerContainer: {
		flex: 1,
		justifyContent: 'center',
		paddingHorizontal: 20,
	},
	card: {
		borderRadius: 12,
		padding: 20,
		elevation: 5,
		backgroundColor: '#fff',
	},
	cardHeader: {
		// flex: 1,
	justifyContent: 'center',
	alignItems: 'center',
	borderBottomWidth: 1,
	borderBottomColor: '#ddd',
	paddingBottom: 10,
	fontWeight:'bold'
	},
	cardTitle: {
		fontSize: 20,
	fontWeight: '600',
	color: '#b8b200',
	textAlign: 'center',
	},
	inputSection: {
		marginTop: 20,
	},
	input: {
		borderBottomWidth: 1,
		fontSize: 16,
		color: '#333',
		paddingVertical: 10,
		marginBottom: 25,
	},
	loginButton: {
		backgroundColor: '#b8b200',
		paddingVertical: 12,
		borderRadius: 6,
		alignItems: 'center',
		marginTop: 10,
	},
	loginButtonText: {
		color: '#fff',
		fontWeight: '600',
		fontSize: 16,
	},
	linksContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 20,
	},
	linkText: {
		color: '#1e88e5',
		fontSize: 14,
	},
	modalContent: {
		backgroundColor: '#fff',
		borderRadius: 10,
		padding: 20,
	},
	modalHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 15,
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: '600',
	},
	modalText: {
		fontSize: 14,
		marginBottom: 10,
		color: '#444',
	},
	modalInput: {
		borderBottomWidth: 1,
		borderBottomColor: '#ccc',
		fontSize: 16,
		marginBottom: 15,
		color: '#000',
	},
	errorText: {
		color: 'red',
		marginBottom: 10,
		fontSize: 13,
	},
});


