/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  TouchableOpacity,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import colors from '../../../style/colors';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {Avatar, TextInput} from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import {
  FormPostMethod,
  getStorageData,
  storeData,
} from '../../../../utils/helper';
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';
import {Controller, useForm} from 'react-hook-form';
import Feather from 'react-native-vector-icons/Feather';
import AccountScreen from './AccountScreen';
import TabNavigation from '../../../navigation/TabNavigation/TabNavigation';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {Pattern} from 'react-native-svg';

interface Props {
  navigation: any;
  route: any;
}
const {width} = Dimensions.get('window');
const EditProfileScreen: React.FC<Props> = ({navigation, route}) => {
  const {
    first_name,
    last_name,
    email,
    phone,
    profile_picture,
    dob,
    gender,
    user_id,
  } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImagePath, setSelectedImagePath] = useState('');

  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
    getValues,
    setValue,
    reset,
    clearErrors,
  } = useForm({
    defaultValues: {
      first_name: '',
      last_name: '',
      gender: '',
      phone: '',
      email: '',
      profile_picture: '',
      dob: '',
    },
  });

  useFocusEffect(
    useCallback(() => {
      setValue('first_name', first_name);
      setValue('last_name', last_name);
      setValue('dob', dob);
      setValue('gender', gender);
      setValue('email', email);
      setValue('phone', phone);
      setSelectedImagePath(profile_picture);
    }, []),
  );

  const onSubmit = (data: {
    first_name: string;
    last_name: string;
    email: string;
    phone: number;
    gender: string;
    dob: String;
  }) => {
    return updateProfile(data);
  };

  const updateProfile = async (data: {
    first_name: string;
    last_name: string;
    email: string;
    phone: number;
    gender: string;
    dob: String;
  }) => {
    try {
      setIsLoading(true);
      const formData: any = new FormData();
      formData.append('user_id', user_id);
      formData.append('first_name', data.first_name);
      formData.append('last_name', data.last_name);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('gender', data.gender);
      formData.append('dob', data.dob);
      if (selectedImagePath) {
        formData.append('avatar_filename', {
          name: 'image.jpg',
          type: 'image/jpeg',
          uri: selectedImagePath,
        });
      }
      const response: any = await FormPostMethod(
        'Profile/edit_profile',
        formData,
      );
      if (response.data.status === true) {
        const existingUserData = await getStorageData();
        const updatedUserDetails = {
          ...existingUserData.user,
          first_name: data.first_name,
          last_name: data.last_name,
          dob: data.dob,
          phone: data.phone,
          email: data.email,
          gender: data.gender,
          avatar_original:
            selectedImagePath || existingUserData.user.avatar_original,
        };
        Snackbar.show({
          text: response.data.message,
          backgroundColor: colors.brand_primary,
          textColor: 'white',
          duration: 1000,
        });
        setIsLoading(false);
        const updatedUserData = {
          ...existingUserData,
          user: updatedUserDetails,
        };
        setIsLoading(false);
        await storeData(updatedUserData);
        navigation.dispatch(
          CommonActions.navigate({
            name: 'TabNavigation',
          }),
        );
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const openCamera = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      });

      if (image && image.path) {
        setSelectedImagePath(image.path);
      }
    } catch (error) {
      console.log('Error selecting image:', error);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.profileView}>
          <IonIcon
            name="arrow-back-sharp"
            color={colors.white}
            size={24}
            onPress={() => navigation.goBack()}
            style={{paddingLeft: 30, marginBottom: -20}}
          />
          {selectedImagePath.length > 0 ? (
            <Image
              source={{uri: selectedImagePath}}
              style={styles.profileImage}
            />
          ) : (
            <Image
              source={{uri: profile_picture}}
              style={styles.profileImage}
            />
          )}

          <TouchableOpacity style={styles.camera}>
            <IonIcon
              name="camera"
              color={colors.white}
              size={23}
              onPress={openCamera}
            />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View style={styles.detailView}>
            <View style={styles.inputarea}>
              <Text style={styles.name}>First Name</Text>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({field: {onChange, value, onBlur}}) => (
                  <TextInput
                    // label="Email"
                    style={styles.input}
                    placeholderTextColor={'gray'}
                    value={value}
                    onChangeText={value => onChange(value)}
                    placeholder="Username"
                    underlineColorAndroid="transparent"
                    right={
                      <TextInput.Icon
                        icon="account-edit-outline"
                        color={colors.brand_primary}
                        size={18}
                      />
                    }
                  />
                )}
                name="first_name"
              />
            </View>
            {errors.first_name && errors.first_name.type === 'required' && (
              <View style={styles.row}>
                <Feather
                  name="alert-circle"
                  size={9}
                  color="red"
                  style={styles.icon}
                />
                <Text style={styles.error}>First Name is required.</Text>
              </View>
            )}
            <View style={styles.inputarea}>
              <Text style={styles.name}>Last Name</Text>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({field: {onChange, value, onBlur}}) => (
                  <TextInput
                    // label="Email"
                    style={styles.input}
                    placeholderTextColor={'gray'}
                    value={value}
                    onChangeText={value => onChange(value)}
                    placeholder="Username"
                    underlineColorAndroid="transparent"
                    right={
                      <TextInput.Icon
                        icon="account-edit-outline"
                        color={colors.brand_primary}
                        size={18}
                      />
                    }
                  />
                )}
                name="last_name"
              />
            </View>
            {errors.last_name && errors.last_name.type === 'required' && (
              <View style={styles.row}>
                <Feather
                  name="alert-circle"
                  size={9}
                  color="red"
                  style={styles.icon}
                />
                <Text style={styles.error}>Last Name is required.</Text>
              </View>
            )}
            <View style={styles.inputarea}>
              <Text style={styles.name}>Email address</Text>
              <Controller
                control={control}
                rules={{
                  required: true,
                  pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                }}
                render={({field: {onChange, value, onBlur}}) => (
                  <TextInput
                    style={styles.input}
                    placeholderTextColor={'gray'}
                    value={value}
                    onChangeText={value => onChange(value)}
                    placeholder="johnhenry@gmail.com"
                    underlineColorAndroid="transparent"
                    right={
                      <TextInput.Icon
                        icon="account-edit-outline"
                        color={colors.brand_primary}
                        size={18}
                      />
                    }
                  />
                )}
                name="email"
              />
              {errors.email && errors.email.type === 'required' && (
                <View style={styles.row}>
                  <Feather
                    name="alert-circle"
                    size={9}
                    color="red"
                    style={styles.icon}
                  />
                  <Text style={styles.error}>Email is required.</Text>
                </View>
              )}
              {errors.email && errors.email.type === 'pattern' && (
                <View style={styles.row}>
                  <Feather
                    name="alert-circle"
                    size={9}
                    color="red"
                    style={styles.icon}
                  />
                  <Text style={styles.error}>Email is not valid.</Text>
                </View>
              )}
            </View>
            <View style={styles.inputarea}>
              <Text style={styles.name}>Phone</Text>
              <Controller
                control={control}
                rules={{
                  required: true,
                  maxLength: 8,
                }}
                render={({field: {onChange, value, onBlur}}) => (
                  <TextInput
                    style={styles.input}
                    placeholderTextColor={'gray'}
                    value={value}
                    onChangeText={value => onChange(value)}
                    placeholder="98765432"
                    underlineColorAndroid="transparent"
                    keyboardType="numeric"
                    right={
                      <TextInput.Icon
                        icon="account-edit-outline"
                        color={colors.brand_primary}
                        size={18}
                      />
                    }
                  />
                )}
                name="phone"
              />
              {errors.phone && errors.phone.type === 'required' && (
                <View style={styles.row}>
                  <Feather
                    name="alert-circle"
                    size={9}
                    color="red"
                    style={styles.icon}
                  />
                  <Text style={styles.error}>Phone No is required.</Text>
                </View>
              )}
              {errors.phone && errors.phone.type === 'maxLength' && (
                <View style={styles.row}>
                  <Feather
                    name="alert-circle"
                    size={9}
                    color="red"
                    style={styles.icon}
                  />
                  <Text style={styles.error}>Phone No is not valid.</Text>
                </View>
              )}
            </View>
            <View style={styles.inputarea}>
              <Text style={styles.name}>Gender</Text>
              <Controller
                control={control}
                rules={{
                  required: true,
                  pattern: {
                    value: /^(Male|Female)$/i, // Regular expression pattern for "Male" or "Female" (case-insensitive)
                    message: 'Please enter a valid gender (Male or Female)',
                  },
                }}
                render={({field: {onChange, value, onBlur}}) => (
                  <TextInput
                    style={styles.input}
                    placeholderTextColor={'gray'}
                    value={value}
                    onChangeText={value => onChange(value)}
                    placeholder="Male"
                    underlineColorAndroid="transparent"
                    right={
                      <TextInput.Icon
                        icon="account-edit-outline"
                        color={colors.brand_primary}
                        size={18}
                      />
                    }
                  />
                )}
                name="gender"
              />
              {errors.gender && errors.gender.type === 'required' && (
                <View style={styles.row}>
                  <Feather
                    name="alert-circle"
                    size={9}
                    color="red"
                    style={styles.icon}
                  />
                  <Text style={styles.error}>Gender is required.</Text>
                </View>
              )}
              {errors.gender && errors.gender.type === 'pattern' && (
                <View style={styles.row}>
                  <Feather
                    name="alert-circle"
                    size={9}
                    color="red"
                    style={styles.icon}
                  />
                  <Text style={styles.error}>
                    Please enter a valid gender (Male or Female)
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.inputarea}>
              <Text style={styles.name}>Date Of Birth</Text>
              <Controller
                control={control}
                rules={{
                  required: true,
                  pattern: {
                    value: /^\d{2}-\d{2}-\d{4}$/,
                    message:
                      'Please enter a valid date in the format YYYY-MM-DD',
                  },
                }}
                render={({field: {onChange, value, onBlur}}) => (
                  <TextInput
                    style={styles.input}
                    placeholderTextColor={'gray'}
                    value={value}
                    onChangeText={value => onChange(value)}
                    placeholder="20-05-1995"
                    underlineColorAndroid="transparent"
                    right={
                      <TextInput.Icon
                        icon="account-edit-outline"
                        color={colors.brand_primary}
                        size={18}
                      />
                    }
                  />
                )}
                name="dob"
              />
              {errors.dob && errors.dob.type === 'required' && (
                <View style={styles.row}>
                  <Feather
                    name="alert-circle"
                    size={9}
                    color="red"
                    style={styles.icon}
                  />
                  <Text style={styles.error}>Date of birth is required.</Text>
                </View>
              )}
              {errors.dob && errors.dob.type === 'pattern' && (
                <View style={styles.row}>
                  <Feather
                    name="alert-circle"
                    size={9}
                    color="red"
                    style={styles.icon}
                  />
                  <Text style={styles.error}>
                    Please enter a valid date in the format DD-MM-YYYY
                  </Text>
                </View>
              )}
            </View>
          </View>
          <Pressable style={styles.saveBtn} onPress={handleSubmit(onSubmit)}>
            {isLoading ? (
              <ActivityIndicator size={20} color={colors.white} />
            ) : (
              <Text style={styles.saveBtnText}>Save</Text>
            )}
          </Pressable>
        </ScrollView>
      </View>
    </ScrollView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    // backgroundColor: colors.white,
    flex: 1,
  },
  profileView: {
    height: width * 0.3,
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
    padding: 0,
    backgroundColor: colors.brand_primary,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileImage: {
    height: responsiveHeight(10),
    width: responsiveWidth(20),
    alignSelf: 'center',
    position: 'relative',
    borderRadius: 70,
    marginBottom: -15,
  },
  detailView: {
    // backgroundColor: 'white',
    marginTop: 20,
    // flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderColor: colors.lightGray,
    flex: 1,
    overflow: 'hidden',
  },
  camera: {
    position: 'absolute',
    right: '37%',
    top: '52%',
  },
  input: {
    color: 'black',
    height: 24,
    backgroundColor: colors.white,
  },
  inputarea: {
    backgroundColor: colors.white,
    borderRadius: 15,
    width: width * 0.9,
    alignSelf: 'center',
    paddingTop: 5,
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    marginTop: 7,
    marginLeft: 20,
  },
  icon: {
    marginRight: 4,
    marginTop: -3,
  },
  error: {
    width: 330,
    color: 'red',
    fontSize: 10,
    marginTop: -5,
    marginBottom: 5,
  },
  name: {
    fontSize: 12,
    marginBottom: 5,
    marginLeft: 18,
    color: 'black',
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
  },
});
