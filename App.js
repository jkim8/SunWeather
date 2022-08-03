import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  ScrollView,
  Dimensions,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
} from 'react-native';
import * as Location from 'expo-location';
import { Fontisto } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;
//Open Weather API Key
const API_KEY = '8cf3f6bfe97981c97bfdc23aefac23e1';

export default function App() {
  const [city, setCity] = useState('...Loading');
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    //폰의 위치 정보 받아오기위한 permission
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    //현재 위도 경도 받아오기
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 }); // 숫자가 높을 수록 정확도가 올라감
    //현재 지역 정보 받아오기 (Geocode 쓰면 반대로 도시정보로 위도 경도 받아옴)
    const location = await Location.reverseGeocodeAsync(
      {
        latitude,
        longitude,
      },
      { useGoogleMaps: false },
    );
    setCity(location[0].city);
    //Open Weather API:  5일간 3시간 텀으로 날씨 정보 받아오는 API
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=imperial`,
    );
    const json = await response.json();
    setDays(json.list);
  };
  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator
              color="white"
              size="large"
              style={{ marginTop: 20 }}
            />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <View style={styles.iconBox}>
                <Image //Weather API 에서 제공하는 이미지 변수 설정 후 보여주기
                  style={styles.icon}
                  source={{
                    uri: `http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`,
                  }}
                />
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.temp}>
                  {parseFloat(day.main.temp).toFixed(1)}
                </Text>
                <Fontisto name="apple" size={24} color="white" />
              </View>

              <Text style={styles.dt_txt}>{day.dt_txt}</Text>
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'teal',
  },
  city: {
    flex: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityName: {
    color: 'white',
    fontSize: 68,
    fontWeight: '500',
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
  },
  temp: {
    fontSize: 118,
    color: 'white',
    alignItems: 'flex-start',
    paddingLeft: 20,
  },
  description: {
    marginTop: 20,
    fontSize: 60,
    color: 'white',
    alignItems: 'flex-start',
    paddingLeft: 20,
  },
  tinyText: {
    fontSize: 20,
    color: 'white',
    alignItems: 'flex-start',
    paddingLeft: 20,
  },
  dt_txt: {
    fontSize: 30,
    color: 'white',
    alignItems: 'flex-start',
    paddingLeft: 20,
  },
  icon: {
    width: 150,
    height: 150,
  },
  iconBox: { alignItems: 'center' },
});
