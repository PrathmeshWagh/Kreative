/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, { FC, useCallback, useEffect, useState } from 'react';
import IonIcon from 'react-native-vector-icons/Ionicons';
import colors from '../../style/colors';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { FlatList } from 'react-native';
import { getMethod } from '../../../utils/helper';

const { width, height } = Dimensions.get('window');
interface Props {
  navigation: any;
}
const VehicleMaintenanceScreen: FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(false)
  const [vehicleMaintainceData, setvehicleMaintainceData] = useState([])

  useFocusEffect(
    useCallback(() => {
      getData()
    }, [])

  )

  const getData = async () => {
    try {
      setLoading(true)
      // const response: any = await axios.get(`https://kreative.braincave.work/hrms/api/VMS/maintenance_list`, {
      //   headers: {
      //     Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiMSIsInVzZXJuYW1lIjoic3VwZXJhZG1pbiIsImVtYWlsIjoic3VwZXJhZG1pbkBnbWFpbC5jb20ifQ.JDP5tig6VGI-fE_dHH4sWRINSIn0QznPHE4rfrtJbeo',
      //     Accept: 'application/json',
      //   },
      // })

      const response: any = await getMethod(`VMS/maintenance_list`)
      if (response.status === 200) {
        // console.log('resp', response?.data.Data);
        setvehicleMaintainceData(response?.data.Data)
        setLoading(false)
      } else {
        setLoading(false)
        console.log('error in maintenance_list api', response.data);
      }
    } catch (error) {
      setLoading(false)
      console.log('error in maintenance_list api', error);

    }
  }

  const renderVehicleData = ({ item, index }) => {
    return (
      <View style={styles.maintenance}>
        <View>
          <Text style={styles.vehicleModal}>{item.ie_description}</Text>
          <Text style={styles.vehicleService}>{item.ie_type}</Text>
        </View>
        <View>
          <Text style={styles.serviceDate}>{item.ie_date}</Text>
          <Text style={styles.serviceCharge}>{item.ie_amount}</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.upperView}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <IonIcon
            name="arrow-back"
            color={'white'}
            size={width * 0.07}
            style={styles.icon}
          />
        </TouchableOpacity>
        <Text style={{ color: 'white', fontSize: width * 0.055 }}>
          Vehicle Maintenance
        </Text>
        <Text> </Text>
      </View>

      <View style={styles.btnView}>
        <TouchableOpacity style={styles.signBtn} onPress={() => navigation.navigate('AddMaintenanceScreen')}>
          <Text style={styles.signBtnText}>+  Add Maintenance</Text>
        </TouchableOpacity>
      </View>

      {loading ?
        <ActivityIndicator size={30} color={'blue'} />
        :
        <View style={{ backgroundColor: '#F4F4F4', flex: 1, marginBottom: 50 }}>
          <View style={styles.lastMaintenanceHead}>
            <Text style={styles.lastMaintenanceText}>Last Maintenance</Text>
          </View>
          <FlatList
            data={vehicleMaintainceData}
            keyExtractor={(item, index) => item.ie_id}
            renderItem={renderVehicleData}
            ListEmptyComponent={() => {
              return (
                <View style={{ flex: 1, }}>
                  <Text style={{ textAlign: 'center', marginTop: height / 5, fontSize: 20, fontWeight: '600', color: '#000000' }}>Vehicle Maintenance Data Not Found</Text>
                </View>
              )
            }}
          />

        </View>
      }

    </View>
  );
};

export default VehicleMaintenanceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  upperView: {
    backgroundColor: colors.brand_primary,
    height: height * 0.17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: height * 0.03,
    paddingLeft: width * 0.03,
  },
  icon: {
    alignSelf: 'flex-start',
  },
  btnView: {
    backgroundColor: 'white',
    height: height * 0.2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signBtn: {
    backgroundColor: '#EBE206',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 6,
    shadowColor: 'black',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
    alignSelf: 'center',

  },
  signBtnText: {
    color: '#4F4D4D',
    fontSize: width * 0.045,
    fontWeight: '700',
  },

  lastMaintenanceHead: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#BAB7B7",
  },
  lastMaintenanceText: {
    color: 'black',
    fontSize: 22,
    fontWeight: '500'

  },
  maintenance: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#BAB7B7",

  },

  vehicleModal: {
    fontSize: width * 0.03,
    color: '#9A9191',

  },
  serviceDate: {
    color: 'black',
    fontSize: width * 0.035,
    fontWeight: '600',

  },
  vehicleService: {
    color: 'black',
    fontSize: width * 0.035,

  },
  serviceCharge: {
    color: '#11AF18',
    fontSize: width * 0.03,
    alignSelf: 'center',
    fontWeight: '700',
  }

});
