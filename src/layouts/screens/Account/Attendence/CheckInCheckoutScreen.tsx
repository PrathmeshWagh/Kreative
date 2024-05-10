/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Pressable,
  Alert,
  // eslint-disable-next-line comma-dangle
} from 'react-native';
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import IonIcon from 'react-native-vector-icons/Ionicons';
import colors from '../../../style/colors';
import TimesheetNavigation from '../../../navigation/TimesheetNavigation';
import AppbarAccount from '../../../component/AppbarAccount';
import {useFocusEffect} from '@react-navigation/native';
import {getStorageData, postMethod} from '../../../../utils/helper';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import MonthPicker from 'react-native-month-year-picker';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {useInfoContext} from '../../../navigation/TabNavigation/TabNavigation';
import CheckInScreen from './CheckInScreen';
import CheckOutScreen from './CheckOutScreen';

const {width} = Dimensions.get('window');

interface Props {
  navigation: any;
  route: any;
}

const ListContext = createContext();
export const useListContext = () => useContext(ListContext);

const CheckInCheckoutScreen: React.FC<Props> = ({navigation, route}) => {
  const {employee_id, date0} = route.params;
  const item = useInfoContext();
  const [list, setList] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userFirst, setUserFirst] = useState(null);
  const [userLast, setUserLast] = useState(null);
  const [userAddress, setUserAddress] = useState(null);

  useFocusEffect(
    useCallback(() => {
      AttendancHandle();
      details();
    }, []),
  );

  const details = async () => {
    const storage = await getStorageData();
    setUserFirst(storage.user.first_name);
    setUserLast(storage.user.last_name);
    setUserAddress(storage.data[0].address);
  };

  const AttendancHandle = async () => {
    const storage = await getStorageData();
    setUserFirst(storage.data[0].first_name);
    setUserLast(storage.data[0].last_name);
    setUserAddress(storage.data[0].address);
    // console.log(storage.data[0].id, employee_id, date, 'user0');

    try {
      setLoading(true);
      const row = {
        user_id: employee_id,
        date: date0,
      };
      const api: any = await postMethod('Attendance/attendance_data_list', row);
      if (api.status === 200) {
        setList(api.data.data);
        setMessage(api.data.message);
        setLoading(false);
        console.log(api.data, list, 'api6');
      }
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  return (
    <ListContext.Provider value={{list, message}}>
      <View style={styles.container}>
        <AppbarAccount title={'My Attendance'} />
        <View style={{alignSelf: 'center', marginLeft: 30}}>
          <Text style={styles.welcome}>Welcome</Text>
          <Text style={styles.name}>
            {userFirst} {userLast}
          </Text>
        </View>
        {loading ? (
          <ActivityIndicator color={colors.white} size={20} />
        ) : (
          <>
            <View style={styles.content_box}>
              <Text style={styles.time}>TimeSheet</Text>
            </View>
            {date0 ? <TimesheetNavigation /> : null}
          </>
        )}
      </View>
    </ListContext.Provider>
  );
};

export default CheckInCheckoutScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },

  welcome: {
    color: colors.black,
    marginTop: 10,
    fontSize: 12,
    // alignSelf: 'center'
  },
  name: {
    color: colors.black,
    fontSize: 20,
    marginLeft: -25,
  },
  attendBox1: {
    height: 120,
    paddingLeft: 30,
    paddingTop: 15,
    backgroundColor: colors.brand_primary,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  content_box: {
    padding: 20,
  },
  dateMonth: {
    flexDirection: 'row',
    color: colors.black,
    alignItems: 'center',
  },
  date: {
    fontSize: 20,
    // marginTop:10,
    fontWeight: '600',
  },
  month: {
    fontSize: 14,
    fontWeight: '500',
    // marginTop: 15,
  },
  timeSheet: {
    padding: 20,
    paddingLeft: 30,
    marginTop: 10,
  },
  time: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.brand_primary,
  },
  checkView: {
    backgroundColor: colors.bg_pink,
  },
  segmentedBtnView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    marginHorizontal: 20,
  },
  leaveType: {
    backgroundColor: colors.white,
    borderColor: colors.black,
    width: width * 0.25,
    paddingVertical: 6,
    flexDirection: 'row',
    // alignSelf:'center'
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
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
  btnText: {
    alignSelf: 'center',
    color: colors.gray,
    fontSize: 12,
  },
  activeButton: {
    backgroundColor: colors.brand_primary,
    borderColor: colors.white,
    // borderRadius: 8,
    elevation: 8,
  },
  activeButtonText: {
    color: colors.white,
    fontWeight: '700',
  },
  content: {},
});
