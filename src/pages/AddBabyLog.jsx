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
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  ArrowBack,
  ChildCare,
  MonitorHeart,
  Bedtime,
  Restaurant,
  Spa,
  LocalHospital,
  FavoriteBorder,
  Straighten,
  DeviceThermostat,
  BabyChangingStation,
  Vaccines,
} from "@mui/icons-material";
import API from "../services/api";

function AddBabyLog() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: "",
    height: "",
    temperature: "",
    feedingType: "",
    sleepHours: "",
    diaperCount: "",
    vaccinationGiven: "",
    notes: "",
    growthStatus: "",
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
        weight: formData.weight ? Number(formData.weight) : undefined,
        height: formData.height ? Number(formData.height) : undefined,
        temperature: formData.temperature ? Number(formData.temperature) : undefined,
        feedingType: formData.feedingType || undefined,
        sleepHours: formData.sleepHours ? Number(formData.sleepHours) : undefined,
        diaperCount: formData.diaperCount ? Number(formData.diaperCount) : undefined,
        vaccinationGiven: formData.vaccinationGiven || undefined,
        notes: formData.notes || undefined,
        growthStatus: formData.growthStatus || undefined,
      };
      
      console.log("Sending payload:", payload);
      
      const response = await API.post("/baby/add", payload);
      console.log("Response:", response);
      
      // Show success message briefly before navigating
      setSuccess(true);
      
      // Navigate back to dashboard after successful save
      setTimeout(() => {
        navigate("/baby");
      }, 1000);
      
    } catch (error) {
      console.error("Error saving log:", error);
      setError(error.response?.data?.message || "Failed to save log. Please try again.");
      setLoading(false);
    }
  };

  const feedingOptions = [
    { value: "breastfeeding", label: "Breastfeeding" },
    { value: "formula", label: "Formula" },
    { value: "both", label: "Both" },
    { value: "solid_foods", label: "Solid Foods" },
    { value: "mixed", label: "Mixed Feeding" },
  ];

  const growthStatusOptions = [
    { value: "normal", label: "Normal" },
    { value: "below_average", label: "Below Average" },
    { value: "above_average", label: "Above Average" },
    { value: "needs_monitoring", label: "Needs Monitoring" },
  ];

  const vaccinationOptions = [
    { value: "bcg", label: "BCG" },
    { value: "hepatitis_b_1", label: "Hepatitis B (1st dose)" },
    { value: "hepatitis_b_2", label: "Hepatitis B (2nd dose)" },
    { value: "opv_0", label: "OPV (0 dose)" },
    { value: "opv_1", label: "OPV (1st dose)" },
    { value: "opv_2", label: "OPV (2nd dose)" },
    { value: "dtap_1", label: "DTaP (1st dose)" },
    { value: "dtap_2", label: "DTaP (2nd dose)" },
    { value: "dtap_3", label: "DTaP (3rd dose)" },
    { value: "ipv_1", label: "IPV (1st dose)" },
    { value: "ipv_2", label: "IPV (2nd dose)" },
    { value: "ipv_3", label: "IPV (3rd dose)" },
    { value: "hib_1", label: "Hib (1st dose)" },
    { value: "hib_2", label: "Hib (2nd dose)" },
    { value: "pcv_1", label: "PCV (1st dose)" },
    { value: "pcv_2", label: "PCV (2nd dose)" },
    { value: "rotavirus_1", label: "Rotavirus (1st dose)" },
    { value: "mmr_1", label: "MMR (1st dose)" },
    { value: "mmr_2", label: "MMR (2nd dose)" },
    { value: "varicella", label: "Varicella" },
    { value: "hepatitis_a", label: "Hepatitis A" },
    { value: "dtap_booster", label: "DTaP Booster" },
    { value: "hib_booster", label: "Hib Booster" },
    { value: "dtap_booster_5yr", label: "DTaP Booster (5 yrs)" },
    { value: "none", label: "None" },
  ];

  // Standardized input styling for all fields
  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 3,
      backgroundColor: "#faf5f8",
      transition: "all 0.2s ease",
      "&:hover": {
        backgroundColor: "#fff5f9",
      },
      "&.Mui-focused": {
        backgroundColor: "white",
        boxShadow: "0 0 0 3px rgba(255,158,181,0.1)",
      },
    },
    "& .MuiInputLabel-root": {
      color: "#a48b9b",
      "&.Mui-focused": {
        color: "#ff9eb5",
      },
    },
  };

  const selectStyles = {
    "& .MuiOutlinedInput-root": {
      height: 56,
      borderRadius: 3,
      backgroundColor: "#faf5f8",
      transition: "all 0.2s ease",
      "&:hover": {
        backgroundColor: "#fff5f9",
      },
      "&.Mui-focused": {
        backgroundColor: "white",
        boxShadow: "0 0 0 3px rgba(255,158,181,0.1)",
      },
    },
    "& .MuiInputLabel-root": {
      color: "#a48b9b",
      "&.Mui-focused": {
        color: "#ff9eb5",
      },
    },
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
        onClick={() => navigate("/baby")}
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
            <ChildCare sx={{ fontSize: 36, color: "white" }} />
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
            Log Baby's Health Today
          </Typography>
          <Typography sx={{ color: "#a48b9b", fontSize: "1.1rem" }}>
            Track your little one's growth with love 👶💕
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
            icon={<ChildCare sx={{ color: "#ff9eb5" }} />}
          >
            Baby log saved successfully! Redirecting...
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
                  sx={inputStyles}
                />
              </Box>
            </CardContent>
          </Card>

          {/* Growth & Vitals Section */}
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
            <MonitorHeart sx={{ color: "#ff9eb5" }} /> Growth & Vitals
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Weight"
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleChange}
                placeholder="3.5"
                InputProps={{ 
                  endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                }}
                sx={inputStyles}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Height"
                name="height"
                type="number"
                value={formData.height}
                onChange={handleChange}
                placeholder="50"
                InputProps={{ 
                  endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                }}
                sx={inputStyles}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Temperature"
                name="temperature"
                type="number"
                value={formData.temperature}
                onChange={handleChange}
                placeholder="36.5"
                InputProps={{ 
                  startAdornment: <DeviceThermostat sx={{ color: "#ff9eb5", mr: 1 }} />,
                  endAdornment: <InputAdornment position="end">°C</InputAdornment>,
                }}
                sx={inputStyles}
              />
            </Grid>
          </Grid>

          {/* Feeding & Sleep Section */}
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
            <Restaurant sx={{ color: "#b592d6" }} /> Feeding & Sleep
          </Typography>

          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth 
              variant="outlined" sx={selectStyles}>
                <InputLabel>Feeding Type</InputLabel>
                <Select
                  name="feedingType"
                  value={formData.feedingType}
                  onChange={handleChange}
                  label="Feeding Type"
                >
                  {feedingOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Sleep Hours"
                name="sleepHours"
                type="number"
                value={formData.sleepHours}
                onChange={handleChange}
                placeholder="8"
                InputProps={{ 
                  endAdornment: <InputAdornment position="end">hrs</InputAdornment>,
                }}
                sx={inputStyles}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Diaper Count"
                name="diaperCount"
                type="number"
                value={formData.diaperCount}
                onChange={handleChange}
                placeholder="6"
                InputProps={{ 
                  startAdornment: <BabyChangingStation sx={{ color: "#b592d6", mr: 1 }} />,
                }}
                sx={inputStyles}
              />
            </Grid>
          </Grid>

          {/* Vaccination & Status Section */}
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
            <Vaccines sx={{ color: "#7a9ec2" }} /> Vaccination & Status
          </Typography>

          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth variant="outlined" sx={selectStyles}>
                <InputLabel>Vaccination Given</InputLabel>
                <Select
                  name="vaccinationGiven"
                  value={formData.vaccinationGiven}
                  onChange={handleChange}
                  label="Vaccination Given"
                >
                  {vaccinationOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth variant="outlined" sx={selectStyles}>
                <InputLabel>Growth Status</InputLabel>
                <Select
                  name="growthStatus"
                  value={formData.growthStatus}
                  onChange={handleChange}
                  label="Growth Status"
                >
                  {growthStatusOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Notes Section */}
          <Typography
            variant="h6"
            sx={{
              color: "#b47197",
              mb: 2,
              fontWeight: 500,
            }}
          >
            <FavoriteBorder
              sx={{
                color: "#7a9ec2",
                mr: 1,
                verticalAlign: "middle",
              }}
            />
            Notes
          </Typography>

          <TextField
          fullWidth
          multiline
          rows={4}
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Any additional notes about baby's health, behavior, or milestones..."
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#EFE9F0",   // 👈 Add background
              borderRadius: 3,
            },
          }}
        />

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
              endIcon={loading ? <CircularProgress size={20} sx={{ color: "white" }} /> : <ChildCare />}
            >
              {loading ? "Saving..." : success ? "Saved!" : "Save Baby Log"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}

export default AddBabyLog;