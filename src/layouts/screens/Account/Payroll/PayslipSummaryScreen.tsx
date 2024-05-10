/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import IonIcon from 'react-native-vector-icons/Ionicons';
import colors from '../../../style/colors';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import AppbarAccount from '../../../component/AppbarAccount';
import {getStorageData, postMethod} from '../../../../utils/helper';
import {useFocusEffect} from '@react-navigation/native';
import {responsiveFontSize} from 'react-native-responsive-dimensions';

const {width, height} = Dimensions.get('window');

interface Props {
  navigation: any;
  route:any
}
const PayslipSummaryScreen: React.FC<Props> = ({navigation,route}) => {
  const {payroll_id} = route.params;
  const [isVisible, setIsVisible] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);
  const [isVisible3, setIsVisible3] = useState(false);
  const [list, setList] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  //call the payrollDetailHandle
  useFocusEffect(
    useCallback(() => {
      PayrollDetailHandle();
    }, []),
  );

  // All  Payroll Details show in this function
  const PayrollDetailHandle = async () => {
    const storage = await getStorageData();
    try {
      const row = {
        payroll_id : payroll_id,
      };
      setLoading(true);
      const response: any = await postMethod('Payroll/payroll_detail', row);
      if (response.status === 200) {
        setMessage(response.data.message);
        setList(response.data.data);
        console.log(message, response.data, 'aar');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppbarAccount title={'Payslip'} />
      <ScrollView>
        {loading ? (
          <ActivityIndicator color={colors.brand_primary} size={20} />
        ) : list ? (
          list.map((item: any) => (
            <View>
              <View style={styles.detailsHeading}>
                <Text style={styles.detailsHeadingText}>Payslip Summary</Text>
              </View>
              <View style={styles.topView}>
                <IonIcon
                  name="arrow-back-sharp"
                  color={colors.white}
                  size={24}
                  onPress={() => navigation.goBack()}
                />
                <Text style={styles.payHead}>{item.earning}</Text>
                <Text style={styles.payHeadDate}>
                  Net Pay , Jan 15 - jan 25 2023
                </Text>
              </View>
              <View style={styles.progressBar}>
                <AnimatedCircularProgress
                  size={130}
                  width={5}
                  fill={75}
                  tintColor="#AC343D"
                  onAnimationComplete={() => console.log('onAnimationComplete')}
                  backgroundColor={colors.gray_font}>
                  {fill => (
                    <View>
                      <Text style={styles.amount}>{item.gross_salary}</Text>
                      <Text style={styles.days}>Gross Pay</Text>
                    </View>
                  )}
                </AnimatedCircularProgress>
              </View>
              <View style={styles.amountDetails}>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{
                      color: colors.brand_primary,
                      fontSize: 24,
                      marginRight: 7,
                    }}>
                    ●
                  </Text>
                  <Text style={styles.amountText}>
                    {item.earning}
                    {'\n'}Earning
                  </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{color: colors.gray, fontSize: 24, marginRight: 7}}>
                    ●
                  </Text>
                  <Text style={styles.amountText}>
                    {item.deduction}
                    {'\n'}Tax & Deduction
                  </Text>
                </View>
              </View>

            {/* TOGGLE BUTTON ONE==================== */}
              {/* <View style={styles.btnOne}>
                <Pressable
                  style={styles.dropDown}>
                  <View>
                    <Text style={styles.dropDownText}>Total Hours</Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.dropDownText}>56 h</Text>
                  </View>
                </Pressable>
              </View> */}
              {/* TOGGLE BUTTON ONE==================== */}
              {/* <View style={styles.btnOne}>
                <Pressable
                  style={styles.dropDown}
                 >
                  <View>
                    <Text style={styles.dropDownText}>Total Earnings</Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.dropDownText}>{item.}</Text>
                  </View>
                </Pressable>
              </View>
              <View style={styles.btnOne}>
                <Pressable
                  style={styles.dropDown}
                  >
                  <View>
                    <Text style={styles.dropDownText}>Taxes & Deduction</Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.dropDownText}>$1000</Text>
                  </View>
                </Pressable>
              </View> */}
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
      </ScrollView>
    </View>
  );
};

export default PayslipSummaryScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  attendBox1: {
    height: width * 0.3,
    paddingLeft: 30,
    paddingTop: 15,
    backgroundColor: colors.brand_primary,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  topView: {},
  head: {
    color: colors.black,
    fontSize: 18,
  },
  payHead: {
    color: colors.black,
    fontSize: 30,
    fontFamily: 'Poppins',
    fontWeight: '800',
    marginTop: 10,
    alignSelf: 'center',
  },
  payHeadDate: {
    color: colors.black,
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    // fontWeight: '700',
    marginTop: 10,
    alignSelf: 'center',
  },
  detailsHeading: {
    width: width * 0.999,
    paddingVertical: 10,
    borderBottomColor: colors.gray_font,
    borderBottomWidth: 0.5,
  },
  detailsHeadingText: {
    color: colors.black,
    alignSelf: 'center',
  },
  progressBar: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  amountDetails: {
    flexDirection: 'row',
    width: width * 0.999,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  amountText: {
    color: colors.gray,
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
  },
  dropDown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  btnOne: {
    borderBottomColor: colors.gray,
    borderBottomWidth: 0.5,
    marginHorizontal: 20,
  },
  dropDownView: {
    padding: 20,
    backgroundColor: colors.textInput_color,
  },
  dropDownText: {
    color: colors.black,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  innerText: {
    color: '#414141',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  flexView: {
    flexDirection: 'row',
    width: width * 0.72,
    justifyContent: 'space-between',
  },
  days: {
    fontSize: 12,
    color: colors.account_font,
    // backgroundColor:'red',
    alignSelf: 'center',
  },
  amount: {
    fontSize: 14,
    color: colors.account_font,
    // backgroundColor:'red',
    fontWeight: '700',
    alignSelf: 'center',
  },
});
