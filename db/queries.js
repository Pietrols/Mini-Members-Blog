const pool = require("./pool.js");

// Create new user
async function createUser(firstName, lastName, email, hashedPassword) {
  const result = await pool.query(
    `INSERT INTO users (first_name, last_name, email, password)
        VALUES($1, $2, $3, $4)
        RETURNING id, first_name, last_name, email, is_member, is_admin`,
    [firstName, lastName, email, hashedPassword]
  );
  return result.rows[0];
}

// find user by email (for login)
async function findUserByEmail(email) {
  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);
  return result.rows[0];
}

async function findUserById(id) {
  const result = await pool.query(
    `SELECT id, first_name, last_name, email, is_member, is_admin FROM users WHERE id=$1`,
    [id]
  );
  return result.row[0];
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
};
