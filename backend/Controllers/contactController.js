import contactServices from '../Services/contactServices.js';

const sendMessage = async (req, res) => {
    try {
        const { user_id, doctor_id, sender_role, query } = req.body;
        if (!user_id || !doctor_id || !sender_role || !query) {
            return res.status(400).json({ error: 'All fields are required: user_id, doctor_id, sender_role, query' });
        }
        
        const insertId = await contactServices.sendMessage({ user_id, doctor_id, sender_role, query });
        res.status(201).json({ message: 'Message sent successfully', messageId: insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getConversationHistory = async (req, res) => {
    try {
        const { user_id, doctor_id } = req.query;
        if (!user_id || !doctor_id) {
            return res.status(400).json({ error: 'Query parameters user_id and doctor_id are required' });
        }
        
        const history = await contactServices.getConversationHistory(user_id, doctor_id);
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getDoctorQueries = async (req, res) => {
    try {
        const { doctor_id } = req.params;
        if (!doctor_id) {
            return res.status(400).json({ error: 'doctor_id path parameter is required' });
        }
        
        const queries = await contactServices.getDoctorQueries(doctor_id);
        res.status(200).json(queries);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default {
    sendMessage,
    getConversationHistory,
    getDoctorQueries
};
