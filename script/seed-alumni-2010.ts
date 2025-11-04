import { createClient } from '@supabase/supabase-js';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const BATCH_SIZE = 200;

async function main() {
  const file = path.join(process.cwd(), 'data-alumni-2010.json');
  const rows = JSON.parse(await readFile(file, 'utf8'));

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const chunk = rows.slice(i, i + BATCH_SIZE).map((row: any) => ({
      name: row.name,
      headline: row.headline,
      location: row.location,
      connections: row.connections,
      about: row.about,
      experiences: row.experiences ?? [],
      education: row.education ?? [],
      skills: row.skills ?? [],
      certifications: row.certifications ?? [],
      languages: row.languages ?? [],
      projects: row.projects ?? [],
      volunteer_experience: row.volunteer_experience ?? [],
      contact_info: row.contact_info ?? {},
      last_updated: row.last_updated ?? null,
    }));

    const { error } = await supabase.from('alumni').upsert(chunk, { onConflict: 'name' });
    if (error) throw error;
    console.log(`Inserted ${i + chunk.length}/${rows.length}`);
  }

  console.log('Import finished.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});