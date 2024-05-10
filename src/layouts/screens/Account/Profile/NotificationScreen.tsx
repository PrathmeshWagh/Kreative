/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import Appbar from '../../../component/Appbar';
import colors from '../../../style/colors';
import {getMethod, postMethod} from '../../../../utils/helper';
import {useFocusEffect} from '@react-navigation/native';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import AppbarAccount from '../../../component/AppbarAccount';
interface Props {
  navigation: any;
  route: any;
}
const NotificationScreen: React.FC<Props> = ({navigation, route}) => {
  const {notificationData} = route.params;
  const [loading, setLoading] = useState(false);
  const [notification_list, setNotificationList] = useState([]);
  const [message, setMessage] = useState<string>('');
  const [clickedItem, setClickedItem] = useState(null);

  useFocusEffect(
    useCallback(() => {
      fetchNotificationData();
    }, []),
  );

  const fetchNotificationData = async () => {
    try {
      setLoading(true);
      const response: any = await getMethod('Notification/notification_list');
      console.log(response.data.message, 'responsek');
      if (response.status === 200) {
        setNotificationList(response.data.data);
        setMessage(response.data.message);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const fetchNotificationDelete = async (item: Number) => {
    const raw = {
      id: item,
    };
    try {
      setLoading(true);
      const response: any = await postMethod(
        'notification/notification_delete',
        raw,
      );
      if (response.status === 200) {
        setClickedItem(item);
     console.log(item,'n')

        console.log(response.data, 'valureD');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <AppbarAccount
          title={'Notifications'}
          backgroundColor={colors.brand_secondary}
          navigation={navigation}
        />
      </View>
      <ScrollView>
        {loading ? (
          <ActivityIndicator size={20} color={colors.brand_primary} />
        ) : notification_list ? (
          <View>
            <View style={{marginTop: 0, padding: 20, marginBottom: -25}}>
              <Text style={styles.notificationsCount}>
                You have {notificationData}
                {notificationData === 1 ? ' notification' : 'notifications'}
              </Text>
            </View>
            {notification_list.map((item: any) => (
              <View style={{marginTop: 5, padding: 20}}>
                <View>
                  <Text style={styles.dayHead}>{item.n_created_date}</Text>

                  <Pressable
                    style={{flexDirection: 'row'}}
                    onPress={()=>fetchNotificationDelete(item.n_id)}>
                    <Text style={styles.emote}>●</Text>
                    <Text style={styles.notiText}>{item.n_subject}</Text>
                  </Pressable>
                  {clickedItem ? (
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.emote}>●</Text>
                      <Text style={styles.notiText}>{item.n_message}</Text>
                    </View>
                  ) : 
                    null
                  }
                </View>
                {/* <View style={{marginBottom: 20}}>
              <Text style={styles.dayHead}>This week</Text>

              <View style={{flexDirection: 'row'}}>
                <Text style={styles.emote}>●</Text>
                <Text style={styles.notiText}>
                  You have completed 1 Task of Project #12345{' '}
                </Text>
              </View>
            </View> */}
              </View>
            ))}
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

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  innerContainer: {
    backgroundColor: colors.brand_secondary,
    elevation: 8,
  },
  text: {
    color: colors.black,
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
  notificationsCount: {
    color: colors.brand_primary,
    fontFamily: 'Poppins-Medium',
    fontSize: 20,
  },
  dayHead: {
    fontSize: 15,
    color: colors.brand_primary,
    fontFamily: 'Poppins-Medium',
    marginVertical: 10,
  },
  emote: {
    fontSize: 20,
    color: colors.brand_primary,
    marginRight: 8,
  },
  notiText: {
    color: colors.black,
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    marginTop: 7,
  },
});
