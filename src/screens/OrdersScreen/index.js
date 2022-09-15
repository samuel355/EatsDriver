import { useRef, useMemo, useState, useEffect } from 'react';
import { Text, View, FlatList, useWindowDimensions, ActivityIndicator } from 'react-native';
import orders from '../../../assets/data/orders.json'
import styles from './styles'
import BottomSheet from '@gorhom/bottom-sheet'
import OrderItem from '../../components/OrderItem';
import MapView, {Marker} from 'react-native-maps';
import {Entypo} from '@expo/vector-icons'
import * as Location from 'expo-location'


const OdersScreen = () => {

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

                <FlatList style={{marginTop: -90,}}
                    data={orders}
                    renderItem={({item}) => <OrderItem order={item} />}
                />
            </BottomSheet>
            
        </View>
    )
}

export default OdersScreen