import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import QuizList from "./components/quiz-editor/QuizList";
import QuizEditor from "./components/quiz-editor/QuizEditor";
import QuizRunner from "./components/quiz-runner/QuizRunner";
import QuizBuilder from "./components/QuizBuilder/QuizBuilder";
import WordSearch from "./components/WordSearch";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/quizzes" element={<QuizList />} />
        <Route path="/quiz/:id" element={<QuizEditor />} />
        <Route path="/quiz/:id/run" element={<QuizRunner />} />
        <Route path="/quiz-builder" element={<QuizBuilder />} />
        <Route path="/search" element={<WordSearch />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
