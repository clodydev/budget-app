import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { getCategories, upsertBudgetLimit, deleteAllTransactions, Category } from '../database/queries';

export default function SettingsScreen() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => { getCategories().then(setCategories); }, []);

  const setBudget = async (catId: number, budget: string) => {
    const val = parseFloat(budget) || 0;
    await upsertBudgetLimit(catId, val);
    Alert.alert('✅', 'Лимит сохранён');
    setCategories(await getCategories());
  };

  const deleteAll = () => {
    Alert.alert(
      'Очистить данные',
      'Удалить все транзакции? Категории останутся.',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Удалить', style: 'destructive', onPress: async () => {
          await deleteAllTransactions();
          setCategories(await getCategories());
        }}
      ]
    );
  };

  return (
    <ScrollView style={s.container}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Настройки</Text>
      </View>

      <View style={s.card}>
        <Text style={s.sectionTitle}>Категории</Text>
        <Text style={s.subtitle}>Лимиты на месяц</Text>
        {categories.map(cat => (
          <View key={cat.id} style={s.catRow}>
            <Text style={s.catIcon}>{cat.icon}</Text>
            <Text style={s.catName}>{cat.name}</Text>
            <TextInput
              style={s.budgetInput}
              placeholder="0"
              keyboardType="decimal-pad"
              placeholderTextColor="#D1D5DB"
              onSubmitEditing={(e) => setBudget(cat.id, e.nativeEvent.text)}
              returnKeyType="done"
            />
            <Text style={s.currency}>₽</Text>
          </View>
        ))}
      </View>

      <View style={s.card}>
        <Text style={s.sectionTitle}>О приложении</Text>
        <View style={s.infoRow}>
          <Text style={s.infoLabel}>Версия</Text>
          <Text style={s.infoValue}>1.0.0</Text>
        </View>
        <View style={s.infoRow}>
          <Text style={s.infoLabel}>База данных</Text>
          <Text style={s.infoValue}>Supabase (облако)</Text>
        </View>
      </View>

      <TouchableOpacity style={s.dangerBtn} onPress={deleteAll}>
        <Text style={s.dangerText}>Очистить все транзакции</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { backgroundColor: '#1F2937', padding: 20, paddingTop: 60 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  card: { backgroundColor: '#fff', margin: 16, borderRadius: 16, padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#6B7280', marginBottom: 12 },
  catRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  catIcon: { fontSize: 20, marginRight: 10 },
  catName: { flex: 1, fontSize: 15, color: '#4B5563' },
  budgetInput: { backgroundColor: '#F3F4F6', borderRadius: 8, padding: 6, width: 80, textAlign: 'right', fontSize: 14, color: '#1F2937' },
  currency: { fontSize: 14, color: '#6B7280', marginLeft: 4 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  infoLabel: { fontSize: 14, color: '#6B7280' }, infoValue: { fontSize: 14, color: '#1F2937', fontWeight: '500' },
  dangerBtn: { marginHorizontal: 16, backgroundColor: '#FEE2E2', borderRadius: 12, padding: 14, alignItems: 'center', marginBottom: 16 },
  dangerText: { color: '#EF4444', fontSize: 15, fontWeight: '600' },
});
