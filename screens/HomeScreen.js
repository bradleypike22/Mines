//HomeScreen.js

//Bradley Pike
//Feb 12th 2024

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome6 } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

const HomeScreen = () => {
    const navigation = useNavigation();
    const [numMines, setNumMines] = useState(3); // Default number of mines

    const startGame = () => {
        navigation.navigate('Game', { numMines }); // Pass numMines as a parameter to the GameScreen
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>
                    Mines <FontAwesome6 name="bomb" size={55} color="#FF0000" />
                </Text>
            </View>
            <View style={styles.content}>
                <Text style={styles.instructions}>Can you navigate through the mines?</Text>
                <View style={styles.pickerContainer}>
                    <Text style={styles.pickerLabel}>Number of Mines:</Text>
                    <View style={styles.picker}>
                        <Picker
                            selectedValue={numMines}
                            style={{ flex: 1 }}
                            onValueChange={(itemValue) => setNumMines(itemValue)}
                            itemStyle={styles.pickerItem}
                        >
                            <Picker.Item label="1" value={1} />
                            <Picker.Item label="3" value={3} />
                            <Picker.Item label="5" value={5} />
                        </Picker>
                    </View>
                </View>
                <TouchableOpacity style={styles.startButton} onPress={startGame}>
                    <Text style={styles.buttonText}>Start Game</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#006cb0',
        paddingHorizontal: 20,
    },
    header: {
        marginBottom: 40,
    },
    headerText: {
        fontSize: 60,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 10,
    },
    content: {
        alignItems: 'center',
    },
    instructions: {
        fontSize: 24,
        marginBottom: 30,
        textAlign: 'center',
        color: '#FFFFFF',
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    pickerLabel: {
        fontSize: 24,
        color: '#FFFFFF',
        marginRight: 10,
    },
    picker: {
        backgroundColor: '#FFFFFF',
        borderRadius: 50,
        paddingHorizontal: 10,
        height: 50,
        minWidth: 100,
        flexDirection: 'row',
        alignItems: 'center',
    },
    pickerItem: {
        fontSize: 20,
    },
    startButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default HomeScreen;
