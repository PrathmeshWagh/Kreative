/* eslint-disable react/jsx-no-undef */
/* eslint-disable semi */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable prettier/prettier */
/* eslint-disable comma-dangle */
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useState,
} from 'react';
import colors from '../../../style/colors';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {getMethod, getStorageData, postMethod} from '../../../../utils/helper';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width} = Dimensions.get('window');
interface Props {
  navigation: any;
  route: any;
}

interface ProfileData {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: string;
  gender: string;
  profile_picture: string;
  contact_no: string;
}

const ProfileScreen: React.FC<Props> = ({navigation}) => {
  navigation = useNavigation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profileInfo, setProfileInfo] = useState([]);

  useFocusEffect(
    useCallback(() => {
      Profile();
      fatchData();
    }, []),
  );

  const Profile = async () => {
    const storage = await getStorageData();
    const row = {
      user_id: storage.data[0].id,
    };
    try {
      setLoading(true);
      const response: any = await postMethod('Profile/user_profile', row);
      if (response.data.status === true) {
        setData(response.data.data);
        await AsyncStorage.setItem('image', JSON.stringify(response.data.data));
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const ProfileDetails = (data: any) => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'EditProfile',
        params: {
          user_id: data.user_id,
          first_name: data.first_name,
          last_name: data.last_name,
          dob: data.date_of_birth,
          email: data.email,
          phone: data.contact_no,
          profile_picture: data.profile_picture,
          gender: data.gender,
        },
      }),
    );
  };

  const fatchData = async () => {
    const jsonValue = await AsyncStorage.getItem('image');
    const imageSection = JSON.parse(jsonValue);
    setProfileInfo(imageSection);
    console.log(profileInfo,imageSection, 'profileInfo');
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size={20} color={colors.brand_primary} />
      ) : 
      (
        data && (
          <>
            <View style={styles.profileView}>
              <IonIcon
                name="arrow-back-sharp"
                color={colors.white}
                size={24}
                onPress={() => navigation.goBack()}
                style={{paddingLeft: 30, marginBottom: -20}}
              />
              <Image
                source={{uri: data.profile_picture}}
                style={styles.profileImage}
              />
            </View>
            <View style={styles.detailView}>
              <ScrollView>
                <View style={styles.topView}>
                  <Text style={styles.idNo}>ID: {data.user_id}</Text>
                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => ProfileDetails(data)}>
                    <Text style={styles.editBtnText}>Edit</Text>
                  </TouchableOpacity>
                </View>
                <View style={{}}>
                  <View style={styles.labelView}>
                    <Text style={styles.label}>User name</Text>
                    <Text style={styles.labelText}>{data.first_name}</Text>
                  </View>
                  <View style={styles.labelView}>
                    <Text style={styles.label}>User name</Text>
                    <Text style={styles.labelText}>{data.last_name}</Text>
                  </View>
                  <View style={styles.labelView}>
                    <Text style={styles.label}>Email address</Text>
                    <Text style={styles.labelText}>{data.email}</Text>
                  </View>
                  <View style={styles.labelView}>
                    <Text style={styles.label}>Phone</Text>
                    <Text style={styles.labelText}>{data.contact_no}</Text>
                  </View>
                  <View style={styles.labelView}>
                    <Text style={styles.label}>Gender</Text>
                    <Text style={styles.labelText}>{data.gender}</Text>
                  </View>
                  <View style={styles.labelView}>
                    <Text style={styles.label}>Date of Birth</Text>
                    <Text style={styles.labelText}>{data.date_of_birth}</Text>
                  </View>
                </View>
              </ScrollView>
            </View>
          </>
        )
      )}
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
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
    backgroundColor: '#FAFAFA',
    marginTop: 20,
    // flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderColor: colors.lightGray,
    flex: 1,
  },
  topView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  idNo: {
    color: colors.brand_primary,
    fontSize: 16,
  },
  editBtn: {
    backgroundColor: '#F1F1F1',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    elevation: 8,
  },
  editBtnText: {
    color: colors.account_font,
  },
  label: {
    color: colors.gray_font,
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
  },
  labelText: {
    color: colors.black,
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
  labelView: {
    marginVertical: 8,
  },
});
