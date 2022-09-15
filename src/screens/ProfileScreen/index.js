import { View, Text, TextInput, Button, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from './styles'
import { Auth } from "aws-amplify";
import { useAuthContext } from "../../contexts/AuthContext";
import { DataStore } from "aws-amplify";
import { User } from "../../models";
import { useNavigation } from "@react-navigation/native";

const Profile = () => {

    const {dbUser} = useAuthContext();
    const {sub, setDbUser} = useAuthContext();

    const [name, setName] = useState(dbUser?.name || " ");
    const [address, setAddress] = useState(dbUser?.address || " ");
    const [lat, setLat] = useState(dbUser?.lat + "" || "0.00000");
    const [lng, setLng] = useState(dbUser?.lng + "" || "0.00000");
    const navigation = useNavigation();

    const createUser = async () => {
        try{
            const user = await DataStore.save(
                new User({
                    name, 
                    address, 
                    lat: parseFloat(lat), 
                    lng: parseFloat(lng), 
                    sub
                }) 
            )
            setDbUser(user);
            

        }catch(e){
            Alert.alert("Error", e.message)
        }
    };

    const updateUser = async() => {
        const user = await DataStore.save(
            User.copyOf(dbUser, (updated) => {
                updated.name = name
                updated.address = address
                updated.lat = parseFloat(lat)
                updated.lng = parseFloat(lng)
            })
        );
        setDbUser(user);
        
    }

    const onSave = async () => {
        if(dbUser){
            await updateUser();
            Alert.alert("Updated Successfully");
            navigation.goBack();
        }else{
            await createUser();
            Alert.alert("User Details Saved Successfully");
            navigation.goBack();
        }
    };

    return (
        <SafeAreaView>
            <Text style={styles.title}>Profile</Text>
            <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Name"
                style={styles.input}
            />
            <TextInput
                value={address}
                onChangeText={setAddress}
                placeholder="Address"
                style={styles.input}
            />
            <TextInput
                value={lat}
                onChangeText={setLat}
                placeholder="Latitude"
                style={styles.input}
                keyboardType="numeric"
            />
            <TextInput
                value={lng}
                onChangeText={setLng}
                placeholder="Longitude"
                style={styles.input}
            />
            <Button onPress={onSave} title={`${dbUser ? 'Update' : 'Save'}`} />
            {
                dbUser ? (
                    <Text onPress={()=>Auth.signOut()} style={styles.signOutButton}> Sign Out</Text>
                ): ('')
            }
            
        </SafeAreaView>
    );
};


export default Profile;
