import React, { Component } from "react";
import { Alert, StatusBar, BackHandler, Dimensions, Platform, StyleSheet, View, TouchableOpacity } from "react-native";
import { Header, Left, Body, Text, Title, Icon, } from "native-base";
import QRCodeScanner from "react-native-qrcode-scanner";
import Loader from "../../../Utility/Loader";
import * as utilities from "../../../Utility/utilities";
import { scanSeQRData, scanQRData, ISNETCONNECTED } from "../../../App";
import VerifierService from '../../../services/VerifierService/VerifierService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as app from '../../../App';
export default class VerifierScanScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
      userId: "",
      userName: "",
      flashEnabled: true,
      loading: false,
      loaderText: "Scanning...",
      flash: false,
      showCamera: true,
      showCameraText: true,
    };
  }
  componentWillMount() { this._getAsyncData(); }
  componentDidMount() {
    this.didFocusSubscription = this.props.navigation.addListener("didFocus", payload => { this.setState({ showCamera: true }); });
    BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
  }
  componentWillUnmount() { BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress); this.didFocusSubscription.remove(); }
  handleBackPress = () => { this.props.navigation.navigate("VerifierMainScreen"); return true; };
  async _getAsyncData() {
    await AsyncStorage.getItem("USERDATA", (err, result) => {
      // USERDATA is set on SignUP screen
      var lData = JSON.parse(result);
      console.log("In scan, user credentials:",result);
      if (lData) {
        this.setState({ userName: lData.username, userId: lData.id, token: lData.access_token });
      }
    });
  }
  onSuccess(e) {
    this.setState({ showCamera: false });
    this._callForAPI(e);
    console.log(e)
  }

  _callForAPI = async (e) => {
    this.setState({ loading: true, showCameraText: false });

    var someText = e.data.replace(/^\s+|\s+$/g, '');
    console.log("sometext:", someText);

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

    // console.log("=-=-=-=-=-=-=-=popopopopo-=-=-==-=>>>>>");

    // var j = g.substr(h + 1);
    // var k = j.indexOf("\n");
    // var l = j.substr(0, k);
    // console.log(l);

    // var m = j.substr(k + 1);
    // var n = m.indexOf("\n");
    // var o = m.substr(0, n);
    // console.log(o);

    // var p = o.substr(n + 1);
    // var q = p.indexOf("\n");
    // var r = p.substr(0, q);
    // console.log(r);


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
    //   formData.append("key", someText.substring(someText.lastIndexOf("\n") + 1));
    //   formData.append("device_type", Platform.OS);
    //   formData.append("scanned_by", this.state.userName);
    //   formData.append("user_id", this.state.userId);
    //   console.log(formData);
    // } else {
    //   formData.append("key", e.data);
    //   formData.append("device_type", Platform.OS);
    //   formData.append("scanned_by", this.state.userName);
    //   formData.append("user_id", this.state.userId);
    // }
    console.log(formData);

    var verifierApiObj = new VerifierService();
    await verifierApiObj.scanByPublicUser(formData, this.state.token);
    var lResponseData = verifierApiObj.getRespData();
    this.setState({ loading: false, showCameraText: false });
    if (!lResponseData) {
      utilities.showToastMsg("Something went wrong. Please try again later");
      this.props.navigation.navigate("VerifierMainScreen");
    } else if (lResponseData.data.status === 2) {
      utilities.showToastMsg(lResponseData.data.message);
      this.props.navigation.navigate("VerifierMainScreen");
    } else if (lResponseData.status === 200) {
      var lData = {};
      lData = lResponseData.data;
      scanSeQRData.unshift(lData);
      utilities.showToastMsg("QR code scanned successfully.");
      await AsyncStorage.setItem("CERTIFICATESCANNEDDATA", JSON.stringify(lResponseData));
      // if (i) {
      this.props.navigation.navigate("CertificateViewScreen", { certificateData: lResponseData.data, dataAboveCertificate: someText });
      // } else {
      //   this.props.navigation.navigate("CertificateViewScreen", { certificateData: lResponseData.data, dataAboveCertificate: "" });
      // }
    } else {
      utilities.showToastMsg(lResponseData.message);
      setTimeout(() => {
        this.props.navigation.navigate("VerifierMainScreen");
      }, 1000);
    }
  }
  _showHeader() {
    if (Platform.OS == "ios") {
      return (
        <Header style={{ backgroundColor: "#b8b200" }}>
          <Left style={{ flex: 0.1 }}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate("VerifierMainScreen")} >
              <Icon type="FontAwesome" name="long-arrow-left" style={{ fontSize: 25, color: "#FFFFFF", paddingLeft: 10, paddingRight: 10 }} />
            </TouchableOpacity>
          </Left>
          <Body style={{ flex: 0.9 }}>
            <Title style={{ color: "#FFFFFF" }}>{app.title}</Title>
          </Body>
        </Header>
      );
    } else {
      return (
        <Header style={{ backgroundColor: "#b8b200" }}>
          <Left style={{ flex: 0.1 }}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate("VerifierMainScreen")} >
              <Icon type="FontAwesome" name="long-arrow-left" style={{ fontSize: 25, color: "#FFFFFF", paddingLeft: 10, paddingRight: 10 }} />
            </TouchableOpacity>
          </Left>
          <Body style={{ flex: 0.9, alignItems: "center" }}>
            <Title style={{ color: "#FFFFFF", fontSize: 16 }}>{app.title}</Title>
          </Body>
        </Header>
      );
    }
  }
  render() {
    return (
      <View style={styles.container}>
        {this._showHeader()}
        <StatusBar barStyle="light-content" />
        <Loader loading={this.state.loading} text={this.state.loaderText} />
        {this.state.showCamera ? (<QRCodeScanner onRead={this.onSuccess.bind(this)} cameraStyle={{ width: "100%", height: "100%" }} showMarker={true} />) : (<View />)}
        {/* {this.state.showCameraText ? (<View> <Text style={{ position: "absolute", bottom: 50, left: Dimensions.get("window").width * 0.1, zIndex: 1, color: "#FFFFFF" }}> Point the camera at QR code. </Text> </View>) : (<View />)}  */}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});