/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import React, {FC, useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import Appbar from '../../component/Appbar';
import {Card} from 'react-native-paper';
import {getMethod, getStorageData, postMethod} from '../../../utils/helper';
import {
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import colors from '../../style/colors';
import {CommonActions, useFocusEffect} from '@react-navigation/native';

interface Props {
  navigation: any;
}

const ProjectScreen: FC<Props> = ({navigation}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const imagePaths = [
    require('../../img/avatar1.png'),
    require('../../img/avatar1.png'),
    require('../../img/avatar1.png'),
  ];

  useFocusEffect(
    useCallback(() => {
      ProjectListHandle();
    }, []),
  );
  // ProjectList Function
  const ProjectListHandle = async () => {
    const storage = await getStorageData();
    try {
      setLoading(true);
      const row = {
        user_id: storage.data[0].id,
      };
      const response: any = await postMethod('Projects/project_list', row);
      if (response.status === 200) {
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
    navigation.dispatch(
      CommonActions.navigate({
        name: 'ProjectTaskScreen',
        params: {
          project_id: id,
        },
      }),
    );
  };

  return (
    <>
      <Appbar
        title={'Project'}
        backgroundColor={colors.white}
        navigation={navigation}
      />
      <ScrollView style={styles.container}>
        {loading ? (
          <ActivityIndicator size={20} color={colors.brand_primary} />
        ) : data  ? (
          data.map((item: any) => (
            <View
              style={{marginBottom: 50, flexDirection: 'column'}}
              key={item.project_id}>
              <Card
                style={styles.card}
                onPress={() => clickHandle(item.project_id)}>
                <View style={styles.align}>
                  <Image
                    style={styles.img}
                    source={require('../../img/cardImage.png')}
                  />
                  <View style={{alignItems: 'center'}}>
                    <Text style={styles.testProject}>{item.project_title}</Text>
                    <Text style={styles.textDescription}>
                      {item.project_billing_type}
                    </Text>
                  </View>
                </View>
                <View style={styles.align1}>
                  <Text style={styles.start}>Start Date</Text>
                  <Text style={styles.end}>End Date</Text>
                </View>
                <View style={styles.align1}>
                  <Text style={styles.startDate}>{item.project_created}</Text>
                  <Text style={styles.endDate}>{item.project_updated}</Text>
                </View>
                <View style={styles.align2}>
                  <Text style={styles.team}>Team Members</Text>
                  <View style={{flexDirection: 'row', marginTop: 10}}>
                    {imagePaths.map((path, index) => (
                      <Image key={index} style={styles.tinyImg} source={path} />
                    ))}
                  </View>
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
    </>
  );
};

export default ProjectScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 14,
  },
  card: {
    borderRadius: 20,
    elevation: 10,
    backgroundColor: colors.white,
    margin: -5,
  },
  align1: {
    marginLeft: -20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  align2: {
    padding: 4,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  align: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 14,
  },
  img: {
    height: 40,
    width: 40,
    marginTop: 8,
  },
  testProject: {
    color: colors.brand_primary,
    fontSize: 20,
    fontFamily: 'Poppins-Medium',
  },
  textDescription: {
    width: responsiveWidth(30),
    color: colors.brand_primary,
    fontSize: responsiveFontSize(0.9),
    fontFamily: 'Poppins-Medium',
    alignSelf: 'flex-end',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    textAlign: 'center',
  },
  start: {
    color: colors.gray,
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  end: {
    color: colors.gray,
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  startDate: {
    color: colors.lightGray,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  endDate: {
    color: colors.lightGray,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  team: {
    marginTop: 10,
    color: colors.gray,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  tinyImg: {
    height: 30,
    width: 30,
    marginRight: -10,
  },
});
