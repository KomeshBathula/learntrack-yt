const Groq = require('groq-sdk');
require('dotenv').config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

class QuestionService {
    static async generateQuestions(transcript, count = 10, language = 'en') {
        try {
            const langPrompt = language === 'hi' ? "Generate questions in Hindi-English mixed (Hinglish)." :
                language === 'te' ? "Generate questions in Telugu." : "Generate questions in English.";

            const completion = await groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You are a teacher creating a quiz from a video transcript. ${langPrompt}
                        Generate a valid JSON array of question objects.
                        Rules:
                        1. Output ONLY valid JSON. No markdown, no "Here is the JSON", no backticks.
                        2. Array format: [{"question": "...", "options": ["A", "B", "C", "D"], "answer": "A", "type": "MCQ", "difficulty": "Medium"}]
                        3. Ensure "answer" matches one of the "options" exactly.
                        4. Create 5 questions.`
                    },
                    {
                        role: "user",
                        content: `Generate 5 MCQ questions based on this text:\n\n${transcript.substring(0, 15000)}`
                    }
                ],
                model: "llama-3.3-70b-versatile",
                temperature: 0.1, // Lower temperature means more deterministic
            });

            let content = completion.choices[0]?.message?.content || "[]";

            // Robust cleaning
            const jsonStart = content.indexOf('[');
            const jsonEnd = content.lastIndexOf(']') + 1;

            if (jsonStart !== -1 && jsonEnd !== -1) {
                content = content.substring(jsonStart, jsonEnd);
            }

            try {
                const parsed = JSON.parse(content);
                // Basic validation
                return Array.isArray(parsed) ? parsed : [];
            } catch (e) {
                console.error("JSON Parse Error in Questions:", e);
                return [];
            }
        } catch (error) {
            console.error("Question Generation Error:", error);
            return [];
        }
    }
}

module.exports = QuestionService;
