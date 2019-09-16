import React, { Component } from 'react';
import { StyleSheet, ImageBackground, Button, View, Alert, TextInput, Text, Platform, TouchableOpacity, ListView, ActivityIndicator, Image, ScrollView, Picker } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Font, Constants, WebBrowser } from 'expo';

class LoginActivity extends React.Component {

 static navigationOptions = { title: 'Welcome', header: null };

    constructor(props) {
        super(props)
        this.state = {
            TextInput_Userid: '',
            TextInput_Password: '',
            fontLoaded: false,
        }
    }

   async componentDidMount() {
    await Font.loadAsync({
      'robotoBold': require('./assets/fonts/Roboto-Bold.ttf'),
    });

    this.setState({ fontLoaded: true });
  }

    LoginFunction = () => {
        const { TextInput_Userid } = this.state;
        const { TextInput_Password } = this.state;

        fetch('http://192.168.8.101/DrowsinessDetection/User_Login.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userid: TextInput_Userid,
                password: TextInput_Password
            })
        }).then((response) => response.json())
            .then((responseJson) => {
            // If server response message same as Data Matched
            if (responseJson === 'Data Matched') {
                this.props.navigation.navigate('Third',{
                    useridOBJ: this.state.TextInput_Userid,
                });
            }
            else if (responseJson === 'Admin Detected') {
                this.props.navigation.navigate('Second');
            }
            else {
                // Showing response message coming from server after inserting records.
                Alert.alert(responseJson);
            }

        }).catch((error) => {
            console.error(error);
        });
    }

    InsertDataToServer = () => {
        this.props.navigation.navigate('Fourth');
    }

    render() {
        return (
            <ImageBackground source={require('./img/car.jpg')}  style={styles.Container}>
                <View style={styles.inputPageContainer}>
                {
                    this.state.fontLoaded ? (
                    <Text style={{ fontFamily: 'robotoBold', fontSize: 30, paddingTop:70, padding:30,paddingBottom: 50,textAlign:'center'}}> AI DROWSINESS DETECTION SYSTEM WITH DASHBOARD ANALYTICS </Text>  ) : null
                }

                    <View style={styles.inputContainer}>
                        <Image style={styles.inputIcon} source={{ uri: 'https://png.icons8.com/user/ultraviolet/50/3498db' }} />
                        <TextInput style={styles.inputs}
                            placeholder="User ID"
                            onChangeText={TextInputValue => this.setState({ TextInput_Userid: TextInputValue })}
                            underlineColorAndroid='transparent'
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Image style={styles.inputIcon} source={{ uri: 'https://png.icons8.com/key-2/ultraviolet/50/3498db' }} />
                        <TextInput style={styles.inputs}
                            placeholder="Password"
                            onChangeText={TextInputValue => this.setState({ TextInput_Password: TextInputValue })}
                            underlineColorAndroid='transparent'
                            secureTextEntry={true}
                        />
                    </View>
               
                </View>

                <TouchableOpacity activeOpacity={.4} style={styles.TouchableOpacityStyle} onPress={this.LoginFunction} >
                    <Text style={styles.TextStyle}> LOGIN </Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={.4} style={styles.TouchableOpacityStyle} onPress={this.InsertDataToServer} >
                    <Text style={styles.TextStyle}> SIGNUP </Text>
                </TouchableOpacity>
            </ImageBackground>
        );
    }
}

/////Profile  Activity ////////////
class ShowDetailActivity extends Component {
    constructor(props) {

        super(props);

        this.state = {

            isLoading: true
        }
    }

    static navigationOptions =
        {
            title: 'All User',
        };

