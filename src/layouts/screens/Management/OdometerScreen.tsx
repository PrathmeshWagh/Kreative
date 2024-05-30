import { Dimensions, StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Pressable, Image } from 'react-native';
import React, { FC, useState } from 'react';
import colors from '../../style/colors';
import IonIcon from 'react-native-vector-icons/Ionicons';
const { width, height } = Dimensions.get('window');
import DatePicker from 'react-native-date-picker';
import { postMethod } from '../../../utils/helper';
import axios from 'axios';
// import { useNavigation } from '@react-navigation/native';
interface Props {
  navigation: any;
}

const OdometerScreen: FC<Props> = ({ navigation }) => {
  // const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [startOdometerValue, setStartOdometerValue] = useState('');
  const [endOdometerValue, setEndOdometerValue] = useState('');
  const [odometerData, setOdometerData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [startOdoMeterData, setStartOdoMeterData] = useState([]);
  // console.log('startOdoMeterData', startOdoMeterData);

  const [endOdoMeterData, setEndOdoMeterData] = useState([]);
  const [startOdometerPressed, setStartOdometerPressed] = useState(false);

  const handleStartOdometer = async () => {
    try {
      setLoading(true);
      const data = {
        start_odometer_distance: startOdometerValue
      };
      // const api: any = await axios.post(`https://kreative.braincave.work/hrms/api/VMS/audometer_start_distance`, data,{
      //   headers: {
      //     Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiMSIsInVzZXJuYW1lIjoic3VwZXJhZG1pbiIsImVtYWlsIjoic3VwZXJhZG1pbkBnbWFpbC5jb20ifQ.JDP5tig6VGI-fE_dHH4sWRINSIn0QznPHE4rfrtJbeo',
      //     Accept: 'application/json'
      //   },
      // })

      const api: any = await postMethod(`VMS/audometer_start_distance`, data)
      if (api.status === 200) {
        console.log('apiiiii', api?.data);
        setStartOdoMeterData(api?.data)
        setLoading(false);
        setStartOdometerPressed(true); // Mark Start Odometer as pressed
      } else {
        console.log('error in start odometer api status', api.data);
        setLoading(false);
      }
    } catch (error) {
      console.log('error in start odometer api', error);
      setLoading(false);
    }
  };

  const handleEndOdometer = async () => {
    try {
      setLoading(true);
      const data = {
        end_odometer_distance: endOdometerValue,
        data_id: startOdoMeterData?.id
      };
      // console.log('data',data);

      // const api: any = await axios.post(`https://kreative.braincave.work/hrms/api/VMS/audometer_end_distance`, data,{
      //   headers: {
      //     Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiMSIsInVzZXJuYW1lIjoic3VwZXJhZG1pbiIsImVtYWlsIjoic3VwZXJhZG1pbkBnbWFpbC5jb20ifQ.JDP5tig6VGI-fE_dHH4sWRINSIn0QznPHE4rfrtJbeo',
      //     Accept: 'application/json'
      //   },
      // })
      const api: any = await postMethod(`VMS/audometer_end_distance`, data)
      console.log('apiiii', api);


      if (api.status == 200) {
        console.log('appppp end odometer', api.data);

        setEndOdoMeterData(api?.data.data)
        setStartOdometerPressed(false);
        setLoading(false);
      } else {
        console.log('error in end odometer api status', api.data);
        setLoading(false);
      }
    } catch (error) {
      console.log('error in end odometer api', error);
      setLoading(false);
    }
  };

  const handleCheckHistory = () => {
    setShowDatePicker(true);
  };

  const handleConfirmDate = () => {
    setShowDatePicker(false);
    const serializableDate = selectedDate.toISOString();
    console.log('serializableDate', serializableDate);
    console.log('selectedDate', selectedDate);
    navigation.navigate('OdometerHistory', { selectedDatee: serializableDate });
  };

  const handleCancelDate = () => {
    setShowDatePicker(false);
  };

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
          Odometer
        </Text>
        <Text> </Text>
      </View>
      <ScrollView>
        <Pressable
          style={[styles.historyBtn]} // Add disabled style if Start Odometer button is pressed
          onPress={handleCheckHistory}
        // disabled={startOdometerPressed}  startOdometerPressed && styles.disabledBtn // Disable button if Start Odometer button is pressed
        >
          <Text style={styles.historyBtnText}>Check Odometer History</Text>
        </Pressable>
        {showDatePicker && (
          <View style={styles.datePickerContainer}>
            <Text style={styles.datePickerTitle}>Choose Date To Check Odometer History</Text>
            <DatePicker
              date={selectedDate}
              onDateChange={setSelectedDate}
              mode='date'
              style={{backgroundColor:'#808080', }}

            />
            <View style={styles.datePickerBtnContainer}>
              <Pressable style={styles.datePickerBtn} onPress={handleConfirmDate}>
                <Text style={styles.datePickerBtnText}>Confirm</Text>
              </Pressable>
              <Pressable style={styles.datePickerBtn} onPress={handleCancelDate}>
                <Text style={styles.datePickerBtnText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        )}
        <View style={styles.speedometerContainer}>
          <Image source={require('../../img/odometer.png')} />
        </View>
        <View style={styles.odometerReadings}>
          <View style={styles.odometerReadingsInner}>
            <Pressable
              style={[styles.startOdometer, startOdometerPressed && styles.disabledBtn]}
              onPress={handleStartOdometer}
              disabled={startOdometerPressed}
            >
              <Text style={styles.odometerReadingsText}>Start Odometer</Text>
            </Pressable>
            <TextInput
              placeholder="Start Odometer"
              keyboardType="decimal-pad"
              value={startOdometerValue}
              onChangeText={(text) => setStartOdometerValue(text)}
              style={[styles.textInput, startOdometerPressed && styles.disabledTextInput]}
              editable={!startOdometerPressed}
            />
          </View>
          <View style={[styles.odometerReadingsInner, { marginLeft: 10 }]}>
            <Pressable style={styles.startOdometer} onPress={handleEndOdometer}>
              <Text style={styles.odometerReadingsText}>End Odometer</Text>
            </Pressable>
            <TextInput
              placeholder="End Odometer"
              keyboardType="decimal-pad"
              value={endOdometerValue}
              onChangeText={(text) => setEndOdometerValue(text)}
              style={styles.textInput}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default OdometerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  upperView: {
    backgroundColor: colors.brand_primary,
    height: height * 0.11,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: height * 0.02,
    paddingLeft: width * 0.03,
  },
  historyBtn: {
    marginTop: 20,
    marginRight: 10,
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 0.5,
    height: 30,
    width: width * 0.50,
    alignItems: 'center',
    alignSelf: 'flex-end'
  },
  historyBtnText: {
    fontSize: width * 0.04,
    fontWeight: '500',
    color: 'black',
  },
  datePickerContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  datePickerTitle: {
    fontSize: width * 0.035,
    fontWeight: '500',
    color: 'black',
  },
  datePickerBtnContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  datePickerBtn: {
    marginHorizontal: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#ccc',
  },
  datePickerBtnText: {
    fontSize: width * 0.04,
    fontWeight: '500',
    color: 'black',
  },
  speedometerContainer: {
    alignSelf: 'center',
    borderBottomColor: '#C4C4C4',
    borderBottomWidth: 1,
    marginVertical: 20,
    paddingBottom: 40,
  },
  odometerReadings: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#F6F6F6',
    padding: 10,
    elevation: 8,
    marginTop: width * 0.035,

  },
  odometerReadingsInner: {
    width: '48%',
    alignSelf: 'center',
  },
  startOdometer: {
    paddingVertical: 5,
    borderWidth: 0.8,
    borderRadius: 8,
    marginBottom: 10,
    width: '70%',
    alignSelf: 'center',
  },
  odometerReadingsText: {
    color: '#565252',
    fontSize: width * 0.038,
    fontWeight: '700',
    alignSelf: 'center',
    marginBottom: 5,
  },
  disabledBtn: {
    opacity: 0.5,
  },
  disabledTextInput: {
    backgroundColor: '#F6F6F6',
  },
  textInput: {
    borderWidth: 1,
    color: '#000000',
    fontSize: 15,
    fontWeight: '400'
  },
});
