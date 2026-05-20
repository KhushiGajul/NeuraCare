import doctorServices from '../Services/doctorServices.js';

const allDoctors = async (req, res) => {
    try {
        const doctors = await doctorServices.allDoctors();
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getDoctorByID = async (req, res) => {
    try {
        const doctorID = req.params.id;
        const doctors = await doctorServices.getDoctorByID(doctorID);
        if (doctors.length === 0) {
            return res.status(404).json({ error: 'Doctor not found' });
        }
        const { password, ...doctorWithoutPassword } = doctors[0];
        res.status(200).json(doctorWithoutPassword);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        
        const doctor = await doctorServices.loginDoctor(email, password);
        res.status(200).json({ message: 'Login successful', doctor });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

const signupDoctor = async (req, res) => {
    try {
        const doctorId = await doctorServices.signupDoctor(req.body);
        res.status(201).json({ message: 'Doctor created successfully', doctorId });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export default { allDoctors, getDoctorByID, loginDoctor, signupDoctor };