    componentDidMount() {
        return fetch('http://192.168.8.101/DrowsinessDetection/allUserProfile.php',{
         
        })
            .then((response) => response.json())
            .then((responseJson) => {
                let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
                this.setState({
                    isLoading: false,
                    dataSource: ds.cloneWithRows(responseJson),
                }, function () {
                    // In this block you can do something with new state.
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    GetUserIDFunction = (kid, ID, Name, Email, Password, Age, Gender, maritalStatus, vehicleType, healthStatus, Occupation) => {
        this.props.navigation.navigate('Fifth', {
            ID: kid,
            USERID: ID,
            NAME: Name,
            EMAIL: Email,
            PASSWORD: Password,
            AGE: Age,
            GENDER: Gender,
            MARITALSTATUS: maritalStatus,
            VEHICLETYPE: vehicleType,
            HEALTHSTATUS: healthStatus,
            JOB: Occupation
        });
    }

    ListViewItemSeparator = () => {
        return (
            <View
                style={{
                    height: .5,
                    width: "100%",
                    backgroundColor: "#000"
                }}
            />
        );
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1, paddingTop: 20 }}>
                    <ActivityIndicator />
                </View>
            );
        }

        return (

            <View style={styles.MainContainer_For_ShowList_Activity}>
                <View>
                    <Text style={{textAlign:'center', fontSize: 30, paddingBottom: 40}}>
                        Registered User
                    </Text>
                </View>

                <ListView
                    dataSource={this.state.dataSource}
                    renderSeparator={this.ListViewItemSeparator}
                    renderRow={(rowData) => <Text style={styles.rowViewContainer}
                        onPress={this.GetUserIDFunction.bind(
                            this,
                            rowData.kid,
                            rowData.ID,
                            rowData.Name,
                            rowData.Email,
                            rowData.Password,
                            rowData.Age,
                            rowData.Gender,
                            rowData.maritalStatus,
                            rowData.vehicleType,
                            rowData.healthStatus,
                            rowData.Occupation
                        )} >
                        {rowData.Name}
                    </Text>}
                />
                        


            </View>

        );
    }
}

//Creating Sign Up activity////////////////////////////////////////////////////////////////////////
class SignUpActivity extends Component {
    static navigationOptions =
        {
            title: "Sign Up"
        };

    constructor(props) {
        super(props);

        this.state = {
            TextInput_UserID: '',
            TextInput_Name: '',
            TextInput_Email: '',
            TextInput_Password: '',
            TextInput_Age: '',
            TextInput_Gender: '',
            TextInput_MaritalStatus: '',
            TextInput_VehicleType: '',
            TextInput_HealthStatus: '',
            TextInput_Job:'',
        }
    }

