const axios = require('axios');

async function checkSessions() {
    try {
        const res = await axios.get('http://localhost:5000/api/sessions');
        console.log('Sessions:', res.data);
    } catch (err) {
        console.error('Error:', err.message);
    }
}

checkSessions();
