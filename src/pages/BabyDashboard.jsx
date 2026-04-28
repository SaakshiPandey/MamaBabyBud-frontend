import {
  BabyChangingStation,
  CheckCircle,
  ChildCare,
  EventAvailable,
  Restaurant,
  Scale,
  ShowChart,
  Straighten,
  Vaccines
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  Fade,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";

function BabyDashboard() {
  const { user } = useContext(AuthContext);
  const [logs, setLogs] = useState([]);
  const [selectedAgeMonths, setSelectedAgeMonths] = useState(0);
  const [takenVaccines, setTakenVaccines] = useState(() => {
    const saved = localStorage.getItem('takenVaccines');
    return saved ? JSON.parse(saved) : [];
  });
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('takenVaccines', JSON.stringify(takenVaccines));
  }, [takenVaccines]);

  const fetchLogs = async () => {
    try {
      const { data } = await API.get("/api/baby");
      const sortedLogs = data.sort((a, b) => new Date(a.date) - new Date(b.date));
      setLogs(sortedLogs);
    } catch (err) {
      console.error("Error fetching baby logs:", err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const latestLog = logs.length > 0 ? logs[logs.length - 1] : null;

  const calculateOverallGrowth = () => {
    if (logs.length < 2) return null;
    
    const firstLog = logs[0];
    const lastLog = logs[logs.length - 1];
    const daysDiff = (new Date(lastLog.date) - new Date(firstLog.date)) / (1000 * 60 * 60 * 24);
    const monthsDiff = daysDiff / 30;
    
    const weightGain = lastLog.weight && firstLog.weight 
      ? ((lastLog.weight - firstLog.weight) / monthsDiff).toFixed(2)
      : null;
    
    const heightGain = lastLog.height && firstLog.height
      ? ((lastLog.height - firstLog.height) / monthsDiff).toFixed(2)
      : null;
    
    const avgDailyWeightGain = lastLog.weight && firstLog.weight
      ? ((lastLog.weight - firstLog.weight) / daysDiff).toFixed(3)
      : null;
    
    const avgDailyHeightGain = lastLog.height && firstLog.height
      ? ((lastLog.height - firstLog.height) / daysDiff).toFixed(2)
      : null;
    
    return {
      totalDays: daysDiff.toFixed(0),
      totalMonths: monthsDiff.toFixed(1),
      totalWeightGain: (lastLog.weight - firstLog.weight)?.toFixed(2),
      totalHeightGain: (lastLog.height - firstLog.height)?.toFixed(1),
      monthlyWeightGain: weightGain,
      monthlyHeightGain: heightGain,
      dailyWeightGain: avgDailyWeightGain,
      dailyHeightGain: avgDailyHeightGain,
      startWeight: firstLog.weight,
      currentWeight: lastLog.weight,
      startHeight: firstLog.height,
      currentHeight: lastLog.height,
    };
  };

  const overallGrowth = calculateOverallGrowth();

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

  const vaccinesDueByAge = VACCINE_SCHEDULE.filter(
    (v) => v.dueMonths <= selectedAgeMonths
  );

  const completedVaccines = vaccinesDueByAge.filter(v => takenVaccines.includes(v.id));
  
  const upcomingVaccines = VACCINE_SCHEDULE
    .filter(v => v.dueMonths > selectedAgeMonths)
    .sort((a, b) => a.dueMonths - b.dueMonths)
    .slice(0, 5);

  const ageOptions = Array.from({ length: 61 }, (_, i) => ({
    value: i,
    label: i < 12 
      ? `${i} month${i !== 1 ? 's' : ''}` 
      : `${Math.floor(i/12)} year${Math.floor(i/12) !== 1 ? 's' : ''} ${i%12 > 0 ? `${i%12} month${i%12 !== 1 ? 's' : ''}` : ''}`
  }));

  const progressPercentage = vaccinesDueByAge.length > 0 
    ? (completedVaccines.length / vaccinesDueByAge.length) * 100 
    : 0;

  const last7DaysLogs = logs.slice(-7).reverse();

  const calculateAvgGain = (metric) => {
    if (logs.length < 2) return '—';
    const first = logs[0][metric];
    const last = logs[logs.length - 1][metric];
    if (!first || !last) return '—';
    
    const daysDiff = (new Date(logs[logs.length - 1].date) - new Date(logs[0].date)) / (1000 * 60 * 60 * 24);
    const monthsDiff = daysDiff / 30;
    const gain = ((last - first) / monthsDiff).toFixed(1);
    return gain;
  };

  const calculateAvg = (metric) => {
    const values = logs.map(l => l[metric]).filter(v => v);
    if (values.length === 0) return '—';
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    return avg.toFixed(1);
  };

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
      <Box sx={softBlob("#fec8d8", "-150px", "-100px", "500px")} />
      <Box sx={softBlob("#d4b7e8", "70%", "-50px", "450px")} />
      <Box sx={softBlob("#b5d0e8", "20%", "70%", "550px")} />
      
      <Box sx={floatingElement("👶", "5%", "15%", "4s")} />
      <Box sx={floatingElement("🍼", "90%", "25%", "5s")} />
      <Box sx={floatingElement("🧸", "10%", "80%", "6s")} />
      <Box sx={floatingElement("🌸", "85%", "70%", "4.5s")} />

      <Box sx={{ maxWidth: "1400px", mx: "auto", position: "relative", zIndex: 1 }}>
        
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
            <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
              <GlassCard
                icon={<Scale />}
                color="#ffb6c1"
                label="Weight"
                value={latestLog?.weight ? `${latestLog.weight} kg` : "—"}
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
              <GlassCard
                icon={<Straighten />}
                color="#d4b7e8"
                label="Height"
                value={latestLog?.height ? `${latestLog.height} cm` : "—"}
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
              <GlassCard
                icon={<ChildCare />}
                color="#b5d0e8"
                label="Sleep"
                value={latestLog?.sleepHours ? `${latestLog.sleepHours}h` : "—"}
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
              <GlassCard
                icon={<BabyChangingStation />}
                color="#ff9eb5"
                label="Diapers"
                value={latestLog?.diaperCount ? `${latestLog.diaperCount}` : "—"}
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
              <GlassCard
                icon={<Restaurant />}
                color="#9fb7d4"
                label="Feeding"
                value={latestLog?.feedingType ? latestLog.feedingType.replace('_', ' ') : "—"}
              />
            </Grid>
          </Grid>
        </Fade>
        
        {/* Vaccination Timeline Section */}
        <Fade in timeout={1200}>
          <Paper
            elevation={0}
            sx={{
              maxWidth: "1400px",
              mx: "auto",
              mb: 5,
              p: 4,
              borderRadius: 2,
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
              <Grid size={{ xs: 12, md: 5 }}>
                <Paper sx={{ p: 2, bgcolor: "white", borderRadius: 2, height: "100%" }}>
                  <Typography sx={{ color: "#ac4e7a", mb: 2, fontWeight: 600 }}>
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
                            borderRadius: 1.5,
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

              <Grid size={{ xs: 12, md: 7 }}>
                <Grid container spacing={2} direction="column">
                  <Grid size={{ xs: 12 }}>
                    <Paper sx={{ p: 2, bgcolor: "white", borderRadius: 2 }}>
                      <Typography sx={{ color: "#ac4e7a", mb: 2, fontWeight: 600, display: "flex", alignItems: "center", gap: 1 }}>
                        <EventAvailable sx={{ color: "#ff9eb5" }} /> Top 5 Upcoming Vaccines
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

                  <Grid size={{ xs: 12 }}>
                    <Paper sx={{ p: 2, bgcolor: "white", borderRadius: 2 }}>
                      <Typography sx={{ color: "#ac4e7a", mb: 1, fontWeight: 600, display: "flex", alignItems: "center", gap: 1 }}>
                        <CheckCircle sx={{ color: "#4caf50" }} /> Completed ({completedVaccines.length})
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2 }}>
                        {completedVaccines.length > 0 ? (
                          completedVaccines.map(v => (
                            <Chip
                              key={v.id}
                              label={v.name}
                              size="small"
                              sx={{ 
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
                      
                      {vaccinesDueByAge.length > 0 && (
                        <Box>
                          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                            <Typography variant="caption" sx={{ color: "#8b6b7a" }}>
                              Progress for age {selectedAgeMonths} months
                            </Typography>
                            <Typography variant="caption" sx={{ color: "#ac4e7a", fontWeight: 600 }}>
                              {completedVaccines.length}/{vaccinesDueByAge.length}
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={progressPercentage}
                            sx={{
                              height: 8,
                              borderRadius: 2,
                              bgcolor: "#f0e0e8",
                              '& .MuiLinearProgress-bar': {
                                bgcolor: "#ff9eb5",
                                borderRadius: 2,
                              },
                            }}
                          />
                        </Box>
                      )}
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Fade>

        {/* Weekly Growth Table */}
        {logs.length > 0 && (
          <Fade in timeout={1400}>
            <Paper
              elevation={0}
              sx={{
                maxWidth: "1400px",
                mx: "auto",
                mb: 5,
                p: 4,
                borderRadius: 2,
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
                <ShowChart sx={{ color: "#ff9eb5" }} /> Recent Weekly Growth Details
              </Typography>

              <Paper sx={{ p: 2, bgcolor: "white", borderRadius: 2, mb: 3 }}>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid size={{ xs: 3 }}>
                    <Typography sx={{ color: "#ac4e7a", fontWeight: 600 }}>Date</Typography>
                  </Grid>
                  <Grid size={{ xs: 2 }}>
                    <Typography sx={{ color: "#ac4e7a", fontWeight: 600 }}>Weight</Typography>
                  </Grid>
                  <Grid size={{ xs: 2 }}>
                    <Typography sx={{ color: "#ac4e7a", fontWeight: 600 }}>Height</Typography>
                  </Grid>
                  <Grid size={{ xs: 2 }}>
                    <Typography sx={{ color: "#ac4e7a", fontWeight: 600 }}>Sleep</Typography>
                  </Grid>
                  <Grid size={{ xs: 3 }}>
                    <Typography sx={{ color: "#ac4e7a", fontWeight: 600 }}>Feeding</Typography>
                  </Grid>
                </Grid>
                <Divider sx={{ mb: 2 }} />
                
                {last7DaysLogs.map((log, index) => (
                  <Grid container spacing={2} key={index} sx={{ mb: 1.5 }}>
                    <Grid size={{ xs: 3 }}>
                      <Typography sx={{ color: "#5d4b6e" }}>
                        {new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 2 }}>
                      <Typography sx={{ color: "#ff6b95", fontWeight: 500 }}>
                        {log.weight ? `${log.weight} kg` : '—'}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 2 }}>
                      <Typography sx={{ color: "#7d4b7a", fontWeight: 500 }}>
                        {log.height ? `${log.height} cm` : '—'}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 2 }}>
                      <Typography sx={{ color: "#b5d0e8", fontWeight: 500 }}>
                        {log.sleepHours ? `${log.sleepHours}h` : '—'}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 3 }}>
                      <Typography sx={{ color: "#9fb7d4", fontWeight: 500 }}>
                        {log.feedingType ? log.feedingType.replace('_', ' ') : '—'}
                      </Typography>
                    </Grid>
                  </Grid>
                ))}
              </Paper>

              <Grid container spacing={2}>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Paper sx={{ p: 2, bgcolor: "white", borderRadius: 2, textAlign: "center" }}>
                    <Typography variant="body2" sx={{ color: "#8b6b7a" }}>Avg Weight Gain</Typography>
                    <Typography variant="h6" sx={{ color: "#ff6b95", fontFamily: "'Playfair Display', serif" }}>
                      {calculateAvgGain('weight')} kg/month
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Paper sx={{ p: 2, bgcolor: "white", borderRadius: 2, textAlign: "center" }}>
                    <Typography variant="body2" sx={{ color: "#8b6b7a" }}>Avg Height Gain</Typography>
                    <Typography variant="h6" sx={{ color: "#7d4b7a", fontFamily: "'Playfair Display', serif" }}>
                      {calculateAvgGain('height')} cm/month
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Paper sx={{ p: 2, bgcolor: "white", borderRadius: 2, textAlign: "center" }}>
                    <Typography variant="body2" sx={{ color: "#8b6b7a" }}>Avg Sleep</Typography>
                    <Typography variant="h6" sx={{ color: "#b5d0e8", fontFamily: "'Playfair Display', serif" }}>
                      {calculateAvg('sleepHours')} hrs
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Paper sx={{ p: 2, bgcolor: "white", borderRadius: 2, textAlign: "center" }}>
                    <Typography variant="body2" sx={{ color: "#8b6b7a" }}>Total Logs</Typography>
                    <Typography variant="h6" sx={{ color: "#ff9eb5", fontFamily: "'Playfair Display', serif" }}>
                      {logs.length}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>
          </Fade>
        )}

        <Fade in timeout={1600}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 2,
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
                fontSize: "1.1rem",
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

        <Fade in timeout={1800}>
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Button
              onClick={() => navigate("/api/mother")}
              sx={{ 
                color: "#8b6b7a",
                "&:hover": { color: "#ac4e7a", transform: "scale(1.05)" },
                transition: "all 0.3s ease",
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
          
          @keyframes float {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
            100% { transform: translateY(0px) rotate(0deg); }
          }
        `}
      </style>
    </Box>
  );
}

function GlassCard({ icon, color, label, value }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 2,
        bgcolor: "rgba(255,255,255,0.6)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,158,181,0.2)",
        transition: "all 0.3s ease",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        "&:hover": {
          transform: "translateY(-5px)",
          bgcolor: "rgba(255,255,255,0.8)",
        },
      }}
    >
      <Avatar sx={{ bgcolor: color, width: 48, height: 48, mb: 1.5 }}>
        {icon}
      </Avatar>
      <Typography variant="body2" sx={{ color: "#8b6b7a", mb: 0.5, fontWeight: 500 }}>
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

const floatingElement = (emoji, left, top, duration) => ({
  position: "absolute",
  left: left,
  top: top,
  fontSize: "2rem",
  opacity: 0.2,
  animation: `float ${duration} infinite ease-in-out`,
  pointerEvents: "none",
  zIndex: 0,
});

export default BabyDashboard;