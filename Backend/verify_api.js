const axios = require('axios');

async function verifyApi() {
    try {
        console.log("Fetching sessions from http://localhost:5000/api/sessions?type=group_discussion");
        const res = await axios.get('http://localhost:5000/api/sessions?type=group_discussion');
        console.log("Status:", res.status);
        console.log("Data length:", res.data.length);
        if (res.data.length > 0) {
            console.log("First session:", JSON.stringify(res.data[0], null, 2));
        }
    } catch (err) {
        console.error("Error:", err.message);
        if (err.response) {
            console.error("Response data:", err.response.data);
        }
    }
}

verifyApi();
