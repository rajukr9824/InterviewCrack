import { useState } from "react";
import {
  indexRepository,
  chatRepository,
  startRepositoryInterview,
  submitRepositoryInterviewAnswer,
  endRepositoryInterview,
} from "../services/repositoryApi";

export default function RepositoryAI() {
  // Page mode state: 'connect' | 'ready' | 'chat' | 'interview-intro' | 'interview-question' | 'interview-eval'
  const [mode, setMode] = useState("connect");

  // Ingestion state
  const [repoUrl, setRepoUrl] = useState("");
  const [repoName, setRepoName] = useState("");
  const [indexing, setIndexing] = useState(false);
  const [indexError, setIndexError] = useState("");
  const [indexSuccessInfo, setIndexSuccessInfo] = useState(null);

  // Chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState("");

  // Interview state
  const [difficulty, setDifficulty] = useState("medium");
  const [sessionId, setSessionId] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [answerInput, setAnswerInput] = useState("");
  const [interviewLoading, setInterviewLoading] = useState(false);
  const [interviewError, setInterviewError] = useState("");
  const [questionCount, setQuestionCount] = useState(1);
  const [evalResult, setEvalResult] = useState(null);
  // Per-question feedback shown after each answer
  const [lastAnswerEval, setLastAnswerEval] = useState(null);
  // Whether we are waiting for the final evaluation after the last question
  const [endingInterview, setEndingInterview] = useState(false);

  // 1. Ingest Repository URL
  const handleConnect = async (e) => {
    e.preventDefault();
    if (!repoUrl) return;

    setIndexing(true);
    setIndexError("");
    setIndexSuccessInfo(null);

    try {
      const data = await indexRepository(repoUrl);
      setRepoName(data.repository_name);
      setIndexSuccessInfo(data);
      setMode("ready");
    } catch (err) {
      console.error(err);
      setIndexError(
        err.response?.data?.message ||
          err.message ||
          "Unable to index repository. Please check the URL and try again.",
      );
    } finally {
      setIndexing(false);
    }
  };

  // 2. Chat sending
  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMessage = { role: "user", content: chatInput };
    setChatMessages((prev) => [...prev, userMessage]);
    const questionText = chatInput;
    setChatInput("");
    setChatLoading(true);
    setChatError("");

    try {
      const data = await chatRepository(repoName, questionText);
      const aiMessage = {
        role: "assistant",
        content: data.answer,
        sources: data.sources || [],
      };
      setChatMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      setChatError(
        err.response?.data?.message ||
          err.message ||
          "Failed to process message.",
      );
    } finally {
      setChatLoading(false);
    }
  };

  // 3. Start Interview
  const handleStartInterview = async () => {
    setInterviewLoading(true);
    setInterviewError("");
    setQuestionCount(1);
    setEvalResult(null);
    setLastAnswerEval(null);
    setEndingInterview(false);

    try {
      const data = await startRepositoryInterview(repoName, difficulty);
      setSessionId(data.session_id);
      setCurrentQuestion(data.question);
      setMode("interview-question");
    } catch (err) {
      console.error(err);
      setInterviewError(
        err.response?.data?.message ||
          err.message ||
          "Failed to start interview session.",
      );
    } finally {
      setInterviewLoading(false);
    }
  };

  // 4. Submit Answer
  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!answerInput.trim() || interviewLoading) return;

    const submittedAnswer = answerInput;
    setAnswerInput("");
    setInterviewLoading(true);
    setInterviewError("");
    setLastAnswerEval(null);

    try {
      const data = await submitRepositoryInterviewAnswer(
        sessionId,
        submittedAnswer,
      );

      // Show per-answer evaluation feedback
      setLastAnswerEval({
        score: data.score,
        feedback: data.feedback,
        strengths: data.strengths || [],
        improvements: data.improvements || [],
      });

      if (data.next_question) {
        // There is another question — update question and increment counter
        setCurrentQuestion(data.next_question);
        setQuestionCount((prev) => prev + 1);
        setInterviewLoading(false);
      } else {
        // No more questions — fetch final evaluation
        // We set a separate flag so the UI shows "Finishing interview..."
        setEndingInterview(true);
        setInterviewLoading(false);
        await _doEndInterview();
      }
    } catch (err) {
      console.error(err);
      setInterviewError(
        err.response?.data?.message ||
          err.message ||
          "Failed to submit answer.",
      );
      setInterviewLoading(false);
    }
  };

  // Internal: call the end-interview API (does not manage interviewLoading itself)
  const _doEndInterview = async () => {
    try {
      const data = await endRepositoryInterview(sessionId);
      setEvalResult(data);
      setMode("interview-eval");
    } catch (err) {
      console.error(err);
      setInterviewError(
        err.response?.data?.message ||
          err.message ||
          "Failed to retrieve final evaluation.",
      );
    } finally {
      setEndingInterview(false);
    }
  };

  // 5. End Interview (user-initiated via button)
  const handleEndInterview = async () => {
    if (endingInterview || interviewLoading) return;
    setEndingInterview(true);
    setInterviewError("");
    await _doEndInterview();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Breadcrumb */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-black tracking-tight">
              🤖 Repository AI
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Interactively explore and practice questions on your codebase.
            </p>
          </div>
          {mode !== "connect" && (
            <button
              onClick={() => {
                if (
                  window.confirm(
                    "Disconnect active repository? Session data will be reset.",
                  )
                ) {
                  setRepoName("");
                  setRepoUrl("");
                  setIndexSuccessInfo(null);
                  setChatMessages([]);
                  setMode("connect");
                }
              }}
              className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-100 font-medium transition">
              Disconnect Repo
            </button>
          )}
        </div>

        {/* --- 1. CONNECT MODE --- */}
        {mode === "connect" && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Connect GitHub Repository
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Enter your repository's public HTTP clone URL. We will parse it
              and generate a secure retrieval index for Q&A and coding
              interviews.
            </p>

            {indexError && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg">
                <span className="font-semibold">Error:</span> {indexError}
              </div>
            )}

            <form onSubmit={handleConnect} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  GitHub URL
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/username/repository"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  disabled={indexing}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <button
                type="submit"
                disabled={indexing || !repoUrl}
                className="w-full bg-black hover:bg-gray-900 text-white font-bold py-4 px-6 rounded-xl transition duration-150 ease-in-out disabled:bg-gray-300 flex items-center justify-center gap-2">
                {indexing ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Indexing repository...
                  </>
                ) : (
                  "Connect Repository"
                )}
              </button>
            </form>
          </div>
        )}

        {/* --- 2. ACTIVE READY DASHBOARD --- */}
        {mode === "ready" && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-green-50 rounded-full mb-4 text-green-500">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-800">{repoName}</h2>
            <p className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold inline-block mt-2">
              ✓ Repository Ready
            </p>

            {indexSuccessInfo && (
              <p className="text-gray-500 text-sm mt-4">
                Successfully indexed{" "}
                <span className="font-semibold text-black">
                  {indexSuccessInfo.total_files}
                </span>{" "}
                code files.
              </p>
            )}

            <div className="grid sm:grid-cols-2 gap-6 mt-8 max-w-lg mx-auto">
              <button
                onClick={() => setMode("chat")}
                className="bg-white hover:bg-gray-50 text-black font-semibold border-2 border-black py-4 px-6 rounded-xl transition flex flex-col items-center justify-center gap-2">
                <span className="text-xl">💬</span>
                <span>Chat with Codebase</span>
                <span className="text-xs font-normal text-gray-500">
                  Ask structural & logic questions
                </span>
              </button>

              <button
                onClick={() => setMode("interview-intro")}
                className="bg-black hover:bg-gray-900 text-white font-semibold py-4 px-6 rounded-xl transition flex flex-col items-center justify-center gap-2">
                <span className="text-xl">🎤</span>
                <span>Take Project Interview</span>
                <span className="text-xs font-normal text-gray-400">
                  Test understanding on implementation
                </span>
              </button>
            </div>
          </div>
        )}

        {/* --- 3. REPOSITORY CHAT MODE --- */}
        {mode === "chat" && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col overflow-hidden h-[600px]">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setChatError("");
                    setMode("ready");
                  }}
                  className="text-gray-600 hover:text-black font-semibold text-sm flex items-center gap-1">
                  ← Dashboard
                </button>
                <span className="text-gray-300">|</span>
                <span className="text-sm font-semibold text-gray-700">
                  Chatting: {repoName}
                </span>
              </div>
              <button
                onClick={() => setChatMessages([])}
                className="text-xs text-gray-500 hover:text-red-500">
                Clear History
              </button>
            </div>

            {/* Chat Message Window */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {chatMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 space-y-2">
                  <span className="text-3xl">🤖</span>
                  <p className="text-sm">
                    Ask any question about {repoName}'s database setup, routes,
                    controllers, or technology stack.
                  </p>
                </div>
              ) : (
                chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                        msg.role === "user"
                          ? "bg-black text-white rounded-tr-none"
                          : "bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200"
                      }`}>
                      <p className="text-sm whitespace-pre-wrap">
                        {msg.content}
                      </p>

                      {/* Source files citation */}
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-gray-200 text-[11px] text-gray-500">
                          <span className="font-semibold block mb-1">
                            Retrieved Sources:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {msg.sources.map((src, sIdx) => (
                              <span
                                key={sIdx}
                                className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded"
                                title={src.path}>
                                {src.file_name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-600 rounded-2xl rounded-tl-none p-4 border border-gray-200 flex items-center gap-2">
                    <span
                      className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                    <span className="text-xs font-medium ml-1">
                      AI is thinking...
                    </span>
                  </div>
                </div>
              )}
              {chatError && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                  {chatError}
                </div>
              )}
            </div>

            {/* Chat Input Bar */}
            <form
              onSubmit={handleSendChatMessage}
              className="p-4 border-t border-gray-100 bg-white flex gap-2">
              <input
                type="text"
                placeholder="Ask about your repository..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={chatLoading}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-50"
              />
              <button
                type="submit"
                disabled={chatLoading || !chatInput.trim()}
                className="bg-black hover:bg-gray-900 text-white font-bold px-6 py-3 rounded-xl transition disabled:bg-gray-300">
                Send
              </button>
            </form>
          </div>
        )}

        {/* --- 4. PROJECT INTERVIEW INTRO MODE --- */}
        {mode === "interview-intro" && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <button
              onClick={() => setMode("ready")}
              className="text-gray-600 hover:text-black font-semibold text-sm mb-6 inline-block">
              ← Back to Dashboard
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Project Interview
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Test your understanding of{" "}
              <span className="font-semibold text-black">{repoName}</span>. The
              interviewer will generate repository-specific questions targeting
              the implementation.
            </p>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 mb-6">
              <h3 className="font-bold text-gray-700 mb-3">
                Interview Topics Covered:
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Project architecture
                  & file structures
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Technology stack &
                  package implementation
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Database connections
                  & storage setups
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> API controllers,
                  business logic & middlewares
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Interview Difficulty
              </label>
              <div className="flex gap-4">
                {["easy", "medium", "hard"].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`flex-1 py-3 px-4 rounded-xl border text-sm font-semibold capitalize transition ${
                      difficulty === diff
                        ? "bg-black border-black text-white"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}>
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {interviewError && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
                {interviewError}
              </div>
            )}

            <button
              onClick={handleStartInterview}
              disabled={interviewLoading}
              className="w-full bg-black hover:bg-gray-900 text-white font-bold py-4 rounded-xl transition disabled:bg-gray-300 flex items-center justify-center gap-2">
              {interviewLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Starting Interview...
                </>
              ) : (
                "Start Interview"
              )}
            </button>
          </div>
        )}

        {/* --- 5. PROJECT INTERVIEW QUESTION MODE --- */}
        {mode === "interview-question" && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-bold uppercase">
                Question {questionCount}
              </span>
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      "Abort current interview? Progress will be lost.",
                    )
                  ) {
                    setMode("ready");
                  }
                }}
                className="text-xs text-gray-500 hover:text-red-500">
                Abort Interview
              </button>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900">
                {currentQuestion}
              </h2>
            </div>

            {interviewError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                {interviewError}
              </div>
            )}

            {/* Per-answer evaluation result (shown after submitting) */}
            {lastAnswerEval && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-blue-800">
                    Previous Answer Evaluation
                  </span>
                  <span className="text-sm font-extrabold text-blue-900 bg-blue-100 px-3 py-1 rounded-full">
                    Score: {lastAnswerEval.score}/10
                  </span>
                </div>
                <p className="text-xs text-blue-700 leading-relaxed">
                  {lastAnswerEval.feedback}
                </p>
                {lastAnswerEval.strengths.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold text-green-700 uppercase">
                      Strengths
                    </span>
                    <ul className="mt-1 space-y-1">
                      {lastAnswerEval.strengths.map((s, i) => (
                        <li
                          key={i}
                          className="text-[11px] text-green-800 bg-green-50 border border-green-200 px-2 py-1 rounded">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {lastAnswerEval.improvements.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold text-amber-700 uppercase">
                      Areas to Improve
                    </span>
                    <ul className="mt-1 space-y-1">
                      {lastAnswerEval.improvements.map((im, i) => (
                        <li
                          key={i}
                          className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 px-2 py-1 rounded">
                          {im}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Ending-interview spinner */}
            {endingInterview && (
              <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
                <svg
                  className="animate-spin h-4 w-4 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Compiling final evaluation...
              </div>
            )}

            <form onSubmit={handleSubmitAnswer} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Answer
                </label>
                <textarea
                  rows="6"
                  required
                  placeholder="Type your detailed explanation here..."
                  value={answerInput}
                  onChange={(e) => setAnswerInput(e.target.value)}
                  disabled={interviewLoading || endingInterview}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-50 resize-none"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleEndInterview}
                  disabled={interviewLoading || endingInterview}
                  className="flex-1 bg-white border border-gray-300 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-50 transition disabled:opacity-50">
                  End Interview &amp; Evaluate
                </button>

                <button
                  type="submit"
                  disabled={
                    interviewLoading || endingInterview || !answerInput.trim()
                  }
                  className="flex-1 bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-900 transition disabled:bg-gray-300 flex items-center justify-center gap-2">
                  {interviewLoading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Evaluating answer...
                    </>
                  ) : (
                    "Submit Answer"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* --- 6. PROJECT INTERVIEW EVALUATION MODE --- */}
        {mode === "interview-eval" && evalResult && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-full mb-4 text-blue-500">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Interview Complete
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Overall evaluation result for {repoName}
              </p>
            </div>

            {/* Score panel */}
            <div className="grid grid-cols-2 gap-4 mb-8 bg-gray-50 p-6 rounded-xl border border-gray-100">
              <div className="text-center border-r border-gray-200">
                <span className="text-sm font-semibold text-gray-500 uppercase block mb-1">
                  Total Score
                </span>
                <span className="text-3xl font-extrabold text-black">
                  {evalResult.total_score}
                </span>
              </div>
              <div className="text-center">
                <span className="text-sm font-semibold text-gray-500 uppercase block mb-1">
                  Average Score
                </span>
                <span className="text-3xl font-extrabold text-black">
                  {evalResult.average_score?.toFixed(1) || "0.0"}
                </span>
              </div>
            </div>

            {/* Final feedback text */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Final Summary & Feedback
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                {evalResult.final_feedback}
              </p>
            </div>

            {/* Strengths & Improvements */}
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div>
                <h4 className="text-sm font-bold text-green-700 uppercase mb-3">
                  ✓ Key Strengths
                </h4>
                {evalResult.strengths && evalResult.strengths.length > 0 ? (
                  <ul className="space-y-2">
                    {evalResult.strengths.map((str, sIdx) => (
                      <li
                        key={sIdx}
                        className="text-xs bg-green-50 border border-green-200 text-green-800 p-2.5 rounded-lg">
                        {str}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-400">
                    No strengths captured.
                  </p>
                )}
              </div>

              <div>
                <h4 className="text-sm font-bold text-amber-700 uppercase mb-3">
                  ⚡ Areas to Improve
                </h4>
                {evalResult.improvements &&
                evalResult.improvements.length > 0 ? (
                  <ul className="space-y-2">
                    {evalResult.improvements.map((imp, iIdx) => (
                      <li
                        key={iIdx}
                        className="text-xs bg-amber-50 border border-amber-200 text-amber-800 p-2.5 rounded-lg">
                        {imp}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-400">
                    No areas for improvement captured.
                  </p>
                )}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => setMode("ready")}
                className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-4 rounded-xl font-semibold transition">
                Back to Dashboard
              </button>

              <button
                onClick={() => setMode("interview-intro")}
                className="flex-1 bg-black hover:bg-gray-900 text-white py-4 rounded-xl font-bold transition">
                Try Interview Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
