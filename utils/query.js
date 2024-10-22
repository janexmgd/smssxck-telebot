import db from './database.js';

const checkIsExist = async (field, value) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM users WHERE ${field} = $1`;

    db.query(query, [value], (err, result) => {
      if (err) {
        console.error('Database query error:', err);
        return reject(err);
      }

      resolve(result);
    });
  });
};

const registUser = async (data) => {
  return new Promise((resolve, reject) => {
    const { telegram_id, api_key } = data;

    const query = `
      INSERT INTO users(tele_id, api_key)
      VALUES ($1, $2)
    `;

    const values = [telegram_id, api_key];

    db.query(query, values, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};
const updateApikey = async (api_key, telegram_id) => {
  const query = `
    UPDATE users
    SET api_key = $1
    WHERE tele_id = $2
  `;

  const values = [api_key, telegram_id];

  try {
    const result = await db.query(query, values);
    return result;
  } catch (err) {
    throw new Error(`Error updating API key: ${err.message}`);
  }
};
export { checkIsExist, registUser, updateApikey };
