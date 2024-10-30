import { useState, useEffect } from 'react';
import { Text, View, FlatList, Pressable } from 'react-native';
import Header from './Header';
import Footer from './Footer';
import { SCOREBOARD_KEY } from './Game';
import styles from '../style/style';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default Scoreboard = ({ navigation }) => {

    const [scores, setScores] = useState([]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getScoreboardData();
        })
        return unsubscribe;
    }, [navigation]);

    const getScoreboardData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem(SCOREBOARD_KEY);
            if (jsonValue !== null) {
                const tmpScores = JSON.parse(jsonValue);
                setScores(tmpScores.sort((a, b) => b.points - a.points));
                console.log('Scoreboard: Read successful.');
                console.log('Scoreboard: Number of scores: ' + tmpScores.length);
            }
        }
        catch (e) {
            console.log('Scoreboard: Read error: ' + e);
        }
    }

    const clearScoreboard = async () => {
        try {
            await AsyncStorage.removeItem(SCOREBOARD_KEY);
            setScores([]);
        }
        catch (e) {
            console.log('Scoreboard: Clear error: ' + e);
        }
    }
    return (
        <>
            <Header />
            <View style={styles.scoreboardContainer}>
                <Text style={styles.title}>Scoreboard</Text>
                <FlatList
                    data={scores}
                    keyExtractor={(item) => item.key.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.scoreboardItem}>
                            <Text style={styles.playerName}>Player: {item.name}</Text>
                            <Text>Date: {item.date} - Time: {item.time}</Text>
                            <Text style={styles.scoreText}>Points: {item.points}</Text>
                        </View>
                    )}
                />
                <Pressable onPress={clearScoreboard} style={styles.clearButton}>
                    <Text style={styles.clearButtonText}>Clear Scoreboard</Text>
                </Pressable>
            </View>
            <Footer />
        </>
    )
}