/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {FC} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import colors from '../../../style/colors';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {ActivityIndicator} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';
import {CommonActions} from '@react-navigation/native';
import {getStorageData, postMethod} from '../../../../utils/helper';
import Snackbar from 'react-native-snackbar';
import Appbar from '../../../component/Appbar';
// import Geolocation from 'react-native-geolocation-service';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {err} from 'react-native-svg';
import {set} from 'react-hook-form';
interface Props {
  navigation: any;
}
const MarkAttendance: FC<Props> = ({navigation}): JSX.Element => {
  const [punchData, setPunchData] = useState([]);
  const [punchOut, setPunchOut] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timeid, setTimeid] = useState(null);
  const [punched, setPunched] = useState(false);
  const [address, setAddress] = useState(null);
  const [message, setMessage] = useState(null);
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'android') {
        requestLocationPermission();
      } else {
        getLocation();
      }
      setTimeout(() => {
        updateDataIfNotNull();
      }, 1000);
    }, [address]),
  );

  // Request location permission
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'App needs access to your location.',
          buttonPositive: '',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getLocation();
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err, 'error');
    }
  };

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      (position: {coords: any}) => {
        const {latitude, longitude}: any = position.coords;
        setRegion({
          ...region,
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });

        fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyB5D8cCcugZPm2WiQh106c-K1-2dmSEiv0`,
        )
          .then(response => response.json())
          .then(data => {
            if (data.results && data.results.length > 0) {
              setAddress(data.results[0].formatted_address);
            }
          })
          .catch(error => {
            console.error('Error fetching address:', error);
          });
      },
      (error: any) => console.error(error),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  };

  // Punch In Function
  const PunchHandle = async () => {
    const storage = await getStorageData();
    const row = {
      user_id: storage.data[0].id,
      latitude: region.latitude,
      longitude: region.longitude,
    };
    try {
      setLoading(true);
      const response: any = await postMethod('Attendance/punch_in', row);
      if (response.status === 200) {
        setPunchData(response.data.data);
        await AsyncStorage.setItem(
          'punchin',
          JSON.stringify(response.data.data),
        );
        await AsyncStorage.setItem(
          'time_id',
          JSON.stringify(response.data.time_id),
        );
        setTimeid(response.data.time_id);
        setMessage(response.data.message);
        Snackbar.show({
          text: response.data.message,
          duration: 1000,
          textColor: colors.white,
          backgroundColor: 'green',
        });
        setPunched(true);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  // Punch out function
  const PunchOutHandle = async () => {
    const storage = await getStorageData();
    const storeTimeId = await AsyncStorage.getItem('time_id');
    const parsedTimeId = JSON.parse(storeTimeId);
    console.log(parsedTimeId,'454p');

    const row = {
      user_id: storage.data[0].id,
      latitude: region.latitude,
      longitude: region.longitude,
      time_id: parsedTimeId,
    };
    try {
      setLoading(true);
      const response: any = await postMethod('Attendance/punch_out', row);
      if (response.status === 200) {
        await AsyncStorage.setItem(
          'punchOut',
          JSON.stringify(response.data.data),
        );
        setPunchOut(response.data.data);

        setMessage(response.data.message);
        setLoading(false);
        Snackbar.show({
          text: response.data.message,
          duration: 1000,
          textColor: colors.white,
          backgroundColor: colors.brand_primary,
        });
      }
      setPunched(false);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error:', error);
    }
  };

  const updateDataIfNotNull = async () => {
    try {
      const storedPunchIn = await AsyncStorage.getItem('punchin');
      const storedPunchOut = await AsyncStorage.getItem('punchOut');
      const parsedPunchIn = JSON.parse(storedPunchIn);
      const parsedPunchOut = JSON.parse(storedPunchOut);
      if (parsedPunchIn) {
        setPunchData(parsedPunchIn);
        setPunched(true)
      }
  
      if (parsedPunchOut) {
        setPunchOut(parsedPunchOut);
        setPunched(false)

      }
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };
  const formatDate = (dateTimeString: string | number | Date) => {
    if (!dateTimeString) {
      return '';
    }
    const date = new Date(dateTimeString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatTime = (dateTimeString: string | number | Date) => {
    if (!dateTimeString) {
      return '';
    }
    const date = new Date(dateTimeString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <>
      <Appbar
        title={'Mark Attendance'}
        backgroundColor={colors.white}
        navigation={navigation}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 30,
          marginBottom: 20,
          paddingHorizontal: 10,
        }}
      />
      {loading ? (
        <ActivityIndicator size={20} color={colors.brand_primary} />
      ) : (
        <>
          <View style={styles.columnBox}>
            <View style={styles.locationColumn}>
              <Icon name="map-marker" size={50} color="red" />
              <Text style={styles.location}>Live Location</Text>
            </View>
            <Text style={styles.textItem}>{address}</Text>
            <View style={styles.row}>
              {punched ? (
                <>
                  <Text style={styles.colText0}>
                    {formatDate(punchData.clock_in)}
                  </Text>
                  <Text style={styles.colText0}>
                    {formatTime(punchData.clock_in)}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.colText0}>
                    {formatDate(punchOut.clock_out)}
                  </Text>
                  <Text style={styles.colText0}>
                    {formatTime(punchOut.clock_out)}
                  </Text>
                </>
              )}
            </View>
            {punched ? (
              <View style={styles.Circle0}>
                <View style={styles.Circle}>
                  <Pressable
                    style={styles.punch0}
                    onPress={() => PunchOutHandle()}>
                    <Icon name="hand-paper-o" size={20} color="white" />
                    <Text style={styles.colText1}>Punch Out</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <View style={styles.Circle0}>
                <View style={styles.Circle}>
                  <Pressable style={styles.punch} onPress={() => PunchHandle()}>
                    <Icon name="hand-paper-o" size={20} color="white" />
                    <Text style={styles.colText1}>Punch In</Text>
                  </Pressable>
                </View>
              </View>
            )}
            <Pressable onPress={() => navigation.navigate('AttendanceScreen')}>
              <Text style={styles.colText0}>Attendance Details</Text>
            </Pressable>
          </View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  columnBox: {
    width: responsiveWidth(90),
    height: responsiveHeight(55),
    marginTop: 50,
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF4F5',
    marginBottom: 10,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 1.2,
    },
    padding: 15,
    shadowOpacity: 0.5,
    elevation: 5,
  },
  column2: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  colText: {
    color: 'black',
    fontFamily: 'Roboto-Light',
    fontSize: 15,
  },
  colText0: {
    color: colors.brand_primary,
    fontFamily: 'Roboto-Light',
    fontSize: 15,
    marginBottom: 5,
  },
  colText1: {
    color: 'white',
    fontFamily: 'Roboto-Light',
    fontSize: 15,
    marginBottom: 5,
  },
  text0: {
    color: colors.brand_primary,
    fontFamily: 'Roboto-Bold',
    fontSize: 22,
    marginBottom: 5,
  },

  button0: {
    width: 130,
    height: 35,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: colors.gray,
  },
  button: {
    width: 130,
    height: 35,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: colors.brand_primary,
  },
  locationColumn: {
    width: 150,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 10,
  },
  location: {
    fontSize: 17,
    color: colors.brand_primary,
    marginBottom: 10,
  },
  textItem: {
    letterSpacing: 1,
    color: colors.gray,
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 15,
  },
  row: {
    alignSelf: 'center',
    textAlign: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  Circle0: {
    width: 135,
    height: 135,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 120,
  },
  Circle: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 120,
  },
  punch: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: colors.white,
    borderWidth: 2,
    justifyContent: 'center',
    backgroundColor: colors.brand_primary,
    alignItems: 'center',
    marginBottom: 0,
  },
  punch0: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
  },
});

export default MarkAttendance;
