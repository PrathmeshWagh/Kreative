/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import {React, useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import colors from '../style/colors';
import SettingScreen from '../screens/Account/Profile/SettingScreen';
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import {Badge} from 'react-native-paper';
import {getMethod} from '../../utils/helper.js'

const Appbar = ({navigation, title, backgroundColor}: any) => {
  const [notificationCount, setNotificationCount] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchNotificationNumber();
    }, []),
  );

  const fetchNotificationNumber = async () => {
    try {
      setLoading(true);
      const response: any = await getMethod('Notification/notificaton_total');
      if (response.status === 200) {
        setNotificationCount(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  return (
    <View style={{backgroundColor, padding: 18}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <IonIcon
          name="arrow-back"
          color={colors.brand_primary}
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.title}>{title}</Text>
        <View style={styles.align}>
          <Pressable onPress={() => navigation.navigate('AttendanceScreen')}>
            <IonIcon
              name="calendar-sharp"
              color={colors.brand_primary}
              size={20}
            />
          </Pressable>

          <TouchableOpacity
            onPress={() =>
              navigation.dispatch(
                CommonActions.navigate({
                  name: 'NotificationScreen',
                  params: {
                    notificationData: notificationCount,
                  },
                }),
              )
            }>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.iconDiv}>
                <Image
                  source={require('../img/bell.png')}
                  style={styles.bell}
                />
                {notificationCount ? (
                  <Badge
                    style={{
                      marginVertical: -27,
                      marginRight: 20,
                      width: 20,
                      height: 20,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {notificationCount}
                  </Badge>
                ) : null}
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Appbar;
const styles = StyleSheet.create({
  // container: {
  //     backgroundColor: colors.white,
  //     padding: 18,
  // },
  bell: {
    marginTop: 3,
    marginLeft: 20,
  },
  align: {
    flexDirection: 'row',
  },
  title: {
    color: colors.brand_primary,
    fontSize: 22,
  },
  iconDiv: {
    width:65  ,
  },

});
