import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const App = () => {
  const [balance, setBalance] = useState(0);
  const [incomeTransactions, setIncomeTransactions] = useState([]);
  const [expenseTransactions, setExpenseTransactions] = useState([]);
  const [newTransactionDescription, setNewTransactionDescription] = useState('');
  const [newTransactionAmount, setNewTransactionAmount] = useState('');
  const [filter, setFilter] = useState('all');

  const addTransaction = () => {
    if (!newTransactionDescription || !newTransactionAmount) return;

    const amount = parseFloat(newTransactionAmount);
    const newTransaction = {
      id: Math.random().toString(),
      description: newTransactionDescription,
      amount: Math.abs(amount),
    };

    if (filter === 'income') {
      setIncomeTransactions([...incomeTransactions, newTransaction]);
      setBalance(balance + Math.abs(amount));
    } else if (filter === 'expense') {
      setExpenseTransactions([...expenseTransactions, newTransaction]);
      setBalance(balance - Math.abs(amount));
    }

    setNewTransactionDescription('');
    setNewTransactionAmount('');
  };

  const filteredTransactions = () => {
    if (filter === 'all') return [...incomeTransactions, ...expenseTransactions];
    if (filter === 'income') return incomeTransactions;
    if (filter === 'expense') return expenseTransactions;
  };

  const generateChartData = (incomeTransactions, expenseTransactions, balance) => {
    const data = {
      labels: [],
      datasets: [
        {
          data: [],
          color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`, // Цвет для доходов
        },
        {
          data: [],
          color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`, // Цвет для расходов
        },
      ],
    };

    incomeTransactions.forEach((transaction) => {
      data.labels.push(transaction.id);
      data.datasets[0].data.push(transaction.amount);
      data.datasets[1].data.push(0); // Добавляем 0 для расходов, чтобы не было отображения на том же уровне
    });

    expenseTransactions.forEach((transaction) => {
      data.labels.push(transaction.id);
      data.datasets[0].data.push(0); // Добавляем 0 для доходов, чтобы не было отображения на том же уровне
      data.datasets[1].data.push(transaction.amount);
    });

    // Добавляем последнюю точку для текущего баланса
    const lastLabel = 'Текущий баланс';
    data.labels.push(lastLabel);
    data.datasets[0].data.push(balance); // Добавляем текущий баланс как доход
    data.datasets[1].data.push(0); // Расходы на текущем балансе будут равны 0

    return data;
  };

  const chartData = generateChartData(incomeTransactions, expenseTransactions, balance);

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 2, // Два знака после запятой
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Цвет подписей оси X и оси Y
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Цвет меток
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#ffa726', // Цвет точек
    },
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text style={styles.title}>Управление финансами</Text>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Текущий баланс:</Text>
        <Text style={styles.balanceAmount}>{balance.toFixed(2)} ₽</Text>
      </View>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
          onPress={() => setFilter('all')}>
          <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>Все</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'income' && styles.activeFilter]}
          onPress={() => setFilter('income')}>
          <Text style={[styles.filterText, filter === 'income' && styles.activeFilterText]}>Доходы</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'expense' && styles.activeFilter]}
          onPress={() => setFilter('expense')}>
          <Text style={[styles.filterText, filter === 'expense' && styles.activeFilterText]}>Расходы</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Описание транзакции"
          value={newTransactionDescription}
          onChangeText={text => setNewTransactionDescription(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Сумма"
          keyboardType="numeric"
          value={newTransactionAmount}
          onChangeText={text => setNewTransactionAmount(text)}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTransaction}>
          <Text style={styles.addButtonText}>Добавить транзакцию</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryLabel}>
          Доходы: {incomeTransactions.reduce((total, transaction) => total + transaction.amount, 0).toFixed(2)}
        </Text>
        <Text style={styles.summaryLabel}>
          Расходы: {expenseTransactions.reduce((total, transaction) => total + transaction.amount, 0).toFixed(2)}
        </Text>
      </View>
      <View style={styles.chartContainer}>
        <LineChart
          data={chartData}
          width={Dimensions.get('window').width - 40} // ширина графика = ширина экрана - 40 (для отступов)
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
        />
      </View>
      <FlatList
        data={filteredTransactions()}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.transaction}>
            <Text style={styles.transactionDescription}>{item.description}</Text>
            <Text style={styles.transactionAmount}>{item.amount.toFixed(2)}</Text>
          </View>
        )}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
  balanceAmount: {
    fontSize: 18,
    color: '#555',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  filterText: {
    fontSize: 16,
    color: '#666',
  },
  activeFilter: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  activeFilterText: {
    color: '#fff',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  transaction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
  transactionDescription: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  transactionAmount: {
    fontSize: 16,
    color: '#555',
  },
  summaryContainer: {
    marginBottom: 20,
  },
  summaryLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default App;
