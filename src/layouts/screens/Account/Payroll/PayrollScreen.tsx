/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import colors from '../../../style/colors';
import AppbarAccount from '../../../component/AppbarAccount';
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import {getStorageData, postMethod} from '../../../../utils/helper';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import {Colors} from 'react-native/Libraries/NewAppScreen';
const {width} = Dimensions.get('window');
interface Props {
  navigation: any;
}
const PayrollScreen: React.FC<Props> = ({navigation}) => {
  const [list, setList] = useState([]);
  const [message, setMessage] = useState<null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  // call the PayrollHandle
  useFocusEffect(
    useCallback(() => {
      PayrollHandle();
    }, []),
  );

  // Payrolist Function
  const PayrollHandle = async () => {
    const storage = await getStorageData();
    try {
      const row = {
        user_id: storage.data[0].id,
      };
      setLoading(true);
      const response: any = await postMethod('Payroll/payroll_list', row);
      if (response.status === 200) {
        setMessage(response.data.message);
        setList(response.data.data);
        console.error(message, response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppbarAccount title={'Payroll'} />
      <ScrollView>
        {loading ? (
          <ActivityIndicator color={colors.brand_primary} size={20} />
        ) : list ? (
          list.map((item: any) => (
            <View style={styles.outerView} key={item.payslip_id}>
              <TouchableOpacity
                style={styles.detail}
                onPress={() =>
                  navigation.dispatch(
                    CommonActions.navigate({
                      name: 'PayslipSummaryScreen',
                      params: {
                        payroll_id: item.payslip_id,
                      },
                    }),
                  )
                }>
                <View>
                  <Image
                    source={require('../../../img/calendar-img.png')}
                    style={styles.calendar}
                  />
                </View>
                <View style={styles.detailsSection}>
                  <View>
                    <Text style={styles.month}>{item.month}</Text>
                    <Text style={styles.date}>{item.year}</Text>
                  </View>
                  <View>
                    <Text style={styles.amount}>${item.net_salary}</Text>
                  </View>
                </View>
              </TouchableOpacity>
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

export default PayrollScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  welcome: {
    color: colors.black,
    marginTop: 5,
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    textAlign: 'center',
  },
  name: {
    color: colors.black,
    fontFamily: 'Poppins-Medium',
    fontSize: 10,
  },
  attendBox1: {
    height: width * 0.32,
    paddingLeft: 30,
    paddingTop: 15,
    backgroundColor: colors.brand_primary,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backArrow: {
    // marginTop: 20,
    // marginLeft: 20
  },
  payHead: {
    color: colors.white,
    fontSize: 22,
    alignSelf: 'center',
    // justifyContent:'center',
    width: width * 0.25,
    // backgroundColor:'red',
    // fontWeight: '400',
    fontFamily: 'Poppins-Medium',
  },
  outerView: {
    marginTop: 30,
    marginVertical: 1,
    borderTopColor: colors.gray_font,
    borderTopWidth: 0.5,
    // elevation: 8
  },
  detail: {
    width: width * 0.999,
    flexDirection: 'row',
    padding: 12,
    borderBottomColor: colors.gray_font,
    borderBottomWidth: 0.5,
  },
  calendar: {
    height: 26,
    width: 25,
    marginRight: 20,
    marginTop: 7,
  },
  detailsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width * 0.75,
    alignSelf: 'center',
  },
  month: {
    color: colors.black,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  date: {
    color: colors.gray_font,
    fontSize: 10,
    fontFamily: 'Poppins-Medium',
  },
  amount: {
    color: colors.black,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    marginTop: 10,
  },
});
