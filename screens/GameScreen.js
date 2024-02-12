//GameScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';

const GameScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { numMines } = route.params;
    const [NUM_MINES, setNumMines] = useState(numMines); // Set NUM_MINES based on the received parameter
    const GRID_SIZE = 5; // Adjust GRID_SIZE to your desired value
    const [grid, setGrid] = useState(initializeGrid(GRID_SIZE));
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [bombAnimation] = useState(new Animated.Value(0));
    const [openedCells, setOpenedCells] = useState(0);
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        const fetchHighScore = async () => {
            try {
                const storedHighScore = await AsyncStorage.getItem('highScore');
                if (storedHighScore) {
                    setHighScore(parseInt(storedHighScore, 10));
                }
            } catch (error) {
                console.error('Error fetching high score:', error);
            }
        };

        fetchHighScore();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(prevTimer => prevTimer + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        restartGame(GRID_SIZE, NUM_MINES); // Ensure the game is restarted when NUM_MINES changes
    }, [GRID_SIZE, NUM_MINES]);

    const restartGame = (gridSize, numMines) => {
        try {
            const updatedGrid = initializeGrid(gridSize);
            placeMines(updatedGrid, gridSize, numMines);
            setGrid(updatedGrid);
            setScore(0);
            setGameOver(false);
            setOpenedCells(0);
            setTimer(0);
        } catch (error) {
            console.error('Error restarting game:', error);
        }
    };

    const handleCellPress = (row, col) => {
        const updatedGrid = [...grid];
        if (grid[row][col].isMine) {
            // Update the grid state to reveal the bomb tile
            updatedGrid[row][col].isOpen = true;
            setGrid(updatedGrid);
            // Reveal all tiles after revealing the bomb tile
            revealAllTiles();
            // Handle game over
            setScore(score + 1);
            setOpenedCells(openedCells + 1);
            handleGameOver();
        } else {
            // Update the grid state to reveal the pressed cell
            updatedGrid[row][col].isOpen = true;
            setGrid(updatedGrid);
            setScore(score + 1);
            setOpenedCells(openedCells + 1);
        }
    };

    const revealAllTiles = () => {
        // Reveal all tiles
        const updatedGrid = grid.map(row =>
            row.map(cell => ({
                ...cell,
                isOpen: true
            }))
        );
        setGrid(updatedGrid);
    };


    const handleGameOver = async () => {
        // Reveal all tiles
        const updatedGrid = grid.map(row =>
            row.map(cell => ({
                ...cell,
                isOpen: true
            }))
        );
        setGrid(updatedGrid);

        if (score > highScore) {
            setHighScore(score);
            try {
                await AsyncStorage.setItem('highScore', score.toString());
            } catch (error) {
                console.error('Error saving high score:', error);
                // You might want to display a user-friendly error message here
            }
        }

        // Delay transition to GameOver screen by 2 seconds
        setTimeout(() => {
            navigation.navigate('GameOver');
        }, 3000);
    };


    const handleQuit = () => {
        navigation.navigate('Home');
    };

    const renderGameBoard = () => {
        const cellSize = 60;
        const borderWidth = 0;

        return (
            <View style={styles.gridContainer}>
                {grid.map((row, rowIndex) => (
                    <View key={rowIndex} style={{ flexDirection: 'row' }}>
                        {row.map((cell, colIndex) => (
                            <TouchableOpacity
                                key={colIndex}
                                style={[
                                    styles.cell,
                                    {
                                        width: cellSize,
                                        height: cellSize,
                                        borderWidth: borderWidth,
                                        backgroundColor: cell.isOpen ? '#3b3b3b' : 'grey',
                                    },
                                ]}
                                onPress={() => handleCellPress(rowIndex, colIndex)}
                                disabled={cell.isOpen || gameOver}
                            >
                                {cell.isOpen ? (
                                    cell.isMine ? (
                                        <FontAwesome6 name="bomb" size={40} color="#FF0000" />
                                    ) : (
                                        <Ionicons name="diamond" size={40} color="#00FF00" />
                                    )
                                ) : null}
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Mines <FontAwesome6 name="bomb" size={60} color="#FF0000" /></Text>
            <Text style={styles.scoreText}>Current Score: {score}</Text>
            <Text style={styles.highScoreText}>High Score: {highScore}</Text>
            <Text style={styles.timerText}>Timer: {timer}</Text>
            <Text style={styles.instructions}>Tap to reveal cells. Avoid the mines!</Text>
            {gameOver ? (
                <GameOverScreen
                    score={score}
                    highScore={highScore}
                    onRestartGame={() => restartGame(GRID_SIZE, NUM_MINES)}
                    isWinner={openedCells === GRID_SIZE * GRID_SIZE - NUM_MINES}
                />
            ) : renderGameBoard()}
            <TouchableOpacity
                style={styles.quitButton}
                onPress={handleQuit}
            >
                <Text style={styles.buttonText}>Quit</Text>
            </TouchableOpacity>
        </View>
    );
};

const initializeGrid = (gridSize) => {
    const grid = Array(gridSize).fill(Array(gridSize).fill({ isMine: false, isOpen: false }));
    return grid.map(row => row.map(cell => ({ ...cell })));
};

const placeMines = (grid, gridSize, numMines) => {
    let minesPlaced = 0;
    while (minesPlaced < numMines) {
        const randomRow = Math.floor(Math.random() * gridSize);
        const randomCol = Math.floor(Math.random() * gridSize);
        if (!grid[randomRow][randomCol].isMine) {
            grid[randomRow][randomCol].isMine = true;
            minesPlaced++;
        }
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#006cb0',
    },
    headerText: {
        fontSize: 60,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 10,
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
        color: '#FFD700',
        fontWeight: 'bold',
    },
    timerText: {
        fontSize: 18,
        marginBottom: 20,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    gridContainer: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    cell: {
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#123499',
        borderWidth: 2,
        backgroundColor: '#91B5E9',
        margin: 1,
        borderRadius: 8,
        overflow: 'hidden',
    },
    instructions: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
        color: '#FFFFFF',
    },
    quitButton: {
        backgroundColor: '#FF0000',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default GameScreen;

