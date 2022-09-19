import { View, Text, TextInput, Button, Alert, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from './styles'
import { Auth } from "aws-amplify";
import { useAuthContext } from "../../contexts/AuthContext";
import { DataStore } from "aws-amplify";
import { Courier, TransportationModes } from "../../models";
import { useNavigation } from "@react-navigation/native";
import {MaterialIcons, FontAwesome5 } from '@expo/vector-icons'

const Profile = () => {

    const {sub, dbCourier, setDbCourier} = useAuthContext();

    const [name, setName] = useState(dbCourier?.name || " ");
    const [transportationMode, setTransportationMode] = useState(TransportationModes.DRIVING);
    const navigation = useNavigation();

    const createCourier = async () => {
        try{
            const courier = await DataStore.save(
                new Courier({
                    name, 
                    lat: 0, 
                    lng: 0, 
                    sub,
                    transportationMode,
                }) 
            )
            setDbCourier(courier);
            

        }catch(e){
            Alert.alert("Error", e.message)
        }
    };

    const updateCourier = async() => {
        const courier = await DataStore.save(
            Courier.copyOf(dbCourier, (updated) => {
                updated.name = name
                updated.transportationMode = transportationMode
            })
        );
        setDbCourier(courier);
    }

    const onSave = async () => {
        if(dbCourier){
            await updateCourier();
            Alert.alert("Updated Successfully");
        }else{
            await createCourier();
            Alert.alert("Courier Details Saved Successfully");
        }
    };

    return (
        <SafeAreaView>
            <Text style={styles.title}>Profile</Text>
            <Text style={{marginLeft: 12, paddingTop: 10, color: 'grey'}}>Full Name</Text>
            <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Name"
                style={styles.input}
            />
            <Text style={{marginLeft: 12, paddingTop: 10, color: 'grey'}}>Select </Text>
            <View style={styles.iconsContainer}>
                <Pressable 
                    onPress={() => setTransportationMode(TransportationModes.DRIVING)}
                    style={{
                        ...styles.bicycleIcon, 
                        backgroundColor: transportationMode === TransportationModes.DRIVING ? 'lightgreen' : 'white'
                    }} 
                >
                    <FontAwesome5 name="car" size={24} color={transportationMode === TransportationModes.DRIVING ? 'white': 'black'} />
                </Pressable>
                <Pressable 
                    onPress={() => setTransportationMode(TransportationModes.BICYCLING)}
                    style={{
                        ...styles.bicycleIcon, 
                        backgroundColor: transportationMode === TransportationModes.BICYCLING ? 'lightgreen' : 'white'
                    }} 
                >
                    <MaterialIcons name="pedal-bike" size={24} color={transportationMode === TransportationModes.BICYCLING ? 'white': 'black'} />
                </Pressable>
            </View>
            <View style={styles.btnContainer}>
                <Button  color="white" onPress={onSave} title={`${dbCourier ? 'UPDATE' : 'SAVE'}`} />
            </View>
            
            {
                dbCourier ? (
                    <Text onPress={()=>Auth.signOut()} style={styles.signOutButton}> Sign Out</Text>
                ): ('')
            }
            
        </SafeAreaView>
    );
};


export default Profile;
