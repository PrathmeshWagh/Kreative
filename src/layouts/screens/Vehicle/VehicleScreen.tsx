/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable quotes */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import React, {FC, useCallback, useEffect, useState} from 'react';
import MapView, {Marker, PROVIDER_GOOGLE, Polyline} from 'react-native-maps';
import colors from '../../style/colors';
import Appbar from '../../component/Appbar';
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import {getStorageData, getMethod} from '../../../utils/helper.js';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/FontAwesome';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
const {width, height} = Dimensions.get('window');
interface Props {
  navigation: any;
  route: any;
}

interface arrayProp {
  t_type: string;
  t_start_date: string;
  t_end_date: string;
  t_trip_fromlocation: string;
  t_trip_tolocation: string;
  t_totaldistance: string;
}

const SCREEN_HEIGHT = height;
const SCREEN_WIDTH = width;
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const VehicleScreen: FC<Props> = ({navigation, route}) => {
  const {t_driver} = route.params;
  const [data, setData] = useState([]);
  const [data0, setData0] = useState([]);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [regionFinal, setRegionFinal] = useState({
    latitude0: 0,
    longitude0: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useFocusEffect(
    useCallback(() => {
      MapHandle();
      VehicleDetailsHandle();
    }, [regionFinal.latitude0,regionFinal.longitude0]),
  );

  // VehicleDetails Function
  const VehicleDetailsHandle = async () => {
    const storage = await getStorageData();
    console.log(t_driver, 't_driver55');
    try {
      setLoading(true);
      const response: any = await getMethod(`VMS/getvms_data?id=${t_driver}`);
      if (response.data.status === true) {
        setData(response.data.data[0]);
        setData0(response.data.data.extra);
        console.log(response.data.data[0].t_vechicle, 'responsed');
        await AsyncStorage.setItem('t_dirver',response.data.data[0].t_vechicle)
        setMessage(response.data.message);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const MapHandle = async () => {
    try {
      setLoading(true);
      const response: any = await getMethod(`VMS/get_longitude?id=${t_driver}`);
      if (response.status === 200) {
        console.log(response.data.data.from.results[0].geometry.location.lat,t_driver)
        const latitude =
          response.data.data.from.results[0].geometry.location.lat;
        const longitude =
          response.data.data.from.results[0].geometry.location.lng;
        setRegion({
          ...regionFinal,
          latitude,
          longitude,
        });
        const latitude0 =
          response.data.data.to.results[0].geometry.location.lat;
        const longitude0 =
          response.data.data.to.results[0].geometry.location.lng;
        setRegionFinal({
          ...region,
          latitude0,
          longitude0,
        });
         setMessage(response.data.message);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Appbar
        title={'Loading Trucks'}
        backgroundColor={colors.white}
        navigation={navigation}
      />
      {loading ? (
        <ActivityIndicator size={20} color={colors.brand_primary} />
      ) : data ? (
        data && (
          <ScrollView key={data.t_vechicle}>
            <View style={styles.image_bg}>
              <Image
                source={require('../../img/jcb.png')}
                style={styles.jcb_image}
              />
            </View>
            <MapView
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                latitude: region.latitude,
                longitude: region.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}>
              <Marker
                coordinate={{
                  latitude: region.latitude,
                  longitude: region.longitude,
                }}
                pinColor="blue"></Marker>

              {/* Final Place Marker */}
              <Marker
                coordinate={{
                  latitude: regionFinal.latitude0,
                  longitude: regionFinal.longitude0,
                }}
                pinColor="red"></Marker>

              <Polyline
                coordinates={[
                  {latitude: region.latitude, longitude: region.longitude}, // Initial place coordinates
                  {
                    latitude: regionFinal.latitude0,
                    longitude: regionFinal.longitude0,
                  }, // Final place coordinates
                ]}
                strokeColor="red"
                strokeWidth={2}
                lineDashPattern={[6, 3]}
              />
            </MapView>
            {/* ADDRESSVIEW============== */}
            <View>
              <Text style={styles.addressHead}>Address</Text>
              <View style={styles.from_to_view}>
                <View style={styles.from_view}>
                  <Text style={styles.addressHeadText}>From</Text>
                  <Text style={styles.address}>{data.t_trip_fromlocation}</Text>
                </View>
                <View style={styles.to_view}>
                  <Text style={styles.addressHeadText}>To</Text>
                  <Text style={styles.address}>{data.t_trip_tolocation}</Text>
                </View>
              </View>
            </View>
            {/* ADDRESSVIEW============== */}

            <View style={styles.distanceView}>
              <View style={styles.tagView}>
                <Image
                  source={require('../../img/arrival-icon.png')}
                  style={styles.icon}
                />
                <Text style={styles.tag}>Arrival Time</Text>
              </View>
              <View>
                <Text style={styles.time}>{data0.arrivalTime}</Text>
              </View>
            </View>
            <View style={styles.distanceView}>
              <View style={styles.tagView}>
                <Image
                  source={require('../../img/distance_icon.png')}
                  style={styles.distance_icon}
                />
                <Text style={styles.tag}>Distance</Text>
              </View>
              <View>
                <Text style={styles.time}>{data0.distance}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.btn}
                // t_vechicle
                onPress={() =>
                  navigation.dispatch(
                    CommonActions.navigate({
                      name: 'VehicleDetailsScreen',
                     
                    }),
                  )
                }
              >
              <Text style={styles.btnText}>Vehicle Detail</Text>
            </TouchableOpacity>
          </ScrollView>
        )
      ) : (
        <Text
          style={{
            fontSize: responsiveFontSize(3.5),
            color: colors.brand_primary,
            textAlign: 'center',
            alignItems: 'center',
            marginTop: 20,
          }}>
          {message}
        </Text>
      )}
    </View>
  );
};

export default VehicleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  head: {
    alignSelf: 'center',
    marginTop: 10,
    color: colors.brand_primary,
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    fontWeight: '600',
  },
  jcb_image: {
    width: width * 1,
    height: width * 0.55,
  },
  image_bg: {
    marginBottom: 5,
  },
  map_bg: {
    paddingTop: 15,
  },
  map: {
    height: width * 0.7,
    width: width * 0.99,
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 20,
    elevation: 8,
    backgroundColor: colors.white,
    margin: -5,
  },
  addressHead: {
    paddingVertical: 15,
    fontSize: 16,
    color: colors.account_font,
    fontWeight: '700',
    paddingLeft: 20,
  },
  from_to_view: {
    backgroundColor: colors.brand_secondary,
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'space-between',
    elevation: 5,
    marginBottom: 20,
  },
  addressHeadText: {
    color: colors.brand_primary,
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    fontWeight: '600',
  },
  from_view: {
    width: width * 0.45,
  },
  to_view: {
    width: width * 0.45,
  },
  address: {
    fontSize: 12,
    color: colors.account_font,
  },
  distanceView: {
    padding: 15,
    flexDirection: 'row',
    // justifyContent:'space-between',
  },
  tagView: {
    width: width * 0.5,
    flexDirection: 'row',
  },
  tag: {
    color: colors.account_font,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  icon: {
    height: 18,
    width: 15,
    marginRight: 15,
  },
  distance_icon: {
    height: 20,
    width: 20,
    marginRight: 10,
  },
  time: {
    color: colors.account_font,
    fontWeight: '700',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  btn: {
    backgroundColor: colors.brand_primary,
    paddingVertical: 10,
    paddingHorizontal: 40,
    alignSelf: 'center',
    marginVertical: 35,
    borderRadius: 20,
  },
  btnText: {
    color: colors.white,
    fontSize: 14,
  },
});
