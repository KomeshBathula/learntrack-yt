const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: [
        "https://learntrack-yt.vercel.app",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));

// Database Connection
// Database Connection with Retry
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { family: 4 });
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('MongoDB Connection Error:', err.message);
        console.log('Retrying connection in 5 seconds...');
        setTimeout(connectDB, 5000);
    }
};

connectDB();

// Routes (Placeholders for now)
app.get('/', (req, res) => {
    res.send('LearnTrackYT API is running...');
});

app.get('/api/test', (req, res) => res.send('API WORKS'));

// Import Routes
const authRoutes = require('./routes/authRoutes');
const playlistRoutes = require('./routes/playlistRoutes');
const progressRoutes = require('./routes/progressRoutes');
const noteRoutes = require('./routes/noteRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/ai-studio', require('./ai/ai.routes'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
