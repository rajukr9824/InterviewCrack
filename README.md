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
API_KEY_ENCRYPTION_SECRET=generate-a-long-random-server-secret
AI_SERVICE_URL=http://127.0.0.1:8000
AI_SERVICE_INTERNAL_SECRET=generate-a-second-random-service-secret
```

`API_KEY_ENCRYPTION_SECRET` is used only by the Node.js backend to encrypt user
provider keys with AES-256-GCM before they are stored in MongoDB. Keep it
stable when deploying so existing keys remain decryptable. `AI_SERVICE_INTERNAL_SECRET`
authenticates private Node.js-to-FastAPI requests and must match the value used
by the AI service. Never commit either secret or a `.env` file.

### 3️⃣ Setup AI Service

```bash
cd ai-service
pip install -r requirements.txt
uvicorn main:app --reload
```

Configure the matching internal service secret in the AI service environment:

```env
AI_SERVICE_INTERNAL_SECRET=the-same-value-as-server
```

The AI service receives a user's decrypted Gemini key only over authenticated
internal requests and does not persist it. User requests that use the Node.js
AI features or RepoChat must first have a key configured in **Profile →
API Key Settings**.

### User API keys

From the profile page, users can independently save, replace, or remove their
Gemini and OpenAI keys. Keys are sent over HTTPS, encrypted at rest by the
backend, and never returned to the browser after saving. A Gemini key is
required for repository indexing, repository search, RepoChat, and Project
Interview because the current RAG service uses Gemini embeddings. The Node.js
interview, learning, and quiz features can use either saved provider and will
use OpenAI first when both are configured.

Repository indexes are stored under the authenticated user's owner directory,
so users indexing repositories with the same name do not share vectors. Each
index also records its Gemini embedding model and vector dimension; indexes
without compatible metadata must be rebuilt rather than reused.

Users can create keys from the provider dashboards:

* [Google AI Studio](https://aistudio.google.com/app/apikey)
* [OpenAI API keys](https://platform.openai.com/api-keys)

For Render, set `API_KEY_ENCRYPTION_SECRET`, `AI_SERVICE_INTERNAL_SECRET`,
`MONGO_URI`, and `JWT_SECRET` as backend secret environment variables. Set
`AI_SERVICE_INTERNAL_SECRET` on the FastAPI service as well. Use long,
independently generated random values and rotate them through a migration
process rather than deleting the old encryption secret without re-encrypting
stored keys.

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
