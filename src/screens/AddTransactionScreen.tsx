import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { getCategories, addTransaction, Category } from '../database/queries';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddTransactionScreen({ navigation }: any) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => { getCategories(type).then(setCategories); }, [type]);

  const handleSave = async () => {
    if (!categoryId || !amount) return;
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return;
    await addTransaction(categoryId, num, type, note, date.toISOString().split('T')[0]);
    navigation.goBack();
  };

  const formatDate = (d: Date) => d.toLocaleDateString('ru-RU');

  return (
    <ScrollView style={s.container}>
      <View style={s.toggle}>
        <TouchableOpacity style={[s.toggleBtn, type === 'expense' && s.activeExpense]} onPress={() => { setType('expense'); setCategoryId(null); }}>
          <Text style={[s.toggleText, type === 'expense' && s.activeText]}>Расход</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.toggleBtn, type === 'income' && s.activeIncome]} onPress={() => { setType('income'); setCategoryId(null); }}>
          <Text style={[s.toggleText, type === 'income' && s.activeText]}>Доход</Text>
        </TouchableOpacity>
      </View>

      <View style={s.field}>
        <Text style={s.label}>Сумма</Text>
        <TextInput
          style={s.input}
          placeholder="0"
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
          placeholderTextColor="#D1D5DB"
        />
      </View>

      <View style={s.field}>
        <Text style={s.label}>Категория</Text>
        <View style={s.catGrid}>
          {categories.map(c => (
            <TouchableOpacity
              key={c.id}
              style={[s.catItem, categoryId === c.id && { borderColor: c.color, borderWidth: 2 }]}
              onPress={() => setCategoryId(c.id)}
            >
              <Text style={s.catIcon}>{c.icon}</Text>
              <Text style={s.catName}>{c.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={s.field}>
        <Text style={s.label}>Заметка</Text>
        <TextInput style={s.input} placeholder="Что это?" value={note} onChangeText={setNote} placeholderTextColor="#D1D5DB" />
      </View>

      <View style={s.field}>
        <Text style={s.label}>Дата</Text>
        <TouchableOpacity onPress={() => setShowPicker(true)} style={s.dateBtn}>
          <Text style={s.dateText}>{formatDate(date)}</Text>
        </TouchableOpacity>
        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            onChange={(_, d) => { setShowPicker(false); if (d) setDate(d); }}
            locale="ru"
          />
        )}
      </View>

      <TouchableOpacity style={[s.saveBtn, (!categoryId || !amount) && s.disabled]} onPress={handleSave} disabled={!categoryId || !amount}>
        <Text style={s.saveText}>Сохранить</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', padding: 16 },
  toggle: { flexDirection: 'row', marginBottom: 20, backgroundColor: '#E5E7EB', borderRadius: 12, padding: 4 },
  toggleBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  activeExpense: { backgroundColor: '#EF4444' }, activeIncome: { backgroundColor: '#10B981' },
  toggleText: { fontSize: 15, fontWeight: '600', color: '#6B7280' }, activeText: { color: '#fff' },
  field: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', color: '#4B5563', marginBottom: 8 },
  input: { backgroundColor: '#fff', borderRadius: 12, padding: 14, fontSize: 16, color: '#1F2937' },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catItem: { backgroundColor: '#fff', borderRadius: 12, padding: 10, alignItems: 'center', width: '23%', borderWidth: 1, borderColor: '#E5E7EB' },
  catIcon: { fontSize: 22 }, catName: { fontSize: 11, color: '#4B5563', marginTop: 4 },
  dateBtn: { backgroundColor: '#fff', borderRadius: 12, padding: 14 },
  dateText: { fontSize: 16, color: '#1F2937' },
  saveBtn: { backgroundColor: '#3B82F6', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 10 },
  disabled: { opacity: 0.5 },
  saveText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
