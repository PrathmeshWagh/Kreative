/* eslint-disable space-infix-ops */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  Dimensions,
  PixelRatio,
  Pressable,
  ScrollView,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import CustomTimesheetBar from './CustomTimesheetBar';
import CheckInScreen from '../screens/Account/Attendence/CheckInScreen';
import CheckOutScreen from '../screens/Account/Attendence/CheckOutScreen';
import {getStorageData, postMethod} from '../../utils/helper';
import {useFocusEffect} from '@react-navigation/native';

const TabTop = createMaterialTopTabNavigator();
const {width, height} = Dimensions.get('window');
const TimesheetNavigation = () => {
  return (
    <>
      <TabTop.Navigator
        tabBar={(props: any) => <CustomTimesheetBar {...props} />}>
        <TabTop.Screen
          name="CheckInScreen"
          component={CheckInScreen}
          options={{tabBarLabel: 'Check In'}}
        />
        <TabTop.Screen
          name="CheckOutScreen"
          component={CheckOutScreen}
          options={{tabBarLabel: 'Check Out'}}
        />
      </TabTop.Navigator>
    </>
  );
};

export default TimesheetNavigation;
