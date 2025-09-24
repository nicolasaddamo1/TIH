import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL!, {
  ssl: { rejectUnauthorized: false },
});

(async () => {
  try {
    const res = await sql`select now()`;
    console.log('DB Connected:', res);
  } catch (err) {
    console.error('Connection failed:', err);
  }
})();
