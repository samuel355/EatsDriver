import { StyleSheet } from "react-native";

export default styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: 'lightblue',
    },
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        
    },
    min: {
        fontSize: 20,
        letterSpacing: 1,
        fontWeight: '500'
    },
    km: {
        fontSize: 20,
        letterSpacing: 1,
        fontWeight: '500'
    },
    btmIndicator:{
        backgroundColor: 'grey',
        width: 100,
    },
    navigationIcon: {
        marginHorizontal: 14,
    },
    detailsContainer: {
        marginTop: 15,
        marginHorizontal: 10,
    },
    userTitle: {
        marginTop: 20,
        fontSize: 20,
        marginBottom:10,
        fontWeight: '500',
    },
    resName: {
        marginBottom: 8,
        fontSize:22,
        fontWeight: '600',
        letterSpacing: 0.8,
        marginTop: 20,
    },
    resAddress: {
        textAlign: 'center', 
        color: 'grey',
        fontSize: 18,
    },
    userName: {
        fontSize: 16,
        color: 'grey',
    },
    userAddress:{
        fontSize: 16,
        color: 'grey',
        marginBottom: 20,
        paddingTop: 8,
    },
    itemsHeading: {
        marginTop: 15,
        fontSize: 20,
        fontWeight: '500',
    },
    oderItemsContainer: {
        borderTopWidth: 1,
        borderTopColor: '#eee'
    },
    orderItem: {
        paddingTop: 8,
        color: 'grey',
        fontSize: 16,
    },
    acceptBtn: {
        marginTop: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
        borderRadius: 20, 
        marginBottom: 50,
        paddingVertical: 10,
        paddingHorizontal: 30,
    },
    acceptTitle: {
        color: 'white',

        fontSize: 18,
        letterSpacing: 0.5
    },
    markerContainer: {
        backgroundColor: "white", 
        padding: 5, 
        borderColor: 'green', 
        borderWidth: 1, 
        borderRadius: 20
    },
    markerContainerU: {
        backgroundColor: "orange", 
        padding: 5, 
        borderColor: 'orange', 
        borderWidth: 1, 
        borderRadius: 20
    }
});