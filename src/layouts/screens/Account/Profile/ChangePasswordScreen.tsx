/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-return-assign */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Touchable,
  TouchableOpacity,
  Keyboard,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import React, {FC, useCallback, useState} from 'react';
import IonIcon from 'react-native-vector-icons/Ionicons';
import colors from '../../../style/colors';
import {TextInput} from 'react-native-paper';
import {getStorageData, postMethod, storeData} from '../../../../utils/helper';
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import {Controller, useForm} from 'react-hook-form';
import Snackbar from 'react-native-snackbar';
import Feather from 'react-native-vector-icons/Feather';
const {width, height} = Dimensions.get('window');

interface Props {
  navigation: any;
}
const ChangePasswordScreen: FC<Props> = ({navigation}) => {
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: {isValid, errors},
  } = useForm({
    defaultValues: {
      old_pass: '',
      new_pass: '',
      conf_pass: '',
    },
  });

  const onSubmit = async (data: any) => {
    Keyboard.dismiss();
    ChangePasswordHandle(data);
  };

  const ChangePasswordHandle = async (props: { old_pass: any; new_pass: any; conf_pass: any; }) => {
    const storage = await getStorageData();
    const row: any = {
      id:storage.data[0].id,
      old_pass: props.old_pass,
      new_pass: props.new_pass,
      conf_pass: props.conf_pass,
    };
    try {
      setLoading(true);
      const response: any = await postMethod('Test/pass_change', row);
      if (response.status === 200) {
        console.log(response.data, 'response');
        await storeData(response.data);
        Snackbar.show({
          text: response.data.message,
          duration: 1000,
          textColor: colors.white,
          backgroundColor: colors.brand_primary,
        });
        navigation.dispatch(
          CommonActions.navigate({
            name: 'LoginScreen',
          }),
        );
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err, 'error');
    }
  };

  const [text, setText] = React.useState('');
  return (
    <View style={styles.container}>
      <View style={styles.attendBox1}>
        <IonIcon
          name="arrow-back-sharp"
          color={colors.white}
          size={24}
          onPress={() => navigation.goBack()}
          style={{paddingLeft: 30}}
        />
        <Text style={styles.welcome}>Change</Text>
        <Text style={styles.name}>Password</Text>
      </View>
      <View style={{marginTop: 50, marginBottom: 40}}>
        {/* INPUT FOR PASSWORD====================== */}
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({field: {onChange, value, onBlur}}) => (
            <View style={styles.inputView}>
              <TextInput
                label="Current password"
                style={styles.inputText}
                autoCapitalize="none"
                autoCorrect={false}
                underlineColor="white"
                secureTextEntry={true}
                value={value}
                onChangeText={value => onChange(value)}
              />
            </View>
          )}
          name="old_pass"
        />
        {errors.old_pass && errors.old_pass.type === 'required' && (
          <View style={styles.row}>
            <Feather
              name="alert-circle"
              size={9}
              color="red"
              style={styles.icon}
            />
            <Text style={styles.error}>Current Password is required.</Text>
          </View>
        )}

        {/* INPUT FOR PASSWORD====================== */}
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({field: {onChange, value, onBlur}}) => (
            <View style={styles.inputView}>
              <TextInput
                style={styles.inputText}
                label="New password"
                autoCapitalize="none"
                autoCorrect={false}
                underlineColor="white"
                secureTextEntry={true}
                value={value}
                onChangeText={value => onChange(value)}
              />
            </View>
          )}
          name="new_pass"
        />
        {errors.new_pass && errors.new_pass.type === 'required' && (
          <View style={styles.row}>
            <Feather
              name="alert-circle"
              size={9}
              color="red"
              style={styles.icon}
            />
            <Text style={styles.error}>Current Password is required.</Text>
          </View>
        )}
        {/* INPUT FOR RE-ENTER PASSWORD====================== */}
        <Controller
          control={control}
          rules={{
            required: true,
            validate: value => value === getValues('new_pass'),
          }}
          render={({field: {onChange, value, onBlur}}) => (
            <View style={styles.inputView}>
              <TextInput
                style={styles.inputText}
                label="Re-enter new password"
                autoCapitalize="none"
                autoCorrect={false}
                underlineColor="white"
                secureTextEntry={true}
                value={value}
                onChangeText={value => onChange(value)}
              />
            </View>
          )}
          name="conf_pass"
        />
        {errors.conf_pass && errors.conf_pass.type === 'required' && (
          <View style={styles.row}>
            <Feather
              name="alert-circle"
              size={9}
              color="red"
              style={styles.icon}
            />
            <Text style={styles.error}>Current Password is required.</Text>
          </View>
        )}
         {errors.conf_pass && errors.conf_pass.type === 'validate' && (
          <View style={styles.row}>
            <Feather
              name="alert-circle"
              size={9}
              color="red"
              style={styles.icon}
            />
            <Text style={styles.error}>New Password and Confirm Password is not similar .</Text>
          </View>
        )}
        {/* INPUT FOR RE-ENTER PASSWORD====================== */}
      </View>
      <View>
        <Pressable style={styles.submitBtn} onPress={handleSubmit(onSubmit)}>
          {loading ? (
            <ActivityIndicator
              color={'white'}
              size={20}
              style={styles.submitBtnText}
            />
          ) : (
            <Text style={styles.submitBtnText}>Submit</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    marginTop: 7,
    marginLeft: 80,
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
  welcome: {
    color: colors.white,
    fontSize: 20,
    alignSelf: 'center',
    fontFamily: 'Poppins-Medium',
  },
  name: {
    color: colors.white,
    fontSize: 20,
    alignSelf: 'center',
    fontFamily: 'Poppins-Medium',
  },
  attendBox1: {
    height: width * 0.28,
    justifyContent: 'center',
    textAlign: 'center',
    backgroundColor: colors.brand_primary,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  inputText: {
    backgroundColor: colors.white,
    alignSelf: 'center',
    width: width * 0.65,
  },
  inputView: {
    backgroundColor: colors.white,
    width: width * 0.8,
    alignSelf: 'center',
    borderRadius: 30,
    elevation: 8,
    marginVertical: 8,
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
    fontSize: 20,
    alignSelf: 'center',
  },
});
