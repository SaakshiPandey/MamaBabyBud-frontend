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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box 
          sx={{ 
            display: "flex", 
            flexDirection: "column", 
            minHeight: "100vh",
            margin: 0,
            padding: 0,
          }}
        >
          <Navbar />
          <Box 
            component="main" 
            sx={{ 
              flex: "1 0 auto", // This ensures main content takes available space
              width: "100%",
            }}
          >
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/mother-dashboard" element={<MotherDashboard />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;