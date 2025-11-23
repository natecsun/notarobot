import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Manual env parsing
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars: Record<string, string> = {};
envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        envVars[match[1].trim()] = match[2].trim();
    }
});

const supabase = createClient(
    envVars['NEXT_PUBLIC_SUPABASE_URL'],
    envVars['SUPABASE_SERVICE_ROLE_KEY']
);

async function main() {
    // 1. Get a user
    const { data: users, error: userError } = await supabase.auth.admin.listUsers();
    if (userError || !users.users.length) {
        console.error('No users found or error:', userError);
        return;
    }
    const userId = users.users[0].id;

    // 2. Insert result
    const { data, error } = await supabase
        .from('saved_results')
        .insert({
            user_id: userId,
            service_type: 'resume',
            original_content: 'Test Resume.pdf',
            analyzed_content: { analysis: 'Test analysis' },
            result_data: {
                human_score: 95,
                ai_probability: 5,
                verdict: 'Human',
                analysis: 'This is a verified human resume.',
                rewritten_text: 'Rewritten text content.'
            },
            is_public: true
        })
        .select('id')
        .single();

    if (error) {
        console.error('Error inserting result:', error);
    } else {
        console.log('Created Verification ID:', data.id);
    }
}

main();
