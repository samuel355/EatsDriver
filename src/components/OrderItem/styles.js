import { StyleSheet } from "react-native";

export default styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1, 
        borderRadius: 20,
        borderColor: '#91e3ab',
        marginHorizontal: 10,
        marginBottom: 10,
    },
    orderDetailsContainer: {
        flex: 1,
        marginLeft: 10,
    },
    image:{
        width: 100,
        height: 150,
        borderTopStartRadius: 20,
        borderBottomLeftRadius: 20,
        
    },
    restName: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 5,
    },
    restAddress: {
        color: 'gray',
    },
    deliveryDetails: {
        fontSize: 16,
        marginVertical: 8,
        fontWeight: '600',
    },
    userName: {
        fontSize: 16,
        color: 'gray'
    },
    userAddress: {
        fontSize: 16,
        color: 'gray'
    },
    logoContainer:{ 
        backgroundColor: '#069e36',
        height: 150,
        padding: 10,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
});