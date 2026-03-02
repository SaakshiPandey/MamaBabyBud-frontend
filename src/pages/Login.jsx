import { useState, useContext } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Link
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import SoftBackground from "../components/SoftBackground";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await API.post("/auth/login", { email, password });
    login(data);
    navigate("/mother");
  };

  return (
    <SoftBackground>
      <Paper
        elevation={0}
        sx={{
          width: 400,
          p: 5,
          borderRadius: 6,
          background: "rgba(255,255,255,0.6)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 20px 60px rgba(216,27,96,0.25)",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Welcome Back 🌸
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3}>
          Log in to continue your journey
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              borderRadius: 8,
              py: 1.2,
              transition: "0.3s",
              "&:hover": { transform: "scale(1.03)" },
            }}
            type="submit"
          >
            Login
          </Button>
        </form>

        <Typography mt={3}>
          Don’t have an account?{" "}
          <Link
            component="button"
            onClick={() => navigate("/register")}
            underline="hover"
          >
            Register
          </Link>
        </Typography>
      </Paper>
    </SoftBackground>
  );
}

export default Login;