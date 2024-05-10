/* eslint-disable @typescript-eslint/func-call-spacing */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable semi */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import colors from '../../../style/colors';
import AppbarAccount from '../../../component/AppbarAccount';
import {getStorageData, postMethod} from '../../../../utils/helper';
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import {ActivityIndicator} from 'react-native-paper';
import {
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

interface Props {
  navigation: any;
}
const AttendanceDetailScreen: React.FC<Props> = ({navigation}) => {
  const [list, setList] = useState([]);
  const [list1, setList1] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      AttendancHandle();
    }, []),
  );

  const AttendancHandle = async () => {
    const storage = await getStorageData();
    console.log(storage.data[0].id, 'user0');
    try {
      setLoading(true);
      const row = {
        user_id: storage.data[0].id,
      };
      const response: any = await postMethod('Attendance/attendance_list', row);
      if (response.data.status === true) {
        console.log(response.data.data[1], 'response5');
        setList(response.data.data[1]);
        setList1(response.data.data[1].data);
        console.log(list1, 'response6');
        setMessage(response.data.message);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppbarAccount title={'Attendance List'} />
      <ScrollView>
        {loading ? (
          <ActivityIndicator color={colors.brand_primary} size={20} />
        ) : list !== null ? (
          list && (
            // const monthData = list[monthKey];
            <View key={list.time_attendance_id}>
              <Text style={styles.headingDate}>{list.month}</Text>
              {list1.map((attendanceItem: any) => {
                const attendanceData = attendanceItem.clock_in.split(' ')[0];
                return (
                  <View key={attendanceItem.time_attendance_id}>
                    <Pressable
                      style={styles.attendance}
                      onPress={() =>
                        navigation.dispatch(
                          CommonActions.navigate({
                            name: 'CheckInCheckoutScreen',
                            params: {
                              employee_id: attendanceItem.employee_id,
                              date0: attendanceData,
                            },
                          }),
                        )
                      }>
                      <View style={styles.date}>
                        <Text style={[styles.dateData, {textAlign: 'center'}]}>
                          {attendanceItem.month}
                        </Text>
                      </View>
                      <View style={styles.punchIn}>
                        <Text style={styles.punchHead}>Check In:</Text>
                        <Text style={styles.dateData}>
                          {attendanceItem.clock_in}
                        </Text>
                      </View>
                      <View style={styles.punchOut}>
                        <Text style={styles.punchHead}>Check Out:</Text>
                        <Text style={styles.dateData}>
                          {attendanceItem.clock_out}
                        </Text>
                      </View>
                    </Pressable>
                  </View>
                );
              })}
            </View>
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
      </ScrollView>
    </View>
  );
};

export default AttendanceDetailScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  attendBox1: {
    height: 120,
    backgroundColor: colors.brand_primary,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  head: {
    fontFamily: 'Poppins-Medium',
    fontSize: 22,
    color: colors.white,
    textAlign: 'center',
  },
  backArrow: {
    marginTop: 20,
    marginLeft: 20,
  },
  attendanceItem: {
    marginVertical: 20,
    width: '90%',
    marginLeft: '5%',
  },
  attendance: {
    backgroundColor: '#F3F3F3',
    marginBottom: 10,
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    justifyContent: 'space-between',
  },
  date: {
    flexWrap: 'nowrap',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: responsiveWidth(2),
  },
  headingDate: {
    padding: 10,
    borderRadius: 8,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 20,
    color:'black',
  },
  punchIn: {
    width: '36%',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#484A4B',
    borderRightWidth: 1,
  },
  punchOut: {
    width: '36%',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  punchHead: {
    color: 'black',
    fontWeight: '600',
  },
  dateData: {
    color: 'black',
    // alignContent: 'center',
    textAlign: 'center',
  },
});
