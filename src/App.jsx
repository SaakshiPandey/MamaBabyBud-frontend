import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MotherDashboard from "./pages/MotherDashboard";
import BabyDashboard from "./pages/BabyDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/mother" element={<MotherDashboard />} />
        <Route path="/baby" element={<BabyDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;