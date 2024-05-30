import {
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import {
  MD3LightTheme as PaperDefaultTheme,
} from 'react-native-paper';

export const CombinedDefaultTheme = {
  ...PaperDefaultTheme,
  ...NavigationDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    ...NavigationDefaultTheme.colors,
  },
};