const pool = require("./pool");

// User queries
async function createUser(firstName, lastName, email, hashedPassword, isAdmin) {
  const result = await pool.query(
    `INSERT INTO users (first_name, last_name, email, password, is_admin) 
     VALUES ($1, $2, $3, $4) 
     RETURNING id, first_name, last_name, email, is_member, is_admin`,
    [firstName, lastName, email, hashedPassword, isAdmin]
  );
  return result.rows[0];
}

async function findUserByEmail(email) {
  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);
  return result.rows[0];
}

async function findUserById(id) {
  const result = await pool.query(
    `SELECT id, first_name, last_name, email, is_member, is_admin 
     FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0];
}

async function updateUserMemberStatus(userId, isMember) {
  const result = await pool.query(
    `UPDATE users SET is_member = $1 WHERE id = $2 
     RETURNING id, first_name, last_name, email, is_member, is_admin`,
    [isMember, userId]
  );
  return result.rows[0];
}

async function updateUserAdminStatus(userId, isAdmin) {
  const result = await pool.query(
    `UPDATE users SET is_admin = $1 WHERE id = $2 
     RETURNING id, first_name, last_name, email, is_member, is_admin`,
    [isAdmin, userId]
  );
  return result.rows[0];
}

// Message queries
async function createMessage(title, text, userId) {
  const result = await pool.query(
    `INSERT INTO messages (title, text, user_id) 
     VALUES ($1, $2, $3) 
     RETURNING id, title, text, user_id, created_at`,
    [title, text, userId]
  );
  return result.rows[0];
}

async function getAllMessages() {
  const result = await pool.query(
    `SELECT 
      messages.id, 
      messages.title, 
      messages.text, 
      messages.created_at,
      users.first_name,
      users.last_name,
      users.id as user_id
     FROM messages 
     JOIN users ON messages.user_id = users.id
     ORDER BY messages.created_at DESC`
  );
  return result.rows;
}

async function deleteMessage(messageId) {
  const result = await pool.query(
    `DELETE FROM messages WHERE id = $1 RETURNING id`,
    [messageId]
  );
  return result.rows[0];
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserMemberStatus,
  updateUserAdminStatus,
  createMessage,
  getAllMessages,
  deleteMessage,
};
