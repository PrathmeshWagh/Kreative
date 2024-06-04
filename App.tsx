/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useCallback, useEffect, useState } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { CombinedDefaultTheme } from './src/utils/theme';
import AppNavigation from './src/layouts/navigation/AppNavigation';
import { LogLevel, OneSignal } from 'react-native-onesignal';
import { LogBox } from 'react-native';
import { Appearance } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
// import SplashScreen from 'react-native-splash-screen';

export default function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    },3000);
  })

  OneSignal.Debug.setLogLevel(LogLevel.Verbose);
  OneSignal.initialize('2e601f79-8f3d-4c6d-b25d-71843ea00807');
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
