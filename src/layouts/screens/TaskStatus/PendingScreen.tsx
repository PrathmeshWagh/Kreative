/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import Appbar from '../../component/Appbar';
import colors from '../../style/colors';
import {getMethod, getStorageData, postMethod} from '../../../utils/helper';
import {ActivityIndicator} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';
import {responsiveFontSize} from 'react-native-responsive-dimensions';

const {width} = Dimensions.get('window');
interface Props {
  navigation: any;
}
const PendingScreen: React.FC<Props> = ({navigation}) => {
  const [pending, setPending] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  useFocusEffect(
    useCallback(() => {
      pendingHandle();
    }, []),
  );

  const pendingHandle = async () => {
    const storage = await getStorageData();
    try {
      setLoading(true);
      const row = {
        user_id: storage.data[0].id,
      };
      const response: any = await postMethod('Projects/pending_project', row);
      if (response.status === 200) {
        setPending(response.data.data);
        setMessage(response.data.message);
        console.log(response.data, 'response');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Appbar
        title={'Pending'}
        backgroundColor={colors.white}
        navigation={navigation}
      />
      {loading ? (
        <ActivityIndicator size={20} color={colors.brand_primary} />
      ) : (
        <View style={styles.innerContainer}>
          <ScrollView>
            {loading ? (
              <ActivityIndicator size={20} color={colors.brand_primary} />
            ) : pending  ? (
              pending &&
              pending.map((item: any) => (
                <View style={styles.projectList} key={item.project_id}>
                  <View style={styles.projectListing}>
                    <Image
                      source={require('../../img/project-list-icon.png')}
                      style={styles.image}
                    />
                    <Text style={styles.project}>{item.project_title}</Text>
                  </View>
                  <Text style={styles.status}>{item.project_status}</Text>
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
      )}
    </View>
  );
};

export default PendingScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.brand_secondary,
    flex: 1,
    width: width * 1,
  },
  innerContainer: {
    paddingHorizontal: '5%',
    paddingVertical: 20,
    // marginVertical:10,
    marginBottom: 50,
  },
  image: {
    height: width * 0.1,
    width: width * 0.1,
    marginRight: 20,
  },
  projectList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width * 0.9,
    backgroundColor: colors.white,
    paddingHorizontal: '5%',
    paddingVertical: 20,
    elevation: 8,
    borderRadius: 6,
    marginVertical: 15,
  },
  projectListing: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  project: {
    color: colors.brand_primary,
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
  status: {
    color: colors.pending_text,
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    marginTop: 5,
    fontWeight: '700',
  },
});
