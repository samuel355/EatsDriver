import { useRef, useMemo, useState, useEffect } from 'react';
import { View, Text, useWindowDimensions, Alert, ActivityIndicator, Pressable } from 'react-native'
import styles from './styles'
import BottomSheet, {BottomSheetFlatList} from '@gorhom/bottom-sheet'
import {FontAwesome5, Ionicons} from '@expo/vector-icons'
import MapView, {Marker} from 'react-native-maps';
import {Entypo} from '@expo/vector-icons'
import * as Location from 'expo-location'
import MapViewDirections from 'react-native-maps-directions'
import { useNavigation, useRoute } from '@react-navigation/native';
import {DataStore} from 'aws-amplify'
import {Order, OrderDish, User} from '../../models'
import { useOrderContext } from '../../contexts/OrderContext';

const ORDER_STATUSES = {
    READY_FOR_PICKUP: 'READY_FOR_PICKUP',
    ACCEPTED: 'ACCEPTED',
    PICKED_UP: 'PICKED_UP', 
}

const OrderDelivery = () => {
    const [order, setOrder] = useState(null)
    const [user, setUser] = useState(null)
    const [driverLocation, setDriverLocation] = useState(null);
    const [totalMinutes, setTotalMinutes] = useState(0);
    const [totalKm, setTotalKm] = useState(0);
    const [deliveryStatus, setDeliveryStatus] = useState(ORDER_STATUSES.READY_FOR_PICKUP);
    const [isDriverClose, setIsDriverClose] = useState(false);
    const [dishItems, setDishItems] = useState([]);
    const {acceptOrder} = useOrderContext()

    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(()=>["12%", "95%"], []);
    const {width, height} = useWindowDimensions();
    const navigation = useNavigation();
    const route = useRoute();
    const id = route.params?.id;
    const mapRef = useRef(null)

    useEffect(() => {
        if(!id){
            return;
        }
        DataStore.query(Order, id)
        .then(setOrder)
    }, [id]);

    useEffect(() => {
        if(!order){
            return;
        }
        DataStore.query(User, order.userID)
        .then(setUser);

        DataStore.query(OrderDish, (od) => od.orderID('eq', order.id))
        .then(setDishItems)
    }, [order]);

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
            acceptOrder(order)
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

    const restaurantLocation = {
        latitude: order?.Restaurant?.lat, 
        longitude: order?.Restaurant?.lng
    } 
    const deliveryLocation = {
        latitude: user?.lat, 
        longitude: user?.lng,
    }

    if(!order || !user || !driverLocation){
        return <ActivityIndicator size="large" color="grey" />
    }

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
                    deliveryStatus === ORDER_STATUSES.READY_FOR_PICKUP && (
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
                    title={user.name}
                    description={user.address}
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
                //index={1}
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
                    <Text style={styles.userName}>Name: {user.name}</Text>
                    <Text style={styles.userAddress}>Address: {user.address}</Text>

                    <View style={styles.oderItemsContainer}>
                        <Text style={styles.itemsHeading}>Items Ordered</Text>
                        {
                            dishItems.map((dishItem) => (
                                <Text key={dishItem.id} style={styles.orderItem}>{dishItem.Dish.name} x{dishItem.quantity}</Text>
                            ))
                        }
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