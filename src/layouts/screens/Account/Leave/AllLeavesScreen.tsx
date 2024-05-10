/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import colors from '../../../style/colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useFocusEffect} from '@react-navigation/native';
import {getMethod, getStorageData, postMethod} from '../../../../utils/helper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Appbar from '../../../component/Appbar';
import {responsiveFontSize} from 'react-native-responsive-dimensions';

const AllLeavesScreen = ({route, navigation}: any) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useFocusEffect(
    useCallback(() => {
      LeaveHandle();
    }, []),
  );

  // LeaveFunction ;
  const LeaveHandle = async () => {
    const storage = await getStorageData();
    const row = {
      user_id: storage.data[0].id,
    };
    try {
      setLoading(true);
      const response: any = await postMethod('Leave/leave_list', row);
      if (response.status === 200) {
        setData(response.data.data);
        setMessage(response.data.message);
        setLoading(false);
        console.error('Error:', data);
      }
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Appbar
        title={'MY Leave'}
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
        }}>
        <Text style={styles.head}>Leaves</Text>
        <TouchableOpacity
          style={styles.addLeave}
          onPress={() => navigation.navigate('NewLeaveScreen')}>
          <MaterialCommunityIcons name="plus" color={colors.white} size={23} />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View>
          <View>
            {loading ? (
              <ActivityIndicator size={20} color={colors.brand_primary} />
            ) : data  ? (
              data.map((item: any) => (
                <View style={styles.leaveSection} key={item.leave_id}>
                  <Text style={styles.month} />

                  {/* AWAITING VIEW================ */}
                  <View style={styles.leaveDetail}>
                    <View style={styles.leaveDetailTop}>
                      <View>
                        <Text style={styles.leaveDuration}>
                          {item.is_half_day === null ? 'Full Day' : 'Half Day'}
                        </Text>
                        <Text style={styles.leaveDate}>
                          applied: {item.applied_on.substring(0, 10)}
                        </Text>
                        <Text style={styles.leaveDate}>
                          Time: {item.applied_on.substring(11)}
                        </Text>

                        <Text style={styles.leaveDate}>
                          Leave Date: {item.from_date.substring(0, 10)} -{' '}
                          {item.to_date.substring(0, 10)}
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.awaitingView}>{item.status}</Text>
                      </View>
                    </View>
                    <View style={styles.bottomView}>
                      <Text style={styles.casual}>{item.type_name}</Text>
                    </View>
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
        </View>
      </ScrollView>
    </View>
  );
};

export default AllLeavesScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.brand_secondary,
    flex: 1,
    // marginBottom: 150,
  },
  month: {
    color: colors.gray_font,
  },
  head: {
    fontFamily: 'Poppins-Medium',
    fontSize: 24,
    color: colors.black,
    fontWeight: 'bold',
  },
  addLeave: {
    backgroundColor: colors.brand_primary,
    padding: 7,
    borderRadius: 6,
  },
  leaveDetail: {
    backgroundColor: colors.white,
    padding: 15,
    marginVertical: 0,
  },
  leaveSection: {
    marginVertical: 0,
  },
  leaveDetailTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  arrowButton: {
    backgroundColor: colors.card_bg,
    borderRadius: 5,
    marginBottom: 10,
  },
  awaitingView: {
    backgroundColor: colors.orange_bg,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    color: colors.awaiting_text,
    marginBottom: 10,
  },
  approvedView: {
    backgroundColor: colors.bg_green,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    color: colors.text_green,
  },
  declineView: {
    backgroundColor: colors.bg_pink,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    color: colors.text_pink,
  },
  casual: {
    color: colors.text_orange,
    fontSize: 14,
  },
  sick: {
    color: colors.gray_font,
    fontSize: 14,
  },
  leaveDuration: {
    color: colors.gray_font,
    marginBottom: 5,
  },
  leaveDate: {
    color: colors.black,
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 5,
    whiteSpace: 'none',
  },
});
