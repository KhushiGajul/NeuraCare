import db from '../Config/db.js';

const sendMessage = async (data) => {
    const { user_id, doctor_id, sender_role, query } = data;
    
    // Insert new message
    const [result] = await db.promise().query(
        'INSERT INTO contacts (user_id, doctor_id, sender_role, query, status) VALUES (?, ?, ?, ?, ?)',
        [user_id, doctor_id, sender_role, query, sender_role === 'doctor' ? 'replied' : 'pending']
    );

    // If a doctor is replying, mark all previous pending queries from this user as replied
    if (sender_role === 'doctor') {
        await db.promise().query(
            'UPDATE contacts SET status = "replied" WHERE user_id = ? AND doctor_id = ? AND sender_role = "user" AND status = "pending"',
            [user_id, doctor_id]
        );
    }

    return result.insertId;
};

const getConversationHistory = async (user_id, doctor_id) => {
    const [rows] = await db.promise().query(
        'SELECT * FROM contacts WHERE user_id = ? AND doctor_id = ? ORDER BY created_at ASC',
        [user_id, doctor_id]
    );
    return rows;
};

const getDoctorQueries = async (doctor_id) => {
    // Select all contact logs joined with user details so doctors can see who they are chatting with
    const [rows] = await db.promise().query(
        `SELECT c.*, u.name AS user_name, u.profile_img AS user_profile_img 
         FROM contacts c 
         JOIN users u ON c.user_id = u.id 
         WHERE c.doctor_id = ? 
         ORDER BY c.created_at DESC`,
        [doctor_id]
    );
    return rows;
};

export default {
    sendMessage,
    getConversationHistory,
    getDoctorQueries
};
