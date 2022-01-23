import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "screens/Home";
import JoinPage from "screens/JoinPage";
import WaitingPage from "screens/WaitingRoom";
import GamePage from "./screens/GamePage";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/game" element={<GamePage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/join/:roomId" element={<JoinPage />} />
        <Route path="/waiting/:roomId" element={<WaitingPage />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