    UserRegistrationFunction = () => {

        fetch('http://192.168.8.101/DrowsinessDetection/user_registeration.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userid: this.state.TextInput_UserID,
                name: this.state.TextInput_Name,
                email: this.state.TextInput_Email,
                password: this.state.TextInput_Password,
                age: this.state.TextInput_Age,
                gender: this.state.TextInput_Gender,
                maritalstatus: this.state.TextInput_MaritalStatus,
                vehicletype: this.state.TextInput_VehicleType,
                healthstatus: this.state.TextInput_HealthStatus,
                job: this.state.TextInput_Job
            })

        }).then((response) => response.json())
            .then((responseJson) => {
                //showing response message coming from server after inserting records.
                Alert.alert(responseJson);
                this.props.navigation.navigate('First');
            }).catch((error) => {
                console.error(error);
            });
    }

    render() {
        return (
            <View style={styles.MainContainer}>
                <ScrollView >
                    <Text style={styles.title}>Account Registeration Details: </Text>

                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.titleDesc}> Name: </Text>
                        <TextInput
                            onChangeText={TextInputValue => this.setState({ TextInput_Name: TextInputValue })}
                            underlineColorAndroid='transparent'
                            style={styles.TextInputStyleClass}
                        />
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.titleDesc}> User ID: </Text>
                        <TextInput
                            onChangeText={TextInputValue => this.setState({ TextInput_UserID: TextInputValue })}
                            underlineColorAndroid='transparent'
                            style={styles.TextInputStyleClass}
                        />
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.titleDesc}> Email: </Text>
                        <TextInput
                            onChangeText={TextInputValue => this.setState({ TextInput_Email: TextInputValue })}
                            underlineColorAndroid='transparent'
                            style={styles.TextInputStyleClass}
                        />
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.titleDesc}> Password: </Text>
                        <TextInput
                            onChangeText={TextInputValue => this.setState({ TextInput_Password: TextInputValue })}
                            underlineColorAndroid='transparent'
                            style={styles.TextInputStyleClass}
                            secureTextEntry={true}
                        />
                    </View>

                    <View
                        style={{
                            borderBottomColor: 'black',
                            borderBottomWidth: 1,
                            marginTop: 40,
                            marginBottom: 40
                        }}
                    />

                    <Text style={styles.title}>Profile Details: </Text>

                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.titleDesc}> Age: </Text>
                        <TextInput
                            onChangeText={TextInputValue => this.setState({ TextInput_Age: TextInputValue })}
                            keyboardType = 'numeric'
                            underlineColorAndroid='transparent'
                            style={styles.TextInputStyleClass}
                        />
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.titleDesc}> Gender: </Text>
                    <View style={styles.picker}>
                        <Picker
                            selectedValue={this.state.TextInput_Gender}
                            onValueChange={(itemValue, itemIndex) => this.setState({ TextInput_Gender: itemValue })}
                            onPress={this.GetSelectedPickerItem}>
                            <Picker.Item label="Please choose one" />
                            <Picker.Item label="Male" value="Male" />
                            <Picker.Item label="Female" value="Female" />
                        </Picker>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.titleDesc}> Marital: </Text>
                    <View style={styles.picker}>
                        <Picker
                            selectedValue={this.state.TextInput_MaritalStatus}
                            onValueChange={(itemValue, itemIndex) => this.setState({ TextInput_MaritalStatus: itemValue })}
                            onPress={this.GetSelectedPickerItem}>
                            <Picker.Item label="Please choose one" />
                            <Picker.Item label="Single" value="Single" />
                            <Picker.Item label="Married" value="Married" />
                        </Picker>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.titleDesc}> Vehicle: </Text>
                    <View style={styles.picker}>
                        <Picker
                            selectedValue={this.state.TextInput_VehicleType}
                            onValueChange={(itemValue, itemIndex) => this.setState({ TextInput_VehicleType: itemValue })}
                            onPress={this.GetSelectedPickerItem}>
                            <Picker.Item label="Please choose one" />
                            <Picker.Item label="Car" value="Car" />
                            <Picker.Item label="Truck" value="Truck" />
                            <Picker.Item label="Motorcar" value="Motorcar" />
                            <Picker.Item label="Multi Purposed Vehicle" value="MPV" />
                        </Picker>
                        </View>
                    </View>

                  <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.titleDesc}> Health: </Text>
                    <View style={styles.picker}>
                        <Picker
                            selectedValue={this.state.TextInput_HealthStatus}
                            onValueChange={(itemValue, itemIndex) => this.setState({ TextInput_HealthStatus: itemValue })}
                            onPress={this.GetSelectedPickerItem}>
                            <Picker.Item label="Please choose one" />
                            <Picker.Item label="Low Blood Sugar" value="LowBloodSugar" />
                            <Picker.Item label="Depression" value="Depression" />
                            <Picker.Item label="Obesity" value="Obesity" />
                            <Picker.Item label="Diabetes" value="Diabetes" />
                            <Picker.Item label="Insomia" value="Insomia" />
                            <Picker.Item label="etc." value="Etc" />
                            <Picker.Item label="None" value="None" />
                        </Picker>
                         </View>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.titleDesc}> Occupation: </Text>
                    <View style={styles.picker}>
                        <Picker
                            selectedValue={this.state.TextInput_Job}
                            onValueChange={(itemValue, itemIndex) => this.setState({ TextInput_Job: itemValue })}
                            onPress={this.GetSelectedPickerItem}>
                            <Picker.Item label="Please choose one" />
                            <Picker.Item label="Secretaries" value="Secretaries" />
                            <Picker.Item label="Driver (Taxi, bus, truck driver and etc related with driving)" value="Driver" />
                            <Picker.Item label="Police" value="Police" />
                            <Picker.Item label="Financial Analysts" value="FinancialAnalysts" />
                            <Picker.Item label="Engineeer" value="Engineeer" />
                            <Picker.Item label="Doctor" value="Doctor" />
                            <Picker.Item label="Entrepreneur" value="Entrepreneur" />
                            <Picker.Item label="Other" value="Other" />
                        </Picker>
                        </View>
                    </View>

                    <TouchableOpacity activeOpacity={.4} style={styles.TouchableOpacityStyle} onPress={this.UserRegistrationFunction} >

                        <Text style={styles.TextStyle}> SIGN UP </Text>

                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }
}

