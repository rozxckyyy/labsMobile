import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, ActivityIndicator} from 'react-native';
import axios from 'axios';

export default function App() {
  const [query, setQuery] = useState('');
  const [foodData, setFoodData] = useState(null);
  const [loading, setLoading] = useState(false);

  const translateToEnglish = async (text) => {
    try {
      const response = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`);
      return response.data[0][0][0];
    } catch (error) {
      console.error('Ошибка перевода:', error);
      return text;
    }
  };
  const fetchFoodData = async () => {
    try {
      setLoading(true)
      const englishQuery = await translateToEnglish(query);
      const response = await axios.get(`https://api.edamam.com/api/food-database/v2/parser?ingr=${englishQuery}&app_id=35f1bd2d&app_key=e389fde7aa464f0d22ccd6500e9cbcde`);
      setFoodData(response.data);
      setLoading(false)
    } catch (error) {
      console.error('ошибочка вылезла:', error);
      setLoading(false)
    }
  };

  const renderFoodInfo = () => {
    if (query.length == 0) {
      return <Text style={styles.emptyMessage}>Введите название продукта</Text>;
    }

    return (
      <ScrollView style={styles.foodContainer}>
        <Text style={styles.heading}>Информация о продукте (100г)</Text>
        <Text style={styles.label}>Название:</Text>
        <Text style={styles.value}>{foodData.hints[0].food.label}</Text>
        <Text style={styles.label}>Калории:</Text>
        <Text style={styles.value}>{foodData.hints[0].food.nutrients.ENERC_KCAL} ккал</Text>
        <Text style={styles.label}>Белки:</Text>
        <Text style={styles.value}>{foodData.hints[0].food.nutrients.PROCNT} г</Text>
        <Text style={styles.label}>Жиры:</Text>
        <Text style={styles.value}>{foodData.hints[0].food.nutrients.FAT} г</Text>
        <Text style={styles.label}>Углеводы:</Text>
        <Text style={styles.value}>{foodData.hints[0].food.nutrients.CHOCDF} г</Text>
      </ScrollView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar></StatusBar>
      <View style={styles.container}>

        <Text style={styles.title}>Поиск продуктов</Text>
        <TextInput
          style={styles.input}
          placeholder="Введите название продукта"
          onChangeText={(text) => setQuery(text)}
          value={query}
        />

        <TouchableOpacity style={styles.button} onPress={fetchFoodData}>
          <Text style={styles.buttonText}>Найти</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />
          ) : (
            <>
            {foodData && renderFoodInfo()}
            </>
          )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  emptyMessage: {
    alignSelf: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  loader: {
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    width: '100%',
    borderRadius: 5,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#1e90ff',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  foodContainer: {
    marginTop: 20,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '100%',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#555',
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
    color: '#777',
  },
});
