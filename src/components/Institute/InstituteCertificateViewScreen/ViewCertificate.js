import React, { Component } from 'react';
import { Alert, StatusBar, BackHandler, Dimensions, Platform, StyleSheet, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Header, Left, Body, Right, Card, CardItem, Text, Title, Icon } from 'native-base';
import Pdf from 'react-native-pdf';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import Loader from '../../../Utility/Loader';
import { Col, Row, Grid } from "react-native-easy-grid";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default class ViewCertificate extends React.Component {

    constructor(props) {
        super(props);
        console.log('view certificate props', this.props.navigation);
        this.state = {
            userId: '',
            serialNo: '',
            certificateURI: '',
            loading: false,
            loaderText: 'Please wait downloading file......',
            dataAboveCertificate: this.props.navigation.state.params.dataAboveCertificate.trim(),
            flag_showdata: false
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
            this.setState({ loading: false });
        });
    }

    async _getAsyncData() {
        await AsyncStorage.multiGet(['USERDATA', 'CERTIFICATESCANNEDDATA'], (err, result) => {		// USERDATA is set on InstituteLogin screen

            // var lUserData = JSON.parse(result[0][1]);
            var lData = JSON.parse(result[1][1]);
            console.log("view certificate data : ", lData);
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
                if (lData.scan_result == '1') {
                    this.setState({ serialNo: lData.serialNo, certificateURI: lData.fileUrl, certificateStatus: 'Active' });
                } else if (lData.scan_result == '0') {
                    this.setState({ serialNo: lData.serialNo, certificateURI: lData.fileUrl, certificateStatus: 'Inactive' });
                }
            }
        });
    }

    getLocalPath(url) {
        const filename = url.split('/').pop();
        return `${RNFS.DocumentDirectoryPath}/${filename}`;
    }

    downloadFile() {
        this.setState({ loading: true });
        const url = this.state.certificateURI;
        const localFile = this.getLocalPath(url);

        const options = {
            fromUrl: url,
            toFile: localFile
        };

        RNFS.downloadFile(options).promise
            .then(async () => {
                this.setState({ loading: false });
                setTimeout(() => { FileViewer.open(localFile) }, 500);
            })
            .catch(error => {
                setTimeout(() => {
                    this.setState({ loading: false });
                }, 2000);
                console.warn("Error in downloading file" + error);
            });
    }

    _showHeader() {
        if (Platform.OS == 'ios') {
            return (
                <Header style={{ backgroundColor: '#94302C' }}>
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
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('InstituteScanScreen')}>
                                    <Title style={{ color: '#FFFFFF', fontSize: 16 }}>SCAN NEW</Title>
                                </TouchableOpacity>
                            </Col>
                        </Row>
                    </Grid>
                </Header>
            )
        } else {
            return (
                <Header style={{ backgroundColor: '#94302C' }}>
                    {/* <Left>
						<TouchableOpacity onPress={() => this.props.navigation.navigate('InstituteMainScreen')}>
							<Icon type="FontAwesome" name="long-arrow-left" style={{ fontSize: 25, color: '#FFFFFF', paddingLeft: 10, paddingRight: 10 }} />
						</TouchableOpacity>
					</Left>
					<Body>
						<Title style={{ color: '#FFFFFF', fontSize: 16 }}>Scanned details</Title>
					</Body>
					<Right>
						<TouchableOpacity onPress={() => this.props.navigation.navigate('InstituteScanScreen')}>
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
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('InstituteScanScreen')}>
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
        console.log("helloooo2", this.state.certificateURI);
        const source = { uri: encodeURI(this.state.certificateURI), cache: true };
        return (
            <View style={styles.container}>
                {/* {Platform.OS == 'ios' ?
					<CustomHeader
						prop={this.props}
						bodyTitle={'Scanned details'}
						rightContent={<TouchableOpacity onPress={() => this.props.navigation.navigate('InstituteScanScreen')}>
							<Title style={{ color: '#FFFFFF', fontSize: 16 }}>SCAN NEW</Title>
						</TouchableOpacity>}
						navigateTo='InstituteMainScreen'
						headerStyle={{ backgroundColor: '#94302C' }}
						bodyStyle={{ marginLeft: -50, width: '100%' }}
					/>
					:
					<CustomHeader
						prop={this.props}
						bodyTitle={'Scanned details'}
						rightContent={<TouchableOpacity onPress={() => this.props.navigation.navigate('InstituteScanScreen')}>
							<Title style={{ color: '#FFFFFF', fontSize: 16 }}>SCAN NEW</Title>
						</TouchableOpacity>}
						navigateTo='InstituteMainScreen'
						headerStyle={{ backgroundColor: '#94302C' }}

					/>
				} */}
                {/* {this._showHeader()} */}

                <StatusBar
                    backgroundColor="#94302C"
                    barStyle="light-content"
                />

                <Loader
                    loading={this.state.loading}
                    text={this.state.loaderText}
                />

                <View style={styles.certificateViewContainer}>
                    <Card style={styles.cardContainer}>
                        <ScrollView keyboardShouldPersistTaps={'handled'}>
                            <CardItem header style={styles.cardHeader}>

                                <Text style={styles.textSrNo}>Document ID : {this.state.serialNo}</Text>
                                <Text style={styles.textStatus}>Status: {this.state.certificateStatus}</Text>
                                {
                                    this.state.dataAboveCertificate ?
                                        <Text style={styles.textStatus}>Data: {this.state.dataAboveCertificate}</Text>
                                        :
                                        <View></View>
                                }

                            </CardItem>
                            <View style={{ paddingTop: 10, height: Dimensions.get('window').height * 0.7 }}>
                                <View style={{ flex: 0.1, flexDirection: 'row' }}>
                                    <Text style={{ fontSize: 22, flex: 0.9 }}>Document</Text>
                                    {/* <TouchableOpacity style={{ flex: 0.1 }} onPress={() => { this.downloadFile() }}>
										<Image
											style={{ width: 30, height: 30 }}
											source={require('../../../images/forward_arrow.png')}
										/>
									</TouchableOpacity> */}
                                </View>

                                <Pdf
                                    source={source}
                                    onLoadComplete={(numberOfPages, filePath) => {
                                        console.log(`number of pages: ${numberOfPages}`);
                                    }}
                                    onPageChanged={(page, numberOfPages) => {
                                        console.log(`current page: ${page}`);
                                    }}
                                    onError={(error) => {
                                        console.log(error);
                                    }}
                                    style={styles.pdf} />
                            </View>
                        </ScrollView>
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
        paddingTop: 0,
        marginTop: 10,
        marginLeft: 15,
        marginRight: 15
    },
    cardHeader: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    textStatus: {
        marginLeft: -16,
        color: '#212121',
        fontWeight: 'normal',
        fontSize: 16
    },
    textSrNo: {
        marginLeft: -12,
        color: '#212121',
        fontWeight: 'normal',
        fontSize: 16
    },
    pdf: {
        flex: 1,
        // width:Dimensions.get('window').width,
    }
});



