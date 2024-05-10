/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import React, {FC, useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  Dimensions,
  TouchableOpacity,
  Modal,
  PermissionsAndroid,
  Platform,
  TextInput,
  Linking,
} from 'react-native';
import colors from '../../style/colors';
import Appbar from '../../component/Appbar';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import {
  FormPostMethod,
  getStorageData,
  postMethod,
} from '../../../utils/helper';
import {ActivityIndicator} from 'react-native-paper';
import Snackbar from 'react-native-snackbar';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import call from 'react-native-phone-call';

const {width} = Dimensions.get('window');
interface Props {
  navigation: any;
  route: any;
}

const NewTaskScreen: FC<Props> = ({navigation, route}) => {
  const {task_id} = route.params;
  const [remark, setRemark] = useState('');
  const [data, setData] = useState<String[]>([]);
  const [startDate, setStartDate] = useState('');
  const [task, setTask] = useState('');
  const [endDate, setEndDate] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState(null);
  const [loading0, setLoading0] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState<string[]>([]);
  const [imageUris, setImageUris] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  useFocusEffect(
    useCallback(() => {
      ViewTaskHandle();
    }, []),
  );

  // View Task Details
  const ViewTaskHandle = async () => {
    const storage = await getStorageData();
    setAddress(storage.data[0].address);
    try {
      const row = {
        task_id: task_id,
      };
      setLoading0(true);
      const response: any = await postMethod('Task/task_detail', row);
      if (response.status === 200) {
        console.log(response.data, 'item');
        setData(response.data.data);
        setMessage(response.data.message);
        setContact(response.data.data[0].client_phone);
        console.log(contact,'contact')
        setLoading0(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setLoading0(false);
    }
  };

  // Start Date Function
  const StartTaskHandle = async () => {
    const storage = await getStorageData();
    try {
      const row = {
        task_id: task_id,
        user_id: storage.data[0].id,
      };
      setLoading1(true);
      const response: any = await postMethod('Task/start_a_task', row);
      if (response.data.status === true) {
        console.log(response.data, 'response');
        setStartDate(response.data.data);
        setLoading1(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setLoading1(false);
    }
  };

  // End Date Function
  const EndTaskHandle = async () => {
    const storage = await getStorageData();

    try {
      const row = {
        task_id: task_id,
        user_id: storage.data[0].id,
      };
      setLoading1(true);
      const response: any = await postMethod('Task/complete_a_task', row);
      if (response.status === 200) {
        console.log(response.data, 'responsecvv');
        setEndDate(response.data.data);
        navigation.dispatch(
          CommonActions.navigate({
            name: 'CompleteScreen',
          }),
        );
        setLoading1(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setLoading1(false);
    }
  };

  // Camera Permission
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission to capture photos.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Camera permission granted');
        } else {
          console.log('Camera permission denied');
        }
      } catch (error) {
        console.log('Error requesting camera permission:', error);
      }
    }
  };

  // Select Images IN library
  const openImageLibrary = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      selectionLimit: 2 - imageUris.length, // Set the remaining number of images to be selected
    };
    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled');
        setImageUri(null);
      } else if (response.error) {
        console.log('Error:', response.error);
        setImageUri(null);
      } else if (response.customButton) {
        console.log('User tapped custom button:', response.customButton);
        setImageUri(null);
      } else {
        const selectedImages = response.assets
          ? response.assets.map((asset: {uri: any}) => asset.uri)
          : [response.uri];
        setImageUris(prevUris => [...prevUris, ...selectedImages]);
      }
      toggleModal();
    });
  };

  const openCamera = async () => {
    await requestCameraPermission();
    const options = {
      storageOptions: {
        path: 'images',
        mediaType: 'photo',
      },
      includeBase64: true,
    };

    launchCamera(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled');
        setImageUri(null);
      } else if (response.error) {
        console.log('Error:', response.error);
        setImageUri(null);
      } else if (response.customButton) {
        console.log('User tapped custom button:', response.customButton);
        setImageUri(null);
      } else {
        const source = response.assets ? response.assets[0].uri : response.uri;
        setImageUris(prevUris => [...prevUris, source]);
      }
      toggleModal();
    });
  };

  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const imageHandle = async () => {
    try {
      const formData = new FormData();
      formData.append('task_id', task_id);
      formData.append('remark', remark);
      imageUris.forEach((uri, index) => {
        const imageName = `image_${index + 1}.jpg`;
        formData.append('task_picture', {
          name: imageName,
          type: 'image/jpeg',
          uri: uri,
        });
        console.log(`Uploaded image ${index + 1} link: ${imageName}`);
      });

      setLoading(true);
      // Make the API call with the FormData
      const response: any = await FormPostMethod(
        'Task/complete_a_task',
        formData,
      );
      if (response.data.status === true) {
        console.log(response.data, 'komaL');
        if (startDate !== '' && endDate !== '') {
          if (imageUris.length > 0 && remark.length > 0) {
            setTask(response.data.message);

            navigation.dispatch(
              CommonActions.navigate({
                name: 'CompleteScreen',
              }),
            );
          } else {
            Snackbar.show({
              text: 'Please upload an image or provide a remark',
              duration: 1000,
              textColor: colors.white,
              backgroundColor: colors.brand_primary,
            });
          }
        }
        // Check if the conditions are not met
        else {
          Snackbar.show({
            text: 'Please complete your task',
            duration: 1000,
            textColor: colors.white,
            backgroundColor: colors.brand_primary,
          });
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const handlePhoneCall = (phoneNumber:number)=> {
    
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    } else {
      // Display a message indicating that the contact number is null
      Snackbar.show({
        text: 'Contact number is null',
        duration: Snackbar.LENGTH_LONG,
        textColor: colors.white,
        backgroundColor: colors.brand_primary,
      });
    }
  
    
  }

  return (
    <>
      <Appbar navigation={navigation} backgroundColor="white" />
      <View style={styles.container}>
        <ScrollView>
          <View style={{flexDirection: 'row', alignSelf: 'center'}}>
            <Image
              source={require('../../img/location.png')}
              style={styles.location}
            />
            <Text style={styles.address}>{address}</Text>
          </View>
          {loading0 ? (
            <ActivityIndicator size={20} color={colors.brand_primary} />
          ) : data !== null ? (
            data.map((item: any) => (
              <>
                <View style={styles.card0} key={item.task_id}>
                  <Text style={styles.text}>{item.task_description}</Text>
                </View>
                <View style={styles.card}>
                  <View>
                    <Text style={styles.text1}>Start Date</Text>
                    <Text style={styles.text2}>End Date</Text>
                  </View>
                  <View>
                    <Text style={styles.date1}>{startDate}</Text>
                    <Text style={styles.date2}>{endDate}</Text>
                  </View>
                </View>
                <Pressable
                  style={styles.align}
                  onPress={() => handlePhoneCall(item.client_phone)}>
                  <Pressable onPress={() => handlePhoneCall(item.client_phone)}>
                    <Text style={styles.customer}>Call Customer</Text>
                    <Text style={styles.number}>{item.client_phone}</Text>
                  </Pressable>

                  <Image
                    source={require('../../img/customer.png')}
                    style={styles.customerImg}
                  />
                </Pressable>
              </>
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

          {startDate === '' ? (
            <Pressable
              style={styles.StartTask}
              onPress={() => StartTaskHandle()}>
              {loading1 ? (
                <ActivityIndicator size={20} color={colors.white} />
              ) : (
                <Text style={styles.StartTaskText}>Start Task</Text>
              )}
            </Pressable>
          ) : (
            <Pressable style={styles.StartTask} onPress={() => EndTaskHandle()}>
              {loading1 ? (
                <ActivityIndicator size={20} color={colors.white} />
              ) : (
                <Text style={styles.StartTaskText}>End Task</Text>
              )}
            </Pressable>
          )}

          {/* <View>
            <Text style={styles.taskText}>{task}</Text>
            <View style={styles.bottomView}>
              <TextInput
                placeholder="Remark..."
                placeholderTextColor={colors.text_secondary}
                style={styles.remark}
                multiline={true}
                value={remark}
                onChangeText={text => setRemark(text)}
              />
              <TouchableOpacity
                style={styles.uploadImageBtn}
                onPress={toggleModal}>
                {imageUris.map((uri, index) => (
                  <Image
                    key={index}
                    source={{uri}}
                    style={styles.uploadedImage}
                  />
                ))}
                {imageUris.length < 1 && (
                  <Text style={styles.uploadImageBtnText}>Upload Image</Text>
                )}
              </TouchableOpacity>
            </View>
          </View> */}
          {/* <TouchableOpacity style={styles.saveBtn} onPress={()=>imageHandle()}>
            {loading ? (
              <ActivityIndicator size={15} color={colors.white} />
            ) : (
              <Text style={styles.saveBtnText}>Submit</Text>
            )}
          </TouchableOpacity> */}
          {/* ===============MODAL============================== */}
          {/* <Modal visible={isModalVisible}>
            <View style={styles.popUp}>
              <View style={styles.crossBtn}>
                <View>
                  <Text> </Text>
                </View>
                <TouchableOpacity onPress={toggleModal}>
                  <Text
                    style={{
                      color: 'grey',
                      fontSize: width * 0.06,
                      paddingBottom: 3,
                    }}>
                    X
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.optionBtns}>
                <TouchableOpacity
                  style={styles.optionS}
                  onPress={openImageLibrary}>
                  <MaterialIcons
                    name="insert-photo"
                    size={width * 0.1}
                    color={colors.brand_primary}
                  />
                  <Text>Library</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionS} onPress={openCamera}>
                  <MaterialCommunityIcons
                    name="camera"
                    size={width * 0.1}
                    color={colors.brand_primary}
                  />
                  <Text>Camera</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal> */}
        </ScrollView>
      </View>
    </>
  );
};

export default NewTaskScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 16,
  },
  StartTaskText: {
    fontSize: 18,
    color: colors.white,
    marginTop: 5,
    fontFamily: 'Poppins-Medium',
  },
  StartTask: {
    alignItems: 'center',
    backgroundColor: colors.brand_primary,
    height: 40,
    width: 130,
    alignSelf: 'center',
    borderRadius: 8,
    marginVertical: 50,
  },
  location: {
    marginTop: 40,
    height: width * 0.25,
    width: width * 0.25,
  },
  address: {
    color: colors.brand_primary,
    marginTop: 60,
    marginLeft: 30,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  text: {
    color: colors.black,
    fontSize: 15,
    marginBottom: 10,
    fontFamily: 'Poppins-Medium',
  },
  card0: {
    padding: 15,
    marginTop: 10,
    marginBottom: -30,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width * 0.85,
    alignSelf: 'center',
  },
  card: {
    borderColor: colors.brand_secondary,
    backgroundColor: colors.brand_secondary,
    borderWidth: 1,
    padding: 15,
    marginTop: 40,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 8,
    width: width * 0.85,
    alignSelf: 'center',
  },
  text1: {
    color: colors.gray,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  text2: {
    color: colors.gray,
    // marginLeft: 20,
    fontSize: 14,
    marginTop: 10,
    fontFamily: 'Poppins-Regular',
  },
  date1: {
    color: colors.brand_primary,
    marginRight: 30,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  date2: {
    color: colors.brand_primary,
    marginRight: 40,
    fontSize: 14,
    marginTop: 10,
    fontFamily: 'Poppins-Regular',
  },
  customer: {
    color: colors.brand_primary,
    fontFamily: 'Poppins-Medium',
    marginTop: 20,
  },
  number: {
    color: colors.black,
    fontFamily: 'Poppins-Medium',
  },
  align: {
    marginTop: 50,
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-around',
  },
  customerImg: {
    marginLeft: 40,
  },

  taskText: {
    marginTop: 50,
    color: colors.brand_primary,
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    fontWeight: '600',
  },
  remark: {
    color: 'gray',
    backgroundColor: '#F3F3F3',
    paddingLeft: 20,
  },
  bottomView: {
    backgroundColor: '#F3F3F3',
    marginTop: 20,
    borderRadius: 10,
    elevation: 8,
  },
  uploadImageBtn0: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: 'white',
  },
  uploadImageBtn: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopColor: '#C0B6B6',
    borderTopWidth: 1,
  },
  uploadImageBtnText0: {
    marginLeft: 15,
    alignItems: 'center',
    marginTop: -10,
    marginBottom: 20,
    paddingLeft: 0,
    color: colors.gray,
  },
  uploadImageBtnText: {
    color: colors.gray,
  },

  uploadedImage: {
    width: width * 0.35,
    height: width * 0.35,
  },
  saveBtn: {
    backgroundColor: colors.brand_primary,
    alignSelf: 'center',
    paddingHorizontal: 35,
    paddingVertical: 8,
    borderRadius: 20,
    marginVertical: 20,
  },
  saveBtnText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  // MODAL POPUP==================================

  popUp: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.brand_primary,
    backgroundColor: 'white',
    width: width * 0.8,
    padding: 10,
    marginLeft: '5%',
  },
  crossBtn: {
    width: '90%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    marginLeft: '5%',
    marginBottom: 10,
  },
  optionBtns: {
    display: 'flex',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    marginBottom: 10,
  },
  optionS: {
    width: '30%',
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.brand_primary,
    paddingTop: 7,
    paddingBottom: 7,
  },
});
