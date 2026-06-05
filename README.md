# 🎓 English Learning Assistant for Telugu Students

A full-stack web platform helping Telugu-medium government school students (Class 5–10) learn English through pronunciation guides, grammar lessons, interactive quizzes, vocabulary building, and a gamified dashboard.

---

## 📁 Project Structure

```
telugu-english-app/
├── backend/                  ← Node.js + Express + MongoDB API
│   ├── config/
│   │   └── db.js             ← MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── lessonController.js
│   │   ├── quizController.js
│   │   ├── progressController.js
│   │   ├── vocabularyController.js
│   │   ├── userController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── authMiddleware.js  ← JWT protect + role guard
│   │   ├── errorMiddleware.js
│   │   └── validationMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Lesson.js
│   │   ├── Quiz.js
│   │   ├── Progress.js
│   │   └── Vocabulary.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── lessonRoutes.js
│   │   ├── quizRoutes.js
│   │   ├── progressRoutes.js
│   │   ├── vocabularyRoutes.js
│   │   ├── userRoutes.js
│   │   └── adminRoutes.js
│   ├── utils/
│   │   ├── tokenUtils.js
│   │   └── responseUtils.js
│   ├── data/
│   │   └── seeder.js          ← Seed/destroy sample data
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js              ← Entry point
│
└── frontend/                  ← React + Vite + Tailwind CSS
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── common/
    │   │   │   └── index.jsx  ← Spinner, Badge, Card, etc.
    │   │   └── layout/
    │   │       ├── Navbar.jsx
    │   │       └── Footer.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx ← Global auth state
    │   ├── hooks/
    │   │   └── useApi.js       ← useFetch, useQuiz, useVocabulary…
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── PronunciationPage.jsx
    │   │   ├── GrammarPage.jsx
    │   │   ├── QuizPage.jsx
    │   │   ├── VocabPage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   ├── DailyPage.jsx
    │   │   ├── LeaderboardPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   └── AdminPage.jsx
    │   ├── utils/
    │   │   └── api.js          ← Axios instance with JWT interceptor
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .env.example
    ├── .env                    ← Local dev env (not committed)
    ├── .gitignore
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    └── vite.config.js
```

---

## ✅ Prerequisites

Make sure the following are installed on your machine:

| Tool       | Version   | Download |
|------------|-----------|----------|
| Node.js    | 18+       | https://nodejs.org |
| npm        | 9+        | (comes with Node) |
| MongoDB    | 6+        | https://www.mongodb.com/try/download/community |
| Git        | any       | https://git-scm.com |

