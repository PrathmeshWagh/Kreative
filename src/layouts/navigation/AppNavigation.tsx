/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import EditProfile from '../screens/Account/Profile/EditProfileScreen';
import Page1 from '../screens/Auth/Page1';
import Page2 from '../screens/Auth/Page2';
import Page3 from '../screens/Auth/Page3';
import LoginScreen from '../screens/Auth/LoginScreen';
import HomeScreen from '../screens/Account/Home/HomeScreen';
import TabNavigation from './TabNavigation/TabNavigation';
import ProjectScreen from '../screens/Project/ProjectScreen';
import NewTaskScreen from '../screens/ProjectManagement/NewTaskScreen';
import AccountScreen from '../screens/Account/Profile/AccountScreen';
import SettingScreen from '../screens/Account/Profile/SettingScreen';
import ProfileScreen from '../screens/Account/Profile/ProfileScreen';
import AttendanceScreen from '../screens/Account/Attendence/AttendanceScreen';
import AttendanceDetailScreen from '../screens/Account/Attendence/AttendanceDetailScreen';
import CheckInScreen from '../screens/Account/Attendence/CheckInScreen';
import CheckInCheckoutScreen from '../screens/Account/Attendence/CheckInCheckoutScreen';
import CheckOutScreen from '../screens/Account/Attendence/CheckOutScreen';
import MaterialCostScreen from '../screens/Account/Profile/MaterialCost';
import ChangePasswordScreen from '../screens/Account/Profile/ChangePasswordScreen';
import NotificationScreen from '../screens/Account/Profile/NotificationScreen';
import PayslipSummaryScreen from '../screens/Account/Payroll/PayslipSummaryScreen';
import PayrollScreen from '../screens/Account/Payroll/PayrollScreen';
import NewLeaveScreen from '../screens/Account/Leave/NewLeaveScreen';
import CompleteScreen from '../screens/TaskStatus/CompleteScreen';
import PendingScreen from '../screens/TaskStatus/PendingScreen';
import ProjectTaskScreen from '../screens/Project/ProjectTaskScreen';
import MaterialScreen from '../screens/Management/MaterialScreen';
import VehicleScreen from '../screens/Vehicle/VehicleScreen';
import VehicleMaintenanceScreen from '../screens/Vehicle/VehicleMaintenanceScreen';
import VehicleDetailsScreen from '../screens/Vehicle/VehicleDetailsScreen';
import OdometerScreen from '../screens/Management/OdometerScreen';
import AddMaintenanceScreen from '../screens/Management/AddMaintenanceScreen';
import WrapperComponent from './TabNavigation/TabNavigation';
import AllLeavesScreen from '../screens/Account/Leave/AllLeavesScreen';
import MarkAttendance from '../screens/Account/Attendence/MarkAttendanceScreen';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { getStorageData } from '../../utils/helper';
import TimesheetNavigation from './TimesheetNavigation';

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  const [auth, setAuth] = useState('');
  const [load, setLoad] = useState(true);
  useEffect(() => {
    getUserData();
  }, []);
  const getUserData = async () => {
    try {
      const getData = await getStorageData();
      if (getData) {
        setAuth(getData.access_token);
        console.log(auth,'auth');
      }
      setLoad(false);
    } catch (error) {
      console.log('Initiate data error');
      setLoad(false);
    }
  };
  return load === false ? (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={auth !== '' ? 'TabNavigation' : 'LoginScreen'}>
      {/* LOgIN SCREENS ============================= */}
      <Stack.Screen name="LoginScreen" component={LoginScreen} />

      {/* Home Screen ============================= */}
      <Stack.Screen name="HomeScreen" component={HomeScreen} />

      {/* Project ============================= */}
      <Stack.Screen name="ProjectScreen" component={ProjectScreen} />
      <Stack.Screen name="ProjectTaskScreen" component={ProjectTaskScreen} />

      {/* ProjectManagement ============================= */}
      <Stack.Screen name="NewTaskScreen" component={NewTaskScreen} />

      {/* Fleet Management ============================= */}
      <Stack.Screen name="VehicleScreen" component={VehicleScreen} />
      <Stack.Screen name="MaterialScreen" component={MaterialScreen} />
      <Stack.Screen
        name="VehicleDetailsScreen"
        component={VehicleDetailsScreen}
      />
      <Stack.Screen
        name="VehicleMaintenanceScreen"
        component={VehicleMaintenanceScreen}
      />
      <Stack.Screen
        name="AddMaintenanceScreen"
        component={AddMaintenanceScreen}
      />
      <Stack.Screen name="OdometerScreen" component={OdometerScreen} />

      {/* PROJECT LISTING SCREENS ============================= */}
      <Stack.Screen name="AccountScreen" component={AccountScreen} />

      {/* PROFILE SCREENS ============================= */}
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      {/* PROFILE SCREENS ============================= */}

      {/* LEAVE SCREENS ============================= */}
      <Stack.Screen name="AllLeavesScreen" component={AllLeavesScreen} />
      <Stack.Screen name="NewLeaveScreen" component={NewLeaveScreen} />
      {/* LEAVE SCREENS ============================= */}

      {/* ATTENDANCE SCREENS ============================= */}
      <Stack.Screen name="AttendanceScreen" component={AttendanceScreen} />
      <Stack.Screen
        name="AttendanceDetailScreen"
        component={AttendanceDetailScreen}
      />

      {/* CHECKIN CHECKOUT SCREENS ====================== */}
      <Stack.Screen
        name="CheckInCheckoutScreen"
        component={CheckInCheckoutScreen}
      />
      <Stack.Screen name="CheckInScreen" component={CheckInScreen} />
      <Stack.Screen name="CheckOutScreen" component={CheckOutScreen} />
      {/* <Stack.Screen name="FaceCheckIn" component={FaceCheckIn} /> */}
      {/* CHECKIN CHECKOUT SCREENS ======================== */}

      {/* INTROSCREENS ============================= */}
      <Stack.Screen name="Page1" component={Page1} />
      <Stack.Screen name="Page2" component={Page2} />
      <Stack.Screen name="Page3" component={Page3} />
      {/* INTROSCREENS ============================= */}

      {/* PAYROLL SCREENS ======================== */}
      <Stack.Screen name="PayrollScreen" component={PayrollScreen} />
      <Stack.Screen
        name="PayslipSummaryScreen"
        component={PayslipSummaryScreen}
      />

      {/* SETTINGSCREENS ============================= */}
      <Stack.Screen name="SettingScreen" component={SettingScreen} />
      <Stack.Screen name="MaterialCostScreen" component={MaterialCostScreen} />
      <Stack.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
      />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      {/* SETTINGSCREENS ============================= */}

      {/* TASKSTATUS SCREENS ======================== */}
      <Stack.Screen name="CompleteScreen" component={CompleteScreen} />
      <Stack.Screen name="PendingScreen" component={PendingScreen} />
      {/* TASKSTATUS SCREENS ======================== */}

      {/* BOTTOMTABNAVIGATION */}
      <Stack.Screen name="TabNavigation" component={TabNavigation} />
      <Stack.Screen name="TimesheetNavigation" component={TimesheetNavigation} />


      {/* TOPTABNAVIGATION */}
      <Stack.Screen name="MarkAttendance" component={MarkAttendance} />
    </Stack.Navigator>
      ) : (
    <View>
      <ActivityIndicator size={20} color={Colors.brand_primary} />
    </View>
  );
};

export default AppNavigation;
