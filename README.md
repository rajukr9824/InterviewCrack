# 🎯 InterviewCrack

**InterviewCrack** is an AI-powered interview preparation platform that helps candidates practice real interview questions, take topic-wise quizzes, learn core CS concepts, and prepare for project-based interviews.

---

## 🚀 Features

* 🔐 User authentication using JWT
* 🤖 AI-powered interview question generation and solutions
* 📚 Topic-wise learning modules — OS, DBMS, DSA, CN, OOPs, React, JavaScript
* 📝 Interview practice with difficulty selection
* 🧠 Quiz mode with MCQs and score tracking
* 👤 User profile with practice history
* 💬 **RepoChat** — chat with and ask questions about a GitHub repository using RAG
* 🎯 **Project Interview** — AI-powered project-specific mock interviews with follow-up questions and answer evaluation

---

## 🛠 Tech Stack

### Frontend

* React.js
* Tailwind CSS
* JavaScript

### Backend

* Node.js
* Express.js
* JWT Authentication

### AI Service

* FastAPI
* RAG
* FAISS
* Gemini Embeddings
* LLM-based question generation and evaluation

### Database

* MongoDB

---

## 🏗️ Architecture

```text
React.js
    ↓
Node.js / Express.js
    ↓
FastAPI AI Service
    ↓
RAG / FAISS / Gemini Embeddings / LLM
```

For **RepoChat**, repositories are parsed, chunked, embedded, and stored for semantic retrieval. Relevant code is retrieved using FAISS and provided to the LLM to generate grounded responses.

**Project Interview** uses repository context to generate project-specific questions, follow-ups, and answer evaluations through multi-turn interview sessions.

---

## 📂 Project Structure

```text
InterviewCrack/
│
├── client/        # React frontend
├── server/        # Node.js + Express backend
├── ai-service/    # FastAPI AI/RAG service
├── .gitignore
├── README.md
└── package.json
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/rajukr9824/InterviewCrack.git
cd InterviewCrack
```

### 2️⃣ Setup Backend

```bash
cd server
npm install
npm run dev
```

Create a `.env` file in `server/`:

```env
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key
```

### 3️⃣ Setup AI Service

```bash
cd ai-service
pip install -r requirements.txt
uvicorn main:app --reload
```

Configure the required AI/API keys in the AI service environment.

### 4️⃣ Setup Frontend

```bash
cd client
npm install
npm start
```

---

## 🎯 Use Case

InterviewCrack helps students and professionals:

* Practice technical interviews
* Strengthen CS fundamentals
* Understand and discuss their own codebase
* Prepare for project-based interview questions
* Receive AI-powered feedback on interview answers
* Track their preparation progress

---

## 🔮 Future Enhancements

* Company-specific interview preparation
* AI-powered resume review
* Voice-based mock interviews
* Advanced performance analytics
* Leaderboard

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repository and submit a pull request.

---

## 📬 Contact

**Raju Kumar**
📧 Email: [rajuk.ug22.cs@nitp.ac.in](mailto:rajuk.ug22.cs@nitp.ac.in)
🔗 GitHub: https://github.com/rajukr9824
