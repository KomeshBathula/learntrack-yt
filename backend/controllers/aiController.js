const OpenAI = require("openai");

exports.chatWithGrok = async (req, res) => {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ message: "Messages array is required" });
    }

    // Check for API Key
    if (!process.env.GROQ_API_KEY) {
        return res.json({
            role: "assistant",
            content: "⚠️ Configuration Error: `GROQ_API_KEY` is missing in the backend `.env` file. Please add your Groq API key (starts with gsk_...) to use the chat features."
        });
    }

    try {
        const openai = new OpenAI({
            apiKey: process.env.GROQ_API_KEY,
            baseURL: "https://api.groq.com/openai/v1",
        });

        const completion = await openai.chat.completions.create({
            model: "llama-3.1-8b-instant", // Switch to faster model for chat as well
            messages: [
                { role: "system", content: "You are a helpful YouTube learning assistant. You help users understand video content, answer questions about their playlists, and provide study tips. Keep answers concise and encouraging." },
                ...messages
            ],
        });

        res.json(completion.choices[0].message);
    } catch (error) {
        console.error("Groq API Error:", error);

        let errorMessage = "Failed to communicate with AI service.";
        if (error.status === 401) {
            errorMessage = "⚠️ Invalid API Key. Please check your `GROQ_API_KEY` in `.env`.";
        } else if (error.error && error.error.message) {
            errorMessage = `Error: ${error.error.message}`;
        }

        res.json({
            role: "assistant",
            content: errorMessage
        });
    }
};
