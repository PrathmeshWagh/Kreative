/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import Appbar from '../../component/Appbar';
import colors from '../../style/colors';
import PendingScreen from './PendingScreen';
import {getStorageData, postMethod} from '../../../utils/helper';
import {useFocusEffect} from '@react-navigation/native';
import {responsiveFontSize} from 'react-native-responsive-dimensions';

const {width} = Dimensions.get('window');
interface Props {
  navigation: any;
}
const CompleteScreen: React.FC<Props> = ({navigation}) => {
  const [complete, setComplete] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  useFocusEffect(
    useCallback(() => {
      completeHandle();
    }, []),
  );

  const completeHandle = async () => {
    const storage = await getStorageData();
    try {
      setLoading(true);
      const row = {
        user_id: storage.data[0].id,
      };
      const response: any = await postMethod('Projects/complete_project', row);
      if (response.status === 200) {
        setComplete(response.data.data);
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
        title={'Complete'}
        backgroundColor={colors.white}
        navigation={navigation}
      />
      <View style={styles.innerContainer}>
        <ScrollView>
          {loading ? (
            <ActivityIndicator size={20} color={colors.brand_primary} />
          ) : complete ? (
            complete &&
            complete.map((item: any) => (
              <View style={styles.projectList}>
                <View style={styles.projectListing}>
                  <Image
                    source={require('../../img/project-list-icon.png')}
                    style={styles.image}
                  />
                  <Text style={styles.project}>{item.project_title}</Text>
                </View>
                <Pressable onPress={() => navigation.navigate('PendingScreen')}>
                  <Text style={styles.status}>{item.project_status}</Text>
                </Pressable>
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
    </View>
  );
};

export default CompleteScreen;

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
    color: colors.complete_text,
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    marginTop: 5,
    fontWeight: '700',
  },
});
