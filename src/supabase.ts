import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://pkycdphqfyhzwbvjogxm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBreWNkcGhxZnloendidmpvZ3htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxNTgxNzksImV4cCI6MjA5NzczNDE3OX0.ONzJzxuMR2SMnKmyXVzYWHBeWBH4UYbvTuOclipcFKM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
