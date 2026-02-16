const axios = require('axios');

async function verifyNewSessions() {
    try {
        console.log("Checking for Group Discussions...");
        const resGroup = await axios.get('http://localhost:5000/api/sessions?type=group_discussion');
        console.log(`Group Discussions found: ${resGroup.data.length}`);
        if (resGroup.data.length > 0) {
            console.log("Sample:", JSON.stringify(resGroup.data[0], null, 2));
        }

        console.log("\nChecking for Debates...");
        const resDebate = await axios.get('http://localhost:5000/api/sessions?type=debate');
        console.log(`Debates found: ${resDebate.data.length}`);

    } catch (err) {
        console.error("Error fetching sessions:", err.message);
    }
}

verifyNewSessions();
