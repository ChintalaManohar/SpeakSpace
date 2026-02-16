const axios = require('axios');

const API_URL = 'http://localhost:5000/api/auth';

const testAuth = async () => {
    try {
        console.log('--- Testing Registration ---');
        const uniqueEmail = `test${Date.now()}@example.com`;
        const registerRes = await axios.post(`${API_URL}/register`, {
            name: 'Test User',
            email: uniqueEmail,
            password: 'password123'
        });
        console.log('Registration Success:', registerRes.data);

        console.log('\n--- Testing Login ---');
        const loginRes = await axios.post(`${API_URL}/login`, {
            email: uniqueEmail,
            password: 'password123'
        });
        console.log('Login Success, Token received:', loginRes.data.token ? 'Yes' : 'No');

        const token = loginRes.data.token;

        console.log('\n--- Testing Protected Route ---');
        const profileRes = await axios.get(`${API_URL}/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log('Protected Route Access Success:', profileRes.data);

        console.log('\n--- Verified Successfully ---');

    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.error('Verification Failed: Server is not running or not accessible at ' + API_URL);
            console.error('Make sure to run "npm run dev" in the backend directory.');
        } else {
            console.error('Verification Failed:', error.response ? error.response.data : error.message);
            // console.error('Full Error:', error);
        }
    }
};

testAuth();
