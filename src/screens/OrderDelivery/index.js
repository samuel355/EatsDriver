import { useRef, useMemo, useState, useEffect } from 'react';
import { View, Text, useWindowDimensions, Alert, ActivityIndicator } from 'react-native'
import styles from './styles'
import BottomSheet from '@gorhom/bottom-sheet'
import orders from '../../../assets/data/orders.json'
import {FontAwesome5} from '@expo/vector-icons'
import MapView, {Marker} from 'react-native-maps';
import {Entypo} from '@expo/vector-icons'
import * as Location from 'expo-location'


const OrderDelivery = () => {

    const [driverLocation, setDriverLocation] = useState(null);
    const order = orders[0];
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
                index={1}
            >
                <View style={styles.container}>
                    <Text style={styles.min}>15 min</Text>
                    <FontAwesome5
                        name="shopping-bag"
                        size={25}
                        color="#3FC060"
                        style={styles.navigationIcon}
                    />
                    <Text style={styles.km}>5km </Text>
                </View>

                <View style={styles.detailsContainer}>
                    <Text style={styles.resName}>{order.Restaurant.name}</Text>
                    <Text style={styles.resAddress}>{order.Restaurant.address}</Text>

                    <Text style={styles.userTitle}>Customer Details</Text>
                    <Text style={styles.userName}>Name: {order.User.name}</Text>
                    <Text style={styles.userAddress}>Address: {order.User.address}</Text>

                    <View style={styles.oderItemsContainer}>
                        <Text style={styles.itemsHeading}>Items Ordered</Text>
                        <Text style={styles.orderItem}>Onion Rings x1 </Text>
                        <Text style={styles.orderItem}>Big Mac  x3 </Text>
                        <Text style={styles.orderItem}>Big Tasty x1 </Text>
                        <Text style={styles.orderItem}>Cocacola x1 </Text>
                    </View>
                </View>
                <View style={styles.acceptBtn}>
                    <Text style={styles.acceptTitle}>Accept Order</Text>
                </View>
            </BottomSheet>
        </View>
    )
}

export default OrderDelivery