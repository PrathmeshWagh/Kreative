/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {FC, useCallback, useState} from 'react';

// import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import IonIcon from 'react-native-vector-icons/Ionicons';
import colors from '../../style/colors';
import {useFocusEffect} from '@react-navigation/native';
import {getStorageData, getMethod} from '../../../utils/helper';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width} = Dimensions.get('window');
interface Props {
  navigation: any;
  route:any
}

const VehicleDetailsScreen: FC<Props> = ({navigation,route}) => {
  // const {t_vechicle} = route.params; 
  const [data, setData] = useState([]);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useFocusEffect(
    useCallback(() => {
      VehicleDetailsHandle();
    }, []),
  );
  // VehicleDetails Function
  const VehicleDetailsHandle = async () => {
    const t_vechicle = await AsyncStorage.getItem('t_dirver');
    console.log(t_vechicle,'t_vechicle');
    try {
      setLoading(true);
      const response: any = await getMethod(`VMS/getvehicle_data?id=${t_vechicle}`);
      if (response.status === 200) {
        console.log(response.data.data, 'responsedin');
        setData(response.data.data);
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
      {/* Top Box START */}
      <View style={styles.topBox}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <IonIcon name="arrow-back" color={colors.white} size={24} />
        </TouchableOpacity>
        <Text style={styles.vehicleDetails}>Vehicle Detail</Text>
      </View>
      {/* Top Box END */}
      {loading ? (
        <ActivityIndicator size={20} color={colors.brand_primary} />
      ) : data ? (
        data.map((item: any) => (
          <ScrollView>
            <TouchableOpacity
              style={styles.odometer}
              onPress={() => navigation.navigate('OdometerScreen')}
              >
              <Text style={styles.bttn}>Odometer</Text>
            </TouchableOpacity>

            {/* Image Box START */}
            <View style={styles.image}>
              <Image
                style={styles.truck}
                source={require('../../img/truck.png')}
              />
              <Text style={styles.truckText}>
                Haulage BharatBenz 2823R 28 Ton Heavy Duty Tipper Truck
              </Text>
            </View>
            {/* Image Box END */}

            {/* Text Boxes START */}
            <View style={styles.textBoxes}>
              <View style={styles.box1}>
                <Text style={styles.brand}>Brand</Text>
                <Text style={styles.detail}>{item.v_name}</Text>
              </View>

              {/* <View style={styles.box1}>
                <Text style={styles.brand}>Maximum Torque</Text>
                <Text style={styles.detail}>850 Nm@1200-1600 rpm</Text>
              </View> */}

              <View style={styles.box1}>
                <Text style={styles.brand}>Model No</Text>
                <Text style={styles.detail}>{item.v_model}</Text>
              </View>

              <View style={styles.box1}>
                <Text style={styles.brand}>Engine</Text>
                <Text style={styles.detail}>{item.v_engine_no}</Text>
              </View>

              {/* <View style={styles.box1}>
                <Text style={styles.brand}>Clutch Type</Text>
                <Text style={styles.detail}>
                  Single Dry Plate, Hydraulic Control
                </Text>
              </View>

              <View style={styles.box1}>
                <Text style={styles.brand}>Max Torque</Text>
                <Text style={styles.detail}>850 Nm Torque</Text>
              </View> */}
            </View>
            {/* Text Boxes END */}
            <TouchableOpacity
              style={styles.btn}
              onPress={() => navigation.navigate('VehicleMaintenanceScreen')}>
              <Text style={styles.btnText}>Vehicle Maintenance</Text>
            </TouchableOpacity>
          </ScrollView>
        ))
      ) : (
        <Text
          // eslint-disable-next-line react-native/no-inline-styles
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

export default VehicleDetailsScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    paddingBottom: 20,
  },
  topBox: {
    backgroundColor: colors.brand_primary,
    padding: 10,
    height: 100,
  },
  vehicleDetails: {
    color: colors.white,
    fontWeight: '500',
    alignSelf: 'center',
    fontSize: 18,
  },
  odometer: {
    backgroundColor: colors.text_date,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    color: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginVertical: 10,
    marginRight: 10,
  },
  bttn: {
    color: colors.white,
    fontWeight: '500',
    fontSize: 16,
  },
  image: {},
  truck: {
    marginTop: 10,
    width: width * 0.8,
    height: width * 0.5,
    alignSelf: 'center',
  },
  truckText: {
    width: 190,
    alignSelf: 'center',
    color: colors.brand_primary,
    fontWeight: '500',
    marginTop: 0,
  },
  textBoxes: {
    marginTop: 30,
    marginBottom: 10,
  },
  box1: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: colors.brand_secondary,
    width: width * 0.8,
    alignSelf: 'center',
    elevation: 5,
    marginBottom: 10,
  },
  brand: {
    color: colors.black,
    fontSize: width * 0.022,
    fontFamily: 'Poppins-Medium',
    width: width * 0.28,
  },
  detail: {
    color: colors.black,
    fontSize: width * 0.022,
    fontFamily: 'Poppins-Medium',
  },
  btn: {
    backgroundColor: colors.brand_primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginVertical: 25,
    borderRadius: 20,
  },
  btnText: {
    color: colors.white,
    fontSize: 14,
  },
});
