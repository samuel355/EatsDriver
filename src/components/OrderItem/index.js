import { StatusBar } from 'expo-status-bar';
import { Text, View,Image, Pressable } from 'react-native';
import styles from './styles'
import {Entypo} from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native';

const OrderItem = ({order}) => {

    const navigation = useNavigation();

    return (
        <Pressable onPress={() => navigation.navigate('OrderDelivery', {id: order.id})}>
            <View style={styles.container}>
                <Image source={{uri: order.Restaurant.image}} style={styles.image} />
                <View style={styles.orderDetailsContainer}>
                    <Text style={styles.restName}>{order.Restaurant.name}</Text>
                    <Text style={styles.restAddress}>Address: {order.Restaurant.address}</Text>

                    <Text style={styles.deliveryDetails}>Delivery Details: </Text>
                    <Text style={styles.userName}>Name: {order.User.name}</Text>
                    <Text style={styles.userAddress}>Address: {order.User.address}</Text>
                </View>
                <View style={styles.logoContainer}>
                    <Entypo style={styles.entypo} name="check" size={24} color="white" />
                </View>
            </View>
        </Pressable>
    )
}

export default OrderItem