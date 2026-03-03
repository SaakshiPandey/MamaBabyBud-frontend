import { useEffect, useState, useContext } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Avatar,
  Chip,
  Fade,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Divider,
  LinearProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import { 
  ChildCare, 
  MonitorHeart, 
  Vaccines, 
  TrendingUp,
  BabyChangingStation,
  Restaurant,
  CheckCircle,
  EventAvailable,
  Info,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

function BabyDashboard() {
  const { user } = useContext(AuthContext);
  const [logs, setLogs] = useState([]);
  const [selectedAgeMonths, setSelectedAgeMonths] = useState(0);
  const [takenVaccines, setTakenVaccines] = useState(() => {
    // Load from localStorage on initial render
    const saved = localStorage.getItem('takenVaccines');
    return saved ? JSON.parse(saved) : [];
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchLogs();
  }, []);

  // Save to localStorage whenever takenVaccines changes
  useEffect(() => {
    localStorage.setItem('takenVaccines', JSON.stringify(takenVaccines));
  }, [takenVaccines]);

  const fetchLogs = async () => {
    try {
      const { data } = await API.get("/baby");
      setLogs(data);
    } catch (err) {
      console.error(err);
    }
  };

  const latestLog = logs.length > 0 ? logs[0] : null;

  const softBlob = (color, left, top, size = "400px") => ({
    position: "absolute",
    width: size,
    height: size,
    background: `radial-gradient(circle at 30% 30%, ${color} 0%, ${color}80 70%, transparent 100%)`,
    borderRadius: "60% 40% 50% 50% / 40% 50% 60% 50%",
    filter: "blur(100px)",
    left,
    top,
    opacity: 0.4,
    animation: "pulse 8s infinite ease-in-out",
    zIndex: 0,
  });

  const VACCINE_SCHEDULE = [
    { id: 1, name: "BCG", dueMonths: 0, description: "At birth" },
    { id: 2, name: "Hepatitis B (1st dose)", dueMonths: 0, description: "At birth" },
    { id: 3, name: "OPV (0 dose)", dueMonths: 0, description: "At birth" },
    { id: 4, name: "DTaP (1st dose)", dueMonths: 2, description: "2 months" },
    { id: 5, name: "IPV (1st dose)", dueMonths: 2, description: "2 months" },
    { id: 6, name: "Hib (1st dose)", dueMonths: 2, description: "2 months" },
    { id: 7, name: "PCV (1st dose)", dueMonths: 2, description: "2 months" },
    { id: 8, name: "Rotavirus (1st dose)", dueMonths: 2, description: "2 months" },
    { id: 9, name: "DTaP (2nd dose)", dueMonths: 4, description: "4 months" },
    { id: 10, name: "IPV (2nd dose)", dueMonths: 4, description: "4 months" },
    { id: 11, name: "Hib (2nd dose)", dueMonths: 4, description: "4 months" },
    { id: 12, name: "PCV (2nd dose)", dueMonths: 4, description: "4 months" },
    { id: 13, name: "DTaP (3rd dose)", dueMonths: 6, description: "6 months" },
    { id: 14, name: "IPV (3rd dose)", dueMonths: 6, description: "6 months" },
    { id: 15, name: "Hepatitis B (2nd dose)", dueMonths: 6, description: "6 months" },
    { id: 16, name: "MMR (1st dose)", dueMonths: 12, description: "12 months" },
    { id: 17, name: "Varicella", dueMonths: 12, description: "12 months" },
    { id: 18, name: "Hepatitis A", dueMonths: 12, description: "12 months" },
    { id: 19, name: "DTaP Booster", dueMonths: 18, description: "18 months" },
    { id: 20, name: "Hib Booster", dueMonths: 18, description: "18 months" },
    { id: 21, name: "MMR (2nd dose)", dueMonths: 48, description: "4 years" },
    { id: 22, name: "DTaP Booster (5 yrs)", dueMonths: 60, description: "5 years" },
  ];

  const handleVaccineToggle = (vaccineId) => {
    setTakenVaccines(prev => 
      prev.includes(vaccineId)
        ? prev.filter(id => id !== vaccineId)
        : [...prev, vaccineId]
    );
  };

  // Calculate vaccines based on selected age
  const vaccinesDueByAge = VACCINE_SCHEDULE.filter(
    (v) => v.dueMonths <= selectedAgeMonths
  );

  const completedVaccines = vaccinesDueByAge.filter(v => takenVaccines.includes(v.id));
  const pendingVaccines = vaccinesDueByAge.filter(v => !takenVaccines.includes(v.id));
  
  // Get upcoming vaccines (next 5 after current age)
  const upcomingVaccines = VACCINE_SCHEDULE
    .filter(v => v.dueMonths > selectedAgeMonths)
    .sort((a, b) => a.dueMonths - b.dueMonths)
    .slice(0, 5);

  // Age options (0-60 months)
  const ageOptions = Array.from({ length: 61 }, (_, i) => ({
    value: i,
    label: i < 12 
      ? `${i} month${i !== 1 ? 's' : ''}` 
      : `${Math.floor(i/12)} year${Math.floor(i/12) !== 1 ? 's' : ''} ${i%12 > 0 ? `${i%12} month${i%12 !== 1 ? 's' : ''}` : ''}`
  }));

  // Calculate progress percentage
  const progressPercentage = vaccinesDueByAge.length > 0 
    ? (completedVaccines.length / vaccinesDueByAge.length) * 100 
    : 0;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(145deg, #fff5f8 0%, #f9f0f5 30%, #f0e9fa 70%, #e8f0fe 100%)",
        pt: { xs: "80px", md: "90px" },
        pb: 4,
        px: { xs: 2, md: 4 },
      }}
    >
      {/* Floating Blobs */}
      <Box sx={softBlob("#fec8d8", "-150px", "-100px", "500px")} />
      <Box sx={softBlob("#d4b7e8", "70%", "-50px", "450px")} />
      <Box sx={softBlob("#b5d0e8", "20%", "70%", "550px")} />

      <Box sx={{ maxWidth: "1200px", mx: "auto", position: "relative", zIndex: 1 }}>
        
        {/* Header */}
        <Fade in timeout={800}>
          <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: "'Playfair Display', serif",
                  background: "linear-gradient(135deg, #ac4e7a, #7d4b7a, #5d6d9e)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: 600,
                }}
              >
                Baby Dashboard 👶
              </Typography>
              <Typography sx={{ color: "#8b6b7a", mt: 1 }}>
                Track your little one's growth & health
              </Typography>
            </Box>

            {/* Age Dropdown */}
            <FormControl sx={{ minWidth: 250, bgcolor: "white", borderRadius: 3 }}>
              <InputLabel sx={{ color: "#ac4e7a" }}>Baby's Age</InputLabel>
              <Select
                value={selectedAgeMonths}
                label="Baby's Age"
                onChange={(e) => setSelectedAgeMonths(e.target.value)}
                sx={{ borderRadius: 3 }}
              >
                {ageOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Fade>

        {/* Stats Cards */}
        <Fade in timeout={1000}>
          <Grid container spacing={3} sx={{ mb: 5 }}>
            <Grid item xs={6} sm={4} md={2.4}>
              <GlassCard
                icon={<MonitorHeart />}
                color="#ffb6c1"
                label="Weight"
                value={latestLog?.weight ? `${latestLog.weight} kg` : "—"}
              />
            </Grid>

            <Grid item xs={6} sm={4} md={2.4}>
              <GlassCard
                icon={<TrendingUp />}
                color="#d4b7e8"
                label="Height"
                value={latestLog?.height ? `${latestLog.height} cm` : "—"}
              />
            </Grid>

            <Grid item xs={6} sm={4} md={2.4}>
              <GlassCard
                icon={<ChildCare />}
                color="#b5d0e8"
                label="Sleep"
                value={latestLog?.sleepHours ? `${latestLog.sleepHours}h` : "—"}
              />
            </Grid>

            <Grid item xs={6} sm={4} md={2.4}>
              <GlassCard
                icon={<BabyChangingStation />}
                color="#ff9eb5"
                label="Diapers"
                value={latestLog?.diapers ? `${latestLog.diapers}` : "—"}
              />
            </Grid>

            <Grid item xs={6} sm={4} md={2.4}>
              <GlassCard
                icon={<Restaurant />}
                color="#9fb7d4"
                label="Meals"
                value={latestLog?.meals ? `${latestLog.meals}` : "—"}
              />
            </Grid>
          </Grid>
        </Fade>
        
        {/* Vaccination Timeline Section - Redesigned for better uniformity */}
        <Fade in timeout={1200}>
          <Paper
            elevation={0}
            sx={{
              maxWidth: "1400px",
              mx: "auto",
              mb: 5,
              p: 4,
              borderRadius: 4,
              bgcolor: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,158,181,0.2)",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontFamily: "'Playfair Display', serif",
                color: "#ac4e7a",
                mb: 3,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Vaccines sx={{ color: "#ff9eb5" }} /> Vaccination Tracker
            </Typography>

            <Grid container spacing={4}>
              {/* Left Column - Vaccines by Age */}
              <Grid item xs={12} md={5}>
                <Paper sx={{ p: 2, bgcolor: "white", borderRadius: 3, height: "100%" }}>
                  <Typography sx={{ color: "#ac4e7a", mb: 2, fontWeight: 600, display: "flex", alignItems: "center" }}>
                    <Info sx={{ mr: 1, fontSize: 20, color: "#ff9eb5" }} />
                    Vaccines by Age ({selectedAgeMonths} months)
                  </Typography>

                  <Box sx={{ maxHeight: 350, overflow: "auto", pr: 1 }}>
                    {vaccinesDueByAge.length > 0 ? (
                      vaccinesDueByAge.map((vaccine) => (
                        <Paper
                          key={vaccine.id}
                          elevation={0}
                          sx={{
                            p: 1.5,
                            mb: 1,
                            bgcolor: takenVaccines.includes(vaccine.id) ? "#f1f9f1" : "#faf5f8",
                            borderRadius: 2,
                            border: "1px solid",
                            borderColor: takenVaccines.includes(vaccine.id) ? "#c8e6c9" : "#f5e4ed",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Checkbox
                              checked={takenVaccines.includes(vaccine.id)}
                              onChange={() => handleVaccineToggle(vaccine.id)}
                              sx={{
                                color: "#ff9eb5",
                                '&.Mui-checked': { color: "#4caf50" },
                                p: 0.5,
                              }}
                              size="small"
                            />
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500, color: "#5d4b6e" }}>
                                {vaccine.name}
                              </Typography>
                              <Typography variant="caption" sx={{ color: "#a48b9b" }}>
                                {vaccine.description}
                              </Typography>
                            </Box>
                          </Box>
                          {takenVaccines.includes(vaccine.id) && (
                            <Chip 
                              label="✓" 
                              size="small" 
                              sx={{ 
                                bgcolor: "#4caf50", 
                                color: "white", 
                                height: 20, 
                                width: 20,
                                borderRadius: "50%",
                                '& .MuiChip-label': { px: 0 }
                              }} 
                            />
                          )}
                        </Paper>
                      ))
                    ) : (
                      <Typography sx={{ color: "#a48b9b", fontStyle: "italic", textAlign: "center", py: 4 }}>
                        No vaccines scheduled for this age
                      </Typography>
                    )}
                  </Box>
                </Paper>
              </Grid>

              {/* Right Column - Split into two sections */}
              <Grid item xs={12} md={7}>
                <Grid container spacing={2} direction="column">
                  {/* Top 5 Upcoming Vaccines */}
                  <Grid item>
                    <Paper sx={{ p: 2, bgcolor: "white", borderRadius: 3 }}>
                      <Typography sx={{ color: "#ac4e7a", mb: 2, fontWeight: 600, display: "flex", alignItems: "center" }}>
                        <EventAvailable sx={{ mr: 1, fontSize: 20, color: "#ff9eb5" }} />
                        Top 5 Upcoming Vaccines
                      </Typography>

                      <Box>
                        {upcomingVaccines.length > 0 ? (
                          upcomingVaccines.map((vaccine, index) => (
                            <Box key={vaccine.id} sx={{ mb: 2 }}>
                              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <Avatar sx={{ width: 24, height: 24, bgcolor: "#b5d0e8", fontSize: "0.8rem" }}>
                                    {index + 1}
                                  </Avatar>
                                  <Typography sx={{ color: "#5d4b6e", fontWeight: 500 }}>
                                    {vaccine.name}
                                  </Typography>
                                </Box>
                                <Chip
                                  label={`${vaccine.dueMonths} months`}
                                  size="small"
                                  sx={{ bgcolor: "#b5d0e8", color: "#2d4b6e", height: 24 }}
                                />
                              </Box>
                              {index < upcomingVaccines.length - 1 && <Divider sx={{ mt: 1.5 }} />}
                            </Box>
                          ))
                        ) : (
                          <Typography sx={{ color: "#a48b9b", fontStyle: "italic", textAlign: "center", py: 2 }}>
                            No upcoming vaccines
                          </Typography>
                        )}
                      </Box>
                    </Paper>
                  </Grid>

                  {/* Completed Vaccines Summary and Progress */}
                  <Grid item>
                    <Paper sx={{ p: 2, bgcolor: "white", borderRadius: 3 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Typography sx={{ color: "#ac4e7a", mb: 1, fontWeight: 600 }}>
                            Completed ({completedVaccines.length})
                          </Typography>
                          <Box sx={{ maxHeight: 120, overflow: "auto" }}>
                            {completedVaccines.length > 0 ? (
                              completedVaccines.map(v => (
                                <Chip
                                  key={v.id}
                                  label={v.name}
                                  size="small"
                                  sx={{ 
                                    m: 0.5, 
                                    bgcolor: "#e8f5e9", 
                                    color: "#2e7d32",
                                    '& .MuiChip-label': { fontWeight: 500 }
                                  }}
                                />
                              ))
                            ) : (
                              <Typography variant="body2" sx={{ color: "#a48b9b", fontStyle: "italic" }}>
                                No completed vaccines
                              </Typography>
                            )}
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Box sx={{ textAlign: "center", p: 1 }}>
                            <Typography variant="h3" sx={{ color: "#ff6b95", fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>
                              {completedVaccines.length}/{vaccinesDueByAge.length}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#8b6b7a", mb: 1 }}>
                              vaccines completed for age {selectedAgeMonths} months
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={progressPercentage}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                bgcolor: "#f0e0e8",
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: "#ff9eb5",
                                  borderRadius: 4,
                                },
                              }}
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Fade>

        {/* Add Log CTA */}
        <Fade in timeout={1400}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              bgcolor: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,158,181,0.2)",
              textAlign: "center"
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: "'Playfair Display', serif",
                color: "#ac4e7a",
                mb: 2
              }}
            >
              Add Today's Baby Log
            </Typography>

            <Button
              variant="contained"
              sx={{
                borderRadius: 40,
                px: 4,
                py: 1,
                background: "linear-gradient(45deg, #ff9eb5, #ff6b95)",
                boxShadow: "0 10px 25px rgba(255,107,149,0.3)",
                color: "white",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 15px 30px rgba(255,107,149,0.4)",
                },
                transition: "all 0.3s ease",
              }}
              onClick={() => navigate("/baby/add")}
            >
              ADD BABY LOG
            </Button>
          </Paper>
        </Fade>

        {/* Mother Dashboard Link */}
        <Fade in timeout={1600}>
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Button
              onClick={() => navigate("/mother")}
              sx={{ 
                color: "#8b6b7a",
                "&:hover": { color: "#ac4e7a" }
              }}
            >
              ← Back to Mother's Dashboard
            </Button>
          </Box>
        </Fade>
      </Box>

      <style>
        {`
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

/* Reusable Glass Card Component */
function GlassCard({ icon, color, label, value }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 3,
        bgcolor: "rgba(255,255,255,0.6)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,158,181,0.2)",
        transition: "all 0.3s ease",
        height: "100%",
        "&:hover": {
          transform: "translateY(-5px)",
          bgcolor: "rgba(255,255,255,0.8)",
        },
      }}
    >
      <Avatar sx={{ bgcolor: color, width: 40, height: 40, mb: 1 }}>
        {icon}
      </Avatar>
      <Typography variant="body2" sx={{ color: "#8b6b7a", mb: 1, fontWeight: 500 }}>
        {label}
      </Typography>
      <Typography
        variant="h5"
        sx={{
          fontFamily: "'Playfair Display', serif",
          color: "#7d4b7a",
          fontWeight: 600,
        }}
      >
        {value}
      </Typography>
    </Paper>
  );
}

export default BabyDashboard;