import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { postMethod } from '../../../utils/helper'
import IonIcon from 'react-native-vector-icons/Ionicons';
const { width, height } = Dimensions.get('window');
import colors from '../../style/colors';
import axios from 'axios';

const OdometerHistory = ({ route, navigation }) => {
    const historyDatee = route.params;
    const nextDayDate = moment(historyDatee?.selectedDatee).format('DD-MM-YYYY');

    const [loading, setLoading] = useState(false);
    const [odometerDetails, setOdometerDetails] = useState([]);
    const [apidatamessage, setApidatamessage] = useState('');
    console.log('odometerDetails',odometerDetails);
    

    useEffect(() => {
        getData()
    }, []);

    const getData = async () => {
        try {
            setLoading(true);
            const body = {
                date: nextDayDate
            };
            // const api: any = await axios.post(`https://kreative.braincave.work/hrms/api/VMS/audometer_history`, body, {
            //     headers: {
            //         Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiMSIsInVzZXJuYW1lIjoic3VwZXJhZG1pbiIsImVtYWlsIjoic3VwZXJhZG1pbkBnbWFpbC5jb20ifQ.JDP5tig6VGI-fE_dHH4sWRINSIn0QznPHE4rfrtJbeo',
            //         Accept: 'application/json'
            //     },
            // })

            const api:any = await postMethod(`VMS/audometer_history`,body)
            // console.log('aaaaaaaa',api.data);
            
            if (api.status === 200) {
                console.log('try',api.data);
                setApidatamessage(api?.data.data);
                setOdometerDetails(api?.data.data);
                setLoading(false);
            } else {
                console.log('error in status of odometerdetails', api.data.message);
                setLoading(false);
            }
        } catch (error) {
            console.log('error in odometer detail api catch', error);
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.upperView}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <IonIcon
                        name="arrow-back"
                        color={'white'}
                        size={width * 0.07}
                        style={styles.icon}
                    />
                </TouchableOpacity>
                <Text style={{ color: 'white', fontSize: width * 0.055 }}>
                    Odometer History
                </Text>
                <Text> </Text>
            </View>
            {odometerDetails ?
                <ScrollView style={{ marginTop: 20, marginHorizontal: 20 }}>
                    <View>
                        <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: '600', color: '#000000' }}>{odometerDetails?.date} Odometer History</Text>
                        <View style={styles.historyBox}>
                            <Text style={styles.startOdometerText}>Start Odometer Distance: {odometerDetails?.start_distance}</Text>
                            <Text style={styles.startOdometerText}>End Odometer Distance: {odometerDetails?.end_distance}</Text>
                            <Text style={styles.startOdometerText}>Total Odometer Distance: {odometerDetails?.total_distance}</Text>
                        </View>
                    </View>
                </ScrollView>
                :
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={styles.message}>Data Not Found</Text>
                </View>
            }
        </View>
    );
};

export default OdometerHistory;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    upperView: {
        backgroundColor: colors.brand_primary,
        height: height * 0.11,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: height * 0.02,
        paddingLeft: width * 0.03,
    },
    historyBox: {
        marginTop: 30,
        marginHorizontal: 15,
        backgroundColor: '#F6F6F6',
        borderRadius: 10,
        elevation: 4,
        paddingVertical: 20,
        alignItems: 'center',
        marginBottom: 10
    },
    startOdometerText: {
        marginVertical: 20,
        color: '#000000',
        fontWeight: '600',
        fontSize: 20
    },
    message: {
        textAlign: 'center',
        fontSize: 22,
        fontWeight: '600',
        color: '#000000'
    }
});
