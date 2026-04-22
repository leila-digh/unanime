import { Routes, Route } from "react-router";
import Navbar from "@components/layout/Navbar";
import Home from "@pages/Home";
import Quiz from "@pages/Quiz";
import Room from "@pages/Room";
import Footer from "@components/layout/Footer";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/"         element={<Home />} />
          <Route path="/quiz"     element={<Quiz />} />
          <Route path="/room/:id" element={<Room />} />
        </Routes>
      </main>
      <Footer/>
    </div>
  );
}