//show profile detail //////////////////////////////////////
class UpdateActivity extends Component {
    constructor(props) {
        super(props)
        this.state = {
            TextInput_ID: '',
            TextInput_UserID: '',
            TextInput_Name: '',
            TextInput_Email: '',
            TextInput_Password: '',
            TextInput_Age: '',
            TextInput_Gender: '',
            TextInput_MaritalStatus: '',
            TextInput_VehicleType: '',
            TextInput_HealthStatus: '',
            TextInput_Job: '',
        }
    }

    componentDidMount() {

            return fetch('http://192.168.8.101/DrowsinessDetection/userProfile.php',{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                useridProfile: this.props.navigation.state.params.useridOBJ,
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    TextInput_ID: responseJson[0].kid,
                    TextInput_UserID: responseJson[0].ID,
                    TextInput_Name: responseJson[0].Name,
                    TextInput_Email: responseJson[0].Email,
                    TextInput_Password: responseJson[0].Password,
                    TextInput_Age: responseJson[0].Age,
                    TextInput_Gender: responseJson[0].Gender,
                    TextInput_MaritalStatus: responseJson[0].maritalStatus,
                    TextInput_VehicleType: responseJson[0].vehicleType,
                    TextInput_HealthStatus: responseJson[0].healthStatus,
                    TextInput_Job: responseJson[0].Occupation,
                })

                this.setState({
                    isLoading: false,
                }, function () {
                    // In this block you can do something with new state.
                });
            })
            .catch((error) => {
                console.error(error);
            });
        
    }

    static navigationOptions =
        {
            title: 'Edit Information',
        };


              _handleOpenWithWebBrowser = () => {
            WebBrowser.openBrowserAsync('http://192.168.8.101/analytics/dashboard/login.php');
        }

    UpdateRecord = () => {
        fetch('http://192.168.8.101/DrowsinessDetection/update.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: this.state.TextInput_ID,
                userid: this.state.TextInput_UserID,
                name: this.state.TextInput_Name,
                email: this.state.TextInput_Email,
                password: this.state.TextInput_Password,
                age: this.state.TextInput_Age,
                gender: this.state.TextInput_Gender,
                maritalstatus: this.state.TextInput_MaritalStatus,
                healthstatus: this.state.TextInput_HealthStatus,
                vehicletype: this.state.TextInput_VehicleType,
                job: this.state.TextInput_Job
            })
        }).then((response) => response.json())
            .then((responseJson) => {

                // Showing response message coming from server updating records.
                Alert.alert(responseJson);

            }).catch((error) => {
                console.error(error);
            });
    }

    DeleteRecord = () => {
        fetch('http://192.168.8.101/DrowsinessDetection/delete.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: this.state.TextInput_ID
            })
        }).then((response) => response.json())
            .then((responseJson) => {

                // Showing response message coming from server after inserting records.
                Alert.alert(responseJson);

            }).catch((error) => {
                console.error(error);
            });

        this.props.navigation.navigate('First');
    }

    Logout = () => {
        this.props.navigation.navigate('First');

    }

    render() {

        return (
            <View style={styles.MainContainer}>
                <ScrollView >
                <Text style={{ fontSize: 25, textAlign: 'center', marginBottom: 20 }}> Update Record </Text>
                    <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.titleDesc}> Name: </Text>
                        <TextInput
                        placeholder="Name "
                        value={this.state.TextInput_Name}
                        onChangeText={TextInputValue => this.setState({ TextInput_Name: TextInputValue })}
                        underlineColorAndroid='transparent'
                        style={styles.TextInputStyleClass}
                        />
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.titleDesc}> User ID: </Text>
                        <TextInput
                            placeholder="User ID "
                            value={this.state.TextInput_UserID}
                            onChangeText={TextInputValue => this.setState({ TextInput_UserID: TextInputValue })}
                            underlineColorAndroid='transparent'
                            style={styles.TextInputStyleClass}
                        />
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.titleDesc}> Email: </Text>
                        <TextInput
                            placeholder="Email "
                            value={this.state.TextInput_Email}
                            onChangeText={TextInputValue => this.setState({ TextInput_Email: TextInputValue })}
                            underlineColorAndroid='transparent'
                            style={styles.TextInputStyleClass}
                        />
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.titleDesc}> Password: </Text>
                        <TextInput
                            placeholder="Password "
                            value={this.state.TextInput_Password}
                            onChangeText={TextInputValue => this.setState({ TextInput_Password: TextInputValue })}
                            underlineColorAndroid='transparent'
                            style={styles.TextInputStyleClass}
                        />
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.titleDesc}> Age: </Text>
                        <TextInput
                            placeholder="Age"
                            keyboardType = 'numeric'
                            value={this.state.TextInput_Age}
                            onChangeText={TextInputValue => this.setState({ TextInput_Age: TextInputValue })}
                            underlineColorAndroid='transparent'
                            style={styles.TextInputStyleClass}
                        />
                    </View>

                <View style={{ flexDirection: 'row' }}>
                <Text style={styles.titleDesc}> Gender: </Text>
                <View style={styles.picker}>
                    <Picker
                        selectedValue={this.state.TextInput_Gender}
                        onValueChange={(itemValue, itemIndex) => this.setState({ TextInput_Gender: itemValue })}
                        onPress={this.GetSelectedPickerItem}>
                        <Picker.Item label="Please choose one" />
                        <Picker.Item label="Male" value="Male" />
                        <Picker.Item label="Female" value="Female" />
                    </Picker>
                        </View>
                </View>

                    <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.titleDesc}> Marital: </Text>
                    <View style={styles.picker}>
                        <Picker
                            selectedValue={this.state.TextInput_MaritalStatus}
                            onValueChange={(itemValue, itemIndex) => this.setState({ TextInput_MaritalStatus: itemValue })}
                            onPress={this.GetSelectedPickerItem}>
                            <Picker.Item label="Please choose one" />
                            <Picker.Item label="Single" value="Single" />
                            <Picker.Item label="Married" value="Married" />
                        </Picker>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.titleDesc}> Vehicle: </Text>
                    <View style={styles.picker}>
                        <Picker
                            selectedValue={this.state.TextInput_VehicleType}
                            onValueChange={(itemValue, itemIndex) => this.setState({ TextInput_VehicleType: itemValue })}
                            onPress={this.GetSelectedPickerItem}>
                            <Picker.Item label="Please choose one" />
                            <Picker.Item label="Car" value="Car" />
                            <Picker.Item label="Truck" value="Truck" />
                            <Picker.Item label="Motorcar" value="Motorcar" />
                            <Picker.Item label="Multi Purposed Vehicle" value="MPV" />
                        </Picker>
                        </View>
                        </View>

                    <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.titleDesc}> Health: </Text>
                    <View style={styles.picker}>
                        <Picker
                            selectedValue={this.state.TextInput_HealthStatus}
                            onValueChange={(itemValue, itemIndex) => this.setState({ TextInput_HealthStatus: itemValue })}
                            onPress={this.GetSelectedPickerItem}>
                            <Picker.Item label="Please choose one" />
                            <Picker.Item label="Low Blood Sugar" value="Lowbloodsugar" />
                            <Picker.Item label="Depression" value="Depression" />
                            <Picker.Item label="Obesity" value="Obesity" />
                            <Picker.Item label="Diabetes" value="Diabetes" />
                            <Picker.Item label="Insomia" value="Insomia" />
                            <Picker.Item label="etc." value="Etc" />
                            <Picker.Item label="None" value="None" />
                        </Picker>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.titleDesc}> Occupation: </Text>
                    <View style={styles.picker}>
                        <Picker
                            selectedValue={this.state.TextInput_Job}
                            onValueChange={(itemValue, itemIndex) => this.setState({ TextInput_Job: itemValue })}
                            onPress={this.GetSelectedPickerItem}>
                            <Picker.Item label="Please choose one" />
                            <Picker.Item label="Secretaries" value="Secretaries" />
                            <Picker.Item label="Driver (Taxi, bus, truck driver and etc related with driving)" value="Driver" />
                            <Picker.Item label="Police" value="Police" />
                            <Picker.Item label="Financial Analysts" value="FinancialAnalysts" />
                            <Picker.Item label="Engineeer" value="Engineeer" />
                            <Picker.Item label="Doctor" value="Doctor" />
                            <Picker.Item label="Entrepreneur" value="Entrepreneur" />
                            <Picker.Item label="Other" value="Other" />
                        </Picker>
                        </View>
                    </View>

                            <TouchableOpacity activeOpacity={.4} style={styles.TouchableOpacityStyle2} onPress={this.UpdateRecord} >
                                <Text style={styles.TextStyle}> UPDATE INFORMATION </Text>
                            </TouchableOpacity>

                            <TouchableOpacity activeOpacity={.4} style={styles.TouchableOpacityStyle2} onPress={this.DeleteRecord} >
                                <Text style={styles.TextStyle}> DELETE INFORMATION </Text>
                            </TouchableOpacity>

                            <TouchableOpacity activeOpacity={.4} style={styles.TouchableOpacityStyle2} onPress={this.Logout} >
                                <Text style={styles.TextStyle}> LOG OUT </Text>
                            </TouchableOpacity>

                    <View style={{flex:1, justifyContent:'flex-start'}}>
                    <Button
                      title="DASHBOARD ANALYTICS "
                      onPress={this._handleOpenWithWebBrowser}
                      style={styles.button}
                    />
                </View>
              </ScrollView>
            </View>
        );
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//show profile detail //////////////////////////////////////
class adminUpdate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            TextInput_ID: '',
            TextInput_UserID: '',
            TextInput_Name: '',
            TextInput_Email: '',
            TextInput_Password: '',
            TextInput_Age: '',
            TextInput_Gender: '',
            TextInput_MaritalStatus: '',
            TextInput_VehicleType: '',
            TextInput_HealthStatus: '',
            TextInput_Job: '',
        }
    }

    componentDidMount() {

        this.setState(
        {
            TextInput_ID: this.props.navigation.state.params.ID,
            TextInput_UserID: this.props.navigation.state.params.USERID,
            TextInput_Name: this.props.navigation.state.params.NAME,
            TextInput_Email: this.props.navigation.state.params.EMAIL,
            TextInput_Password: this.props.navigation.state.params.PASSWORD,
            TextInput_Age: this.props.navigation.state.params.AGE,
            TextInput_Gender: this.props.navigation.state.params.GENDER,
            TextInput_MaritalStatus: this.props.navigation.state.params.MARITALSTATUS,
            TextInput_VehicleType: this.props.navigation.state.params.VEHICLETYPE,
            TextInput_HealthStatus: this.props.navigation.state.params.HEALTHSTATUS,
            TextInput_Job: this.props.navigation.state.params.JOB,  
        })
        
    }

    static navigationOptions =
        {
            title: 'Edit Information',
        };


              _handleOpenWithWebBrowser = () => {
            WebBrowser.openBrowserAsync('http://192.168.8.101/analytics/dashboard/login.php');
        }

    UpdateRecord = () => {
        fetch('http://192.168.8.101/DrowsinessDetection/update.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: this.state.TextInput_ID,
                userid: this.state.TextInput_UserID,
                name: this.state.TextInput_Name,
                email: this.state.TextInput_Email,
                password: this.state.TextInput_Password,
                age: this.state.TextInput_Age,
                gender: this.state.TextInput_Gender,
                maritalstatus: this.state.TextInput_MaritalStatus,
                healthstatus: this.state.TextInput_HealthStatus,
                vehicletype: this.state.TextInput_VehicleType,
                job: this.state.TextInput_Job
            })
        }).then((response) => response.json())
            .then((responseJson) => {

                // Showing response message coming from server updating records.
                Alert.alert(responseJson);

            }).catch((error) => {
                console.error(error);
            });
    }

    DeleteRecord = () => {
        fetch('http://192.168.8.101/DrowsinessDetection/delete.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: this.state.TextInput_ID
            })
        }).then((response) => response.json())
            .then((responseJson) => {

                // Showing response message coming from server after inserting records.
                Alert.alert(responseJson);

            }).catch((error) => {
                console.error(error);
            });

        this.props.navigation.navigate('First');
    }

    Logout = () => {
        this.props.navigation.navigate('First');

    }

    render() {

        return (
            <View style={styles.MainContainer}>
                <ScrollView >
                <Text style={{ fontSize: 25, textAlign: 'center', marginBottom: 20 }}> Update Record </Text>
                    <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.titleDesc}> Name: </Text>
                        <TextInput
                        placeholder="Name "
                        value={this.state.TextInput_Name}
                        onChangeText={TextInputValue => this.setState({ TextInput_Name: TextInputValue })}
                        underlineColorAndroid='transparent'
                        style={styles.TextInputStyleClass}
                        />
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.titleDesc}> User ID: </Text>
                        <TextInput
                            placeholder="User ID "
                            value={this.state.TextInput_UserID}
                            onChangeText={TextInputValue => this.setState({ TextInput_UserID: TextInputValue })}
                            underlineColorAndroid='transparent'
                            style={styles.TextInputStyleClass}
                        />
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.titleDesc}> Email: </Text>
                        <TextInput
                            placeholder="Email "
                            value={this.state.TextInput_Email}
                            onChangeText={TextInputValue => this.setState({ TextInput_Email: TextInputValue })}
                            underlineColorAndroid='transparent'
                            style={styles.TextInputStyleClass}
                        />
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.titleDesc}> Password: </Text>
                        <TextInput
                            placeholder="Password "
                            value={this.state.TextInput_Password}
                            onChangeText={TextInputValue => this.setState({ TextInput_Password: TextInputValue })}
                            underlineColorAndroid='transparent'
                            style={styles.TextInputStyleClass}
                        />
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.titleDesc}> Age: </Text>
                        <TextInput
                            placeholder="Age"
                            keyboardType = 'numeric'
                            value={this.state.TextInput_Age}
                            onChangeText={TextInputValue => this.setState({ TextInput_Age: TextInputValue })}
                            underlineColorAndroid='transparent'
                            style={styles.TextInputStyleClass}
                        />
                    </View>

                <View style={{ flexDirection: 'row' }}>
                <Text style={styles.titleDesc}> Gender: </Text>
                <View style={styles.picker}>
                    <Picker
                        selectedValue={this.state.TextInput_Gender}
                        onValueChange={(itemValue, itemIndex) => this.setState({ TextInput_Gender: itemValue })}
                        onPress={this.GetSelectedPickerItem}>
                        <Picker.Item label="Please choose one" />
                        <Picker.Item label="Male" value="Male" />
                        <Picker.Item label="Female" value="Female" />
                    </Picker>
                        </View>
                </View>

                    <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.titleDesc}> Marital: </Text>
                    <View style={styles.picker}>
                        <Picker
                            selectedValue={this.state.TextInput_MaritalStatus}
                            onValueChange={(itemValue, itemIndex) => this.setState({ TextInput_MaritalStatus: itemValue })}
                            onPress={this.GetSelectedPickerItem}>
                            <Picker.Item label="Please choose one" />
                            <Picker.Item label="Single" value="Single" />
                            <Picker.Item label="Married" value="Married" />
                        </Picker>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.titleDesc}> Vehicle: </Text>
                    <View style={styles.picker}>
                        <Picker
                            selectedValue={this.state.TextInput_VehicleType}
                            onValueChange={(itemValue, itemIndex) => this.setState({ TextInput_VehicleType: itemValue })}
                            onPress={this.GetSelectedPickerItem}>
                            <Picker.Item label="Please choose one" />
                            <Picker.Item label="Car" value="Car" />
                            <Picker.Item label="Truck" value="Truck" />
                            <Picker.Item label="Motorcar" value="Motorcar" />
                            <Picker.Item label="Multi Purposed Vehicle" value="MPV" />
                        </Picker>
                        </View>
                        </View>

                    <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.titleDesc}> Health: </Text>
                    <View style={styles.picker}>
                        <Picker
                            selectedValue={this.state.TextInput_HealthStatus}
                            onValueChange={(itemValue, itemIndex) => this.setState({ TextInput_HealthStatus: itemValue })}
                            onPress={this.GetSelectedPickerItem}>
                            <Picker.Item label="Please choose one" />
                            <Picker.Item label="Low Blood Sugar" value="Lowbloodsugar" />
                            <Picker.Item label="Depression" value="Depression" />
                            <Picker.Item label="Obesity" value="Obesity" />
                            <Picker.Item label="Diabetes" value="Diabetes" />
                            <Picker.Item label="Insomia" value="Insomia" />
                            <Picker.Item label="etc." value="Etc" />
                            <Picker.Item label="None" value="None" />
                        </Picker>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.titleDesc}> Occupation: </Text>
                    <View style={styles.picker}>
                        <Picker
                            selectedValue={this.state.TextInput_Job}
                            onValueChange={(itemValue, itemIndex) => this.setState({ TextInput_Job: itemValue })}
                            onPress={this.GetSelectedPickerItem}>
                            <Picker.Item label="Please choose one" />
                            <Picker.Item label="Secretaries" value="Secretaries" />
                            <Picker.Item label="Driver (Taxi, bus, truck driver and etc related with driving)" value="Driver" />
                            <Picker.Item label="Police" value="Police" />
                            <Picker.Item label="Financial Analysts" value="FinancialAnalysts" />
                            <Picker.Item label="Engineeer" value="Engineeer" />
                            <Picker.Item label="Doctor" value="Doctor" />
                            <Picker.Item label="Entrepreneur" value="Entrepreneur" />
                            <Picker.Item label="Other" value="Other" />
                        </Picker>
                        </View>
                    </View>

                            <TouchableOpacity activeOpacity={.4} style={styles.TouchableOpacityStyle2} onPress={this.UpdateRecord} >
                                <Text style={styles.TextStyle}> UPDATE INFORMATION </Text>
                            </TouchableOpacity>

                            <TouchableOpacity activeOpacity={.4} style={styles.TouchableOpacityStyle2} onPress={this.DeleteRecord} >
                                <Text style={styles.TextStyle}> DELETE INFORMATION </Text>
                            </TouchableOpacity>

                            <TouchableOpacity activeOpacity={.4} style={styles.TouchableOpacityStyle2} onPress={this.Logout} >
                                <Text style={styles.TextStyle}> LOG OUT </Text>
                            </TouchableOpacity>

                    <View style={{flex:1, justifyContent:'flex-start'}}>
                    <Button
                      title="DASHBOARD ANALYTICS "
                      onPress={this._handleOpenWithWebBrowser}
                      style={styles.button}
                    />
                </View>
              </ScrollView>
            </View>
        );
    }
}

