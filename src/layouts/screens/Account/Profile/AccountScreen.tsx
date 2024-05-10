/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import colors from '../../../style/colors';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {NavigationContainer, useFocusEffect} from '@react-navigation/native';
import NotificationScreen from './NotificationScreen';
import SettingScreen from './SettingScreen';
import {useInfoContext} from '../../../navigation/TabNavigation/TabNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
interface Props {
  navigation: any;
}
const {width} = Dimensions.get('window');
const AccountScreen: React.FC<Props> = ({navigation}) => {
  const item = useInfoContext();
  const [profileInfo, setProfileInfo] = useState(null);

  useFocusEffect(
    useCallback(() => {
      fatchData();
    }, []),
  );

  const fatchData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('image');
      if (jsonValue !== null) {
        const parsedValue = JSON.parse(jsonValue);
        setProfileInfo(parsedValue);
        console.log('profileInfo:', profileInfo);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.profileContainer}>
          {profileInfo !== null  ? (
              <Image
                source={{uri: profileInfo.profile_picture}}
                style={styles.profileImage}
              />
          ) : (
            <Image
            source={require('../../../img/profile-image.png')}
            style={styles.profileImage}
          />
          )}
          <Text style={styles.name}>
            {item.userFirst} {item.userLast}
          </Text>
        </View>
        <View>
          <TouchableOpacity
            style={styles.buttons}
            onPress={() => navigation.navigate('MarkAttendance')}>
            <MaterialCommunityIcons
              name="card-account-mail-outline"
              color={colors.account_font}
              size={23}
              style={styles.icon}
            />
            <Text style={styles.btnText}>Attendance</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttons}
            onPress={() => navigation.navigate('AllLeavesScreen')}>
            <MaterialCommunityIcons
              name="calendar-multiple-check"
              color={colors.account_font}
              size={23}
              style={styles.icon}
            />
            <Text style={styles.btnText}>Leave</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttons}
            onPress={() => navigation.navigate('PayrollScreen')}>
            <Image
              source={require('../../../img/payroll-icon.png')}
              style={styles.iconImage}
            />
            <Text style={styles.btnText}>Payroll</Text>
          </TouchableOpacity>
          <View style={styles.horizontalLine} />
          <Text style={styles.accountText}>ACCOUNT</Text>
          <TouchableOpacity
            style={styles.buttons}
            onPress={() => navigation.navigate('ProfileScreen')}>
            <IonIcon
              name="person"
              color={colors.account_font}
              size={20}
              style={styles.icon}
            />
            <Text style={styles.btnText}>My Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttons}
            onPress={() => navigation.navigate('SettingScreen')}>
            <MaterialIcons
              name="settings"
              color={colors.account_font}
              size={23}
              style={styles.icon}
            />
            <Text style={styles.btnText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.brand_secondary,
    padding: 20,
  },
  profileContainer: {
    marginVertical: 30,
    flexDirection: 'row',
    width: width * 0.7,
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  profileImage: {
    height: responsiveHeight(10),
    width: responsiveWidth(20),
    alignSelf: 'center',
    position: 'relative',
    borderRadius: 70,
    marginBottom: -15,
  },
  name: {
    color: colors.brand_primary,
    fontFamily: 'Poppins-Medium',
    fontWeight: '700',
    fontSize: 22,
    alignSelf: 'center',
  },
  buttons: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  icon: {
    marginRight: 10,
  },
  btnText: {
    color: colors.account_font,
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    fontWeight: '600',
  },
  iconImage: {
    height: 25,
    width: 25,
    marginRight: 10,
  },
  iconImageSub: {
    height: 24,
    width: 22,
    marginRight: 10,
  },
  horizontalLine: {
    borderBottomColor: colors.account_font, // Change the color as needed
    borderBottomWidth: 1, // Adjust the width as needed
    marginVertical: 20, // Adjust the margin as needed
  },
  accountText: {
    color: colors.red,
    fontFamily: 'Poppins-Medium',
    marginBottom: 5,
  },
});
