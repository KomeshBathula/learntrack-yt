require('dotenv').config();
const OpenAI = require("openai");

async function testGroq() {
    console.log("--- GROQ CONNECTION TEST (RETRY) ---");
    const key = process.env.GROQ_API_KEY;

    const openai = new OpenAI({
        apiKey: key,
        baseURL: "https://api.groq.com/openai/v1",
    });

    try {
        console.log("⏳ Sending test request to Groq (Model: llama-3.3-70b-versatile)...");
        const completion = await openai.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "user", content: "Say 'Success'!" }
            ],
        });
        console.log("✅ SUCCESS! Response:");
        console.log(completion.choices[0].message.content);
    } catch (error) {
        console.error("❌ REQUEST FAILED:", error);
    }
}

testGroq();
