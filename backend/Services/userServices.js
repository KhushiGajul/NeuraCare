import db from '../Config/db.js';
import bcrypt from 'bcrypt';

const signup = async (userData) => {
    const { name, email, password, weight, height } = userData;
    
    // Check if user exists
    const [existing] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
        throw new Error('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await db.promise().query(
        'INSERT INTO users (name, email, password, weight, height) VALUES (?, ?, ?, ?, ?)',
        [name, email, hashedPassword, weight || null, height || null]
    );

    return result.insertId;
};

const login = async (email, password) => {
    let [users] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    let account = null;
    let type = 'user';

    if (users.length > 0) {
        account = users[0];
    } else {
        const [doctors] = await db.promise().query('SELECT * FROM doctors WHERE email = ?', [email]);
        if (doctors.length > 0) {
            account = doctors[0];
            type = 'doctor';
        }
    }

    if (!account) {
        throw new Error('Invalid credentials');
    }

    if (type === 'user' && account.account_status === 'inactive') {
        throw new Error('Account is inactive');
    }

    let isMatch = false;
    try {
        isMatch = await bcrypt.compare(password, account.password);
    } catch (e) {
        isMatch = (password === account.password);
    }
    if (!isMatch) {
        isMatch = (password === account.password);
    }

    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    const { password: _, ...accountWithoutPassword } = account;
    return { ...accountWithoutPassword, role: account.role || type };
};

const updateProfile = async (userId, updateData) => {
    const { name, weight, height, profile_img, tags } = updateData;
    
    // Ensure tags is stringified for JSON column if it's an array
    const tagsJson = tags ? (typeof tags === 'string' ? tags : JSON.stringify(tags)) : '[]';

    const [result] = await db.promise().query(
        'UPDATE users SET name = ?, weight = ?, height = ?, profile_img = ?, tags = ? WHERE id = ?',
        [name, weight, height, profile_img, tagsJson, userId]
    );

    if (result.affectedRows === 0) {
        throw new Error('User not found');
    }

    return true;
};

const getUserByID = async (userId) => {
    const [users] = await db.promise().query('SELECT * FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
        throw new Error('User not found');
    }

    const user = users[0];
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

const updatePassword = async (email, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const [result] = await db.promise().query(
        'UPDATE users SET password = ? WHERE email = ?',
        [hashedPassword, email]
    );
    if (result.affectedRows === 0) {
        throw new Error('User not found');
    }
    return true;
};

export default { signup, login, updateProfile, getUserByID, updatePassword };