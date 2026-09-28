import { createClient } from '@supabase/supabase-js';

import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function test() {
    const { data, error } = await supabase.auth.signUp({
        email: 'test@example.com',
        password: 'password123'
    });
    console.log(data, error);
}

test();
