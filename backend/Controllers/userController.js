import userServices from '../Services/userServices.js';

const signup = async (req, res) => {
    try {
        const userId = await userServices.signup(req.body);
        res.status(201).json({ message: 'User created successfully', userId });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        
        const user = await userServices.login(email, password);
        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        // Simple auth using 'user-id' header as requested
        const userIdHeader = req.headers['user-id'];
        if (!userIdHeader) {
            return res.status(401).json({ error: 'Unauthorized: missing user-id header' });
        }
        
        await userServices.updateProfile(userIdHeader, req.body);
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getUserByID = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await userServices.getUserByID(userId);
        res.status(200).json(user);
    } catch (error) {
        if (error.message === 'User not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

export default { signup, login, updateProfile, getUserByID };
