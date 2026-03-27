# LearnTrackYT 🎓

A full-stack YouTube Learning Management System with AI-powered study assistance. Track your learning progress, generate smart summaries, and master YouTube content efficiently.

## ✨ Features

### 🔐 Authentication
- **Google OAuth 2.0** - Secure login with Google accounts
- **Profile Management** - Update username, view profile picture from Google
- **JWT-based Sessions** - Secure token-based authentication

### 📚 Playlist Management
- **Import YouTube Playlists** - Add playlists via URL or playlist ID
- **Progress Tracking** - Mark videos as completed, track completion percentage
- **Visual Progress Bars** - Real-time progress indicators for each playlist
- **Jump Back In** - Quick access to last watched videos
- **Mini Player** - Embedded YouTube player with controls

### 🤖 AI Learning Studio
- **Smart Summaries** - Generate AI-powered summaries from YouTube videos
  - 3 Summary Levels: Short, Medium, Detailed
  - Multi-language Support: English, Hindi, Telugu
  - Animated selector interface with smooth transitions
- **Practice Questions** - Automatically generate quiz questions from video content
- **Clarifications** - Get AI explanations for complex topics
- **Manual Text Processing** - Process transcript text or notes directly
- **PDF Export** - Download summaries as formatted PDFs
  - Video title as heading
  - Professional borders and justified text
  - Filename: `{video-title}-summary.pdf`

### 📊 Dashboard & Analytics
- **Personalized Dashboard** - View total courses and completion rates
- **Study Heatmap** - GitHub-style contribution heatmap showing daily study activity
- **Statistics** - Track completed courses, total courses, and progress
- **Motivation Quotes** - Daily inspiration to keep you motivated

### 📝 Notes System
- **Video Notes** - Take timestamp-based notes while watching videos
- **Notes Management** - View, edit, and organize notes per playlist

### 🎯 Profile & Achievements
- **User Profile** - View and edit profile information
- **Completed Playlists** - Track your learning achievements
- **Quiz Results** - View quiz performance history
- **Study Streak** - Visualize learning consistency

### 🎨 User Experience
- **Dark/Light Theme** - Toggle between dark and light modes
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Smooth Animations** - Framer Motion-powered transitions and interactions
- **Loading States** - Skeleton loaders for better perceived performance
- **Error Handling** - Graceful error messages and retry mechanisms

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **Lucide React** - Icon library
- **jsPDF** - PDF generation
- **@react-oauth/google** - Google OAuth integration

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Token-based authentication
- **google-auth-library** - Google OAuth verification
- **Groq API** - AI-powered text processing
- **YouTube Transcript API** - Fetch video transcripts
- **YouTube oEmbed API** - Fetch video metadata
- **Axios** - HTTP client
- **Helmet** - Security middleware
- **Morgan** - HTTP request logger
- **CORS** - Cross-origin resource sharing

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Google Cloud Console account (for OAuth credentials)
- Groq API key

### Environment Variables

Create `.env` files in both frontend and backend directories:

#### Backend `.env`
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GROQ_API_KEY=your_groq_api_key
PORT=5000
```

#### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/learntrack-yt.git
cd learntrack-yt
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

4. **Set up Google OAuth**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Configure the OAuth consent screen (choose user type, add app details, and save/publish)
   - Create OAuth 2.0 Client ID credentials (Application type: **Web application**)
   - Add authorized JavaScript origins:
     - `http://localhost:5173` (development)
     - Your production frontend URL
   - Copy the Client ID to your `.env` files

5. **Start the development servers**

Backend:
```bash
cd backend
npm start
```

Frontend (in a new terminal):
```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:5173`

## 📦 Production Deployment

### Frontend (Vercel)
1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `VITE_API_URL` - Your backend URL
   - `VITE_GOOGLE_CLIENT_ID` - Your Google Client ID
4. Deploy

### Backend (Render/Railway/Heroku)
1. Create a new web service
2. Connect your GitHub repository
3. Add environment variables
4. Deploy

### Google OAuth Setup for Production
- Add your production frontend URL to Google Console's Authorized JavaScript Origins
- Update backend CORS to include production frontend URL

## 🎮 Usage

1. **Sign In** - Click "Get Started" and sign in with your Google account
2. **Import Playlist** - Go to "My Courses" and paste a YouTube playlist URL
3. **Track Progress** - Click videos to mark as completed, watch progress bars update
4. **AI Learning** - Visit "AI Studio" to generate summaries and practice questions
5. **Take Notes** - Use the notes section while watching videos
6. **Download Summaries** - Export AI summaries as PDFs for offline study
7. **View Dashboard** - Check your study heatmap and statistics

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- YouTube API for video data
- Groq for AI capabilities
- Google OAuth for authentication
- All open-source libraries used in this project

---

Built with ❤️ for learners by learners
