/* eslint-disable react/jsx-no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {Dimensions, StyleSheet, Text, View, ScrollView} from 'react-native';
import React, {FC} from 'react';
import colors from '../../style/colors';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {
  AnimatedCircularProgress,
  CircularProgress,
} from 'react-native-circular-progress';
const {width, height} = Dimensions.get('window');

interface Props {
  navigation: any;
}

const OdometerScreen: FC<Props> = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headView}>
        <IonIcon
          name="arrow-back"
          color={colors.white}
          size={width * 0.07}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headText}>Odometer</Text>
        <Text> </Text>
      </View>
      <ScrollView>
        <View style={styles.speedometerContainer}>
          <View>
          <CircularProgress
        size={200}
        width={10}
        fill={12}
        tintColor={colors.brand_primary}
        backgroundColor="#3d5875"
        rotation={90}
        lineCap="round"
      >
        {(fill) => (
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}>
              {Math.round(fill)}%
            </Text>
            <Text style={{ fontSize: 16, color: '#fff' }}>Speed</Text>
          </View>
        )}
      </CircularProgress>
            {/* <Speedometer
              value={128}
              fontFamily="Poppins-Medium"
              height={height * 0.4}>
              <Background />
              <Arc />
              <Needle />
              <Progress />
              <Marks />
              <Indicator fixValue={false} />
            </Speedometer> */}
          </View>
          <View></View>
          <View style={styles.reading}>
            <Text style={styles.odoText}>Odometer : </Text>
            <Text style={styles.odoReading}>1,203</Text>
          </View>
        </View>
        <View style={styles.reading}>
          <Text style={styles.dates}>01, Sep 22 - 02, Oct 22</Text>
        </View>
        <View style={styles.count}>
          <View style={styles.vehicleStartCount}>
            <Text style={styles.text}>Number of vehicle starts</Text>
            <Text style={styles.no}>48</Text>
            <Text style={styles.unit}>times</Text>
          </View>
          <View style={styles.vehicleStartCount}>
            <Text style={styles.text}>Total distance travelled</Text>
            <Text style={styles.no}>1,203</Text>
            <Text style={styles.unit}>Km</Text>
          </View>
        </View>
        <View style={styles.progressView}>
          <Text style={styles.onTime}>Total - On time</Text>
          <View style={{flexDirection: 'row', marginTop: 20}}>
            <View>
              <AnimatedCircularProgress
                size={100}
                width={8}
                fill={35}
                tintColor={colors.brand_primary}
                onAnimationComplete={() => console.log('onAnimationComplete')}
                backgroundColor="#E89D2C"
              />
            </View>
            <View style={styles.detailView}>
              <View style={styles.detailViewinner}>
                <Text style={{color: colors.brand_primary, fontSize: 24}}>
                  ●
                </Text>
                <Text style={styles.total}>Total driving time 16h 25min</Text>
              </View>
              <View style={styles.detailViewinner}>
                <Text style={{color: '#E89D2C', fontSize: 24}}>●</Text>
                <Text style={styles.total}>Total idle time 2h 49min</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.status}>
          <Text style={styles.statusText}>Vehicle Status....</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default OdometerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.brand_primary,
    height: 50,
    alignItems: 'center',
    paddingLeft: 20,
  },
  headText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
  },
  speedometerContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.8,
    borderBottomColor: '#C4C4C4',
    borderBottomWidth: 1,
    marginTop: 30,
  },
  reading: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: 20,
  },
  odoText: {
    color: colors.account_font,
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    fontWeight: '800',
  },
  odoReading: {
    color: colors.account_font,
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  dates: {
    color: colors.black,
    fontWeight: '900',
    marginVertical: 10,
    alignSelf: 'center',
  },
  count: {
    backgroundColor: colors.screen_bg,
    flexDirection: 'row',
    marginTop: 20,
    // elevation:8
  },
  vehicleStartCount: {
    width: width * 0.5,
    padding: 10,
  },
  text: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: colors.account_font,
    alignSelf: 'center',
  },
  unit: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: colors.account_font,
    alignSelf: 'center',
  },
  no: {
    fontSize: 22,
    color: colors.black,
    fontFamily: 'Poppins-Medium',
    alignSelf: 'center',
    fontWeight: '700',
  },
  progressView: {
    padding: 20,
  },
  onTime: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: colors.account_font,
    fontWeight: '800',
  },
  detailView: {
    justifyContent: 'center',
    marginLeft: 20,
  },
  total: {
    fontSize: 12,
    color: colors.account_font,
    width: width * 0.4,
    marginTop: 10,
    marginLeft: 5,
  },
  detailViewinner: {
    flexDirection: 'row',
  },
  status: {
    backgroundColor: colors.screen_bg,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 50,
  },
  statusText: {
    color: colors.account_font,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
});
