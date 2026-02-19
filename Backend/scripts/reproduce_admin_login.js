const axios = require('axios');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file in Backend root
dotenv.config({ path: path.join(__dirname, '../.env') });

const API_URL = 'http://localhost:5000/api';

const testAdminLogin = async () => {
    console.log('Testing Admin Login...');
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
        console.error('ADMIN_EMAIL or ADMIN_PASSWORD not set in .env');
        return;
    }

    try {
        // 1. Login
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email,
            password,
            isAdmin: true
        });

        console.log('Admin Login Successful');
        const token = loginRes.data.token;
        console.log('Token received:', token ? 'Yes' : 'No');

        if (!token) {
            console.error('No token received!');
            return;
        }

        // 2. Fetch Users (Protected Admin Route)
        console.log('Fetching Users...');
        const usersRes = await axios.get(`${API_URL}/admin/users`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log('Fetch Users Successful');
        console.log('Users found:', usersRes.data.length);
        console.log('First user (if any):', usersRes.data[0]);

    } catch (error) {
        console.error('Test Failed!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
};

testAdminLogin();
