import { StyleSheet } from "react-native";

export default styles = StyleSheet.create({
    title: {
        fontSize: 30,
        fontWeight: "bold",
        textAlign: "center",
        margin: 10,
    },
    input: {
        margin: 10,
        backgroundColor: "white",
        padding: 15,
        borderRadius: 5,
    },
    signOutButton:{
        textAlign: "center",
        color: "red",
        marginTop: 10,
    },
    iconsContainer: {
        flexDirection: 'row',
    },
    btnContainer:{
        backgroundColor: "green",
        marginTop: 20,
        marginHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 30,
    },
    btn: {
        color: 'white',
        fontWeight: '500',
        letterSpacing: 0.4
    },
    carIcon: {
        padding: 10,
        margin: 10,
        borderWidth: 1,
        borderColor: 'green',
        borderRadius: 40,
        backgroundColor: 'white',
    },
    bicycleIcon: {
        padding: 10,
        margin: 10,
        borderWidth: 1,
        borderColor: 'green',
        borderRadius: 40,
    },
});