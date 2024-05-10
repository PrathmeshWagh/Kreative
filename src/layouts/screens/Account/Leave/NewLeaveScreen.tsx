/* eslint-disable no-sequences */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-trailing-spaces */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
  Pressable,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import colors from '../../../style/colors';
import CalendarPicker from 'react-native-calendar-picker';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {getMethod, getStorageData, postMethod} from '../../../../utils/helper';
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import moment from 'moment';
import Snackbar from 'react-native-snackbar';
import {ActivityIndicator} from 'react-native-paper';
import { openCamera } from 'react-native-image-crop-picker';

const {width} = Dimensions.get('window');
interface Props {
  navigation: any;
}
const NewLeaveScreen: React.FC<Props> = ({navigation}) => {
  const [selected, setSelected] = useState('am');
  const [selectedFile, setSelectedFile] = useState([]);
  const [resetCalendar, setResetCalendar] = useState(false);
  const [data, setData] = useState([]);
  const [cause, setCause] = useState('');
  const [loading, setLoading] = useState(false);
  const [remark, setRemark] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [curValue, SetCurValue] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Resetcalendar
  const resetSelection = () => {
    setStartDate(null), setEndDate(null);
    setResetCalendar(!resetCalendar);
    setSelected('am');
    setResetCalendar(!resetCalendar);
  };

  const totalDaysSelected =
    startDate && endDate
      ? moment(endDate, 'DD/MM/YYYY').diff(
          moment(startDate, 'DD/MM/YYYY'),
          'days',
        ) + 1
      : startDate
      ? setEndDate(startDate) && 1
      : 0;

  useFocusEffect(
    useCallback(() => {
      LeaveType();
    }, []),
  );

  // select and change date
  const onDateChange = (date: React.SetStateAction<string>, type: string) => {
    const newDate = JSON.stringify(date);
    const newDate1 = newDate.substring(1, newDate.length - 1);
    const dates = newDate1.split('T');
    const date1 = dates[0].split('-');
    const day = date1[2];
    const month = date1[1];
    const year = date1[0];

    if (type === 'END_DATE') {
      if (day === undefined) {
        setEndDate(null);
      } else {
        setEndDate(day + '-' + month + '-' + year);
      }
    } else {
      setStartDate(day + '-' + month + '-' + year);
      setEndDate(null);
    }
  };

  // Type OF leave Function
  const LeaveType = async () => {
    try {
      const response: any = await getMethod('Leave/leave_types');
      if (response.status === 200) {
        console.log(response.data, 'response5');
        setData(response.data.data);
      } else {
        console.error('API error:', response.data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Select file
  const handleChooseFile = async () => {
    try {
      const result: DocumentPickerResponse[] = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
        allowMultiSelection: true,
      });
      setSelectedFile(result);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log(err, 'cancel');
      } else {
        console.log(err, 'error');
      }
    }
  };

  // Apply to leave
  const newLeaveHandle = async () => {
    const storage = await getStorageData();
    const apiResponse = {
      data: {
        status: false,
        message: 'Field is Required',
      },
    };
    try {
      const row = {
        user_id: storage.data[0].id,
        leave_type_id: curValue,
        leave_reason: cause,
        start_date: startDate,
        end_date: endDate,
        remark: remark,
        leave_attachment: selectedFile,
      };

      setLoading(true);
      const response: any = await postMethod('Leave/apply_leave', row);
      if (response.data.status === true) {
        Snackbar.show({
          text: response.data.message,
          duration: 1000,
          textColor: colors.white,
          backgroundColor: colors.brand_primary,
        });
        navigation.dispatch(
          CommonActions.navigate({
            name: 'TabNavigation',
          }),
        );
      } else {
        Snackbar.show({
          text: response.data.message,
          duration: 1000,
          textColor: colors.white,
          backgroundColor: colors.brand_primary,
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      return Snackbar.show({
        text: apiResponse.data.message,
        duration: 1000,
        textColor: colors.white,
        backgroundColor: colors.brand_primary,
      });
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <IonIcon
            name="arrow-back-outline"
            color={colors.black}
            size={23}
            onPress={() => navigation.goBack()}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 30,
          marginBottom: 0,
          paddingHorizontal: 10,
        }}>
        <Text style={styles.head}>New Leave</Text>
      </View>

      <ScrollView>
        <View style={styles.newLeaveForm}>
          <View style={{paddingVertical: 5, paddingHorizontal: 20}}>
            <Text style={styles.heading}>Type</Text>
            <DropDownPicker
              items={data.map((item: any) => ({
                label: item.type_name,
                value: item.leave_type_id.toString(), // Convert to string if necessary
              }))}
              open={isOpen}
              setOpen={() => setIsOpen(!isOpen)}
              value={curValue}
              setValue={value => SetCurValue(value)}
              maxHeight={200}
              // autoScroll
              placeholder="Select your Leave Type"
              placeholderStyle={{color: 'gray', fontSize: responsiveWidth(3)}}
              style={[
                styles.dropDownPicker,
                isOpen ? styles.dropDownPickerOpen : null,
              ]}
            />
          </View>
          <View style={styles.section}>
            <Text style={styles.heading}>Cause</Text>
            <TextInput
              style={styles.text}
              value={cause}
              onChangeText={text => setCause(text)}
            />
          </View>
          <View style={styles.section}>
            <Text style={styles.heading}>From</Text>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.text}>
                {startDate ? startDate : 'No date selected'}
              </Text>
            </View>
          </View>

          <CalendarPicker
            // ref={fileInputRef}
            startFromMonday={true}
            allowRangeSelection={true}
            selectedDayColor={colors.brand_primary}
            selectedDayTextColor={colors.white}
            width={width * 0.8}
            height={width * 0.9}
            todayBackgroundColor="#f2e6ff"
            onDateChange={(date, type) => onDateChange(date, type)}
            key={resetCalendar ? 'reset' : 'normal'}
          />
          <TouchableOpacity style={styles.saveBtn} onPress={resetSelection}>
            <Text style={styles.submitBtnText}>Reset Selection</Text>
          </TouchableOpacity>
          <View style={styles.section}>
            <Text style={styles.heading}>To</Text>
            <Text style={styles.text}>
              {endDate ? endDate : 'No date selected'}
            </Text>
          </View>
        </View>
        <View style={styles.column2}>
          <View style={styles.box0}>
            <Text style={styles.text0}>
              {selectedFile.length > 0
                ? selectedFile[0].name
                : 'No file selected'}
            </Text>
          </View>
          <TouchableOpacity onPress={() => handleChooseFile()}>
            <Icon name="upload" size={15} color={'black'} />
          </TouchableOpacity>
        </View>
        <View>
          <TextInput
            placeholder="Remark..."
            placeholderTextColor={colors.gray}
            style={styles.remark}
            multiline={true}
            value={remark}
            onChangeText={text => setRemark(text)}
          />
        </View>
        <Pressable style={styles.submitBtn} onPress={() => newLeaveHandle()}>
          {loading ? (
            <ActivityIndicator size={20} color={colors.white} />
          ) : (
            <Text style={styles.submitBtnText}>
              Apply for
              {totalDaysSelected === 1
                ? ' 1 day'
                : totalDaysSelected > 1
                ? ` ${totalDaysSelected} days `
                : ''}{' '}
              leave
            </Text>
          )}
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default NewLeaveScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.brand_secondary,
    flex: 1,
    padding: 20,
  },
  dropDownPicker: {
    borderWidth: 0,
    borderColor: 'transparent',
  },
  dropDownPickerOpen: {
    marginBottom: 200,
  },
  head: {
    fontFamily: 'Poppins-Medium',
    fontSize: 24,
    color: colors.black,
    fontWeight: 'bold',
  },
  arrowButton: {
    backgroundColor: colors.white,
    borderRadius: 5,
    alignSelf: 'flex-start',
    padding: 8,
    elevation: 8,
  },
  newLeaveForm: {
    backgroundColor: colors.white,
    marginVertical: 30,
    borderRadius: 8,
    elevation: 8,
  },

  section: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderBottomColor: colors.lightGray,
    borderBottomWidth: 1,
  },
  section2: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomColor: colors.lightGray,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  heading: {
    color: colors.gray,
    fontWeight: '600',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  text: {
    color: colors.black,
    fontWeight: '600',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  toggleButtons: {
    flexDirection: 'row',
    backgroundColor: '#E1E1E1',
    paddingHorizontal: 2,
    paddingVertical: 2,
    borderRadius: 15,
  },
  toggleButton: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 15,
    color: colors.gray,
  },
  activeToggleButton: {
    backgroundColor: colors.white,
  },
  timeSelectorText: {
    color: colors.black,
  },
  timeSelector: {
    backgroundColor: '#E1E1E1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 10,
  },
  saveBtn:{
    backgroundColor: colors.brand_primary,
    width: width * 0.5,
    alignSelf: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 50,
  },
  submitBtn: {
    backgroundColor: colors.brand_primary,
    width: width * 0.77,
    alignSelf: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 50,
  },
  submitBtnText: {
    color: colors.white,
    fontSize: 16,
    alignSelf: 'center',
  },

  remark: {
    marginTop: 10,
    height: responsiveHeight(10),
    marginBottom: 20,
    color: 'gray',
    backgroundColor: 'white',
    paddingLeft: 20,
  },

  column2: {
    width: 320,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignSelf: 'center',
    textAlign: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    justifyContent: 'space-between',
    paddingRight: 15,
    marginBottom: 5,
    paddingVertical: 10,
  },
  text1: {
    color: colors.white,
    fontFamily: 'Roboto-Medium',
    fontSize: 18,
  },
  text0: {
    color: colors.black,
    fontFamily: 'Roboto-Dark',
    fontSize: 10,
  },

  box0: {
    width: 150,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginHorizontal: 10,
    backgroundColor: '#FFB534',
    borderRadius: 5,
    borderWidth: 1,
    textAlign: 'justify',
  },
  box: {
    width: 120,
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginHorizontal: 30,
    borderRadius: 5,
    borderColor: colors.gray,
    borderWidth: 1,
  },
});
