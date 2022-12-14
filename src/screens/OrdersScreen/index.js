import { useRef, useMemo, useState, useEffect } from 'react';
import { Text, View, useWindowDimensions, ActivityIndicator } from 'react-native';
import styles from './styles'
import BottomSheet, {BottomSheetFlatList} from '@gorhom/bottom-sheet'
import OrderItem from '../../components/OrderItem';
import MapView, {Marker} from 'react-native-maps';
import {Entypo} from '@expo/vector-icons'
import {DataStore} from 'aws-amplify'
import {Order} from '../../models'
import * as Location from 'expo-location'

const OdersScreen = () => {

    const [orders, setOrders] = useState([]); 
    const [driverLocation, setDriverLocation] = useState(null);
    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(()=>["12%", "95%"], []);
    const {width, height} = useWindowDimensions();

    useEffect(() => {
        const getDeliveryLocations  = async () => { 
            let {status} = await Location.requestForegroundPermissionsAsync();
            if(!status === 'granted') {
                Alert.alert('You have to allow location permission on your device')
                return;
            }
            let location = await Location.getCurrentPositionAsync();
            setDriverLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            }); 
        }
        getDeliveryLocations(); 
    },[])

    useEffect(() => {
        DataStore.query(Order, (order)=> order.status('eq', 'READY_FOR_PICKUP'))
        .then(setOrders)
    },[])

    if(!driverLocation){
        return <ActivityIndicator size="large" color="grey" />
    }
    return (
        <View style={styles.page}>
            <MapView 
                style={{
                    height,
                    width
                }} 
                showsUserLocation
                followsUserLocation
                initialRegion={{
                    latitude: driverLocation.latitude,
                    longitude: driverLocation.longitude,
                    latitudeDelta: 0.07,
                    longitudeDelta: 0.07
                }}
            >
                {
                    orders.map((order, i) => (
                        <Marker 
                            key={order.id}
                            title={order.Restaurant.name} 
                            description={order.Restaurant.address} 
                            coordinate={{
                                latitude: order.Restaurant.lat, 
                                longitude: order.Restaurant.lng
                            }} 
                        > 
                            <View style={styles.markerContainer}>
                                <Entypo name='shop' size={24} color='green' />
                            </View>
                            
                        </Marker>
                    ))
                }
                
            </MapView>
            
            <BottomSheet 
                handleIndicatorStyle={styles.btmIndicator}
                ref={bottomSheetRef} 
                snapPoints={snapPoints}
                //index={1}
            >
                <View style={styles.container}>
                    <Text style={styles.title}>You are online</Text>
                    <Text style={styles.subTitle}>Available Orders: <Text style={styles.count}> {orders.length}</Text></Text>
                </View>

                <BottomSheetFlatList 
                    style={{marginTop: 25,}}
                    data={orders}
                    renderItem={({item}) => <OrderItem order={item} />}
                />
            </BottomSheet>
            
        </View>
    )
}

export default OdersScreen