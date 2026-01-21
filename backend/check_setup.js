require('dotenv').config();
const axios = require('axios');

console.log('--- DIAGNOSTICS ---');

// 1. Check Env Vars
if (process.env.GROK_API_KEY) {
    console.log('✅ GROK_API_KEY is found (Length: ' + process.env.GROK_API_KEY.length + ')');
} else {
    console.log('❌ GROK_API_KEY is MISSING in .env');
}

if (process.env.MONGO_URI) {
    console.log('✅ MONGO_URI is found');
} else {
    console.log('❌ MONGO_URI is MISSING');
}

// 2. Check Server Reachability (Assumes running on 5000)
const checkServer = async () => {
    try {
        const res = await axios.get('http://localhost:5000/api/test');
        console.log('✅ Backend is RUNNING and reachable: ' + res.data);
    } catch (e) {
        console.log('❌ Backend is NOT reachable on port 5000. Error: ' + e.message);
    }
};

checkServer();