> **Tip:** You can also use [MongoDB Atlas](https://www.mongodb.com/atlas) (free cloud MongoDB) instead of installing locally.

---

## 🚀 Step-by-Step Local Setup

### Step 1 — Clone / Download the project

If you downloaded as a ZIP, extract it. Otherwise:

```bash
git clone https://github.com/your-username/telugu-english-app.git
cd telugu-english-app
```

---

### Step 2 — Set up the Backend

```bash
cd backend
```

**2a. Install dependencies**

```bash
npm install
```

**2b. Create environment file**

Copy the example file and edit it:

```bash
cp .env.example .env
```

Open `.env` and update the values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/telugu_english_db
JWT_SECRET=replace_this_with_a_long_random_secret_string
JWT_EXPIRE=30d
NODE_ENV=development
ADMIN_EMAIL=admin@teluguenglish.com
ADMIN_PASSWORD=Admin@123
```

> **Using MongoDB Atlas?** Replace `MONGO_URI` with your Atlas connection string:
> `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/telugu_english_db`

**2c. Start MongoDB (local only)**

```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Ubuntu / Debian
sudo systemctl start mongod

# Windows — open Services and start "MongoDB"
# OR run: net start MongoDB
```

**2d. Seed the database with sample data**

```bash
npm run seed
```

This creates:
- 1 Admin account
- 3 Sample student accounts
- 5 Grammar/tense/article lessons
- 12 Quiz questions
- 18 Vocabulary words

Output will show:
```
✅ Seeded: 4 users, 5 lessons, 12 quizzes, 18 vocabulary words

🔑 Admin login:
   Email:    admin@teluguenglish.com
   Password: Admin@123

👩‍🎓 Sample student login:
   Email:    priya@student.com
   Password: Student@123
```

**2e. Start the backend server**

```bash
# Development mode (auto-restarts on file changes)
npm run dev

# OR production mode
npm start
```

You should see:
```
✅ MongoDB Connected: localhost
🚀 Server running in development mode on port 5000
📚 Telugu-English Learning Platform API
```

Test it at: http://localhost:5000/api/health

---

### Step 3 — Set up the Frontend

Open a **new terminal** window:

```bash
cd frontend
```

**3a. Install dependencies**

```bash
npm install
```

**3b. Create environment file**

```bash
cp .env.example .env
```

The default `.env` content works for local development:

```env
VITE_API_URL=http://localhost:5000/api
```

**3c. Start the frontend development server**

```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in 500ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

Open **http://localhost:5173** in your browser. 🎉

---

## 🔑 Login Credentials (after seeding)

| Role    | Email                        | Password     |
|---------|------------------------------|--------------|
| Admin   | admin@teluguenglish.com      | Admin@123    |
| Student | priya@student.com            | Student@123  |
| Student | ravi@student.com             | Student@123  |
| Student | anitha@student.com           | Student@123  |

---

## 🗺️ Application Routes

### Public Pages (no login needed)

| URL              | Page                    |
|------------------|-------------------------|
| `/`              | Home / Landing page     |
| `/pronunciation` | Pronunciation module    |
| `/grammar`       | Grammar lessons         |
| `/quiz`          | Interactive quiz        |
| `/vocabulary`    | Vocabulary builder      |
| `/leaderboard`   | Student leaderboard     |
| `/login`         | Student login           |
| `/register`      | Student registration    |

### Protected Pages (login required)

| URL          | Page                    |
|--------------|-------------------------|
| `/daily`     | Daily practice goals    |
| `/dashboard` | Student dashboard       |

### Admin Only

| URL      | Page                               |
|----------|------------------------------------|
| `/admin` | Admin panel (stats, students, etc) |

---

## 🌐 API Endpoints Reference

### Authentication
```
POST /api/auth/register        Register new student
POST /api/auth/login           Student login
POST /api/auth/admin/login     Admin login
GET  /api/auth/me              Get current user (auth required)
PUT  /api/auth/profile         Update profile (auth required)
PUT  /api/auth/change-password Change password (auth required)
```

### Lessons
```
GET    /api/lessons                  List all lessons
GET    /api/lessons/:id              Get single lesson
POST   /api/lessons/:id/complete     Mark lesson complete (auth)
POST   /api/lessons/:id/bookmark     Bookmark/unbookmark (auth)
POST   /api/lessons                  Create lesson (admin)
PUT    /api/lessons/:id              Update lesson (admin)
DELETE /api/lessons/:id              Delete lesson (admin)
```

### Quizzes
```
GET  /api/quizzes               List quizzes (filters: category, difficulty)
GET  /api/quizzes/random        Get random quiz set (?count=10&category=grammar)
POST /api/quizzes/:id/answer    Submit single answer
POST /api/quizzes/session/submit Submit full quiz session
POST /api/quizzes               Create question (admin)
PUT  /api/quizzes/:id           Update question (admin)
DELETE /api/quizzes/:id         Delete question (admin)
```

### Vocabulary
```
GET  /api/vocabulary            List vocabulary (?search=&category=&difficulty=)
GET  /api/vocabulary/daily      Get 5 random daily words
POST /api/vocabulary/:id/learned  Mark word as learned (auth)
POST /api/vocabulary            Add word (admin)
PUT  /api/vocabulary/:id        Update word (admin)
DELETE /api/vocabulary/:id      Delete word (admin)
```

### Progress (auth required)
```
GET  /api/progress/today        Today's progress
GET  /api/progress/weekly       Last 7 days chart data
GET  /api/progress/summary      Full dashboard summary
POST /api/progress/pronunciation Log pronunciation session
```

### Users & Leaderboard
```
GET /api/users/leaderboard      Top 20 students by points
GET /api/users/bookmarks        My bookmarked lessons (auth)
```

### Admin (admin role required)
```
GET /api/admin/stats                    Platform statistics
GET /api/admin/students                 All students (paginated)
GET /api/admin/students/:id             Student detail + progress
PUT /api/admin/students/:id/toggle-status Activate/deactivate student
GET /api/admin/leaderboard              Admin leaderboard view
```

---

## 🗄️ Database Models

### User
```js
{ name, email, password, school, class, role,
  totalPoints, streak: { current, longest, lastActive },
  badges, bookmarks, isActive, createdAt }
```

### Lesson
```js
{ title, slug, category, subcategory, level,
  content: { definition, teluguExplanation, examples[], practiceQuestions[], tips[] },
  order, isPublished, viewCount, completedBy[], tags[], estimatedTime }
```

### Quiz
```js
{ question, questionTelugu, type, options[], correctAnswer,
  explanation, explanationTelugu, category, difficulty,
  points, timesAnswered, timesCorrect }
```

### Progress
```js
{ user, date, lessonsCompleted[], quizAttempts[], pronunciationSessions[],
  dailyStats: { lessonsCount, quizzesCount, quizScore, pronunciationCount,
                pronunciationAvg, pointsEarned, timeSpent } }
```

### Vocabulary
```js
{ word, meaning, phonetic, pronunciation, exampleSentence, exampleTelugu,
  category, difficulty, synonyms[], antonyms[], learnedBy[] }
```

---

## 📦 Building for Production

### Backend
```bash
cd backend
NODE_ENV=production npm start
```

### Frontend
```bash
cd frontend
npm run build
# Output is in frontend/dist/ — deploy to Nginx, Vercel, Netlify, etc.
```

### Frontend + Backend on same server (Nginx example)
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Serve React build
    location / {
        root /var/www/telugu-english/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API calls to Node
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 🔧 Troubleshooting

### "MongoDB connection refused"
- Make sure MongoDB service is running: `sudo systemctl status mongod`
- Check that `MONGO_URI` in `.env` is correct

### "Port 5000 already in use"
```bash
# Find the process using port 5000
lsof -i :5000
# Kill it
kill -9 <PID>
# Or change PORT in backend/.env
```

### "CORS error" in browser
- Make sure `CLIENT_URL` in backend `.env` matches your frontend URL
- Default allows `http://localhost:5173`

### Frontend shows blank page
- Run `npm install` in the `frontend/` folder
- Check browser console for errors
- Make sure `VITE_API_URL` in `frontend/.env` points to the running backend

### Seeder fails
- Confirm MongoDB is running
- Check `MONGO_URI` in `backend/.env`
- Run from inside the `backend/` folder: `npm run seed`

### To reset / destroy all seeded data
```bash
cd backend
node data/seeder.js -d
```

---

## 🛠️ Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS, Framer Motion |
| Routing    | React Router v6                         |
| HTTP       | Axios                                   |
| Charts     | Chart.js + react-chartjs-2              |
| Icons      | Lucide React                            |
| Toasts     | react-hot-toast                         |
| Backend    | Node.js, Express.js                     |
| Database   | MongoDB, Mongoose                       |
| Auth       | JWT (jsonwebtoken), bcryptjs            |
| Security   | Helmet, CORS, express-rate-limit        |
| Validation | express-validator                       |
| Speech     | Web Speech API (browser-native)         |
| TTS        | SpeechSynthesis API (browser-native)    |

---

## 👨‍💻 Development Tips

- **Add new quiz questions:** Edit `backend/data/seeder.js` and re-run `npm run seed`
- **Add grammar topics:** Add to the `lessons` array in `seeder.js`
- **Change admin email/password:** Update `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `backend/.env`
- **Hot reloading:** Both `npm run dev` (backend) and `npm run dev` (frontend) support hot reload
- **API testing:** Use Postman or Thunder Client (VS Code extension)

---

## 📄 License

Free to use for educational purposes. Made with ❤️ for Telugu students.
