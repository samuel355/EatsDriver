import { StyleSheet } from "react-native";

export default styles = StyleSheet.create({
    page:{
        flex: 1,
        backgroundColor: 'lightblue',
    },
    mapView: {

    },
    container: {
        marginTop: 5,
        alignItems: 'center',
    },  
    title: {
        fontSize: 20,
        fontWeight: '600',
        letterSpacing: 0.5,
        paddingBottom: 5,
    },
    subTitle: {
        fontSize: 16,
        fontWeight: '400',
        letterSpacing: 0.5,
        color: 'grey',
    },
    count: {
        fontWeight: '600',
    },
    btmIndicator:{
        backgroundColor: 'grey',
        width: 100,
    }, 
    markerContainer: {
        backgroundColor: "white", 
        padding: 5, 
        borderColor: 'green', 
        borderWidth: 1, 
        borderRadius: 20
    }
    
    
});