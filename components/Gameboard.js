import { useState, useEffect } from 'react';
import { Text, View, Pressable } from 'react-native';
import Header from './Header';
import Footer from './Footer';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Container, Row, Col } from 'react-native-flex-grid';
import styles from '../style/style';

import {
    NBR_OF_DICES,
    NBR_OF_THROWS,
    MIN_SPOT,
    MAX_SPOT,
    BONUS_POINTS,
    BONUS_POINTS_LIMIT,
    SCOREBOARD_KEY,
} from './Game';
import AsyncStorage from '@react-native-async-storage/async-storage';

let board = [];



export default Gameboard = (navigation, route) => {

    const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS);
    const [status, setStatus] = useState('Throw dices.');
    const [gameEndStatus, setGameEndStatus] = useState(false);
    // Which dices are chosen?
    const [selectedDices, setSelectedDices] =
        useState(new Array(NBR_OF_DICES).fill(false));
    // Value of dices
    const [diceSpots, setDiceSpots] =
        useState(new Array(NBR_OF_DICES).fill(0));
    // Which dices values are chosen in points?
    const [selectedDicePoints, setSelectedDicePoints] =
        useState(new Array(MAX_SPOT).fill(0));
    // Sum of chosen dices
    const [dicePointsTotal, setDicePointsTotal]
        = useState(new Array(MAX_SPOT).fill(0));
    const [playerName, setPlayerName] = useState('');
    const [scores, setScores] = useState([]);

    useEffect(() => {
        if (playerName === '' && route.params?.player) {
            setPlayerName(route.params.player);
        }
    }, []);

  
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
        
            //do this later wip
            key: newKey,
            name: playerName,
            date: currentDate, 
            time: currentTime, 
            points: 0   // return points of the player 
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
        return selectedDices[i] ? "black" : "steelblue";
    }

    function getDicePointsColor(i) {
        return (selectedDicePoints[i] && !gameEndStatus) ? "black" : "steelblue";
    }

    function getSpotTotal(i) {
        return dicePointsTotal[i];
    }

    const chooseDicePoints = (i) => {
        if (nbrOfThrowsLeft === 0) {
            let selectedPoints = [...selectedDicePoints];
            let points = [...dicePointsTotal];
            if (!selectedPoints[i]) {
                selectedPoints[i] = true;
                let nbrOfDices =
                    diceSpots.reduce((total, x) => (x === (i + 1) ? total + 1 : total), 0);
                points[i] = nbrOfDices * (i + 1);
            }
            else {
                setStatus("You already selected points for " + (i + 1));
                return points[i];
            }
            setDicePointsTotal(points);
            setSelectedDicePoints(selectedPoints);
            return points[i];
        }

        else {
            setStatus("Throw " + NBR_OF_THROWS + " times before setting points.");
        }
    }

    const throwDices = () => {
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
    }

    return (
        <>
            <Header />
            <View>
                <Container>
                    <Row>{dicesRow}</Row>
                </Container>
                <Text>Throws left: {nbrOfThrowsLeft}</Text>
                <Text>{status}</Text>
                <Pressable onPress={() => throwDices()}>
                    <Text>Throw Dices!</Text>
                </Pressable>
                <Container>
                    <Row>{pointsRow}</Row>
                </Container>
                <Container>
                    <Row>{pointsToSelectRow}</Row>
                </Container>
                <Text>Player: {playerName}</Text>
                <Pressable onPress={() => savePlayerPoints()}> 
                <Text>Save points</Text>
                </Pressable>
            </View>
            <Footer />
        </>
    )
}