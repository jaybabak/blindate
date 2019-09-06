import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // justifyContent: 'center',
        // alignItems: 'flex-start',
        // backgroundColor: '#E2E2E2',
        padding: 20
    },
    containerCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#E2E2E2',
        textAlign: 'center',
        // padding: 20
    },
    containerBody: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 20
        // backgroundColor: '#E2E2E2',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    iconQuestion: {
        fontSize: 26,
        color: '#F39034'
    },
    iconLocation: {
        fontSize: 20,
        color: '#F39034'
    },
    blueText: {
        color: 'blue'
    },
    blackText: {
        color: 'black',
        marginTop: 10,
    },
    introText: {
        color: 'black',
        marginBottom: 20,
        fontSize: 26
    },
    buttonSubmit: {
        color: 'white',
    },
    spinner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#E2E2E2',
        textAlign: 'center',
    }
});

export default styles;