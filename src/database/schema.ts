import { supabase } from '../supabase';

const DEFAULT_CATEGORIES = [
  { name: 'Зарплата', icon: '💰', type: 'income', color: '#10B981' },
  { name: 'Фриланс', icon: '💻', type: 'income', color: '#34D399' },
  { name: 'Подработка', icon: '🛠️', type: 'income', color: '#6EE7B7' },
  { name: 'Продукты', icon: '🛒', type: 'expense', color: '#EF4444' },
  { name: 'Транспорт', icon: '🚗', type: 'expense', color: '#F97316' },
  { name: 'Жильё', icon: '🏠', type: 'expense', color: '#8B5CF6' },
  { name: 'Связь', icon: '📱', type: 'expense', color: '#3B82F6' },
  { name: 'Развлечения', icon: '🎮', type: 'expense', color: '#EC4899' },
  { name: 'Здоровье', icon: '💊', type: 'expense', color: '#14B8A6' },
  { name: 'Одежда', icon: '👕', type: 'expense', color: '#F59E0B' },
  { name: 'Образование', icon: '📚', type: 'expense', color: '#6366F1' },
  { name: 'Прочее', icon: '📦', type: 'expense', color: '#6B7280' },
];

/**
 * Seeds default categories if the categories table is empty.
 * Call once on app startup.
 */
export async function seedCategoriesIfEmpty(): Promise<void> {
  const { count, error } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('seedCategoriesIfEmpty — count error:', error.message);
    return;
  }

  if (count === 0) {
    const { error: insertError } = await supabase
      .from('categories')
      .insert(DEFAULT_CATEGORIES);

    if (insertError) {
      console.error('seedCategoriesIfEmpty — insert error:', insertError.message);
    }
  }
}
