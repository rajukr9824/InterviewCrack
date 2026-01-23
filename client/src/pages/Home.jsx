import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">

     
     

      {/* Welcome Section */}
      <section className="text-center py-16 px-6">
        <h2 className="text-3xl font-bold mb-4">
          Welcome Back 👋
        </h2>
        {/* Weekly Study Routine */}
<section className="bg-white py-14 px-6">
  <div className="max-w-6xl mx-auto">
    <h3 className="text-2xl font-bold text-center mb-10">
      📅 Weekly Interview Preparation Routine
    </h3>

    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Monday */}
      <div className="border rounded-lg p-5">
        <h4 className="font-semibold mb-2">Monday</h4>
        <p className="text-sm">📘 Arrays + Binary Search + Greedy</p>
        <p className="text-sm text-gray-600">🧠 OOPs</p>
      </div>

      {/* Tuesday */}
      <div className="border rounded-lg p-5">
        <h4 className="font-semibold mb-2">Tuesday</h4>
        <p className="text-sm">
          📘 Strings + Sliding Window + LL + Stack + Queue
        </p>
        <p className="text-sm text-gray-600">🧠 Operating System</p>
      </div>

      {/* Wednesday */}
      <div className="border rounded-lg p-5">
        <h4 className="font-semibold mb-2">Wednesday</h4>
        <p className="text-sm">📘 Trees</p>
        <p className="text-sm text-gray-600">🧠 DBMS</p>
      </div>

      {/* Thursday */}
      <div className="border rounded-lg p-5">
        <h4 className="font-semibold mb-2">Thursday</h4>
        <p className="text-sm">📘 Graphs</p>
        <p className="text-sm text-gray-600">🧠 Computer Networks</p>
      </div>

      {/* Friday */}
      <div className="border rounded-lg p-5">
        <h4 className="font-semibold mb-2">Friday</h4>
        <p className="text-sm">📘 DP + Recursion + Backtracking</p>
        <p className="text-sm text-gray-600">⚛️ MERN Stack + Javascript Revision</p>
      </div>

      {/* Weekend */}
      <div className="border rounded-lg p-5 bg-gray-50">
        <h4 className="font-semibold mb-2">Saturday & Sunday</h4>
        <p className="text-sm">🚀 Project Development</p>
        <p className="text-sm text-gray-600">
           • Projects • Resume • Mock Interviews
        </p>
      </div>
    </div>
  </div>
</section>

        <p className="text-gray-600">
          Choose how you want to prepare for today’s interview practice.
        </p>
      </section>

      {/* Main Sections */}
      <section className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6 px-6 pb-20">

       

        {/* Learn Topics */}
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h3 className="text-lg font-semibold mb-2">
            📘 Learn Topics
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Revise important concepts with short explanations and more details.
          </p>
          
          <Link
            to="/learn"
            className="inline-block bg-black text-white px-4 py-2 rounded"
          >
            Start Learning
          </Link>
        </div>
         {/* Interview Practice */}
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h3 className="text-lg font-semibold mb-2">
            🎤 Interview Practice
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Practice 10 interview questions by topic and difficulty.
          </p>
          <Link
            to="/interview"
            className="inline-block bg-black text-white px-4 py-2 rounded"
          >
            Start Practice
          </Link>
        </div>

        {/* Quiz Section */}
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h3 className="text-lg font-semibold mb-2">
            📝 Quiz Practice
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Test your knowledge with 10 MCQs and instant scoring.
          </p>
          <Link
            to="/quiz"
            className="inline-block bg-black text-white px-4 py-2 rounded"
          >
            Take Quiz
          </Link>
        </div>

        {/* Daily Coding */}
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h3 className="text-lg font-semibold mb-2">
            💻 Daily Coding
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Solve one LeetCode problem daily by topic or randomly.
          </p>
          <Link
            to="/coding"
            className="inline-block bg-black text-white px-4 py-2 rounded"
          >
            Practice Now
          </Link>
        </div>
       
      </section>

      <section className="bg-white py-16 px-6">
  <div className="max-w-5xl mx-auto text-center">
    <h3 className="text-2xl font-bold mb-8">
      Interview Resources
    </h3>

    <div className="grid md:grid-cols-2 gap-6">
      <a
        href="https://drive.google.com/drive/folders/1mjj0crODYZ1ABbk7xNdvG87EsqvQiaNV?usp=drive_link"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gray-50 p-8 rounded-lg shadow hover:shadow-lg transition"
      >
        <h4 className="text-lg font-semibold mb-2">📂 Interview Material</h4>
        <p className="text-gray-600 text-sm">
          Notes, sheets, and important interview resources in one place.
        </p>
      </a>

      <a
        href="https://youtube.com/@raju_creative_world?si=8EANEFv5SiEGv9oS"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gray-50 p-8 rounded-lg shadow hover:shadow-lg transition"
      >
        <h4 className="text-lg font-semibold mb-2">▶️ InterviewCrack YouTube</h4>
        <p className="text-gray-600 text-sm">
          Real interview rounds, preparation strategy, and confidence tips.
        </p>
      </a>
    </div>
  </div>
