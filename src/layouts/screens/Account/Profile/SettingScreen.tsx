/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import colors from '../../../style/colors';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Appbar from '../../../component/Appbar';
import AppbarAccount from '../../../component/AppbarAccount';
import {getMethod, postMethod} from '../../../../utils/helper';
import NotificationScreen from './NotificationScreen';
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import {Badge} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props {
  navigation: any;
}
const {width} = Dimensions.get('window');
const SettingScreen: React.FC<Props> = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [notificationCount, setNotificationCount] = useState([]);
  const [userDetails, setUserDetails] = useState(null);

  useFocusEffect(
    useCallback(() => {
      getStoredData();
      fetchNotificationNumber();
    }, []),
  );

  const getStoredData = async () => {
    try {
      const storedData = await getStoredData();
      setUserDetails(storedData);
    } catch (error) {
      console.log('Error retrieving images:', error);
    }
  };

  const LogOut = async () => {
    try {
      const api: any = await getMethod('login/logout');
      if (api.status === 200) {
        await AsyncStorage.removeItem('user_data');
        navigation.reset({
          routes: [{name: 'LoginScreen'}],
        });
      } else {
        Snackbar.show({
          text: api.data.message,
          duration: Snackbar.LENGTH_SHORT,
          textColor: '#AE1717',
          backgroundColor: '#F2A6A6',
        });
      }
    } catch (e) {
      Snackbar.show({
        text: 'Some Error Occured-' + e,
        duration: Snackbar.LENGTH_SHORT,
        textColor: '#AE1717',
        backgroundColor: '#F2A6A6',
      });
    }
  };

  const fetchNotificationNumber = async () => {
    try {
      setLoading(true);
      const response: any = await getMethod('Notification/notificaton_total');
      if (response.status === 200) {
        setNotificationCount(response.data.data);
        console.log(response.data.data,'right');

      }
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      <AppbarAccount title={'Settings'} />
      <ScrollView>
        <View style={{paddingHorizontal: 20, marginVertical: 20}}>
          {/* OPTIONS========================== */}
          {/* <TouchableOpacity style={styles.optionView}>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.iconDiv}>
                <Image
                  source={require('../../../img/language-icon.png')}
                  style={styles.iconImage}
                />
              </View>
              {/* <View style={styles.options}>
                <Text style={styles.optionsText}>Language</Text>
                <Text style={styles.optionsText2}>English</Text>
              </View> */}
          {/* </View> */}
          {/* <View style={styles.iconView}>
              <IonIcon
                name="chevron-forward"
                color={colors.gray}
                size={20}
                onPress={() => navigation.navigate('Language')}
              />
            </View>
          </TouchableOpacity> */}
          {/* OPTIONS========================== */}

          {/* OPTIONS========================== */}
          {/* <TouchableOpacity
            style={styles.optionView}
            onPress={() => navigation.navigate('ChangePasswordScreen')}>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.iconDiv}>
                <Image
                  source={require('../../../img/change-password.png')}
                  style={styles.password}
                />
              </View>
              <View style={styles.options}>
                <Text style={styles.optionsText}>Change Password</Text>
                {/* <Text style={styles.optionsText2}>English</Text> */}
          {/* </View>
            </View>
            <View style={styles.iconView}>
              <IonIcon name="chevron-forward" color={colors.gray} size={20} />
            </View>
          </TouchableOpacity> */}
          {/* OPTIONS========================== */}

          {/* OPTIONS========================== */}
          {/* <TouchableOpacity style={styles.optionView}>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.iconDiv}>
                <Image
                  source={require('../../../img/location-icon.png')}
                  style={styles.location}
                />
              </View>
              <View style={styles.options}>
                <Text style={styles.optionsText}>Location</Text>
                <Text style={styles.optionsText2}>Allow</Text>
              </View>
            </View>
          </TouchableOpacity> */}
          {/* OPTIONS========================== */}

          {/* OPTIONS========================== */}
          <TouchableOpacity
            style={styles.optionView}
            onPress={() =>
              navigation.dispatch(
                CommonActions.navigate({
                  name: 'NotificationScreen',
                  params: {
                    notificationData: notificationCount,
                  },
                }),
              )
            }>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.iconDiv}>
                <Image
                  source={require('../../../img/bell-image.png')}
                  style={styles.bellImage}
                />
                {notificationCount ? (
                  <Badge
                    style={{
                      marginVertical: -27,
                      marginRight: 20,
                      width: 20,
                      height: 20,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {notificationCount}
                  </Badge>
                ) : null}
              </View>
              <View style={styles.options}>
                <Text style={styles.optionsText}>Notification</Text>
              </View>
            </View>
            {/* <View style={styles.iconView}>
                        <IonIcon name="chevron-forward" color={colors.gray} size={20} onPress={() => navigation.navigate('Language')} />
                    </View> */}
          </TouchableOpacity>
          {/* OPTIONS========================== */}

          {/* OPTIONS========================== */}
          {/* <View style={styles.optionView}>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.iconDiv}>
                <Image
                  source={require('../../../img/help.png')}
                  style={styles.help}
                />
              </View>
              <View style={styles.options}>
                <Text style={styles.optionsText}>Help center</Text>
              </View>
            </View>
          </View>
          {/* OPTIONS========================== */}

          {/* OPTIONS========================== */}
          {/* <View style={styles.optionView}>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.iconDiv}>
                <Image
                  source={require('../../../img/general.png')}
                  style={styles.help}
                />
              </View>
              <View style={styles.options}>
                <Text style={styles.optionsText}>General</Text>
              </View>
            </View>
          </View> */}
          {/* OPTIONS========================== */}

          {/* OPTIONS========================== */}
          {/* <View style={styles.optionView}>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.iconDiv}>
                <Image
                  source={require('../../../img/info-icon.png')}
                  style={styles.help}
                />
              </View>
              <View style={styles.options}>
                <Text style={styles.optionsText}>About us</Text>
              </View>
            </View>
          </View> */}
          {/* OPTIONS========================== */}

          {/* OPTIONS========================== */}
          <TouchableOpacity
            style={styles.materialView}
            onPress={() => navigation.navigate('MaterialCostScreen')}>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.iconDiv}>
                <Image
                  source={require('../../../img/money.png')}
                  style={styles.help}
                />
              </View>
              <View style={styles.options}>
                <Text style={styles.optionsText}>Materials cost</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.materialView} onPress={LogOut}>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.iconDiv}>
                <MaterialCommunityIcons
                  name="logout"
                  color={colors.brand_primary}
                  size={20}
                />
              </View>
              <View style={styles.options}>
                <Text style={styles.optionsText}>Sign Out</Text>
              </View>
            </View>
          </TouchableOpacity>
          {/* OPTIONS========================== */}

          <View>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <IonIcon
                name="close-circle"
                color={colors.black}
                size={40}
                style={styles.closeIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.brand_secondary,
    flex: 1,
  },
  bg: {
    height: width * 0.48,
  },
  backArrow: {
    marginLeft: 10,
    marginTop: 10,
  },
  head: {
    color: colors.white,
    fontSize: 24,
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.3,
    alignSelf: 'center',
    marginTop: 20,
  },
  iconImage: {
    height: 35,
    width: 35,

    marginTop: 3,
  },
  password: {
    height: 25,
    width: 25,
    marginLeft: 5,
    marginTop: 3,
  },
  location: {
    height: 22,
    width: 15,
    marginLeft: 9,
    marginTop: 7,
  },
  bellImage: {
    width: 20,
    height: 20,
    marginLeft: 7,
    marginTop: 3,
  },
  help: {
    height: 20,
    width: 20,
    marginLeft: 7,

    marginTop: 3,
  },
  options: {
    justifyContent: 'center',
  },
  optionsText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: colors.black,
  },
  optionsText2: {
    fontFamily: 'Poppins-Medium',
    fontSize: 10,
    color: colors.gray,
  },
  iconView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionView: {
    height: width * 0.11,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: colors.gray,
    borderBottomWidth: 0.5,
    paddingVertical: 5,
    alignItems: 'center',
  },
  materialView: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // borderBottomColor: colors.gray,
    // borderBottomWidth: 0.5,
    paddingVertical: 5,
    alignItems: 'center',
  },
  iconDiv: {
    width: width * 0.15,
  },
  closeIcon: {
    alignSelf: 'center',
    // width: width * 0.12,
    marginTop: 20,
  },
});
