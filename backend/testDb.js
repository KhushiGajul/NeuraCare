import "dotenv/config";
import db from './Config/db.js';

db.promise().query('SELECT * FROM users')
  .then(([rows]) => {
    console.log("USERS IN DB:", rows);
    process.exit(0);
  })
  .catch(err => {
    console.error("DB ERROR:", err.message);
    process.exit(1);
  });
