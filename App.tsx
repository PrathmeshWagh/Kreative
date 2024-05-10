/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import React, {useCallback, useEffect, useState} from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import {NavigationContainer, useFocusEffect} from '@react-navigation/native';
import {CombinedDefaultTheme} from './src/utils/theme';
import AppNavigation from './src/layouts/navigation/AppNavigation';
import {LogLevel, OneSignal} from 'react-native-onesignal';
import {LogBox} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
// import SplashScreen from 'react-native-splash-screen';

export default function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, );
  })

  OneSignal.Debug.setLogLevel(LogLevel.Verbose);
  OneSignal.initialize('66208921-9dd0-413c-9952-03b03c5c6cd5');
  OneSignal.Notifications.requestPermission(true);

  return (
    <PaperProvider theme={CombinedDefaultTheme}>
      <NavigationContainer theme={CombinedDefaultTheme}>
        <AppNavigation />
      </NavigationContainer>
    </PaperProvider>
  );
}

LogBox.ignoreAllLogs();
