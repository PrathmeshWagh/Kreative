import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Dimensions, ActivityIndicator, BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 

const { width } = Dimensions.get('window');

const ProminentDisclosure = () => {
    const navigation = useNavigation(); 
    const [isLoading, setIsLoading] = useState(true);


    const handleAccept = async () => {
        await AsyncStorage.setItem('permissionsAccepted', 'true');
        navigation.navigate('TabNavigation');
    };

    const handleReject = async () => {
        await AsyncStorage.setItem('permissionsAccepted', 'false');
        await AsyncStorage.removeItem('user_data');
        BackHandler.exitApp();
    };


    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Permissions</Text>
            </View>
            <View style={styles.content}>
                <Text style={styles.text}>Hi there,</Text>
                <Text style={styles.text}>
                    For the purpose of ensuring optimal functionality of our services, particularly in vehicle maintenance and attendance tracking, we require the following permissions from YOU:
                </Text>
                <Text style={styles.subTitle}>Location</Text>
                <Text style={styles.text}>
                    Vehicle Maintenance Screen - When a driver is assigned, our app collects and transmits the location data from the start location to the end location. This data collection may occur even when the app is closed. This is necessary for tracking the driver's route and ensuring accurate record-keeping.
                </Text>
                <Text style={styles.text}>
                    Attendance Screen - Our app collects and transmits location data to mark attendance for clocking in and clocking out. This ensures precise and reliable attendance records.
                </Text>
                <Text style={styles.subTitle}>Camera</Text>
                <Text style={styles.text}>
                    Our app uses the camera to take pictures of the vehicle. These images help in documenting the condition and maintenance of the vehicle, ensuring proper service and upkeep.
                </Text>
            </View>
            <View style={styles.buttonContainer}>
                <Pressable style={styles.button} onPress={handleAccept}>
                    <Text style={styles.buttonText}>Accept</Text>
                </Pressable>
                <Pressable style={[styles.button, styles.rejectButton]} onPress={handleReject}>
                    <Text style={styles.buttonText}>Reject</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    header: {
        backgroundColor: '#ffffff',
        padding: 20,
        alignItems: 'center',
    },
    title: {
        color: '#000000',
        fontSize: 24,
        fontFamily: 'Poppins-Medium',
    },
    content: {
        padding: 20,
    },
    text: {
        color: '#000000',
        fontSize: 16,
        marginVertical: 10,
        fontFamily: 'Poppins-Regular',
    },
    subTitle: {
        color: '#000000',
        fontSize: 18,
        marginVertical: 10,
        fontFamily: 'Poppins-Medium',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
    },
    button: {
        backgroundColor: 'blue',
        padding: 15,
        borderRadius: 8,
        width: width * 0.4,
        alignItems: 'center',
    },
    rejectButton: {
        backgroundColor: 'red',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
    },
});

export default ProminentDisclosure;
