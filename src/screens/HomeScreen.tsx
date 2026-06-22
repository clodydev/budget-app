import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { getMonthlyReport, getTransactions, getMonthlyChart, MonthlyReport, Transaction } from '../database/queries';

export default function HomeScreen({ navigation }: any) {
  const [report, setReport] = useState<MonthlyReport>({ total_income: 0, total_expense: 0, balance: 0 });
  const [recentTx, setRecentTx] = useState<Transaction[]>([]);
  const [chartData, setChartData] = useState<{labels: string[]; income: number[]; expense: number[]}>({labels:[], income:[], expense:[]});
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setReport(await getMonthlyReport());
    setRecentTx(await getTransactions(5));
    const chart = await getMonthlyChart();
    const labels = chart.map((_, i) => i % 5 === 0 || i === chart.length - 1 ? chart[i].date.slice(5) : '');
    setChartData({
      labels: labels.slice(-7),
      income: chart.slice(-7).map(d => d.income),
      expense: chart.slice(-7).map(d => d.expense),
    });
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const currency = (n: number) => `${n < 0 ? '-' : ''}${Math.abs(n).toLocaleString()} ₽`;

  return (
    <ScrollView style={s.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={s.balanceCard}>
        <Text style={s.balanceLabel}>Баланс за месяц</Text>
        <Text style={[s.balance, report.balance >= 0 ? s.positive : s.negative]}>
          {currency(report.balance)}
        </Text>
        <View style={s.row}>
          <View style={s.statBox}>
            <Text style={s.statLabel}>Доходы</Text>
            <Text style={[s.statValue, s.positiveText]}>{currency(report.total_income)}</Text>
          </View>
          <View style={s.statBox}>
            <Text style={s.statLabel}>Расходы</Text>
            <Text style={[s.statValue, s.negativeText]}>{currency(report.total_expense)}</Text>
          </View>
        </View>
      </View>

      {chartData.labels.length > 1 && (
        <View style={s.chartCard}>
          <Text style={s.sectionTitle}>Динамика (30 дней)</Text>
          <LineChart
            data={{
              labels: chartData.labels,
              datasets: [
                { data: chartData.income.length ? chartData.income : [0], color: () => '#10B981', strokeWidth: 2 },
                { data: chartData.expense.length ? chartData.expense : [0], color: () => '#EF4444', strokeWidth: 2 },
              ],
              legend: ['Доходы', 'Расходы'],
            }}
            width={Dimensions.get('window').width - 32}
            height={200}
            chartConfig={{
              backgroundColor: '#fff', backgroundGradientFrom: '#fff', backgroundGradientTo: '#fff',
              decimalPlaces: 0, color: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
              labelColor: () => '#6B7280', propsForDots: { r: '3' },
            }}
            bezier
            style={s.chart}
          />
        </View>
      )}

      <View style={s.section}>
        <Text style={s.sectionTitle}>Последние операции</Text>
        {recentTx.length === 0 && <Text style={s.empty}>Пока нет операций</Text>}
        {recentTx.map(tx => (
          <View key={tx.id} style={s.txRow}>
            <Text style={s.txIcon}>{tx.category_icon}</Text>
            <View style={s.txInfo}>
              <Text style={s.txName}>{tx.category_name}</Text>
              <Text style={s.txNote}>{tx.note || tx.date}</Text>
            </View>
            <Text style={[s.txAmount, tx.type === 'income' ? s.positiveText : s.negativeText]}>
              {tx.type === 'income' ? '+' : '-'}{tx.amount.toLocaleString()} ₽
            </Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={s.fab} onPress={() => navigation.navigate('AddTransaction')}>
        <Text style={s.fabText}>+</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  balanceCard: { backgroundColor: '#1F2937', margin: 16, borderRadius: 16, padding: 20 },
  balanceLabel: { color: '#9CA3AF', fontSize: 14 },
  balance: { fontSize: 36, fontWeight: '700', marginVertical: 8 },
  positive: { color: '#10B981' }, negative: { color: '#EF4444' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  statBox: { flex: 1 },
  statLabel: { color: '#9CA3AF', fontSize: 12 },
  statValue: { fontSize: 18, fontWeight: '600', marginTop: 2 },
  positiveText: { color: '#10B981' }, negativeText: { color: '#EF4444' },
  chartCard: { backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 16, padding: 12, marginBottom: 12 },
  chart: { borderRadius: 12 },
  section: { backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 16, padding: 16, marginBottom: 80 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 12 },
  empty: { color: '#9CA3AF', textAlign: 'center', padding: 20 },
  txRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  txIcon: { fontSize: 24, marginRight: 12 },
  txInfo: { flex: 1 },
  txName: { fontSize: 15, fontWeight: '500', color: '#1F2937' },
  txNote: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  txAmount: { fontSize: 15, fontWeight: '600' },
  fab: { position: 'absolute', bottom: 24, right: 24, backgroundColor: '#3B82F6', width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 30 },
});
