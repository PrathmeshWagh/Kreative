/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  Image,
  Task,
  ActivityIndicator,
} from 'react-native';
import React, {FC, useCallback, useEffect, useId, useState} from 'react';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Appbar from '../../component/Appbar';
import colors from '../../style/colors';
import {Card, Snackbar} from 'react-native-paper';
import {getMethod, getStorageData, postMethod} from '../../../utils/helper';
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

const {width} = Dimensions.get('window');
interface Props {
  navigation: any;
  route: any;
}

const ProjectTaskScreen: FC<Props> = ({navigation, route}) => {
  const project_id = route.params;
  const [data, setData] = useState([]);
  const [message, setMessage] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      ProjectListHandle();
    }, []),
  );
  // ProjectList Function
  const ProjectListHandle = async () => {
    const storage = await getStorageData();
    setAddress(storage.data[0].address);
    try {
      setLoading(true);
      const row = {
        project_id: project_id,
      };
      const response: any = await postMethod('Task/task_list', row);
      console.log(response.data.message, 'responsek');
      if (response.status === 200) {
        console.log(response.data.data, 'responsed19');
        setData(response.data.data);
        setMessage(response.data.message);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const clickHandle = (id: any) => {
    console.log(id, 'id');
    navigation.dispatch(
      CommonActions.navigate({
        name: 'NewTaskScreen',
        params: {
          task_id: id,
        },
      }),
    );
  };

  return (
    <View style={styles.container}>
      <View style={{backgroundColor: '#FFF4F5', height: 120}}>
        <Appbar
          backgroundColor={colors.brand_secondary}
          navigation={navigation}
        />
        <Text style={styles.projectNo}>Project #12356</Text>
      </View>
      <ScrollView>
        <View>
          <Text style={styles.headingText}>Task</Text>
        </View>
        {loading ? (
          <ActivityIndicator size={20} color={colors.brand_primary} />
        ) : data  ? (
          data.map((item: any) => (
            <View
              style={{marginBottom: 20, flexDirection: 'column'}}
              key={item.task_id}>
              <Card
                style={styles.card}
                onPress={() => clickHandle(item.task_id)}>
                <View style={styles.cardView}>
                  <Text style={styles.cardViewHeadText}>{item.task_title}</Text>
                </View>
               
                <View style={styles.cardView}>
                  {item.task_created === null ? (
                    ''
                  ) : (
                    <View style={styles.iconView}>
                      <IonIcon
                        name="calendar-sharp"
                        color={colors.white}
                        size={14}
                        style={{marginRight: 5, marginBottom: 2}}
                      />
                    </View>
                  )}

                  <Text style={styles.cardViewText}>{item.task_created}</Text>
                </View>
                <View style={styles.cardView}>
                  {item.task_updated === null ? (
                    ''
                  ) : (
                    <View style={styles.iconView}>
                      <IonIcon
                        name="calendar-sharp"
                        color={colors.white}
                        size={14}
                        style={{marginRight: 5, marginBottom: 2}}
                      />
                    </View>
                  )}
                  <Text style={styles.cardViewText}>{item.task_updated} </Text>
                </View>
              </Card>
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

export default ProjectTaskScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  projectNo: {
    color: colors.brand_primary,
    fontSize: 20,
    fontFamily: 'Poppins-Medium',
    alignSelf: 'center',
  },
  headingText: {
    fontSize: 24,
    fontFamily: 'Poppins-Medium',
    color: colors.black,
    marginVertical: 20,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: colors.brand_primary,
    width: responsiveWidth(80),
    alignSelf: 'center',
    justifyContent: 'center',
    padding: 10,
    marginVertical: 6,
  },

  cardView: {
    flexDirection: 'row',
    marginVertical: 3,
  },
  cardViewHeadText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  cardViewText: {
    color: colors.white,
    fontSize: responsiveFontSize(1.5),
    fontFamily: 'Poppins-Regular',
    marginBottom: 2,
  },
  cardViewHeadText2: {
    color: colors.brand_primary,
    // color: colors.gray_font,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  cardViewText2: {
    color: colors.brand_primary,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  watchImage: {
    height: 17,
    width: 17,
  },
  iconView: {
    width: 25,
  },
});
