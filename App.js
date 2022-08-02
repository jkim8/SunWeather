import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default function App() {
  return (
    <View style={styles.container}>
    <StatusBar style="light"/>
    <View style={styles.city}>
      <Text>Atlanta</Text>
    </View>
    <View style={styles.weather}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: "tomato"
  },
  city: {
    flex: 1,
    backgroundColor: 'blue',
    justifyContent: 'center'
  },
  weather: {
    flex: 3,
    backgroundColor: 'teal'
  }
})

