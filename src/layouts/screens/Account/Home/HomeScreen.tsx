/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {FC, useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native';
import colors from  '../../../style/colors';
import {ActivityIndicator, Surface} from 'react-native-paper';
import { getMethod,getStorageData,postMethod, } from '../../../../utils/helper';
import {useFocusEffect} from '@react-navigation/native';
import { useInfoContext } from '../../../navigation/TabNavigation/TabNavigation';
import { Item } from 'react-native-paper/lib/typescript/components/Drawer/Drawer';

const {width} = Dimensions.get('window');
interface Props {
  navigation: any;
  route: any;
}
const HomeScreen: FC<Props> = ({navigation, route}: any) => {
  const item = useInfoContext();
  const [userAddress, setUserAddress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [storageD, setStorageD] = useState([]);
  useFocusEffect(
    useCallback(() => {
      HomeFuntion();
      item;
    }, []),
  );

  // HomeFunction
  const HomeFuntion = async () => {
    const storage = await getStorageData();
    const row = {
      user_id: storage.data[0].id,
    };
    try {
      setLoading(true);
      const response: any = await postMethod('Dashboard/dashboard_data', row);
      if (response.status === 200) {
        setData(response.data.data);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e, 'error');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../../img/logo.png')} style={styles.logo} />
      </View>
      {loading ? (
        <ActivityIndicator size={20} color={colors.brand_primary} />
      ) : (
        data && (
          <View style={styles.cover}>
            <Pressable style={styles.clock} onPress={()=>navigation.navigate('MarkAttendance')}>
              <Text style={styles.clockText}>Clock in</Text>
            </Pressable>
            <Text style={styles.text}>
              Hi {item.userFirst} {item.userLast}
            </Text>
            <Text style={styles.text_secondary}>{data.pending} Task are Pending</Text>
            <View style={styles.card}>
              <View
                style={{
                  flexDirection: 'row',
                  marginLeft: -20,
                  justifyContent: 'space-around',
                  alignItems: 'flex-start',
                }}>
                <Text style={styles.text1}>Today Task</Text>
                <Pressable
                  onPress={() => navigation.navigate('MaterialScreen')}>
                  <View style={styles.btn}>
                    <Text style={styles.textbtn}>Start Job </Text>
                  </View>
                </Pressable>
                <Pressable
                  onPress={() => navigation.navigate('ProjectScreen')}
                  style={styles.btn}>
                  <Text style={styles.textbtn}>Start Project </Text>
                </Pressable>
              </View>
              <Text style={styles.text2}>{userAddress}</Text>
            </View>
            <Text style={styles.monthly}>Monthly Review</Text>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Surface style={styles.surface} elevation={4}>
                <Text style={styles.number}>{data.completed}</Text>
                <Text style={styles.surfaceText}>Completed</Text>
              </Surface>
              <Surface style={styles.surface2} elevation={4}>
                <Text style={styles.number}>{data.inprogress}</Text>
                <Text style={styles.surfaceText}>Inprogress</Text>
              </Surface>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Surface style={styles.surface2} elevation={4}>
                <Text style={styles.number}>{data.pending}</Text>
                <Text style={styles.surfaceText}>Pending</Text>
              </Surface>
              <Surface style={styles.surface} elevation={4}>
                <Text style={styles.number}>{data.hold}</Text>
                <Text style={styles.surfaceText}>Waiting for Review</Text>
              </Surface>
            </View>
          </View>
        )
      )}
    </ScrollView>
  );
};

export default HomeScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    backgroundColor: colors.brand_secondary,
    height: width * 0.3,
  },
  logo: {
    height: width * 0.22,
    width: width * 0.22,
    alignSelf: 'center',
    marginTop: 20,
  },
  clock: {
    backgroundColor: '#7CA942',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 7,
    alignSelf: 'flex-start',
  },
  clockText: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Poppins-Medium',
  },
  btn: {
    width: 80,
    height: 30,
    borderRadius: 10,
    backgroundColor: colors.brand_primary,
    marginBottom: 10,
    justifyContent: 'center',
  },
  textbtn: {
    color: colors.white,
    fontSize: 10,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
  text: {
    color: colors.brand_primary,
    fontSize: 24,
    marginTop: 22,
    fontFamily: 'Poppins-Medium',
  },
  cover: {
    padding: 18,
  },
  text_secondary: {
    color: colors.brand_primary,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  card: {
    borderColor: colors.brand_secondary,
    backgroundColor: colors.brand_secondary,
    borderWidth: 1,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 8,
    marginTop: 20,
    borderRadius: 8,
  },
  text1: {
    fontSize: 14,
    marginBottom: 8,
    color: colors.brand_primary,
    fontFamily: 'Poppins-Regular',
  },
  text2: {
    fontSize: 12,
    color: colors.brand_primary,
    fontFamily: 'Poppins-Regular',
  },
  text3: {
    color: '#4F4A4A',
    position: 'absolute',
    right: 10,
    bottom: -25,
    marginBottom: 5,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  monthly: {
    color: colors.brand_primary,
    fontSize: 20,
    fontFamily: 'Poppins-Medium',
    marginTop: 15,
  },
  surface: {
    marginTop: 10,
    backgroundColor: colors.brand_primary,
    width: width * 0.48,
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 15,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  surface2: {
    marginTop: 10,
    backgroundColor: colors.brand_primary,
    padding: 10,
    width: width * 0.37,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  surfaceText: {
    color: 'white',
    borderRadius: 8,
  },
  number: {
    fontSize: 42,
    color: 'white',
    // fontFamily: 'Poppins-Medium'
  },
});
