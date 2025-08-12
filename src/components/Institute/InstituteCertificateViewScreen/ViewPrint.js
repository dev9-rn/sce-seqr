import React, { Component } from 'react';
import { StatusBar, BackHandler, Dimensions, Platform, StyleSheet, View, TouchableOpacity, FlatList } from 'react-native';
import { Header, Left, Body, Right, Card, Text, Title, Icon, ListItem } from 'native-base';
import Loader from '../../../Utility/Loader';
import { Col, Row, Grid } from "react-native-easy-grid";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class ViewPrint extends React.Component {

    constructor(props) {
        super(props);
        ;
        this.state = {
            data: '',
            userId: '',
            serialNo: '',
            certificateURI: '',
            loading: false,
            loaderText: 'Loading...',
            barcode: '',
            userPrinted: '',
            printedDate: '',
            printedTime: '',
            printerUsed: '',
            printCount: '',
            status: '',
            printDetailsAvailable: false,
        };
    }

    componentWillMount() {
        this._getAsyncData();
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {
        this.props.navigation.navigate('InstituteMainScreen');
        return true;
    }

    closeActivityIndicator() {
        setTimeout(() => {
            this.setState({ animating: false, loading: false });
        });
    }

    async _getAsyncData() {
        await AsyncStorage.multiGet(['USERDATA', 'CERTIFICATESCANNEDDATA'], (err, result) => {
            // USERDATA is set on InstituteLogin screen
            ;
            // var lUserData = JSON.parse(result[0][1]);

            var lData = JSON.parse(result[1][1]);
            console.log(result);
            var lProps = this.props;
            ;
            // if (lProps.navigation.state.params) {
            // 	if (lData) {
            // 		this.setState({ serialNo: lProps.navigation.state.params.certificateData.serial_no, certificateURI: lProps.navigation.state.params.certificateData.certificate_filename, certificateStatus: lData.status });
            // 	}
            // }else {
            // 	if (lData) {
            // 		this.setState({ serialNo: lData.serial_no, certificateURI: lData.fileUrl,  });
            // 	}
            // }
            if (lData) {
                //    // var dateTime = lData.printingDateTime.split(' ');
                //     var lDate = dateTime[0];
                //     var lTime = dateTime[1];
                var lDate = lData.printedDate;
                var lTime = lData.printedTime;

                if (lData.isPrintDetailsAvailable == '0') {
                    this.setState({ printDetailsAvailable: true })
                    if (lData.status == '1') {
                        this.setState({ serialNo: lData.serialNo, userPrinted: lData.userPrinted, barcode: lData.barcode, certificateStatus: 'Active', printedDate: lDate, printedTime: lTime, printerUsed: lData.printerUsed, printCount: lData.printCount });
                        var items = [
                            {
                                'barcode': this.state.barcode,
                                'userPrinted': this.state.userPrinted,
                                'printedDate': this.state.printedDate,
                                'printedTime': this.state.printedTime,
                                'printerUsed': this.state.printerUsed,
                                'printCount': this.state.printCount,
                                'status': this.state.certificateStatus
                            },
                        ];
                        this.setState({ data: items });
                    } else if (lData.status == '0') {
                        this.setState({ serialNo: lData.serialNo, userPrinted: lData.userPrinted, barcode: lData.barcode, certificateStatus: 'InActive', printedDate: lDate, printedTime: lTime, printerUsed: lData.printerUsed, printCount: lData.printCount });
                        var items = [
                            {
                                'barcode': this.state.barcode,
                                'userPrinted': this.state.userPrinted,
                                'printedDate': this.state.printedDate,
                                'printedTime': this.state.printedTime,
                                'printerUsed': this.state.printerUsed,
                                'printCount': this.state.printCount,
                                'status': this.state.certificateStatus
                            },
                        ];
                        this.setState({ data: items });
                    }
                }
                else {
                    this.setState({ printDetailsAvailable: false })


                }
            }
        });
    }



    _showHeader() {
        if (Platform.OS == 'ios') {
            return (
                <Header style={{ backgroundColor: '#434e7c' }}>
                    <Grid>
                        <Row>
                            <Col style={{ justifyContent: 'center' }} size={1.5}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('InstituteMainScreen')}>
                                    <Icon type="FontAwesome" name="long-arrow-left" style={{ fontSize: 25, color: '#FFFFFF', paddingLeft: 10, paddingRight: 10 }} />
                                </TouchableOpacity>
                            </Col>
                            <Col style={{ justifyContent: 'center' }} size={8}>
                                <Title style={{ color: '#FFFFFF', fontSize: 16 }}>Scanned details</Title>
                            </Col>
                            <Col style={{ justifyContent: 'center' }} size={2.5}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('InstituteAuditScanScreen')}>
                                    <Title style={{ color: '#FFFFFF', fontSize: 16 }}>SCAN NEW</Title>
                                </TouchableOpacity>
                            </Col>
                        </Row>
                    </Grid>
                </Header>
            )
        } else {
            return (
                <Header style={{ backgroundColor: '#434e7c' }}>
                    {/* <Left>
						<TouchableOpacity onPress={() => this.props.navigation.navigate('InstituteMainScreen')}>
							<Icon type="FontAwesome" name="long-arrow-left" style={{ fontSize: 25, color: '#FFFFFF', paddingLeft: 10, paddingRight: 10 }} />
						</TouchableOpacity>
					</Left>
					<Body>
						<Title style={{ color: '#FFFFFF', fontSize: 16 }}>Scanned details</Title>
					</Body>
					<Right>
						<TouchableOpacity onPress={() => this.props.navigation.navigate('InstituteAuditScanScreen')}>
							<Title style={{ color: '#FFFFFF', fontSize: 16 }}>SCAN NEW</Title>
						</TouchableOpacity>
					</Right> */}
                    <Grid>
                        <Row>
                            <Col style={{ justifyContent: 'center' }} size={1.5}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('InstituteMainScreen')}>
                                    <Icon type="FontAwesome" name="long-arrow-left" style={{ fontSize: 25, color: '#FFFFFF', paddingLeft: 10, paddingRight: 10 }} />
                                </TouchableOpacity>
                            </Col>
                            <Col style={{ justifyContent: 'center' }} size={8}>
                                <Title style={{ color: '#FFFFFF', fontSize: 16 }}>Scanned details</Title>
                            </Col>
                            <Col style={{ justifyContent: 'center' }} size={2.5}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('InstituteAuditScanScreen')}>
                                    <Title style={{ color: '#FFFFFF', fontSize: 16 }}>SCAN NEW</Title>
                                </TouchableOpacity>
                            </Col>
                        </Row>
                    </Grid>
                </Header>
            )
        }
    }


    render() {

        return (
            <View style={styles.container}>
                {/* {this._showHeader()} */}

                <StatusBar
                    backgroundColor="#434e7c"
                    barStyle="light-content"
                />

                <Loader
                    loading={this.state.loading}
                    text={this.state.loaderText}
                />

                <View style={styles.certificateViewContainer}>

                    <Card style={styles.cardContainer}>

                        {this.state.printDetailsAvailable ?

                            <FlatList
                                data={this.state.data}
                                extraData={this.state}
                                key={(item, index) => item.index}
                                keyExtractor={(item, index) => item.index}
                                renderItem={({ item, index }) =>
                                    <View>
                                        <ListItem>
                                            <Text>Barcode : {item.barcode}</Text>
                                        </ListItem>
                                        <ListItem>
                                            <Text>User Printed: {item.userPrinted}</Text>
                                        </ListItem>
                                        <ListItem>
                                            <Text>Printed Date : {item.printedDate}</Text>
                                        </ListItem>
                                        <ListItem>
                                            <Text>Printed Time: {item.printedTime}</Text>
                                        </ListItem>
                                        <ListItem>
                                            <Text>Printer used : {item.printerUsed}</Text>
                                        </ListItem>
                                        <ListItem>
                                            <Text>Print count: {item.printCount}</Text>
                                        </ListItem>
                                        <ListItem>
                                            <Text>Status: {item.status}</Text>
                                        </ListItem>
                                    </View>
                                }
                            />
                            :
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 18 }}> In order to view the printing details, </Text>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('InstituteAuditScanScreen')}>
                                    <Text style={{ color: '#0000FF', fontSize: 18 }}>click here</Text>
                                </TouchableOpacity>
                                <Text style={{ fontSize: 18 }} > and scan the 1D barcode. </Text>
                            </View>
                        }


                    </Card>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    certificateViewContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch',
        paddingTop: Dimensions.get('window').height * 0.01
    },
    cardContainer: {
        flex: 1,
        padding: 15,
        marginTop: 10,
        marginLeft: 10,
        marginRight: 15
    },
    cardHeader: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0'
    },
    pdf: {
        flex: 1,
        // width:Dimensions.get('window').width,
    }
});