import { View, Text, TextInput, Button, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from './styles'
import { Auth } from "aws-amplify";
import { useAuthContext } from "../../contexts/AuthContext";
import { DataStore } from "aws-amplify";
import { Courier } from "../../models";
import { useNavigation } from "@react-navigation/native";

const Profile = () => {

    const {sub, dbCourier, setDbCourier} = useAuthContext();

    const [name, setName] = useState(dbCourier?.name || " ");
    const [address, setAddress] = useState(dbCourier?.address || " ");
    const [lat, setLat] = useState(dbCourier?.lat + "" || "0.00000");
    const [lng, setLng] = useState(dbCourier?.lng + "" || "0.00000");
    const navigation = useNavigation();

    const createCourier = async () => {
        try{
            const courier = await DataStore.save(
                new Courier({
                    name, 
                    address, 
                    lat: parseFloat(lat), 
                    lng: parseFloat(lng), 
                    sub
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
                updated.address = address
                updated.lat = parseFloat(lat)
                updated.lng = parseFloat(lng)
            })
        );
        setDbCourier(courier);
    }

    const onSave = async () => {
        if(dbCourier){
            await updateCourier();
            Alert.alert("Updated Successfully");
            navigation.goBack();
        }else{
            await createCourier();
            Alert.alert("Courier Details Saved Successfully");
            navigation.goBack();
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
            <Text style={{marginLeft: 12, paddingTop: 10, color: 'grey'}}>Address</Text>
            <TextInput
                value={address}
                onChangeText={setAddress}
                placeholder="Address"
                style={styles.input}
            />
            <Text style={{marginLeft: 12, paddingTop: 10, color: 'grey'}}>Latitude</Text>
            <TextInput
                value={lat}
                onChangeText={setLat}
                placeholder="Latitude"
                style={styles.input}
                keyboardType="numeric"
            />
            <Text style={{marginLeft: 12, paddingTop: 10, color: 'grey'}}>Longitude</Text>
            <TextInput
                value={lng}
                onChangeText={setLng}
                placeholder="Longitude"
                style={styles.input}
            />
            <Button onPress={onSave} title={`${dbCourier ? 'Update' : 'Save'}`} />
            {
                dbCourier ? (
                    <Text onPress={()=>Auth.signOut()} style={styles.signOutButton}> Sign Out</Text>
                ): ('')
            }
            
        </SafeAreaView>
    );
};


export default Profile;
