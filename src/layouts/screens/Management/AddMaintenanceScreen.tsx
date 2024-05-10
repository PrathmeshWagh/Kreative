/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useState, useEffect, FC, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Button,
  ScrollView,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  TextInput,
} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {ImagePickerResponse, launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Modal from 'react-native-modal';
import colors from '../../style/colors';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { getMethod } from '../../../utils/helper';
import { Badge } from 'react-native-paper';
const {width, height} = Dimensions.get('window');

interface Props {
  navigation: any;
}

const AddMaintenanceScreen: FC<Props> = ({navigation}) => {
  // // PHOTO UPLOAD USESTATE----------------------------------------------------------------
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageUris, setImageUris] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [notificationCount, setNotificationCount] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchNotificationNumber();
    }, []),
  );

  const fetchNotificationNumber = async () => {
    try {
      setLoading(true);
      const response: any = await getMethod('Notification/notificaton_total');
      if (response.status === 200) {
        setNotificationCount(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

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

  const openImageLibrary = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: true,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled');
        setImageUri(null);
      } else if (response.error) {
        console.log('ImagePicker Error:', response.error);
        setImageUri(null);
      } else {
        const source = response.assets[0].uri;
        const newUris = [...imageUris, source];
        setImageUri(source);
        setImageUris(newUris);

        if (selectedImage === null) {
          setSelectedImage(source);
        }
      }
      toggleModal();
    });
  };

  const openCamera = async () => {
    await requestCameraPermission();
    const options = {
      mediaType: 'photo',
      includeBase64: true,
      saveToPhotos: true,
    };

    launchCamera(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled');
        setImageUri(null);
      } else if (response.error) {
        console.log('ImagePicker Error:', response.error);
        setImageUri(null);
      } else {
        const source = response.assets[0].uri;
        const newUris = [...imageUris, source];
        setImageUri(source);
        setImageUris(newUris);

        if (selectedImage === null) {
          setSelectedImage(source);
        }
      }
      toggleModal();
    });
  };

  // // PHOTO UPLOAD USESTATE ENDED----------------------------------------------------------------

  // MODAL USESTATE----------------------------------------------------------------

  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    console.log('Image URI:', imageUri);
  }, [imageUri]);

  // MODAL USESTATE ENDED----------------------------------------------------------------

  return (
    <View style={{height: '100%'}}>
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
        <TouchableOpacity
            onPress={() =>
              navigation.dispatch(
                CommonActions.navigate({
                  name: 'NotificationScreen',
                  params: {
                    notificationData: notificationCount,
                  },
                }),
              )
            }>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.iconDiv}>
              <IonIcon
            name="notifications"
            color={'white'}
            size={width * 0.055}
            style={styles.icon}
          />
                {notificationCount ? (
                  <Badge
                    style={{
                      marginVertical: -27,
                      marginRight: 20,
                      width: 20,
                      height: 20,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {notificationCount}
                  </Badge>
                ) : null}
              </View>
            </View>
          </TouchableOpacity>
       
      </View>
      <ScrollView>
        <View style={styles.btnView}>
          <View style={styles.vehicleDetailView}>
            <View style={styles.vehicleDetailInnerViewOne}>
              <Text style={styles.vehicleDetailsTextOne}>
                Vehicle Details :{' '}
              </Text>
            </View>
            <View>
              <Image
                source={require('../../img/truck.png')}
                style={styles.vehicleImage}
              />
              <Text style={styles.vehicleDescription}>
                Haulage BharatBenz 2823R 28 Ton Heavy Duty Tipper Truck
              </Text>
            </View>
          </View>
          <View style={styles.vehicleDetailView}>
            <View style={styles.vehicleDetailInnerViewTwo}>
              <Text style={styles.vehicleDetailsText}>Model No : </Text>
            </View>
            <View style={styles.detailDiv}>
              <Text style={{color: 'black', fontSize: width * 0.04}}>2020</Text>
            </View>
          </View>
          <View style={styles.vehicleDetailView}>
            <View style={styles.vehicleDetailInnerViewTwo}>
              <Text style={styles.vehicleDetailsText}>ID : </Text>
            </View>
            <View style={styles.detailDiv}>
              <Text style={{color: 'black', fontSize: width * 0.04}}>
                HM234701VR
              </Text>
            </View>
          </View>
          <View style={[styles.vehicleDetailView, {paddingBottom: 10}]}>
            <View style={styles.vehicleDetailInnerViewTwo}>
              <Text style={styles.vehicleDetailsText}>RC : </Text>
            </View>
            <View style={styles.detailDiv}>
              <Text style={{color: 'black', fontSize: width * 0.04}}>
                REH10345#GH233
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.billDetail}>
          <View style={styles.billDetailInner}>
            <Text style={styles.billHead}>Bill Name : </Text>
            <Text style={styles.billText}>Truck Roof Services</Text>
          </View>
          <View style={styles.billDetailInner}>
            <Text style={styles.billHead}>Bill Date : </Text>
            <Text style={styles.billText}>12/09/2022</Text>
          </View>
          <View style={styles.billDetailInner}>
            <Text style={styles.billHead}>Bill Amount : </Text>
            <Text style={styles.billText}>$ 300</Text>
          </View>
          <View style={styles.billDetailInner}>
            <Text style={styles.billHead}>Bill Type : </Text>
            <Text style={styles.billText}>Vehicle Maintenance</Text>
          </View>
        </View>
        <View>
          <TouchableOpacity style={styles.cameraView} onPress={toggleModal}>
            <IonIcon
              name="camera"
              color={'#4F4D4D'}
              size={width * 0.07}
              style={styles.cameraIcon}
            />
          </TouchableOpacity>
        </View>

        {selectedImage ? (
          <View style={{alignSelf: 'center'}}>
            <Image source={{uri: selectedImage}} style={styles.profileImage} />
          </View>
        ) : (
          <View style={{alignSelf: 'center', marginTop: 10}}>
            <Text style={{color:"black"}}>No Image is selected</Text>
          </View>
        )}

        <View style={styles.buttonsView}>
          <TouchableOpacity
            style={styles.signBtn}
            onPress={()=>navigation.navigate('VehicleDetailsScreen')}
          >
            <Text style={styles.signBtnText}>Submit</Text>
          </TouchableOpacity>
        </View>

        {/* MODAL VIEW--------------------------------------------------------- */}

        <Modal isVisible={isModalVisible}>
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
                <Text style={styles.text}>Library</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionS} onPress={openCamera}>
                <MaterialCommunityIcons
                  name="camera"
                  size={width * 0.1}
                  color={colors.brand_primary}
                />
                <Text style={styles.text}>Camera</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* MODAL VIEW ENDED--------------------------------------------------------- */}
      </ScrollView>
    </View>
  );
};

