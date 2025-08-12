import React, { Component } from 'react';
import { Alert, BackHandler, Dimensions, Platform, StyleSheet, View, Image, TouchableOpacity, StatusBar, Linking } from 'react-native';
import { Container, Header, Left, Body, Right, Content, Card, CardItem, Text, Title, Item, Icon, Toast } from 'native-base';
import QRCodeScanner from 'react-native-qrcode-scanner';
import AndroidOpenSettings from 'react-native-android-open-settings';
import InstituteService from '../../../services/InstituteService/InstituteService';
// import Torch from 'react-native-torch';
import CustomHeader from '../../../Utility/CustomHeader';
import Loader from '../../../Utility/Loader';
import OfflineNotice from '../../../Utility/OfflineNotice';
import * as utilities from '../../../Utility/utilities';
import * as app from '../../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class InstituteScanScreen extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			isConnected: true,
			userId: '',
			userName: '',
			flashEnabled: true,
			flash: false,
			loading: false,
			showCamera: true,
			loaderText: 'Scanning...',
			showCameraText: true,
			token: ""
		};
	}

	componentWillMount() {
		this.setState({ isConnected: app.ISNETCONNECTED });
		this._getAsyncData();
	}

	componentDidMount() {
		this.didFocusSubscription = this.props.navigation.addListener(
			'didFocus',
			payload => {
				this.setState({ showCamera: true });
				// this.scanSuccess = true;
			}
		);
		BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
		this._showNetErrMsg();
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
		this.didFocusSubscription.remove();
	}

	handleBackPress = () => {
		this.props.navigation.navigate('InstituteMainScreen');
		return true;
	}

	handleConnectivityChange = isConnected => {
		if (isConnected) {
			this.setState({ isConnected });
		} else {
			this.setState({ isConnected });
			this._showNetErrMsg();
		}
	};

	_openSettings() {
		if (Platform.OS == 'ios') {
			Linking.canOpenURL('app-settings:').then(supported => {
				if (!supported) {
					console.log('Can\'t handle settings url');
				} else {
					return Linking.openURL('app-settings:');
				}
			}).catch(err => console.error('An error occurred', err));
		} else {
			AndroidOpenSettings.generalSettings();
		}
	}

	_showNetErrMsg() {
		if (!this.state.isConnected || !app.ISNETCONNECTED) {
			Alert.alert(
				'No network available',
				'Connect to internet to scan SeQR. Without internet you can only scan non secured public QR codes.',
				[
					{ text: 'SETTINGS', onPress: () => { this._openSettings() } },
					{ text: 'BACK', onPress: () => { this.props.navigation.navigate('InstituteMainScreen') } },
					{ text: 'CONTINUE', onPress: () => { this.setState({ isConnected: false }) } },
				],
				{ cancelable: false }
			)
		}
	}

	closeActivityIndicator() {
		setTimeout(() => {
			this.setState({ loading: false });
		});
	}

	async _getAsyncData() {
		await AsyncStorage.getItem('USERDATA', (err, result) => {		// USERDATA is set on SignUP screen
			var lData = JSON.parse(result);
			console.log("institute scan credentials:",result);
			if (lData) {
				this.setState({ userName: lData.institute_username, userId: lData.id, token: lData.access_token });
			}
		});
	}

	onSuccess(e) {
		this.setState({ showCamera: false });
		this._callForAPI(e);
	}

	async _callForAPI(e) {
		// const formData = new FormData();
		// let lUserName = this.state.userName;
		// let lUserId = this.state.userId;
		// formData.append('key', e.data);
		// formData.append('device_type', Platform.OS);
		// formData.append('scanned_by', lUserName);
		// console.log(formData);
		var someText = e.data.replace(/^\s+|\s+$/g, '');
		console.log(someText);

		var a = someText.indexOf("\n");
		// var b = someText.substr(0, a - 1);
		var b = someText.substr(0, a);

		var c = someText.substr(a + 1);
		var d = c.indexOf("\n");
		// var f = c.substr(0, d - 1);
		var f = c.substr(0, d);

		var g = c.substr(d + 1);
		var h = g.indexOf("\n");
		// var i = g.substr(0, h - 1);
		var i = g.substr(0, h);

		// var j = g.substr(h + 1);
		// var k = j.indexOf("\n");
		// // var l = j.substr(0, k - 1);
		// var l = j.substr(0, k - 0);

		// var m = j.substr(k + 1);
		// var n = m.indexOf("\n");
		// var o = m.substr(0, n - 1);

		// var obj = {};
		// obj.name = b;
		// obj.enrollmentNo = f;
		// obj.degree = i;
		// obj.pointer = l;
		// obj.keyForPdf = m.replace(/(\r\n|\n|\r)/gm, "");;
		// console.log(obj);

		const formData = new FormData();

		if (/\n/.test(someText)) {
			formData.append("key", someText.substring(someText.lastIndexOf("\n") + 1));
			someText = someText.substring(someText.lastIndexOf("\n") + 0, -1);

		}
		else if (/\s/.test(someText)) {
			formData.append("key", someText.substring(someText.lastIndexOf(" ") + 1));
			someText = someText.substring(someText.lastIndexOf(" ") + 0, -1);
		}
		else {
			formData.append('key', e.data);
			someText = "";
		}
		formData.append("device_type", Platform.OS);
		formData.append("scanned_by", this.state.userName);
		formData.append("user_id", this.state.userId);

		// if (i) {
		// 	formData.append("key", someText.substring(someText.lastIndexOf("\n") + 1));
		// 	formData.append("device_type", Platform.OS);
		// 	formData.append("scanned_by", this.state.userName);
		// 	formData.append("user_id", this.state.userId);
		// 	console.log(formData);
		// } else {
		// 	formData.append("key", e.data);
		// 	formData.append("device_type", Platform.OS);
		// 	formData.append("scanned_by", this.state.userName);
		// 	formData.append("user_id", this.state.userId);
		// }
		console.log(formData);

		var instituteApiObj = new InstituteService();

		this.setState({ loading: true, showCameraText: false });
		await instituteApiObj.instituteScanViewCertificate(formData, this.state.token);
		var lResponseData = instituteApiObj.getRespData();
		await this.closeActivityIndicator();
		if (!lResponseData) {
			utilities.showToastMsg("Something went wrong. Please try again later");
			this.props.navigation.navigate("InstituteMainScreen");
		} else if (lResponseData.status === 2) {
			utilities.showToastMsg(lResponseData.data.message);
			this.props.navigation.navigate("InstituteMainScreen");
		} else if (lResponseData.status === 200) {
			utilities.showToastMsg("QR code scanned successfully.");
			await AsyncStorage.setItem("CERTIFICATESCANNEDDATA", JSON.stringify(lResponseData.data));
			// if (i) {
			this.props.navigation.navigate("InstituteCertificateAndPrint", { dataAboveCertificate: someText });
			// } else {
			// 	this.props.navigation.navigate("InstituteCertificateAndPrint");
			// }
		} else {
			utilities.showToastMsg(lResponseData.message);
			this.props.navigation.navigate("InstituteMainScreen");
		}

		// if (!lResponseData) {
		// 	utilities.showToastMsg('Something went wrong. Please try again later');
		// } else if (lResponseData.status == '1') {
		// 	try {
		// 		await AsyncStorage.setItem('CERTIFICATESCANNEDDATA', JSON.stringify(lResponseData));
		// 		this.props.navigation.navigate('InstituteCertificateViewScreen');
		// 	} catch (error) {
		// 		console.warn(error);
		// 	}
		// } else if (lResponseData.status == '0') {
		// 	try {
		// 		await AsyncStorage.setItem('CERTIFICATESCANNEDDATA', JSON.stringify(lResponseData));
		// 		this.props.navigation.navigate('InstituteCertificateViewScreen');
		// 	} catch (error) {
		// 		console.warn(error);
		// 	}
		// 	await utilities.showToastMsg('QR code part of the system. But certificate is inactive now');
		// } else if (lResponseData.status == '2') {
		// 	setTimeout(() => {
		// 		Alert.alert(
		// 			'Scanning Error',
		// 			'Please scan proper QR Code',
		// 			[
		// 				{ text: 'OK', onPress: () => { this.props.navigation.navigate('InstituteMainScreen') } },
		// 			],
		// 			{ cancelable: false }
		// 		)
		// 	}, 500);
		// }
		// else {
		// 	utilities.showToastMsg('Something went wrong. Please try again later');
		// }
	}

	_openFlash() {
		if (this.state.flashEnabled) {
			Torch.switchState(true);
			this.setState({ flashEnabled: false });
		} else {
			Torch.switchState(false);
			this.setState({ flashEnabled: true });
		}

	}

	_showHeader() {
		if (Platform.OS == 'ios') {
			return (
				<Header style={{ backgroundColor: '#434e7c' }}>
					<Left style={{ flex: 0.1 }}>
						<TouchableOpacity onPress={() => this.props.navigation.navigate('InstituteMainScreen')}>
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
						<TouchableOpacity onPress={() => this.props.navigation.navigate('InstituteMainScreen')}>
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

	_displayFlashIcon() {
		if (Platform.OS == 'ios') {
			if (this.state.flash) {
				return (
					<TouchableOpacity onPress={() => { this._openFlash(); this.setState({ flash: false }); }} style={{ position: 'absolute', bottom: 50, left: Dimensions.get('window').width * 0.8, zIndex: 1 }}>
						<Image
							style={{ width: 30, height: 30 }}
							source={require('../../../images/flash_on.png')}
						/>
					</TouchableOpacity>
				)
			} else {
				return (
					<TouchableOpacity onPress={() => { this._openFlash(); this.setState({ flash: true }); }} style={{ position: 'absolute', bottom: 50, left: Dimensions.get('window').width * 0.8, zIndex: 1 }}>
						<Image
							style={{ width: 30, height: 30 }}
							source={require('../../../images/flash_off.png')}
						/>
					</TouchableOpacity>
				)
			}
		} else {
			return (null);
		}
	}

	render() {
		return (
			<View style={styles.container}>
				{this._showHeader()}
				{/* { Platform.OS == 'ios' ?
					<CustomHeader prop={this.props} bodyTitle={'VU'} navigateTo='InstituteMainScreen' headerStyle={{backgroundColor: '#434e7c'}}/>
				:
					<CustomHeader prop={this.props} bodyTitle={'VU'} navigateTo='InstituteMainScreen' headerStyle={{backgroundColor: '#434e7c'}} bodyStyle={{ alignItems: 'center'}}/>
				} */}
				<OfflineNotice />
				<StatusBar
					backgroundColor="#434e7c"
					barStyle="light-content"
				/>

				<Loader
					loading={this.state.loading}
					text={this.state.loaderText}
				/>

				{this.state.showCamera ?
					<QRCodeScanner
						onRead={this.onSuccess.bind(this)}
						cameraStyle={{ width: '100%', height: '100%' }}
						showMarker={true}
					/>
					:
					<View></View>
				}
				{this.state.showCameraText ?
					<View>
						<Text style={{ position: 'absolute', bottom: 50, left: Dimensions.get('window').width * 0.1, zIndex: 1, color: '#FFFFFF' }}>Point the camera at QR code.</Text>
					</View>
					:
					<View></View>
				}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},

})

 // { this._displayFlashIcon() }