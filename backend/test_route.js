const axios = require('axios');

const checkAi = async () => {
    try {
        console.log('Testing /api/ai/test ...');
        const res = await axios.get('http://localhost:5000/api/ai/test');
        console.log('Response:', res.data);
    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) console.error('Status:', error.response.status);
    }
};

checkAi();
