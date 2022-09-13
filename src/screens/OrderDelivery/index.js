import { useRef, useMemo } from 'react';
import { View, Text, useWindowDimensions } from 'react-native'
import styles from './styles'
import BottomSheet from '@gorhom/bottom-sheet'
import orders from '../../../assets/data/orders.json'
import {FontAwesome5} from '@expo/vector-icons'
import MapView, {Marker} from 'react-native-maps';
import {Entypo} from '@expo/vector-icons'

const OrderDelivery = () => {

    const order = orders[0];
    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(()=>["12%", "95%"], []);
    const {width, height} = useWindowDimensions();

    return (
        <View style={styles.page}>

            <MapView 
                style={{
                    height,
                    width
                }} 
                showsUserLocation
                followsUserLocation
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
                    <Text style={styles.km}>5km</Text>
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