import { useState } from 'react';
import { Text, View, TextInput, Pressable, Keyboard } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Header from './Header';
import Footer from './Footer';
import {
    NBR_OF_DICES,
    NBR_OF_THROWS,
    MIN_SPOT,
    MAX_SPOT,
} from './Game';
import styles from '../style/style';

export default Home = ({ navigation }) => {
    const [playerName, setPlayerName] = useState('');
    const [hasPlayerName, setHasPlayerName] = useState(false);

    const handlePlayerName = (value) => {
        if (value.trim().length > 0) {
            setHasPlayerName(true);
            Keyboard.dismiss();
        }
    }

    return (
        <>
            <Header />
            <View style={styles.container}>
                <MaterialCommunityIcons name="information" size={90} color="red" />
                {!hasPlayerName ?
                    <>
                        <Text style={styles.infoText}>For scoreboard enter your name...</Text>
                        <TextInput
                            style={styles.textInput}
                            onChangeText={setPlayerName}
                            autoFocus={true}
                            placeholder="Enter your name"
                        />
                        <Pressable
                            style={styles.button}
                            onPress={() => handlePlayerName(playerName)}>
                            <Text style={styles.buttonText}>Ok</Text>
                        </Pressable>
                    </>
                    :
                    <>
                        <Text style={styles.rulesText}>Rules of the game:</Text>
                        <Text style={styles.rulesText} multiline>
                            THE GAME: Upper section of the classic Yahtzee dice game. You have {NBR_OF_DICES} dices and for every dice, you have {NBR_OF_THROWS} throws.
                            After each throw, you can keep dices to get same dice spot counts as many as possible. In the end of the turn, you must select your points from
                            {MIN_SPOT} to {MAX_SPOT}. Game ends when all points have been selected. The order for selecting those is free.
                        </Text>
                        <Text style={styles.infoText}>Good luck, {playerName}</Text>
                        <Pressable
                            style={styles.button}
                            onPress={() => navigation.navigate('Gameboard', { player: playerName })}>
                            <Text style={styles.buttonText}>Play</Text>
                        </Pressable>
                    </>
                }
            </View>
            <Footer />
        </>
    );
}
