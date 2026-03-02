import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Link,
  InputAdornment,
  IconButton,
  Divider,
  Chip,
  Fade,
  Grow,
  Alert,
  Snackbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Favorite,
  Spa,
  ChildCare,
  Email,
  Lock,
  Person,
  Phone,
  ArrowBack,
  Visibility,
  VisibilityOff,
  CheckCircle,
} from "@mui/icons-material";
import API from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Phone number validation for Indian numbers (starts with 6-9, 10 digits)
  const validatePhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      setError("All fields are required");
      return;
    }

    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!validatePhone(formData.phone)) {
      setError("Phone number must be a valid 10-digit Indian number starting with 6-9");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Send data exactly as per schema
      const response = await API.post("/auth/register", {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone,
        password: formData.password,
      });

      if (response.status === 201 || response.status === 200) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      console.error("Registration error:", err);
      
      // Handle specific error messages from backend
      if (err.response?.data?.message) {
        if (err.response.data.message.includes("email")) {
          setError("This email is already registered");
        } else if (err.response.data.message.includes("phone")) {
          setError("This phone number is already registered");
        } else {
          setError(err.response.data.message);
        }
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(145deg, #fff5f8 0%, #f9f0f5 30%, #f0e9fa 70%, #e8f0fe 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        pt: { xs: '80px', md: '90px' }, // Account for fixed navbar
      }}
    >
      {/* Floating Blobs */}
      <Box sx={softBlob("#fec8d8", "-150px", "-100px", "500px")} />
      <Box sx={softBlob("#d4b7e8", "70%", "-50px", "450px")} />
      <Box sx={softBlob("#b5d0e8", "20%", "70%", "550px")} />
      <Box sx={softBlob("#fbd5e0", "85%", "60%", "400px")} />
      
      {/* Floating Elements */}
      <Box sx={floatingElement("❤️", "5%", "15%", "4s")} />
      <Box sx={floatingElement("🌸", "90%", "85%", "5s")} />
      <Box sx={floatingElement("👶", "10%", "80%", "6s")} />
      <Box sx={floatingElement("🤱", "80%", "10%", "4.5s")} />

      {/* Back Button */}
      <IconButton
        onClick={() => navigate("/")}
        sx={{
          position: "absolute",
          top: { xs: '90px', md: '100px' },
          left: { xs: '20px', md: '40px' },
          backgroundColor: "rgba(255,255,255,0.6)",
          backdropFilter: "blur(10px)",
          "&:hover": {
            backgroundColor: "rgba(255,255,255,0.8)",
            transform: "scale(1.05)",
          },
          transition: "all 0.3s ease",
          zIndex: 10,
        }}
      >
        <ArrowBack sx={{ color: "#ac4e7a" }} />
      </IconButton>

      {/* Success Snackbar */}
      <Snackbar
        open={success}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          severity="success" 
          sx={{ 
            borderRadius: 4,
            background: "linear-gradient(45deg, #4caf50, #81c784)",
            color: "white",
            "& .MuiAlert-icon": { color: "white" }
          }}
          icon={<CheckCircle />}
        >
          Registration successful! Redirecting to login...
        </Alert>
      </Snackbar>

      <Fade in timeout={1000}>
        <Paper
          elevation={0}
          sx={{
            width: { xs: '100%', sm: 480 },
            p: { xs: 4, sm: 5 },
            borderRadius: 8,
            background: "rgba(255, 250, 252, 0.85)",
            backdropFilter: "blur(30px)",
            boxShadow: "0 30px 80px rgba(180, 100, 140, 0.25)",
            border: "2px solid rgba(255,255,255,0.7)",
            position: "relative",
            overflow: "hidden",
            zIndex: 2,
          }}
        >
          {/* Decorative Elements */}
          <Box
            sx={{
              position: "absolute",
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              background: "radial-gradient(circle, #ffd9e6 0%, transparent 70%)",
              borderRadius: "50%",
              opacity: 0.4,
              zIndex: 0,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: -50,
              left: -50,
              width: 200,
              height: 200,
              background: "radial-gradient(circle, #e3d0ff 0%, transparent 70%)",
              borderRadius: "50%",
              opacity: 0.4,
              zIndex: 0,
            }}
          />

          <Box sx={{ position: "relative", zIndex: 1 }}>
            {/* Title - Logo removed, only title remains */}
            <Typography
              variant="h4"
              sx={{
                fontFamily: "'Playfair Display', serif",
                color: "#ac4e7a",
                mb: 1,
                fontSize: { xs: "2rem", sm: "2.4rem" },
                textAlign: "center",
              }}
            >
              Create Account
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "#8b6b7a",
                mb: 4,
                textAlign: "center",
              }}
            >
              Join our circle of love and care 💕
            </Typography>

            {/* Error Alert */}
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3, 
                  borderRadius: 4,
                  backgroundColor: "rgba(255,107,107,0.1)",
                  color: "#d32f2f",
                  "& .MuiAlert-icon": { color: "#d32f2f" }
                }}
              >
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              {/* Name Field */}
              <Grow in timeout={500}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  margin="normal"
                  required
                  placeholder="Enter your full name"
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 4,
                      backgroundColor: "rgba(255,255,255,0.7)",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.9)",
                      },
                      "&.Mui-focused": {
                        backgroundColor: "white",
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: "#ff9eb5" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grow>

              {/* Email Field */}
              <Grow in timeout={600}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  margin="normal"
                  required
                  placeholder="your.email@example.com"
                  helperText="We'll never share your email"
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 4,
                      backgroundColor: "rgba(255,255,255,0.7)",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.9)",
                      },
                      "&.Mui-focused": {
                        backgroundColor: "white",
                      },
                    },
                    "& .MuiFormHelperText-root": {
                      color: "#9b7cb6",
                      marginLeft: 0,
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: "#ff9eb5" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grow>

              {/* Phone Number Field - With Indian validation */}
              <Grow in timeout={700}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  margin="normal"
                  required
                  placeholder="9876543210"
                  helperText="10-digit Indian number starting with 6-9"
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 4,
                      backgroundColor: "rgba(255,255,255,0.7)",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.9)",
                      },
                      "&.Mui-focused": {
                        backgroundColor: "white",
                      },
                    },
                    "& .MuiFormHelperText-root": {
                      color: "#9b7cb6",
                      marginLeft: 0,
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone sx={{ color: "#ff9eb5" }} />
                      </InputAdornment>
                    ),
                    inputProps: {
                      maxLength: 10,
                      pattern: "[6-9][0-9]{9}",
                    },
                  }}
                />
              </Grow>

              {/* Password Field */}
              <Grow in timeout={800}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  margin="normal"
                  required
                  placeholder="Minimum 6 characters"
                  helperText="At least 6 characters long"
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 4,
                      backgroundColor: "rgba(255,255,255,0.7)",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.9)",
                      },
                      "&.Mui-focused": {
                        backgroundColor: "white",
                      },
                    },
                    "& .MuiFormHelperText-root": {
                      color: "#9b7cb6",
                      marginLeft: 0,
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: "#ff9eb5" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grow>

              {/* Terms and Conditions */}
              <Typography
                variant="caption"
                sx={{
                  color: "#8b6b7a",
                  display: "block",
                  mb: 2,
                  textAlign: "center",
                }}
              >
                By creating an account, you agree to our{" "}
                <Link href="#" sx={{ color: "#ff6b95" }}>
                  Terms of Use
                </Link>{" "}
                and{" "}
                <Link href="#" sx={{ color: "#ff6b95" }}>
                  Privacy Policy
                </Link>
              </Typography>

              {/* Register Button */}
              <Button
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 1,
                  mb: 2,
                  borderRadius: 40,
                  py: 1.5,
                  background: "linear-gradient(45deg, #ff9eb5, #ff6b95)",
                  boxShadow: "0 10px 25px rgba(255,107,149,0.4)",
                  fontSize: "1.1rem",
                  "&:hover": {
                    transform: "translateY(-3px) scale(1.02)",
                    boxShadow: "0 15px 30px rgba(255,107,149,0.5)",
                    background: "linear-gradient(45deg, #ff8da1, #ff5a85)",
                  },
                  "&:disabled": {
                    background: "rgba(255,158,181,0.5)",
                  },
                  transition: "all 0.3s ease",
                }}
                type="submit"
                endIcon={<Favorite />}
              >
                {loading ? "Creating Account..." : "Join Our Circle"}
              </Button>

              <Divider sx={{ my: 2, borderColor: "#ffd4e4" }}>
                <Chip 
                  label="OR" 
                  size="small"
                  sx={{ 
                    color: "#ac4e7a", 
                    backgroundColor: "rgba(255,210,230,0.5)",
                    fontSize: "0.75rem",
                  }} 
                />
              </Divider>

              {/* Login Link */}
              <Typography
                variant="body2"
                sx={{
                  color: "#8b6b7a",
                  textAlign: "center",
                }}
              >
                Already have an account?{" "}
                <Link
                  component="button"
                  onClick={() => navigate("/login")}
                  sx={{
                    color: "#ff6b95",
                    fontWeight: 600,
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Sign In
                </Link>
              </Typography>

              {/* Quick tip */}
              
            </form>
          </Box>
        </Paper>
      </Fade>

      {/* Animations */}
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
            100% { transform: translateY(0px) rotate(0deg); }
          }
          
          @keyframes pulse {
            0% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.1); }
            100% { opacity: 0.4; transform: scale(1); }
          }
        `}
      </style>
    </Box>
  );
}

// Helper functions
const softBlob = (color, left, top, size = "400px") => ({
  position: "absolute",
  width: size,
  height: size,
  background: `radial-gradient(circle at 30% 30%, ${color} 0%, ${color}80 70%, transparent 100%)`,
  borderRadius: "60% 40% 50% 50% / 40% 50% 60% 50%",
  filter: "blur(100px)",
  left: left,
  top: top,
  opacity: 0.5,
  animation: "pulse 8s infinite ease-in-out",
  zIndex: 0,
});

const floatingElement = (emoji, left, top, duration) => ({
  position: "absolute",
  left: left,
  top: top,
  fontSize: "2rem",
  opacity: 0.3,
  animation: `float ${duration} infinite ease-in-out`,
  pointerEvents: "none",
  zIndex: 1,
});

export default Register;