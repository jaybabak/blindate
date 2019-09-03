
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    videoStyles: {
        // flex: 1,
        // justifyContent: 'center',
        // alignItems: 'flex-start',
        padding: 20,
        width: "100%", 
        height: "100%", 
        backgroundColor: "black",
        flex: 1,
        // paddingLeft: 15,
        // paddingRight: 15,
        // borderRadius: 5
    },
    videoStylesLocal: {
        // flex: 1,
        // justifyContent: 'center',
        // alignItems: 'flex-start',
        padding: 20,
        width: "100%", 
        height: "40%", 
        backgroundColor: "white"
    },
    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5
    },
    buttonText: {
        fontSize: 18,
        fontFamily: 'Gill Sans',
        textAlign: 'center',
        margin: 10,
        color: '#ffffff',
        backgroundColor: 'transparent',
    },
    view: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: 'red'
    }
});

export default styles;