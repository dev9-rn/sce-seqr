import React, {Component} from 'react';
import {Root} from 'native-base';
import Route from '../src/config/Route';
import {MenuProvider} from 'react-native-popup-menu';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {enableSecureView} from 'react-native-prevent-screenshot-ios-android';

export default class App extends Component {
  // componentDidMount(){
  //   if (Platform.OS == 'ios') {
  //     enableSecureView(); //This function blocks the Screen share/Recording and taking screenshot for iOS devices.
  //     // disableSecureView(); //This function allows to provide back the Screen share/Recording and screenshot functionality for iOS devices
  //   }
  // }
  render() {
    return (
      <Root>
        <SafeAreaProvider>
          <SafeAreaView style={{flex: 1}} edges={['top', 'bottom']}>
            <MenuProvider>
              <Route />
            </MenuProvider>
          </SafeAreaView>
        </SafeAreaProvider>
      </Root>
    );
  }
}

export const URL = 'http://103.239.85.242:8081/api/';

export const title = 'SCE SeQR Scan';

export const HEADER = {
  Accept: 'application/json',
  'Content-Type': 'multipart/form-data',
  apikey: 'GSka~2nu@D,knVOfz{+/RL1WMF{bka',
};
export var scanQRData = [];
export var scanSeQRData = [];
export var ISNETCONNECTED = true;
export function setValue(newValue: Boolean) {
  ISNETCONNECTED = newValue;
}
