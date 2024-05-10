/* eslint-disable react-native/no-inline-styles */
/* eslint-disable quotes */
/* eslint-disable space-infix-ops */
/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import React, {FC, useCallback, useState} from 'react';
import Appbar from '../../component/Appbar';
import colors from '../../style/colors';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import {getMethod, getStorageData, postMethod} from '../../../utils/helper';
import {Card} from 'react-native-paper';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import VehicleScreen from '../Vehicle/VehicleScreen';

const {width} = Dimensions.get('window');
interface Props {
  navigation: any;
}
interface arrayProp {
  t_type: string;
  t_start_date: string;
  t_end_date: string;
  t_trip_fromlocation: string;
  t_trip_tolocation: string;
  t_totaldistance: string;
  t_customer_id: string;
}

const MaterialScreen: FC<Props> = ({navigation}) => {
  const [data, setData] = useState<arrayProp[]>([]);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useFocusEffect(
    useCallback(() => {
      VehicleListHandle();
    }, []),
  );
  // VehicleLis Function
  const VehicleListHandle = async () => {
    const storage = await getStorageData();
    try {
      setLoading(true);
      const response: any = await getMethod(`VMS/getvms_all_data`);
      if (response.status === 200) {
        console.log(response.data, 'responsed');
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
      <Appbar
        navigation={navigation}
        backgroundColor={colors.brand_secondary}
      />
      <ScrollView>
        <View style={styles.innerContainer}>
          <Text style={styles.taskText}>Task</Text>
          <View style={styles.heading}>
            <Text style={styles.headingText}>
              carrying construction materials
            </Text>
          </View>
          {loading ? (
            <ActivityIndicator size={20} color={colors.brand_primary} />
          ) : data ? (
            data.map((item: any) => (
              <View style={{padding: 10}} key={item.t_driver}>
                <View style={{padding: 5}} >
                  <Text style={styles.taskNo}>{item.t_type}</Text>
                  <Pressable
                    style={styles.detail}
                    onPress={() =>
                      navigation.dispatch(
                        CommonActions.navigate({
                          name: 'VehicleScreen',
                          params: {
                            t_driver: item.t_driver,
                          },
                        }),
                      )
                    }
                    >
                    <View style={styles.from}>
                      <Text style={styles.fromText}>From</Text>
                      <Text style={styles.fromAdd}>
                        {item.t_trip_fromlocation}
                      </Text>
                      <View style={{flexDirection: 'row'}}>
                        <IonIcon
                          name="location"
                          color={colors.brand_primary}
                          size={16}
                          style={{marginRight: 5}}
                        />
                        <Text style={styles.distance}>Distance</Text>
                      </View>
                    </View>
                    <View style={styles.to}>
                      <Text style={styles.fromText}>To</Text>
                      <Text style={styles.toAdd}>{item.t_trip_tolocation}</Text>

                      <Text style={styles.distance}>
                        {item.t_totaldistance}
                      </Text>
                    </View>
                  </Pressable>
                </View>
              </View>
            ))
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
      </ScrollView>
    </View>
  );
};

export default MaterialScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.brand_secondary,
  },
  innerContainer: {
    backgroundColor: colors.brand_secondary,
  },
  taskText: {
    color: colors.black,
    fontSize: 22,
    alignSelf: 'center',
    paddingVertical: 20,
    fontFamily: 'Poppins-Medium',
  },
  heading: {
    backgroundColor: colors.brand_primary,
  },
  headingText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    paddingVertical: 10,
    alignSelf: 'center',
    letterSpacing: 0.5,
  },
  taskNo: {
    color: colors.brand_primary,
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    fontWeight: '600',
    marginVertical: 10,
  },
  detail: {
    backgroundColor: colors.white,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 20,
    elevation: 10,
    margin: -5,
  },
  from: {
    width: width * 0.412,
  },
  fromText: {
    fontSize: 12,
    color: colors.black,
    fontFamily: 'Poppins-Medium',
  },
  to: {
    width: width * 0.412,
  },
  fromAdd: {
    fontSize: 10,
    height: 42,
    color: colors.gray,
    fontFamily: 'Poppins-Medium',
  },
  toAdd: {
    fontSize: 10,
    height: 42,
    color: colors.gray,
    fontFamily: 'Poppins-Medium',
  },
  distance: {
    fontSize: 12,
    color: colors.gray,
    fontFamily: 'Poppins-Medium',
  },
});
