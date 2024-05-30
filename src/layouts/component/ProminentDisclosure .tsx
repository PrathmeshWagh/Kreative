import { Button, Modal, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProminentDisclosure = ({onAccept}) => {
    const [visible, setVisible] = useState(true);


    const handleAccept = async () => {
        await AsyncStorage.setItem('locationPermissionAccepted', 'true');
        setVisible(false);
        onAccept();
    };
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setVisible(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Location Permission Required</Text>
                    <Text style={styles.message}>
                        This app collects your location data for mark attendance, Your data will not be shared with third parties.
                    </Text>
                    <Button title="Accept" onPress={handleAccept} />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    message: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
});

export default ProminentDisclosure;