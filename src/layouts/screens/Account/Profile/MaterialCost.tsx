/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {StyleSheet, Text, View, Dimensions, ScrollView} from 'react-native';
import React, {FC, useCallback, useState} from 'react';
import colors from '../../../style/colors';
import Appbar from '../../../component/Appbar';
import {useFocusEffect} from '@react-navigation/native';
import {getStorageData, postMethod} from '../../../../utils/helper';
import {ActivityIndicator} from 'react-native-paper';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {responsiveFontSize} from 'react-native-responsive-dimensions';

const {width} = Dimensions.get('window');
interface Props {
  navigation: any;
}

const MaterialCostScreen: FC<Props> = ({navigation}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useFocusEffect(
    useCallback(() => {
      MaterialHandle();
    }, []),
  );

  // LeaveFunction ;
  const MaterialHandle = async () => {
    try {
      setLoading(true);
      const response: any = await postMethod('Meterial_data/material_list');
      if (response.status === 200) {
        setData(response.data.data);
        setMessage(response.data.message);
        setLoading(false);
        console.error('Error:', response.data.data, data, message);
      }
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Appbar
          title={'Materials Cost'}
          backgroundColor={colors.white}
          navigation={navigation}
        />
      </View>

      <View style={{flexDirection: 'row'}}>
        <View style={styles.sr_noHead}>
          <Text style={styles.sr_noText}>Sr no.</Text>
        </View>
        <View style={styles.materialHead}>
          <Text style={styles.sr_noText}>Materials</Text>
        </View>
        <View style={styles.materialHead}>
          <Text style={styles.sr_noText}>Quantity</Text>
        </View>
        <View style={styles.costHead}>
          <Text style={styles.sr_noText}>Cost</Text>
        </View>
      </View>
      {data.map((item, index): any => (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 30,
          }}
          key={item.project_product_id}>
          {/* ROW ONE================= */}
          <ScrollView horizontal style={{flexDirection: 'row'}}>
            <View style={styles.sr_no}>
              <Text style={styles.sr_noText}>{index + 1}</Text>
            </View>
            <View style={styles.material}>
              <Text style={styles.sr_noText}>{item.description}</Text>
            </View>
            <View style={styles.material}>
              <Text style={styles.sr_noText}>{item.qty}</Text>
            </View>
            <View style={styles.cost}>
              <Text style={styles.sr_noText}>{item.cost_price}</Text>
            </View>
          </ScrollView>
          {/* ROW ONE================= */}
        </View>
      ))}
    </View>
  );
};

export default MaterialCostScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.brand_secondary,
    flex: 1,
  },
  innerContainer: {
    backgroundColor: colors.white,
    paddingBottom: 30,
  },
  sr_no: {
    backgroundColor: colors.white,
    width: width * 0.2,
    borderWidth: 0.5,
    borderColor: colors.gray_font,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  sr_noText: {
    color: colors.black,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    alignSelf: 'center',
  },
  material: {
    backgroundColor: colors.white,
    width: width * 0.4,
    borderWidth: 0.5,
    borderColor: colors.gray_font,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  cost: {
    backgroundColor: colors.white,
    width: width * 0.25,
    borderWidth: 0.5,
    borderColor: colors.gray_font,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  sr_noHead: {
    width: width * 0.2,
    paddingHorizontal: 10,
    paddingVertical: 0,
  },
  materialHead: {
    width: width * 0.4,
    paddingHorizontal: 10,
    paddingVertical: 0,
  },
  costHead: {
    width: width * 0.25,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
});
