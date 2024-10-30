import { useState, useEffect } from 'react';
import { Text, View, Pressable } from 'react-native';
import Header from './Header';
import Footer from './Footer';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Container, Row, Col } from 'react-native-flex-grid';
import styles from '../style/style';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';

import {
    NBR_OF_DICES,
    NBR_OF_THROWS,
    MIN_SPOT,
    MAX_SPOT,
    BONUS_POINTS,
    BONUS_POINTS_LIMIT,
    SCOREBOARD_KEY,
} from './Game';


// WIP: GAME-END Does not work properly, also the start new round does not work properly (player can cheat)

let board = [];

export default function Gameboard() {
    const navigation = useNavigation();
    const route = useRoute();

    const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS);
    const [status, setStatus] = useState('Throw dices.');
    const [gameEndStatus, setGameEndStatus] = useState(false);
    const [selectedDices, setSelectedDices] = useState(new Array(NBR_OF_DICES).fill(false));
    const [diceSpots, setDiceSpots] = useState(new Array(NBR_OF_DICES).fill(0));
    const [selectedDicePoints, setSelectedDicePoints] = useState(new Array(MAX_SPOT).fill(0));
    const [dicePointsTotal, setDicePointsTotal] = useState(new Array(MAX_SPOT).fill(0));
    const [playerName, setPlayerName] = useState('');
    const [scores, setScores] = useState([]);
    const [pointsChosen, setPointsChosen] = useState(false);
    const [roundCount, setRoundCount] = useState(0);

    useEffect(() => {
        if (playerName === '' && route.params?.player) {
            setPlayerName(route.params.player);
        }
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getScoreboardData();
        });
        return unsubscribe;
    }, [navigation]);

    const getScoreboardData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem(SCOREBOARD_KEY);
            if (jsonValue !== null) {
                const tmpScores = JSON.parse(jsonValue);

                setScores(tmpScores);
                console.log('Gameboard: Read successful.');
                console.log('Gameboard: Number of scores: ' + tmpScores.length);
            }
        }
        catch (e) {
            console.log('Gameboard: Read error: ' + e);
        }
    }

    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    const savePlayerPoints = async () => {
        const newKey = scores.length + 1;
        const playerPoints = {

            key: newKey,
            name: playerName,
            date: currentDate,
            time: currentTime,
            points: total
        }
        try {
            const newScore = [...scores, playerPoints];
            const jsonValue = JSON.stringify(newScore);
            await AsyncStorage.setItem(SCOREBOARD_KEY, jsonValue);
            console.log('Gameboard: Save succesful');

        }
        catch (e) {
            console.log('Gameboard: Save error: ' + e);

        }
    }

    // Dice row creation (Col)
    const dicesRow = [];
    for (let i = 0; i < NBR_OF_DICES; i++) {
        dicesRow.push(
            <Col key={"dice" + i}>
                <Pressable
                    key={"row" + i}
                    onPress={() => chooseDice(i)}>
                    <MaterialCommunityIcons
                        name={board[i]}
                        key={"dice" + i}
                        size={50}
                        color={getDiceColor(i)}>
                    </MaterialCommunityIcons>
                </Pressable>
            </Col>
        );
    }

    // Points row creation (Col)
    const pointsRow = [];
    for (let spot = 0; spot < MAX_SPOT; spot++) {
        pointsRow.push(
            <Col key={"pointsRow" + spot}>
                <Text key={"pointsRow" + spot}>{getSpotTotal(spot)}
                </Text>
            </Col>
        );
    }

    // Row creation which tells you has points been chosen
    const pointsToSelectRow = [];
    for (let diceButton = 0; diceButton < MAX_SPOT; diceButton++) {
        pointsToSelectRow.push(
            <Col key={"buttonsRow" + diceButton}>
                <Pressable key={"buttonsRow" + diceButton}
                    onPress={() => chooseDicePoints(diceButton)}>
                    <MaterialCommunityIcons
                        name={"numeric-" + (diceButton + 1) + "-circle"}
                        key={"buttonsRow" + diceButton}
                        size={35}
                        color={getDicePointsColor(diceButton)}>
                    </MaterialCommunityIcons>
                </Pressable>
            </Col>
        );
    }



    const chooseDice = (i) => {
        if (nbrOfThrowsLeft < NBR_OF_THROWS && !gameEndStatus) {
            let dices = [...selectedDices];
            dices[i] = selectedDices[i] ? false : true;
            setSelectedDices(dices);
        }
        else {
            setStatus('You have to throw dices first.')
        }
    }

    function getDiceColor(i) {
        return selectedDices[i] ? "black" : "red";
    }

    function getDicePointsColor(i) {
        return (selectedDicePoints[i] && !gameEndStatus) ? "black" : "red";
    }

    function getSpotTotal(i) {
        return dicePointsTotal[i];
    }

    const chooseDicePoints = (i) => {
        if (nbrOfThrowsLeft === 0 && !pointsChosen) {
            let selectedPoints = [...selectedDicePoints];
            let points = [...dicePointsTotal];

            if (!selectedPoints[i]) {
                selectedPoints[i] = true;
                let nbrOfDices = diceSpots.reduce((total, x) => (x === (i + 1) ? total + 1 : total), 0);
                points[i] = nbrOfDices * (i + 1); // Calculate points for the selected spot

                setDicePointsTotal(points);
                setSelectedDicePoints(selectedPoints);
                setPointsChosen(true); // Mark points as chosen

                calculateTotalPoints();

                // Check for game over condition
                checkGameEnd(selectedPoints); // Check selectedPoints after updating
            } else {
                setStatus("You already selected points for " + (i + 1));
            }
        } else if (pointsChosen) {
            setStatus("You have already chosen points for this round.");
        } else {
            setStatus("You must throw the dice " + NBR_OF_THROWS + " times before setting points.");
        }
    };

    const checkGameEnd = (selectedPoints) => {
        console.log("Checking game end condition.");
        if (selectedPoints.every(point => point) || roundCount >= 5) {
            setGameEndStatus(true);
            setStatus("Game Over! You've completed all rounds.");
        }
    };

    const throwDices = () => {

        if (gameEndStatus) {
            setStatus("The game is over. Please start a new game.");
            return;
        }

        if (nbrOfThrowsLeft > 0) {
            let spots = [...diceSpots];
            for (let i = 0; i < NBR_OF_DICES; i++) {
                if (!selectedDices[i]) {
                    let randomNumber = Math.floor(Math.random() * 6 + 1);
                    board[i] = 'dice-' + randomNumber;
                    spots[i] = randomNumber;
                }
            }
            setNbrOfThrowsLeft(nbrOfThrowsLeft - 1);
            setDiceSpots(spots);
            setStatus('Select and throw dices again');
            console.log("Dices thrown. Spots updated:", spots);
            console.log("Throws left:", nbrOfThrowsLeft - 1);
        } else {
            setStatus(" Choose your points first.");
        }
    };

    //Check if bonus points are available

    const [bonusAchieved, setBonusAchieved] = useState(false);
    const [total, setTotal] = useState(0);

    function calculateTotalPoints() {
        let totalPoints = dicePointsTotal.reduce((sum, points) => sum + points, 0);

        // Check if the player is eligible for bonus points + Add bonus points
        if (totalPoints >= BONUS_POINTS_LIMIT && !bonusAchieved) {
            totalPoints += BONUS_POINTS;
            setBonusAchieved(true);
            setStatus("Congrats! You've earned a bonus of " + BONUS_POINTS + " points.");
        }

        setTotal(totalPoints);
    }

    useEffect(() => {
        calculateTotalPoints();
    }, [dicePointsTotal]);

    // Check how many points are left for the possible bonus

    const calculateBonusPointsRemaining = () => {
        const currentTotal = dicePointsTotal.slice(0, 6).reduce((acc, points) => acc + points, 0);
        const pointsLeftForBonus = BONUS_POINTS_LIMIT - currentTotal;
        return pointsLeftForBonus > 0 ? pointsLeftForBonus : 0;
    };



    const startNewRound = () => {
        if (roundCount >= 5) {
            console.log("Max rounds reached.");
            return;
        }
        console.log(" Current round count: ", roundCount);
        setNbrOfThrowsLeft(NBR_OF_THROWS);
        setSelectedDices(Array(NBR_OF_DICES).fill(false));
        setSelectedDicePoints(Array(MAX_SPOT).fill(false));
        setDiceSpots(Array(NBR_OF_DICES).fill(0));
        setStatus("New round started. Throw your dice!");
        setPointsChosen(false);

        setRoundCount(prevRound => prevRound + 1);
    };

    // Resets the whole game 
    const resetGame = () => {
        setRoundCount(0);
        setNbrOfThrowsLeft(NBR_OF_THROWS);
        setSelectedDices(Array(NBR_OF_DICES).fill(false));
        setSelectedDicePoints(Array(MAX_SPOT).fill(false));
        setDiceSpots(Array(NBR_OF_DICES).fill(0));
        setStatus("Game has been reset. Throw your dice!");
        setPointsChosen(false);
        setGameEndStatus(false);
        setDicePointsTotal(Array(MAX_SPOT).fill(0));
        setBonusAchieved(false);
        setTotal(0);
    };

    return (
        <>
            <Header />
            <View style={styles.gameboard}>
                <Container>
                    <Row>{dicesRow}</Row>
                </Container>
                <Text style={styles.gameinfo}>Throws left: {nbrOfThrowsLeft}</Text>
                <Text style={styles.gameinfo}>{status}</Text>
                {/* This button should only be visible when there are throws left */}
                {nbrOfThrowsLeft > 0 && (
                    <Pressable style={styles.button} onPress={() => throwDices()}>
                        <Text style={styles.buttonText}>Throw Dices!</Text>
                    </Pressable>
                )}
                {/* Start new round button is only visible when the round is over and points have been chosen */}
                {!gameEndStatus && nbrOfThrowsLeft === 0 && pointsChosen && (
                    <Pressable onPress={startNewRound}>
                        <Text style={styles.button}>Start New Round</Text>
                    </Pressable>
                )}
                <Text style={styles.gameinfo}>Total: {total}</Text>
                <Text style={styles.gameinfo}>You are {calculateBonusPointsRemaining()} points away from bonus</Text>
                <Container>
                    <Row>{pointsRow}</Row>
                </Container>
                <Container>
                    <Row>{pointsToSelectRow}</Row>
                </Container>
                <Text style={styles.gameinfo}>Player: {playerName}</Text>
                <Pressable style={styles.button} onPress={() => savePlayerPoints()}>
                    <Text style={styles.buttonText}>Save points</Text>
                </Pressable>
                {gameEndStatus && (
                    <Pressable onPress={resetGame} style={styles.button}>
                        <Text style={styles.buttonText}>Reset Game</Text>
                    </Pressable>
                )}
            </View>
            <Footer />
        </>
    );
}    