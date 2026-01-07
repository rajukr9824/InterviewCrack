import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Interview from "./pages/Interview";
import LearnTopics from "./pages/LearnTopics";
import QuizTopic from "./pages/QuizTopic";
import QuizPractice from "./pages/QuizPractice";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import InterviewPractice from "./pages/InterviewPractice";
import Coding from "./pages/Coding";
import CodingPractice from "./pages/CodingPractice";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/interview" element={<Interview />} />
            <Route path="/interview-practice" element={<InterviewPractice />} />
            <Route path="/learn" element={<LearnTopics />} />
            <Route path="/quiz" element={<QuizTopic />} />
            <Route path="/quiz-practice" element={<QuizPractice />} />
            <Route path="/coding" element={<Coding />} />
            <Route path="/coding-practice" element={<CodingPractice />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
