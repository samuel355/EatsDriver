import { useRef, useMemo } from 'react';
import { Text, View, FlatList, useWindowDimensions } from 'react-native';
import orders from '../../../assets/data/orders.json'
import styles from './styles'
import BottomSheet from '@gorhom/bottom-sheet'
import OrderItem from '../../components/OrderItem';
import MapView, {Marker} from 'react-native-maps';
import {Entypo} from '@expo/vector-icons'

const OdersScreen = () => {

    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(()=>["12%", "95%"], []);
    const {width, height} = useWindowDimensions();

    //const mapAPI = 'AIzaSyDhXXxiYLfwwF2YPV8RFXfZTE0pqedRa6Q';
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