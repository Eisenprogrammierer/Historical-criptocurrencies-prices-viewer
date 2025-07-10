import db from '~/server/db';


export default defineEventHandler(async (event) => {
  const { period = '24h' } = getQuery(event);
  
  const data = await db.query(`SELECT * FROM prices WHERE timestamp >= NOW() - INTERVAL '${period}' ORDER BY timestamp DESC`);

  return { data };
});
