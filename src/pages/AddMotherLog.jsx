import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  MenuItem,
  IconButton,
  InputAdornment,
  Divider,
  Card,
  CardContent,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  ArrowBack,
  Favorite,
  MonitorHeart,
  Bedtime,
  Restaurant,
  Mood,
  Spa,
  LocalHospital,
  FavoriteBorder,
} from "@mui/icons-material";
import API from "../services/api";

function AddMotherLog() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    systolic: "",
    diastolic: "",
    weight: "",
    sugarLevel: "",
    heartRate: "",
    sleepHours: "",
    waterIntake: "",
    meals: "",
    mood: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    
    try {
      const payload = {
        date: formData.date,
        systolic: formData.systolic ? Number(formData.systolic) : undefined,
        diastolic: formData.diastolic ? Number(formData.diastolic) : undefined,
        weight: formData.weight ? Number(formData.weight) : undefined,
        sugarLevel: formData.sugarLevel ? Number(formData.sugarLevel) : undefined,
        heartRate: formData.heartRate ? Number(formData.heartRate) : undefined,
        sleepHours: formData.sleepHours ? Number(formData.sleepHours) : undefined,
        waterIntake: formData.waterIntake ? Number(formData.waterIntake) : undefined,
        meals: formData.meals || undefined,
        mood: formData.mood || undefined,
        notes: formData.notes || undefined,
      };
      
      console.log("Sending payload:", payload);
      
      const response = await API.post("/mother/add", payload);
      console.log("Response:", response);
      
      // Show success message briefly before navigating
      setSuccess(true);
      
      // Navigate back to dashboard after successful save (with slight delay to show success)
      setTimeout(() => {
        navigate("/mother");
      }, 1000);
      
    } catch (error) {
      console.error("Error saving log:", error);
      setError(error.response?.data?.message || "Failed to save log. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(145deg, #fff9fb 0%, #faf5ff 100%)",
        pt: { xs: "80px", md: "90px" },
        px: { xs: 2, md: 3 },
        pb: 6,
        position: "relative",
      }}
    >
      {/* Back Button */}
      <IconButton
        onClick={() => navigate("/mother")}
        sx={{
          position: "fixed",
          top: { xs: '90px', md: '100px' },
          left: { xs: '20px', md: '40px' },
          bgcolor: "white",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          "&:hover": { 
            bgcolor: "#f5e4ed",
            transform: "scale(1.05)",
          },
          transition: "all 0.3s ease",
          zIndex: 10,
        }}
      >
        <ArrowBack sx={{ color: "#a16b8a" }} />
      </IconButton>

      <Paper
        elevation={0}
        sx={{
          maxWidth: 1000,
          mx: "auto",
          p: { xs: 3, md: 5 },
          borderRadius: 6,
          bgcolor: "white",
          border: "1px solid #f5e4ed",
          boxShadow: "0 10px 40px rgba(161,107,138,0.08)",
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 70,
              height: 70,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #ffb6c1, #ff9eb5)",
              mb: 2,
            }}
          >
            <Spa sx={{ fontSize: 36, color: "white" }} />
          </Box>
          <Typography
            variant="h4"
            sx={{
              fontFamily: "'Playfair Display', serif",
              color: "#a16b8a",
              mb: 1,
              fontWeight: 500,
            }}
          >
            Log Your Health Today
          </Typography>
          <Typography sx={{ color: "#a48b9b", fontSize: "1.1rem" }}>
            Track your wellness journey with love 💕
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3, borderRadius: 3 }}
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}

        {/* Success Alert */}
        {success && (
          <Alert 
            severity="success" 
            sx={{ mb: 3, borderRadius: 3 }}
            icon={<Favorite sx={{ color: "#ff9eb5" }} />}
          >
            Health log saved successfully! Redirecting...
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {/* Date Field - Full Width Card */}
          <Card 
            elevation={0}
            sx={{ 
              mb: 4, 
              borderRadius: 4,
              border: "1px solid #f5e4ed",
              bgcolor: "#fffafc",
              width: "100%",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <LocalHospital sx={{ color: "#ff9eb5", fontSize: 28 }} />
                <TextField
                  fullWidth
                  type="date"
                  label="Date"
                  name="date"
                  value={formData.date}
                  InputLabelProps={{ shrink: true }}
                  onChange={handleChange}
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      bgcolor: "white",
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>

          {/* Vitals Section */}
          <Typography 
            variant="h6" 
            sx={{ 
              color: "#a16b8a", 
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontWeight: 500,
            }}
          >
            <MonitorHeart sx={{ color: "#ff9eb5" }} /> Vitals
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={6} md={2.4}>
              <TextField
                fullWidth
                label="Systolic"
                name="systolic"
                type="number"
                value={formData.systolic}
                onChange={handleChange}
                placeholder="120"
                InputProps={{ 
                  endAdornment: <InputAdornment position="end">mmHg</InputAdornment>,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    bgcolor: "#fff5f8",
                  },
                }}
              />
            </Grid>
            <Grid item xs={6} md={2.4}>
              <TextField
                fullWidth
                label="Diastolic"
                name="diastolic"
                type="number"
                value={formData.diastolic}
                onChange={handleChange}
                placeholder="80"
                InputProps={{ 
                  endAdornment: <InputAdornment position="end">mmHg</InputAdornment>,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    bgcolor: "#fff5f8",
                  },
                }}
              />
            </Grid>
            <Grid item xs={6} md={2.4}>
              <TextField
                fullWidth
                label="Heart Rate"
                name="heartRate"
                type="number"
                value={formData.heartRate}
                onChange={handleChange}
                placeholder="72"
                InputProps={{ 
                  endAdornment: <InputAdornment position="end">bpm</InputAdornment>,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    bgcolor: "#fff5f8",
                  },
                }}
              />
            </Grid>
            <Grid item xs={6} md={2.4}>
              <TextField
                fullWidth
                label="Weight"
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleChange}
                placeholder="65"
                InputProps={{ 
                  endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    bgcolor: "#fff5f8",
                  },
                }}
              />
            </Grid>
            <Grid item xs={6} md={2.4}>
              <TextField
                fullWidth
                label="Sugar"
                name="sugarLevel"
                type="number"
                value={formData.sugarLevel}
                onChange={handleChange}
                placeholder="95"
                InputProps={{ 
                  endAdornment: <InputAdornment position="end">mg/dL</InputAdornment>,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    bgcolor: "#fff5f8",
                  },
                }}
              />
            </Grid>
          </Grid>

          {/* Lifestyle Section */}
          <Typography 
            variant="h6" 
            sx={{ 
              color: "#a16b8a", 
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontWeight: 500,
            }}
          >
            <Bedtime sx={{ color: "#b592d6" }} /> Lifestyle
          </Typography>

          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={6} md={3}>
              <TextField
                fullWidth
                label="Sleep"
                name="sleepHours"
                type="number"
                value={formData.sleepHours}
                onChange={handleChange}
                placeholder="8"
                InputProps={{ 
                  endAdornment: <InputAdornment position="end">hrs</InputAdornment>,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    bgcolor: "#f5f0ff",
                  },
                }}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField
                fullWidth
                label="Water"
                name="waterIntake"
                type="number"
                value={formData.waterIntake}
                onChange={handleChange}
                placeholder="8"
                InputProps={{ 
                  endAdornment: <InputAdornment position="end">glasses</InputAdornment>,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    bgcolor: "#f5f0ff",
                  },
                }}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField
                fullWidth
                label="Meals"
                name="meals"
                value={formData.meals}
                onChange={handleChange}
                placeholder="e.g., Breakfast, Lunch"
                InputProps={{ 
                  startAdornment: <Restaurant sx={{ color: "#b592d6", mr: 1 }} />,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    bgcolor: "#f5f0ff",
                  },
                }}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField
                select
                fullWidth
                label="Mood"
                name="mood"
                value={formData.mood}
                onChange={handleChange}
                InputProps={{ 
                  startAdornment: <Mood sx={{ color: "#b592d6", mr: 1 }} />,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    bgcolor: "#f5f0ff",
                  },
                }}
              >
                <MenuItem value="Happy">Happy 😊</MenuItem>
                <MenuItem value="Calm">Calm 😌</MenuItem>
                <MenuItem value="Tired">Tired 😴</MenuItem>
                <MenuItem value="Anxious">Anxious 😟</MenuItem>
                <MenuItem value="Energetic">Energetic ⚡</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          {/* Notes Section - FULL WIDTH with proper grid */}
          <Typography 
            variant="h6" 
            sx={{ 
              color: "#a16b8a", 
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontWeight: 500,
            }}
          >
            <FavoriteBorder sx={{ color: "#7a9ec2" }} /> Notes
          </Typography>

          {/* Full width notes field using Grid */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="How are you feeling today? Any additional notes you'd like to remember..."
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    bgcolor: "#f0f5fa",
                  },
                }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4, borderColor: "#f5e4ed" }} />

          {/* Submit Button */}
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading || success}
              sx={{
                borderRadius: 40,
                px: 6,
                py: 1.8,
                background: "linear-gradient(45deg, #ff9eb5, #ff6b95)",
                color: "white",
                fontSize: "1.2rem",
                fontWeight: 500,
                boxShadow: "0 8px 20px rgba(255,107,149,0.4)",
                "&:hover": { 
                  background: "linear-gradient(45deg, #ff6b95, #ff9eb5)",
                  transform: "translateY(-3px)",
                  boxShadow: "0 12px 25px rgba(255,107,149,0.5)",
                },
                "&:disabled": {
                  background: "#f0e0e8",
                  color: "#a48b9b",
                },
                transition: "all 0.3s ease",
                minWidth: 250,
              }}
              endIcon={loading ? <CircularProgress size={20} sx={{ color: "white" }} /> : <Favorite />}
            >
              {loading ? "Saving..." : success ? "Saved!" : "Save Health Log"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}

export default AddMotherLog;