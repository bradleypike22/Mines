//GameOverScreen.js

//Bradley Pike
//Feb 12th 2024

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';

const GameOverScreen = ({ score, highScore, onRestartGame, isWinner }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text style={styles.gameOverText}>{isWinner ? 'You Won!' : 'Game Over!'}</Text>
            <Text style={styles.scoreText}>Your Score: {score}</Text>
            <Text style={styles.highScoreText}>High Score: {highScore}</Text>
            <TouchableOpacity
                style={styles.startButton}
                onPress={() => navigation.navigate('Home')}
            >
                <Text style={styles.buttonText}>Back to Home</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#006cb0',
    },
    gameOverText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 20,
    },
    scoreText: {
        fontSize: 20,
        marginBottom: 10,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    highScoreText: {
        fontSize: 18,
        marginBottom: 20,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    startButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default GameOverScreen;
