import { createStackNavigator } from "react-navigation";
import React, { Component } from "react";
import {
  BackHandler,
  StatusBar,
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  Dimensions,
  PixelRatio,
  TouchableOpacity
} from "react-native";
import OfflineNotice from "../../Utility/OfflineNotice";
import * as utilities from "../../Utility/utilities";
import * as app from "../../App";
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

export var LAT = "";
export var LONG = "";
export var LOC_ERROR = "";

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      latitude: null,
      longitude: null,
      locationError: null
    };
  }

  componentWillMount() {
    // alert("componentWillMount : " + app.ISNETCONNECTED);
  }

  componentDidMount() {
    SplashScreen.hide()
    BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
    // navigator.geolocation.getCurrentPosition(
    //   position => {
    //     this.setState({
    //       latitude: position.coords.latitude,
    //       longitude: position.coords.longitude,
    //       locationError: null
    //     });
    //     LAT = position.coords.latitude;
    //     LONG = position.coords.latitude;
    //     LOC_ERROR = null;
    //     console.log(LAT + " : " + LONG + " : " + LOC_ERROR);
    //   },
    //   error => {
    //     this.setState({ locationError: error.message });
    //     LOC_ERROR = error.message;
    //   },
    //   { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    // );

    this.getUserdata();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
  }

  handleBackPress = () => {
    BackHandler.exitApp();
    return true;
  };

  async getUserdata() {
    // debugger;
    await AsyncStorage.multiGet(["USERDATA"], (err, result) => {
      // USERDATA is set on VerifierLoginScreen
      // debugger;
      var lData = JSON.parse(result[0][1]);

      console.log(result);
      if (lData) {
        if (lData.user_type == "1") {
          this.props.navigation.navigate("VerifierMainScreen");
        } else if (lData.user_type == "2") {
          this.props.navigation.navigate("InstituteMainScreen");
        } else if (lData.hasOwnProperty("student_id") && lData.student_id) {
          this.props.navigation.navigate("DocumentListScreen");
        }
      }
    });
  }

  _onPressButton(pLoginType) {
    this.props.navigation.navigate(pLoginType, { LAT: LAT, LONG: LONG });
  }
  render() {
    return (
      <View style={styles.container}>
        <OfflineNotice />
        <StatusBar backgroundColor="#b8b200" barStyle="light-content" />
        <View style={{ flex: 0.9 }}>
          
        </View>

        <View style={{}}>
          <Image
            style={{ width: 200, height: 180, }}
            resizeMode="contain"
            source={require("../../images/wwe.png")}
          />
        </View>
        <View style={styles.containerLevel1}>
            <Text
              style={{
                textAlign: "center",
                fontSize: 26,
                fontWeight:'bold'
                // fontFamily: "system"
              }}
            >
              <Text style={{ color: "#434e7c" }}>SCE </Text>
              
            </Text>
            <Text style={{ color: "#91A1C2", fontSize: 20, }}>SeQR Scan </Text>
          </View>

        <View style={{ flex: 1, marginTop: 20 }}>
          <TouchableOpacity
            onPress={() => this._onPressButton("VerifierLoginScreen")}
          >
            <View style={styles.buttonVerifier}>
              <Text style={styles.buttonText}>SIGN IN AS VERIFIER</Text>
            </View>
          </TouchableOpacity>
          {/* <TouchableOpacity
            onPress={() => this._onPressButton("StudentLoginScreen")}
          >
            <View style={styles.buttonStudent}>
              <Text style={styles.buttonText}>STUDENT LOGIN</Text>
            </View>
          </TouchableOpacity> */}
          <TouchableOpacity
            onPress={() => this._onPressButton("InstitueLoginScreen")}
          >
            <View style={styles.buttonInstitute}>
              <Text style={styles.buttonText}>SIGN IN AS INSTITUTE</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#F5FCFF",
    backgroundColor: "#ffffff",
    flexDirection: "column"
  },
  containerLevel1: {
    alignItems: "center",
    paddingTop: 30
  },
  buttonVerifier: {
    width: 300,
    alignItems: "center",
    backgroundColor: "#b8b200",
    borderRadius: 30
  },
  buttonStudent: {
    marginTop: 10,
    width: 300,
    alignItems: "center",
    borderRadius: 30,
    backgroundColor: "#68228B"
  },
  buttonInstitute: {
    marginTop: 10,
    marginBottom: 30,
    width: 300,
    alignItems: "center",
    borderRadius: 30,
    backgroundColor: "#434e7c"
  },
  buttonText: {
    padding: 15,
    color: "white",
    fontWeight: "bold",
    fontSize: 15
  }
});

// <Text style={{color: '#b8b200', marginLeft: 10, }}>SECURITY SOFTWARE {'\n'}</Text>
//                   <Text style={{color: '#b8b200' }}>SOLUTION LIMITED(SSSL)</Text>
