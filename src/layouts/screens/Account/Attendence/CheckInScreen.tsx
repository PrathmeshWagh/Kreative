/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable keyword-spacing */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import colors from '../../../style/colors';
import {getStorageData, postMethod} from '../../../../utils/helper';
import {useFocusEffect} from '@react-navigation/native'; 
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useListContext} from './CheckInCheckoutScreen';


const {width} = Dimensions.get('window');

interface Props {
  navigation: any;
}
const CheckInScreen: React.FC<Props> = ({navigation}: any) => {
  const [list, setList] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const item = useListContext();
  useFocusEffect(
    useCallback(() => {
      TimeSheetHandle();
    }, [item]),
  );

  const TimeSheetHandle = async () => {
    const storage = await getStorageData();
    try {
      setLoading(true);
      // if (item) {
        setList(item.list);
        // setMessage(item.message);
        console.log( list, 'item');
        setLoading(false);
      // }
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const formatTime = (clock_in: string) => {
    const date = new Date(clock_in);
    return date.toLocaleTimeString([], {
      // year: 'numeric',
      // month: 'short',
      // day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View>
          {loading ? (
            <ActivityIndicator color={colors.brand_primary} size={20} />
          ) : list ? (
            list.map((data) => (
              <View style={styles.checkInView} key={data.attendance_date}>
                <Text style={styles.checkInText}>Check-In</Text>
                <Text style={styles.checkInTime}>
                  {formatTime(data.clock_in)}
                </Text>
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

export default CheckInScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    width: width * 0.999,
    backgroundColor: 'rgba(255, 244, 245, 1)',
    flex: 1,
  },
  checkInView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: colors.gray,
    borderBottomWidth: 1,
    paddingVertical: 12,
    marginHorizontal: 15,
  },
  checkInText: {
    color: colors.account_font,
    fontSize: 12,
  },
  checkInTime: {
    color: colors.account_font,
    fontSize: 13,
    fontWeight: '600',
  },
});
