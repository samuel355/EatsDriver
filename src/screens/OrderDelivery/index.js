import { useRef, useMemo, useState, useEffect } from 'react';
import { View, Text, useWindowDimensions, Alert, ActivityIndicator, Pressable } from 'react-native'
import styles from './styles'
import BottomSheet from '@gorhom/bottom-sheet'
import orders from '../../../assets/data/orders.json'
import {FontAwesome5, Ionicons} from '@expo/vector-icons'
import MapView, {Marker} from 'react-native-maps';
import {Entypo} from '@expo/vector-icons'
import * as Location from 'expo-location'
import MapViewDirections from 'react-native-maps-directions'
import { useNavigation } from '@react-navigation/native';

const order = orders[0];

const ORDER_STATUSES = {
    READY_FOR_PICKUP: 'READY_FOR_PICKUP',
    ACCEPTED: 'ACCEPTED',
    PICKED_UP: 'PICKED_UP', 
}

const restaurantLocation = {
    latitude: order.Restaurant.lat, 
    longitude: order.Restaurant.lng
} 
const deliveryLocation = {
    latitude: order.User.lat, 
    longitude: order.User.lng,
}

const OrderDelivery = () => {

    const [driverLocation, setDriverLocation] = useState(null);
    const [totalMinutes, setTotalMinutes] = useState(0);
    const [totalKm, setTotalKm] = useState(0);
    const [deliveryStatus, setDeliveryStatus] = useState(ORDER_STATUSES.READY_FOR_PICKUP);
    const [isDriverClose, setIsDriverClose] = useState(false);


    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(()=>["12%", "95%"], []);
    const {width, height} = useWindowDimensions();
    const navigation = useNavigation();

    const mapRef = useRef(null)

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

        //Update Driving location on live device
        const foregroundSubscription = Location.watchPositionAsync({
            accuracy: Location.Accuracy.High,
            distanceInterval: 20, //interval in meters
        }, (updatedLocation) => {
            setDriverLocation({
                latitude: updatedLocation.coords.latitude,
                longitude: updatedLocation.coords.longitude,
            })
        })
        //Prevent always rerunning
        foregroundSubscription;
    },[])

    if(!driverLocation){
        return <ActivityIndicator size="large" color="grey" />
    }

    const onButtonPressed = () => {
        if(deliveryStatus === ORDER_STATUSES.READY_FOR_PICKUP){
            bottomSheetRef.current?.collapse();
            mapRef.current.animateToRegion({
                latitude: driverLocation.latitude,
                longitude: driverLocation.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
            });
            setDeliveryStatus(ORDER_STATUSES.ACCEPTED)
        }
        if(deliveryStatus === ORDER_STATUSES.ACCEPTED){
            setDeliveryStatus(ORDER_STATUSES.PICKED_UP)
        }
        if(deliveryStatus === ORDER_STATUSES.PICKED_UP){
            alert('Delivery finished successfully');
        }
    };

    const renderButtonTitle = () => {
        if(deliveryStatus === ORDER_STATUSES.READY_FOR_PICKUP){
            return 'Accept Order';
        }
        if(deliveryStatus === ORDER_STATUSES.ACCEPTED){
            return 'Pick Up Order';
        }
        if(deliveryStatus === ORDER_STATUSES.PICKED_UP){
            return 'Complete Delivery';
        }
    }

    const isButtonDisabled = () => {
        if(deliveryStatus === ORDER_STATUSES.READY_FOR_PICKUP){
            return false;
        }
        if(deliveryStatus === ORDER_STATUSES.ACCEPTED && isDriverClose){
            return false;
        }
        if(deliveryStatus === ORDER_STATUSES.PICKED_UP && isDriverClose){
            return false;
        }
        return true;
    };

    return (
        <View style={styles.page}>

            <MapView 
                ref={mapRef}
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
                    deliveryStatus ===ORDER_STATUSES.READY_FOR_PICKUP && (
                        <Pressable 
                            onPress = {()=> navigation.goBack()}
                            style={{paddingTop: 45, paddingLeft: 10,}}>
                            <Ionicons name='arrow-back-circle' size={35} color="black"  style={{}}/>
                        </Pressable>
                    )
                }
                
                
                <MapViewDirections 
                    origin={driverLocation}

                    destination={deliveryStatus === ORDER_STATUSES.ACCEPTED ? 
                        restaurantLocation : deliveryLocation
                    }

                    strokeWidth = {8}
                    strokeColor ='orange'
                    apikey={"AIzaSyDhXXxiYLfwwF2YPV8RFXfZTE0pqedRa6Q"}

                    waypoints={ deliveryStatus === ORDER_STATUSES.READY_FOR_PICKUP ? [restaurantLocation]: []}

                    onReady={(result) =>{
                        setIsDriverClose(result.distance <= 0.2);
                        setTotalKm(result.distance);
                        setTotalMinutes(result.duration);
                    } }
                />

                <Marker
                    coordinate={restaurantLocation}
                    title={order.Restaurant.name}
                    description={order.Restaurant.address}
                >
                    <View style={styles.markerContainerU}>
                        <Entypo name='shop' size={30} color='white' />
                    </View>
                </Marker>

                <Marker
                    coordinate={deliveryLocation}
                    title={order.User.name}
                    description={order.User.address}
                >
                    <View style={styles.markerContainer}>
                        <Entypo name='user' size={30} color='green' />
                    </View>
                </Marker>
            </MapView>

            <BottomSheet 
                handleIndicatorStyle={styles.btmIndicator}
                ref={bottomSheetRef} 
                snapPoints={snapPoints}
                index={1}
            >
                <View style={styles.container}>
                    <Text style={styles.min}>{totalMinutes.toFixed(0)} min</Text>
                    <FontAwesome5
                        name="shopping-bag"
                        size={25}
                        color="#3FC060"
                        style={styles.navigationIcon}
                    />
                    <Text style={styles.km}>{totalKm.toFixed(1)} km </Text>
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
                <Pressable 
                    onPress={onButtonPressed}
                    style={{...styles.acceptBtn, backgroundColor: isButtonDisabled() ? 'grey': 'black'} }
                    //disabled={isButtonDisabled}
                >
                    <Text style={styles.acceptTitle}>{renderButtonTitle()}</Text>
                </Pressable>
            </BottomSheet>
        </View>
    )
}

export default OrderDelivery