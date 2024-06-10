import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, ActivityIndicator, TouchableOpacity, SafeAreaView, StatusBar, FlatList} from 'react-native';

const API_KEY = '02caaf441f7d41ecb65be0dd77b4fa30';
const API_URL = `https://newsapi.org/v2/top-headlines?country=&apiKey=${API_KEY}`;
const pickerData = [
  {label: 'Все', value: 'general'},
  {label: 'Политика', value: 'politics'},
  {label: 'Спорт', value: 'sports'},
  {label: 'Наука', value: 'science'}
]

export default function App() {
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState('general');

  useEffect(() => {
    fetchNews();
  }, [category]);

  const fetchNews = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}&category=${category}`);
      const data = await response.json();
      setArticles(data.articles);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
  };

  const renderItem = ({item}) => (
    <TouchableOpacity style={item.value == category ? styles.itemContainerSelected : styles.itemContainer} onPress={() => handleCategoryChange(item.value)}>
      <Text style={item.value == category ? styles.placeSelected : styles.place}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar></StatusBar>
      <View style={styles.container}>
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Выберите категорию:</Text>
          <FlatList
            data={pickerData}
            renderItem={renderItem}
            keyExtractor={(item) => item.value}
            style={styles.list}
          />
        </View>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.newsContainer}>
            {articles.map((article, index) => (
              <TouchableOpacity key={index} style={styles.item} onPress={() => alert(`Вы выбрали ${article.title}`)}>
                <Image source={{ uri: article.urlToImage }} style={styles.image} />
                <View style={styles.textContainer}>
                  <Text style={styles.title}>{article.title}</Text>
                  <Text>{article.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  itemContainer: {
    padding: 10,
  },
  itemContainerSelected: {
    padding: 10,
    backgroundColor: '#1e90ff'
  },
  place: {
    fontSize: 16,
    color: '#333333',
  },
  placeSelected: {
    fontSize: 16,
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
  },
  filterLabel: {
    marginRight: 10,
  },
  list: {
    width: '100%',
    marginTop: 20,
    flexGrow: 0,
  },
  picker: {
    flex: 1,
    height: 50,
  },
  newsContainer: {
    paddingBottom: 20,
  },
  item: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});