</section>


      {/* How It Works */}
<section className="bg-white py-16 px-6">
  <div className="max-w-5xl mx-auto text-center">
    <h3 className="text-2xl font-bold mb-8">
      How InterviewCrack Works
    </h3>

    <div className="grid md:grid-cols-4 gap-6">
      <div className="p-6 border rounded-lg">
        <h4 className="font-semibold mb-2">1️⃣ Learn Concepts</h4>
        <p className="text-gray-600 text-sm">
          Revise key interview concepts with AI explanations.
          
        </p>
      </div>

      <div className="p-6 border rounded-lg">
        <h4 className="font-semibold mb-2">2️⃣ Choose Topic</h4>
        <p className="text-gray-600 text-sm">
          Select from core CS and frontend interview topics.
        </p>
      </div>

      <div className="p-6 border rounded-lg">
        <h4 className="font-semibold mb-2">3️⃣ Practice</h4>
        <p className="text-gray-600 text-sm">
          Answer real interview and quiz questions.
        </p>
      </div>

      <div className="p-6 border rounded-lg">
        <h4 className="font-semibold mb-2">4️⃣ Code Daily</h4>
        <p className="text-gray-600 text-sm">
          Build consistency with daily coding challenges.
        </p>
      </div>
    </div>
  </div>
</section>
{/* Why InterviewCrack */}
<section className="py-16 px-6 bg-gray-50">
  <div className="max-w-4xl mx-auto text-center">
    <h3 className="text-2xl font-bold mb-6">
      Why InterviewCrack?
    </h3>

    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded shadow">
        <h4 className="font-semibold mb-2">🎯 Interview-Focused</h4>
        <p className="text-gray-600 text-sm">
          Structured questions, fixed limits, and real interview patterns.
        </p>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h4 className="font-semibold mb-2">🧠 Smart Learning</h4>
        <p className="text-gray-600 text-sm">
          Learn → Practice → Revise → Code in one place.
        </p>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h4 className="font-semibold mb-2">⚡ No Distractions</h4>
        <p className="text-gray-600 text-sm">
          No long videos, no random content, only what matters.
        </p>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h4 className="font-semibold mb-2">🔒 Personalized</h4>
        <p className="text-gray-600 text-sm">
          Secure login and personalized practice flow.
        </p>
      </div>
    </div>
  </div>
</section>
{/* Bottom CTA */}
<section className="bg-black text-white text-center py-16 px-6">
  <h3 className="text-2xl font-bold mb-4">
    Stay Consistent. Crack Interviews.
  </h3>
  <p className="text-gray-300 mb-6">
    Practice a little every day and gain confidence.
  </p>
  <Link
    to="/coding"
    className="inline-block bg-white text-black px-6 py-3 rounded font-medium"
  >
    Start Today
  </Link>
</section>


    </div>
  );
}
