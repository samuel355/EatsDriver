import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import Navigation from './src/navigation';
import {Amplify} from 'aws-amplify'
import awsconfig from './src/aws-exports'
import {withAuthenticator} from 'aws-amplify-react-native'
import AuthContextProvider from './src/contexts/AuthContext'

Amplify.configure({
    ...awsconfig, 
    Analytics: {
        disabled: true
    }
})

function App() {
    return (
        <NavigationContainer>
            <AuthContextProvider>
                <View style={styles.container}>
                    <Navigation />
                    <StatusBar style="auto" />
                </View>
            </AuthContextProvider>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    }
});

export default withAuthenticator(App);