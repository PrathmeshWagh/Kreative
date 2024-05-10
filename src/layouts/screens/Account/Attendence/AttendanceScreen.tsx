/* eslint-disable no-octal */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-trailing-spaces */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  View,
  Text,
  Platform,
  Pressable,
  StyleSheet,
  Dimensions,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import colors from '../../../style/colors';
import IonIcon from 'react-native-vector-icons/Ionicons';
import AppbarAccount from '../../../component/AppbarAccount';
import {getStorageData, postMethod} from '../../../../utils/helper';
import MonthPicker from 'react-native-month-year-picker';
import moment from 'moment';
import {ActivityIndicatorBase} from 'react-native';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import {useFocusEffect} from '@react-navigation/native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Svg, { Circle } from 'react-native-svg';

interface Props {
  navigation: any;
}

const {width} = Dimensions.get('window');
const AttendanceScreen: React.FC<Props> = ({navigation}) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [selectMonth, setSelectMonth] = useState(null);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');

  useFocusEffect(
    useCallback(() => {
      AttendancHandle();
    }, [selectMonth]),
  );

  const onValueChange = useCallback(
    async (event, newDate) => {
      try {
        const selectedDate = newDate || new Date();
        const monthYear: string = moment(selectedDate).format('YYYY-MM');
        setShow(false);
        setDate(selectedDate);
        setSelectMonth(monthYear);
      } catch (error) {
        console.error('Error in onValueChange:', error);
      }
    },
    [date, selectMonth],
  );

  const AttendancHandle = async () => {
    const storage = await getStorageData();
      setLoading(true);
    const row = {
      user_id: storage.data[0].id,
      month_year: selectMonth,
    };
    
    try {
      const response: any = await postMethod('Attendance/my_attendance', row);
      if (response.status === 200) {
        console.log(response.data.data,storage.data[0].id,selectMonth, 'response6');
        setList(response.data.data);
        setMessage(response.data.message);
      setLoading(false);

      }
      setLoading(false);
    } catch (error) {
      console.error('Error25:', error);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppbarAccount title={'My Attendance'} />
      <ScrollView>
        {loading ? (
          <ActivityIndicator size={20} color={colors.brand_primary} />
        ) : list !== null ? (
          <View style={styles.attendanceView}>
            <Pressable onPress={() => setShow(!false)} style={styles.button}>
              <Text
                style={{
                  marginBottom: 0,
                  color: 'white',
                  fontFamily: 'Roboto-SemiBold',
                }}>
                Please Select Year
              </Text>
            </Pressable>
            <Text style={{marginBottom: 20,color:"black"}}>{selectMonth}</Text>

            {show && (
            <MonthPicker open={show} onChange={onValueChange} value={date} />
            )}
            {selectMonth !== null ? (
              <Pressable
                style={styles.attendanceBox2}
                onPress={() => navigation.navigate('AttendanceDetailScreen')}>
                <View style={styles.progressView}>
                  <AnimatedCircularProgress
                    size={70}
                    width={3}
                    fill={90}
                    tintColor="#AC343D"
                    onAnimationComplete={() =>
                      console.log('onAnimationComplete')
                    }
                    backgroundColor={colors.textInput_color}>
                    {fill => (
                      <View>
                        <Text style={styles.days}>
                          {list.present_count} days
                        </Text>
                        <Text style={styles.days}>Present</Text>
                      </View>
                    )}
                  </AnimatedCircularProgress>
                </View>
                <View style={styles.attendanceDetail}>
                  <Text style={styles.heading}>Total Working days</Text>
                  <Text style={styles.text}>
                    {list.total_working_days} Days
                  </Text>
                  <Text style={styles.heading}>Official Leaves</Text>
                  <Text style={styles.text}>{list.leave_count} Days</Text>
                </View>
              </Pressable>
            ) : null}
          </View>
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

export default AttendanceScreen;

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
  attendanceView: {
    padding: 20,
  },
  button: {
    width: 130,
    height: 35,
    padding: 3,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.brand_primary,
    borderRadius: 5,
    marginBottom: 10,
  },
  date: {
    color: colors.text_date,
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  attendanceBox2: {
    borderWidth: 1,
    borderColor: colors.brand_primary,
    backgroundColor: colors.brand_secondary,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 8,
    flexDirection: 'row',
  },
  progressView: {
    width: width * 0.35,
    justifyContent: 'center',
  },
  days: {
    fontSize: 10,
    color: colors.account_font,
  },
  attendanceDetail: {
    // backgroundColor: 'red'
  },
  heading: {
    fontSize: 12,
    color: '#484A4B',
    fontWeight: '600',
  },
  text: {
    fontSize: 10,
    color: colors.account_font,
    fontWeight: '500',
  },
});
