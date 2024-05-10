/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Pressable, TouchableOpacity } from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import colors from '../style/colors';
import { useNavigation } from '@react-navigation/native';

const AppbarAccount = ({ title}: any) => {
    const navigation = useNavigation();

    return (
        <View style={styles.attendBox1}>
                <IonIcon name="arrow-back-sharp" color={colors.white} size={24} onPress={() => navigation.goBack()} style={styles.backArrow} />
                <Text style={styles.head}>{title}</Text>
            </View>
    );
}

export default AppbarAccount;
const styles = StyleSheet.create({
    attendBox1: {
        height: 120,
        backgroundColor: colors.brand_primary,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        padding:14
    },
    head: {
        fontFamily: 'Poppins-Medium',
        fontSize: 22,
        color: colors.white,
        textAlign: 'center',

    },
})