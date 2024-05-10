/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import React, {FC} from 'react';
import IonIcon from 'react-native-vector-icons/Ionicons';
import colors from '../../style/colors';

const {width, height} = Dimensions.get('window');
interface Props {
  navigation: any;
}
const VehicleMaintenanceScreen: FC<Props> = ({navigation}) => {
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
        <Text style={{color: 'white', fontSize: width * 0.055}}>
          Vehicle Maintenance
        </Text>
        <Text> </Text>
      </View>
      <View style={styles.btnView}>
        <TouchableOpacity
          style={styles.signBtn}
          onPress={() => navigation.navigate('AddMaintenanceScreen')}>
          <Text style={styles.signBtnText}>Add Maintenance +</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={{backgroundColor: '#F4F4F4', paddingBottom: 20}}>
          <View style={styles.lastMaintenanceHead}>
            <Text style={styles.lastMaintenanceText}>Last Maintenance</Text>
          </View>
          <View>
            <View style={styles.maintenance}>
              <View>
                <Text style={styles.vehicleModal}>Small Cargo Truck</Text>
                <Text style={styles.vehicleService}>Full Body Painting</Text>
              </View>
              <View>
                <Text style={styles.serviceDate}>Dec 08/01/2022</Text>
                <Text style={styles.serviceCharge}>$500</Text>
              </View>
            </View>
            <View style={styles.maintenance}>
              <View>
                <Text style={styles.vehicleModal}>Small Cargo Truck</Text>
                <Text style={styles.vehicleService}>Water wash</Text>
              </View>
              <View>
                <Text style={styles.serviceDate}>Dec 12/09/2021</Text>
                <Text style={styles.serviceCharge}>$100</Text>
              </View>
            </View>
            <View style={styles.maintenance}>
              <View>
                <Text style={styles.vehicleModal}>Small Cargo Truck</Text>
                <Text style={styles.vehicleService}>Complete truck spa</Text>
              </View>
              <View>
                <Text style={styles.serviceDate}>Dec 12/05/2021</Text>
                <Text style={styles.serviceCharge}>$660</Text>
              </View>
            </View>
            <View style={styles.maintenance}>
              <View>
                <Text style={styles.vehicleModal}>Small Cargo Truck</Text>
                <Text style={styles.vehicleService}>General services</Text>
              </View>
              <View>
                <Text style={styles.serviceDate}>Dec 12/01/2021</Text>
                <Text style={styles.serviceCharge}>$660</Text>
              </View>
            </View>
            <View style={styles.maintenance}>
              <View>
                <Text style={styles.vehicleModal}>Small Cargo Truck</Text>
                <Text style={styles.vehicleService}>General services</Text>
              </View>
              <View>
                <Text style={styles.serviceDate}>Dec 12/01/2021</Text>
                <Text style={styles.serviceCharge}>$660</Text>
              </View>
            </View>
            <View style={styles.maintenance}>
              <View>
                <Text style={styles.vehicleModal}>Small Cargo Truck</Text>
                <Text style={styles.vehicleService}>General services</Text>
              </View>
              <View>
                <Text style={styles.serviceDate}>Dec 12/01/2021</Text>
                <Text style={styles.serviceCharge}> $660</Text>
              </View>
            </View>
            <View style={styles.maintenance}>
              <View>
                <Text style={styles.vehicleModal}>Big Cargo Truck</Text>
                <Text style={styles.vehicleService}>General services</Text>
              </View>
              <View>
                <Text style={styles.serviceDate}>Dec 12/01/2021</Text>
                <Text style={styles.serviceCharge}> $660</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default VehicleMaintenanceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  addMaintananceBtn: {
    // backgroundColor: '',
    // backgroundColor: colors.bg_add,
  },
  signBtn: {
    backgroundColor: colors.bg_btn,
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 6,
    shadowColor: 'black',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 1,
    shadowRadius: 4,
    // elevation: 4,
    alignSelf: 'center',
  },
  signBtnText: {
    color: '#4F4D4D',
    fontSize: width * 0.045,
    fontWeight: '700',
  },
  btnView: {
    backgroundColor: 'white',
    height: height * 0.2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lastMaintenanceHead: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#BAB7B7',
  },
  lastMaintenanceText: {
    color: 'black',
    marginTop: 15,
  },
  maintenance: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#BAB7B7',
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
  },
});