export default AddMaintenanceScreen;

const styles = StyleSheet.create({
  upperView: {
    backgroundColor: colors.brand_primary,
    height: height * 0.17,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: height * 0.03,
    paddingLeft: width * 0.03,
    paddingRight: width * 0.03,
  },
  icon: {
    alignSelf: 'flex-start',
  },
  btnView: {
    backgroundColor: colors.white,
    display: 'flex',
    justifyContent: 'center',
    paddingLeft: '5%',
    marginTop: 10,
    paddingTop: 10,
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 10,
  },
  vehicleDetailView: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 5,
  },
  vehicleDetailInnerViewOne: {
    width: '40%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  vehicleDetailInnerView: {
    width: '55%',
  },
  vehicleDetailInnerViewTwo: {
    width: '40%',
  },
  vehicleDetailsTextOne: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: colors.black,
    justifyContent: 'flex-end',
  },
  vehicleDetailsText: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: colors.black,
    alignSelf: 'flex-end',
    // marginRight: 15,
  },
  vehicleImage: {
    width: width * 0.35,
    height: width * 0.2,
    resizeMode: 'cover',
  },
  detailDiv: {
    backgroundColor: colors.bg_detailDiv,
    width: '47%',
    paddingLeft: 10,
    paddingTop: 3,
    paddingBottom: 3,
  },
  billDetail: {
    width: '76%',
    marginLeft: '12%',
    backgroundColor: colors.white,
    marginTop: 25,
    marginBottom: 25,
  },
  billDetailInner: {
    display: 'flex',
    flexDirection: 'row',
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
  },
  billHead: {
    padding: 12,
    width: '38%',
    color: colors.black,
    fontWeight: '600',
    fontSize: width * 0.03,
    paddingLeft: 20,
  },
  billText: {
    padding: 12,
    color: colors.black,
    fontSize: width * 0.03,
  },
  cameraIcon: {},
  cameraView: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    alignSelf: 'center',
    shadowColor: colors.black,
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 4,
  },

  buttonsView: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '8%',
    alignSelf: 'center',
    paddingBottom: 30,
  },
  signBtn: {
    backgroundColor: colors.brand_primary,
    paddingHorizontal: 85,
    paddingVertical: 8,
    borderRadius: 15,
    shadowColor: colors.black,
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  signBtnText: {
    color: colors.white,
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },

  profileImage: {
    width: width * 0.4,
    height: width * 0.4,
    resizeMode: 'cover',
    marginTop: height * 0.03,
    // marginLeft: width * 0.4,
  },
  vehicleDescription: {
    color: colors.gray_font,
    fontSize: 10,
    textAlign: 'center',
    width: width * 0.45,
  },
  text: {
    color: colors.account_font,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },

  // MODAL CSS-------------------------

  popUp: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.brand_primary,
    backgroundColor: colors.white,
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
    backgroundColor: colors.white,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.brand_primary,
    paddingTop: 7,
    paddingBottom: 7,
  },

  // MODAL CSS ENDED-------------------------
});
