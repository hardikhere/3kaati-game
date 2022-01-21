import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GamePage from "./screens/GamePage";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GamePage />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