export default MainProject = StackNavigator(
    {
        First: { screen: LoginActivity },
        Second: { screen: ShowDetailActivity },
        Third: { screen: UpdateActivity },
        Fourth: { screen: SignUpActivity },
        Fifth: {screen: adminUpdate}
    },

    {
        headerMode: 'screen',
        backgroundColor: 'rgb(255,2255,255)'
    }

    );

const styles = StyleSheet.create({

    MainContainer: {
        justifyContent: 'center',
        flexGrow: 1,
        margin: 10,
    },
    Container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    inputContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 30,
        borderWidth: 2,
        borderColor: '#FF5722',
        width: 250,
        height: 45,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    inputPageContainer:{
      
        justifyContent: 'center',
        alignItems: 'center',
    },
    MainContainer_For_ShowList_Activity: {
        flex: 1,
        paddingTop: (Platform.OS == 'ios') ? 20 : 0,
        marginLeft: 5,
        marginRight: 5,
    },
    TextInputStyleClass: {
        textAlign:'center',
        marginBottom: 7,
        height: 45,
        width: '70%',
        borderWidth: 2,
        borderColor: '#2196F3',
        borderRadius: 5,
        flex: 2,
    },

    TouchableOpacityStyle: {
        justifyContent:'center',
        alignItems: 'center',
        paddingLeft:20,
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 5,
        marginBottom: 7,
        width: '90%',
        backgroundColor: '#00BCD4'

    },

    TouchableOpacityStyle2: {
    flex: 1,
    flexDirection: 'column',
    justifyContent:'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 7,
    width: '100%',
    backgroundColor: '#00BCD4'

},

    TextStyle: {
        color: '#fff',
        textAlign: 'center',
    },

    rowViewContainer: {
        flex: 1,
        fontSize: 20,
        paddingRight: 10,
       justifyContent:'space-between'
    },
    inputs: {
        height: 45,
        marginLeft: 16,
        borderBottomColor: '#FFFFFF',
        flex: 1,
    },
    inputIcon: {
        width: 30,
        height: 30,
        marginLeft: 15,
        justifyContent: 'center'
    },
    TextComponentStyle: {
        fontSize: 20,
        color: "#000",
        textAlign: 'center',
        marginBottom: 15
    },
    titleDesc: {
        fontSize: 15,
        padding: 10,
        width: '30%',
        height: 60,
    },
    picker: {
        flex: 1,
        justifyContent: 'center',
        margin: 0.1
    },
    title: {
        fontSize: 20,
        paddingBottom: 40,
       
    }
});
