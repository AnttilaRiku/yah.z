import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A3D26',
  },
  header: {
    marginTop: 30,
    backgroundColor: '#007A33',
    flexDirection: 'row',
  },
  footer: {
    marginTop: 20,
    backgroundColor: '#007A33',
    flexDirection: 'row',
  },
  title: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    flex: 1,
    fontSize: 23,
    textAlign: 'center',
    margin: 10,
  },
  author: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    flex: 1,
    fontSize: 15,
    textAlign: 'center',
    margin: 10,
  },
  gameboard: {
    backgroundColor: '#0A3D26',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameinfo: {
    backgroundColor: '#0A3D26',
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 18,
    color: '#000000',
  },
  item: {
    margin: 15,
    padding: 5,
  },
  flex: {
    flexDirection: "row",
  },
  button: {
    margin: 30,
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#FF4C4C",
    width: 150,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: "#2B2B52",
    fontSize: 20,
  },

  // New styles for the Home component
  textInput: {
    backgroundColor: '#fff',
    borderColor: 'red',
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    color: '#000',
  },
  infoText: {
    color: '#fff',
    fontSize: 18,
    marginVertical: 10,
  },
  rulesText: {
    color: '#fff',
    fontSize: 16,
    marginVertical: 10,
  },
//Scoreboard.js 
  scoreboardContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0A3D26',
  },
  scoreboardItem: {
    backgroundColor: '#007A33',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
  },
  playerName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scoreText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  clearButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#FF4C4C',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#2B2B52',
    fontSize: 18,
  },

});