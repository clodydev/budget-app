import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { seedCategoriesIfEmpty } from './src/database/schema';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    seedCategoriesIfEmpty()
      .then(() => setReady(true))
      .catch((e: Error) => setError(e.message));
  }, []);

  if (error) {
    return (
      <View style={s.center}>
        <Text style={s.error}>Ошибка: {error}</Text>
      </View>
    );
  }

  if (!ready) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={s.loading}>Загрузка...</Text>
      </View>
    );
  }

  return <AppNavigator />;
}

const s = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F4F6' },
  loading: { marginTop: 12, color: '#6B7280', fontSize: 16 },
  error: { color: '#EF4444', fontSize: 14, textAlign: 'center', padding: 20 },
});
