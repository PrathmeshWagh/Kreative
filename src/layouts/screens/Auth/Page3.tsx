/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  Dimensions,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React from 'react';
import colors from '../../style/colors';
import LoginScreen from './LoginScreen';

const {width, height} = Dimensions.get('window');

const Page3 = ({navigation}: any) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../img/shadowcircle.png')}
        style={styles.bgImage}>
        <TouchableOpacity
          style={{alignSelf: 'flex-end', marginTop: 10, marginRight: 10}}
          onPress={() => navigation.navigate('LoginScreen')}>
          <Text>Skip</Text>
        </TouchableOpacity>
        <Image
          source={require('../../img/construction-2.png')}
          style={styles.screen_image}
        />
        <View style={styles.bottomView}>
          <Text style={styles.text}>WE ARE READY TO</Text>
          <Text style={styles.text}>WORK WITH YOU</Text>
          <Pressable
            onPress={() => navigation.navigate('LoginScreen')}
            style={styles.nextBtn}>
            <Text style={styles.nextBtnText}>Finish</Text>
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Page3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  bgImage: {
    flex: 1,
    height: width * 1,
    width: width * 1,
  },
  screen_image: {
    height: width * 0.75,
    width: width * 0.9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomView: {
    marginTop: width * 0.32,
    alignSelf: 'center',
    width: width * 0.7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 22,
    color: colors.brand_primary,
    fontFamily: 'Poppins-Medium',
    // alignSelf: 'center'
    fontWeight: '700',
    letterSpacing: 1,
  },
  nextBtn: {
    backgroundColor: colors.brand_primary,
    paddingHorizontal: 70,
    paddingVertical: 8,
    alignSelf: 'center',
    borderRadius: 20,
    marginTop: 20,
  },
  nextBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
    fontFamily: 'Poppins-Medium',
    letterSpacing: 1,
  },
});
