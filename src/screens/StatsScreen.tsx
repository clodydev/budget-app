import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { getCategoryStats, CatStat } from '../database/queries';

export default function StatsScreen() {
  const [incomeCats, setIncomeCats] = useState<CatStat[]>([]);
  const [expenseCats, setExpenseCats] = useState<CatStat[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const cats = await getCategoryStats();
    const income: CatStat[] = cats.filter((c: CatStat) => c.type !== 'expense');
    const expense: CatStat[] = cats.filter((c: CatStat) => c.type !== 'income');
    const ti = income.reduce((s: number, c: CatStat) => s + c.total, 0);
    const te = expense.reduce((s: number, c: CatStat) => s + c.total, 0);
    setIncomeCats(income.map((c: CatStat) => ({ ...c, percentage: ti ? Math.round(c.total / ti * 100) : 0 })));
    setExpenseCats(expense.map((c: CatStat) => ({ ...c, percentage: te ? Math.round(c.total / te * 100) : 0 })));
    setTotalIncome(ti);
    setTotalExpense(te);
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const pieData = (data: CatStat[]) => data.filter(d => d.total > 0).slice(0, 6).map(d => ({
    name: d.icon, population: d.total, color: d.color, legendFontColor: '#4B5563', legendFontSize: 12
  }));

  const renderCats = (data: CatStat[]) => data.map((c: CatStat) => (
    <View key={c.name} style={s.catRow}>
      <Text style={s.catIcon}>{c.icon}</Text>
      <View style={s.catBar}>
        <View style={s.catInfo}>
          <Text style={s.catName}>{c.name}</Text>
          <Text style={s.catAmount}>{c.total.toLocaleString()} ₽</Text>
        </View>
        <View style={s.barBg}>
          <View style={[s.barFill, { width: `${c.percentage}%`, backgroundColor: c.color }]} />
        </View>
      </View>
      <Text style={s.percent}>{c.percentage}%</Text>
    </View>
  ));

  return (
    <ScrollView style={s.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load().then(() => setRefreshing(false)); }} />}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Статистика за месяц</Text>
      </View>

      <View style={s.card}>
        <Text style={s.sectionTitle}>Расходы</Text>
        {pieData(expenseCats).length > 0 && (
          <PieChart
            data={pieData(expenseCats)}
            width={Dimensions.get('window').width - 64}
            height={160}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="0"
            absolute
          />
        )}
        {renderCats(expenseCats)}
        {totalExpense === 0 && <Text style={s.empty}>Нет расходов</Text>}
      </View>

      <View style={s.card}>
        <Text style={s.sectionTitle}>Доходы</Text>
        {pieData(incomeCats).length > 0 && (
          <PieChart
            data={pieData(incomeCats)}
            width={Dimensions.get('window').width - 64}
            height={160}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="0"
            absolute
          />
        )}
        {renderCats(incomeCats)}
        {totalIncome === 0 && <Text style={s.empty}>Нет доходов</Text>}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { backgroundColor: '#1F2937', padding: 20, paddingTop: 60 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  card: { backgroundColor: '#fff', margin: 16, borderRadius: 16, padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 12 },
  empty: { color: '#9CA3AF', textAlign: 'center', padding: 20 },
  catRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  catIcon: { fontSize: 20, marginRight: 8 },
  catBar: { flex: 1 },
  catInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  catName: { fontSize: 14, color: '#4B5563' }, catAmount: { fontSize: 14, fontWeight: '600', color: '#1F2937' },
  barBg: { height: 6, backgroundColor: '#E5E7EB', borderRadius: 3 },
  barFill: { height: 6, borderRadius: 3 },
  percent: { fontSize: 12, color: '#6B7280', marginLeft: 8, width: 40, textAlign: 'right' },
});
