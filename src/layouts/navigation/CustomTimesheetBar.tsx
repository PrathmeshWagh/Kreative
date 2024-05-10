/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import colors from '../style/colors';
import Entypo from 'react-native-vector-icons/Entypo';
import moment from 'moment';
import {getStorageData, postMethod} from '../../utils/helper';

const {width, height} = Dimensions.get('window');

const CustomTimesheetBar = ({
  state,
  descriptors,
  navigation,
  date,
  toggleModal,
}: any) => {
  return (
    <View style={styles.container}>
      {state.routes.map(
        (
          route: {
            key: string | number;
            name: any;
          },
          index: React.Key | null | undefined,
        ) => {
          const {options} = descriptors[route.key];
          const label = options.tabBarLabel || options.title || route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.6}
              onPress={onPress}
              style={[styles.tabButton, isFocused && styles.tabButtonActive]}>
              <Text style={[styles.tabText, isFocused && styles.tabTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        },
      )}
    </View>
  );
};

export default CustomTimesheetBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.brand_secondary,
    paddingVertical: 15,
  },
  tabButton: {
    backgroundColor: colors.textInput_color,
    borderColor: colors.gray,
    width: width * 0.29,
    paddingVertical: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabButtonActive: {
    borderBottomWidth: 0,
    borderBottomColor: 'red',
    backgroundColor: colors.brand_primary,
    borderRadius: 3,
    elevation: 8,
  },
  tabText: {
    alignSelf: 'center',
    color: colors.gray,
  },
  tabTextActive: {
    color: colors.white,
    fontWeight: '700',
  },
});
