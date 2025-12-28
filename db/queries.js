const pool = require("./pool");

// Create a new user
async function createUser(firstName, lastName, email, hashedPassword) {
  try {
    const result = await pool.query(
      `INSERT INTO users (first_name, last_name, email, password) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, first_name, last_name, email, is_member, is_admin`,
      [firstName, lastName, email, hashedPassword]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Error in createUser:", err);
    throw err;
  }
}

// Find user by email
async function findUserByEmail(email) {
  try {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);
    return result.rows[0]; // Will be undefined if no user found
  } catch (err) {
    console.error("Error in findUserByEmail:", err);
    throw err;
  }
}

// Find user by ID
async function findUserById(id) {
  try {
    console.log("Finding user by ID:", id); // Debug log
    const result = await pool.query(
      `SELECT id, first_name, last_name, email, is_member, is_admin 
       FROM users WHERE id = $1`,
      [id]
    );
    console.log("Query result:", result.rows); // Debug log

    if (!result || !result.rows) {
      console.error("Query returned invalid result:", result);
      return null;
    }

    return result.rows[0] || null; // Return null instead of undefined
  } catch (err) {
    console.error("Error in findUserById:", err);
    throw err;
  }
}

// Update user to member status
async function updateUserMemberStatus(userId, isMember) {
  try {
    const result = await pool.query(
      `UPDATE users SET is_member = $1 WHERE id = $2 
       RETURNING id, first_name, last_name, email, is_member, is_admin`,
      [isMember, userId]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Error in updateUserMemberStatus:", err);
    throw err;
  }
}

// Update user to admin status
async function updateUserAdminStatus(userId, isAdmin) {
  try {
    const result = await pool.query(
      `UPDATE users SET is_admin = $1 WHERE id = $2 
       RETURNING id, first_name, last_name, email, is_member, is_admin`,
      [isAdmin, userId]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Error in updateUserAdminStatus:", err);
    throw err;
  }
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserMemberStatus,
  updateUserAdminStatus,
};
