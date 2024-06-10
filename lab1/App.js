// Импорт необходимых компонентов и библиотек
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Keyboard, SafeAreaView, StatusBar} from 'react-native';
import axios from 'axios';

// API ключ для доступа к сервису OpenWeatherMap
const API_KEY = 'f72e8ad6ecee1edcc115b27e5c42ce59';

// Основной компонент приложения
const App = () => {
  // Состояния компонента
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [citiesList, setCitiesList] = useState([]);

  // Хук useEffect для выполнения сетевых запросов при изменении значения city
  useEffect(() => {
    const fetchCities = async () => {
      try {
        if (city.length >= 3) {
          setLoading(true);
          const response = await axios.get(`https://api.openweathermap.org/data/2.5/find?q=${encodeURIComponent(city)}&appid=${API_KEY}&lang=ru&type=like`);
          setCitiesList(response.data.list);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchCities, 500);

    return () => clearTimeout(timeoutId);
  }, [city]);

  // Функция для обработки выбора города из списка
  const handleSelectCity = async (selectedCity) => {
    setCity(selectedCity.name);
    setLoading(true);
    Keyboard.dismiss();
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(selectedCity.name)}&appid=${API_KEY}&lang=ru`);
      setWeatherData(response.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setWeatherData(null);
    }
    setLoading(false);
  };

  // Функция для отображения элемента списка городов в компоненте FlatList
  const renderCityItem = ({ item }) => (
    <TouchableOpacity style={styles.cityItem} onPress={() => handleSelectCity(item)}>
      <Text style={styles.cityName}>{item.name}</Text>
      <Text style={styles.countryName}>{item.sys.country}</Text>
    </TouchableOpacity>
  );

  // Функция для отображения информации о погоде выбранного города
  const renderWeatherInfo = () => {
    if (!weatherData) {
      return <Text style={styles.emptyMessage}>Выберите город для просмотра погоды</Text>;
    }

    return (
      <View style={styles.weatherContainer}>
        <Text style={styles.weatherCity}>{weatherData.name}</Text>
        <Text style={styles.weatherDescription}>{weatherData.weather[0].description}</Text>
        <Text style={styles.weatherTemp}>{`${(weatherData.main.temp - 273.15).toFixed(1)}°C`}</Text>
        <View style={styles.weatherDetails}>
          <View style={styles.weatherDetail}>
            <Text style={styles.detailLabel}>Давление:</Text>
            <Text style={styles.detailValue}>{`${(weatherData.main.pressure / 1.33).toFixed(1)} мм.рт.ст`}</Text>
          </View>
          <View style={styles.weatherDetail}>
            <Text style={styles.detailLabel}>Влажность:</Text>
            <Text style={styles.detailValue}>{`${weatherData.main.humidity}%`}</Text>
          </View>
          <View style={styles.weatherDetail}>
            <Text style={styles.detailLabel}>Скорость ветра:</Text>
            <Text style={styles.detailValue}>{`${weatherData.wind.speed} м/с`}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar></StatusBar>
      <View style={styles.container}>
        <Text style={styles.title}>Погода</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Введите название города на русском"
            value={city}
            onChangeText={(text) => setCity(text)}
            autoCapitalize="none"
          />
          <Button
            title="Найти"
            onPress={() => handleSelectCity({ name: city })}
          />
        </View>
        {loading && <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />}
        <FlatList
          style={styles.cityList}
          data={citiesList}
          renderItem={renderCityItem}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={<Text style={styles.emptyMessage}>Нет данных</Text>}
        />
        {renderWeatherInfo()}
      </View>
    </SafeAreaView>
  );
};

// Стили для компонентов
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  loader: {
    marginTop: 20,
  },
  cityList: {
    marginBottom: 20,
  },
  cityItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cityName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  countryName: {
    fontSize: 14,
    color: '#666',
  },
  emptyMessage: {
    alignSelf: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  weatherContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 20,
  },
  weatherCity: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  weatherDescription: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  weatherTemp: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  weatherDetails: {
    marginTop: 20,
  },
  weatherDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailValue: {
    fontSize: 16,
  },
});

// Экспорт компонента App
export default App;
