import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box } from "@mui/material";
import theme from "./theme";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MotherDashboard from "./pages/MotherDashboard";
import AddMotherLog from "./pages/AddMotherLog";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            }}
          >
            <Navbar />

            <Box component="main" sx={{ flex: "1 0 auto", width: "100%" }}>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/mother-dashboard" element={<MotherDashboard />} />
                <Route path="/mother/add" element={<AddMotherLog />} />
              </Routes>
            </Box>

            <Footer />
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
export default App;