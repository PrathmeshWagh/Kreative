/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unstable-nested-components */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Image, Text} from 'react-native';
import colors from '../../style/colors';
import HomeScreen from '../../screens/Account/Home/HomeScreen';
import AccountScreen from '../../screens/Account/Profile/AccountScreen';
import {getStorageData} from '../../../utils/helper';
import {useFocusEffect} from '@react-navigation/native';
import ProjectScreen from '../../screens/Project/ProjectScreen';
import { Ionicons } from '@expo/vector-icons';


const Tab = createBottomTabNavigator();
const InfoContext = createContext();
export const useInfoContext = () => useContext(InfoContext);
const TabNavigation = ({userData, navigation}: any) => {
  const [userFirst, setUserFirst] = useState(null);
  const [userLast, setUserLast] = useState(null);
  const [userAddress, setUserAddress] = useState([]);

  useFocusEffect(
    useCallback(() => {
      details();
      detailsUpdate();      
    }, []),
  );

  const detailsUpdate = async () => {
    const storage = await getStorageData();
    setUserFirst(storage.user.first_name);
    setUserLast(storage.user.last_name);
    setUserAddress(storage.data[0].address);
    console.log(userFirst, 'laljjk');
  };

  const details = async () => {
    const storage = await getStorageData();
    setUserFirst(storage.data[0].first_name);
    setUserLast(storage.data[0].last_name);
    setUserAddress(storage.data[0].address);
    console.log(storage, userFirst, 'jjk');
  };

  return (
    <InfoContext.Provider value={{userFirst, userLast, userAddress}}>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {backgroundColor: colors.brand_secondary},
          tabBarActiveTintColor: colors.brand_primary,
          tabBarInactiveTintColor: colors.gray,
          tabBarLabelStyle: {
            marginBottom: 5,
          },
          headerShown: false,
        }}>
        <Tab.Screen
          name="HomeScreen"
          component={HomeScreen}
          // initialParams={{userData:userData }}
          options={{
            tabBarLabel: ({focused, color}) => (
              <Text style={{color: focused ? color : 'gray'}}>Home</Text>
            ),
            tabBarIcon: ({color}) => (
              <MaterialCommunityIcons
                name="home-outline"
                color={color}
                size={24}
              />
            ),
          }}
        />

        <Tab.Screen
          name="Account Screen"
          component={AccountScreen}
          options={{
            tabBarLabel: ({focused, color}) => (
              <Text style={{color: focused ? color : 'gray'}}>Account</Text>
            ),
            tabBarIcon: ({color}) => (
              <IonIcon name="person" color={color} size={23} />
            ),
          }}
        />
         <Tab.Screen
          name="Project Screen"
          component={ProjectScreen}
          options={{
            tabBarLabel: ({focused, color}) => (
              <Text style={{color: focused ? color : 'gray'}}>Project</Text>
            ),
            tabBarIcon: ({color}) => (
              <Image source={require('../../img/Project.png')} tintColor={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </InfoContext.Provider>
  );
};

export default TabNavigation;
