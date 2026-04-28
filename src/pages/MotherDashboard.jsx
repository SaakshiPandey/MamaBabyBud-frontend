import { useEffect, useState, useContext } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Avatar,
  Paper,
  Alert,
  AlertTitle,
  Collapse,
  IconButton,
  Fade,
  LinearProgress,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Favorite,
  Spa,
  ChildCare,
  MonitorHeart,
  Bedtime,
  AddCircle,
  ChevronRight,
  WaterDrop,
  Close as CloseIcon,
  Warning,
  Speed,
  Insights,
  TrendingUp,
  TrendingDown,
  TrendingFlat,
} from "@mui/icons-material";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
  ReferenceLine,
} from "recharts";

function MotherDashboard() {
  const { user, logout } = useContext(AuthContext);
  const [logs, setLogs] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [openAlerts, setOpenAlerts] = useState(true);
  const navigate = useNavigate();

  const fetchLogs = async () => {
    try {
      const { data } = await API.get("/api/mother");
      setLogs(data);
    } catch (error) {
      console.error(error);
    }
  };
  
  useEffect(() => {
    fetchLogs();
  }, []);

  // Calculate Overall Wellness Score (0-100)
  // Higher score = better health
  const calculateWellnessScore = (log) => {
    if (!log) return null;
    
    let score = 100;
    let deductions = [];
    
    // Blood Pressure (Systolic 120, Diastolic 80 is ideal)
    if (log.systolic && log.diastolic) {
      const systolicDeviation = Math.abs(log.systolic - 120);
      const diastolicDeviation = Math.abs(log.diastolic - 80);
      const bpDeduction = (systolicDeviation + diastolicDeviation) / 2;
      if (bpDeduction > 0) {
        deductions.push({ factor: "BP", deduction: Math.min(bpDeduction, 25) });
        score -= Math.min(bpDeduction, 25);
      }
    }
    
    // Blood Sugar (Ideal: 80-120)
    if (log.sugarLevel) {
      let sugarDeduction = 0;
      if (log.sugarLevel > 120) {
        sugarDeduction = (log.sugarLevel - 120) / 2;
      } else if (log.sugarLevel < 80) {
        sugarDeduction = (80 - log.sugarLevel) / 2;
      }
      if (sugarDeduction > 0) {
        deductions.push({ factor: "Sugar", deduction: Math.min(sugarDeduction, 30) });
        score -= Math.min(sugarDeduction, 30);
      }
    }
    
    // Heart Rate (Ideal: 60-80 bpm)
    if (log.heartRate) {
      let hrDeduction = 0;
      if (log.heartRate > 80) {
        hrDeduction = (log.heartRate - 80) / 2;
      } else if (log.heartRate < 60) {
        hrDeduction = (60 - log.heartRate) / 2;
      }
      if (hrDeduction > 0) {
        deductions.push({ factor: "Heart Rate", deduction: Math.min(hrDeduction, 20) });
        score -= Math.min(hrDeduction, 20);
      }
    }
    
    // Sleep (Ideal: 7-9 hours)
    if (log.sleepHours) {
      let sleepDeduction = 0;
      if (log.sleepHours < 7) {
        sleepDeduction = (7 - log.sleepHours) * 5;
      } else if (log.sleepHours > 9) {
        sleepDeduction = (log.sleepHours - 9) * 3;
      }
      if (sleepDeduction > 0) {
        deductions.push({ factor: "Sleep", deduction: Math.min(sleepDeduction, 15) });
        score -= Math.min(sleepDeduction, 15);
      }
    }
    
    // Water Intake (Ideal: 8-10 glasses)
    if (log.waterIntake) {
      let waterDeduction = 0;
      if (log.waterIntake < 8) {
        waterDeduction = (8 - log.waterIntake) * 4;
      }
      if (waterDeduction > 0) {
        deductions.push({ factor: "Hydration", deduction: Math.min(waterDeduction, 15) });
        score -= Math.min(waterDeduction, 15);
      }
    }
    
    // Weight (during pregnancy - gentle tracking)
    if (log.weight && logs.length > 1) {
      // This is a simplified version - ideally would compare to pre-pregnancy weight
      // For now, just flag rapid changes
      const prevLog = logs.find(l => new Date(l.date) < new Date(log.date));
      if (prevLog && prevLog.weight) {
        const weightChange = Math.abs(log.weight - prevLog.weight);
        if (weightChange > 5) { // More than 5kg change
          const weightDeduction = (weightChange - 5) * 2;
          deductions.push({ factor: "Weight Change", deduction: Math.min(weightDeduction, 10) });
          score -= Math.min(weightDeduction, 10);
        }
      }
    }
    
    // Mood adjustment (extra point for good mood)
    if (log.mood) {
      const moodBonus = {
        happy: 5,
        excited: 5,
        calm: 3,
        "feeling good": 3,
        tired: -2,
        anxious: -3,
        stressed: -5,
      };
      const bonus = moodBonus[log.mood.toLowerCase()] || 0;
      score += bonus;
    }
    
    // Ensure score stays between 0 and 100
    return Math.min(Math.max(Math.round(score), 0), 100);
  };
  
  // Get wellness level and color based on score
  const getWellnessLevel = (score) => {
    if (score >= 85) return { level: "Excellent", color: "#4caf50", icon: "🌟", description: "You're doing fantastic! Keep up the great work!" };
    if (score >= 70) return { level: "Good", color: "#8bc34a", icon: "👍", description: "You're on the right track. Small improvements can make a big difference!" };
    if (score >= 55) return { level: "Fair", color: "#ffc107", icon: "⚠️", description: "Some areas need attention. Focus on sleep, hydration, and stress management." };
    if (score >= 40) return { level: "Concerning", color: "#ff9800", icon: "⚡", description: "Multiple health markers need improvement. Consider consulting a healthcare provider." };
    return { level: "Critical", color: "#f44336", icon: "🚨", description: "Urgent attention needed. Please consult your doctor immediately." };
  };
  
  // Calculate trend (improving, declining, stable)
  const calculateTrend = (wellnessData) => {
    if (wellnessData.length < 2) return { type: "stable", icon: <TrendingFlat />, text: "Need more data" };
    
    const recent = wellnessData.slice(-3);
    const old = wellnessData.slice(0, 3);
    
    const recentAvg = recent.reduce((sum, d) => sum + d.score, 0) / recent.length;
    const oldAvg = old.reduce((sum, d) => sum + d.score, 0) / old.length;
    const change = recentAvg - oldAvg;
    
    if (change > 5) return { type: "improving", icon: <TrendingUp />, text: "Improving", color: "#4caf50" };
    if (change < -5) return { type: "declining", icon: <TrendingDown />, text: "Declining", color: "#f44336" };
    return { type: "stable", icon: <TrendingFlat />, text: "Stable", color: "#ffc107" };
  };
  
  // Prepare wellness data for chart
  const prepareWellnessData = () => {
    const sortedLogs = [...logs].sort((a, b) => new Date(a.date) - new Date(b.date));
    return sortedLogs.map(log => ({
      date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fullDate: new Date(log.date),
      score: calculateWellnessScore(log),
      sleep: log.sleepHours,
      water: log.waterIntake,
      mood: log.mood,
      bpStatus: log.systolic && log.diastolic ? `${log.systolic}/${log.diastolic}` : null,
    }));
  };
  
  const wellnessData = prepareWellnessData();
  const currentScore = logs.length > 0 ? calculateWellnessScore(logs[0]) : null;
  const wellnessLevel = currentScore ? getWellnessLevel(currentScore) : null;
  const trend = calculateTrend(wellnessData);
  
  // Get detailed breakdown for current log
  const getDetailedBreakdown = () => {
    if (!logs[0]) return [];
    const log = logs[0];
    const breakdown = [];
    
    if (log.systolic && log.diastolic) {
      const bpScore = 100 - Math.min((Math.abs(log.systolic - 120) + Math.abs(log.diastolic - 80)) / 2, 25);
      breakdown.push({ metric: "Blood Pressure", score: bpScore, ideal: "120/80", current: `${log.systolic}/${log.diastolic}` });
    }
    if (log.sugarLevel) {
      let sugarScore = 100;
      if (log.sugarLevel > 120) sugarScore = Math.max(0, 100 - (log.sugarLevel - 120) * 1.5);
      else if (log.sugarLevel < 80) sugarScore = Math.max(0, 100 - (80 - log.sugarLevel) * 1.5);
      breakdown.push({ metric: "Blood Sugar", score: sugarScore, ideal: "80-120 mg/dL", current: `${log.sugarLevel} mg/dL` });
    }
    if (log.heartRate) {
      let hrScore = 100;
      if (log.heartRate > 80) hrScore = Math.max(0, 100 - (log.heartRate - 80) * 2);
      else if (log.heartRate < 60) hrScore = Math.max(0, 100 - (60 - log.heartRate) * 2);
      breakdown.push({ metric: "Heart Rate", score: hrScore, ideal: "60-80 bpm", current: `${log.heartRate} bpm` });
    }
    if (log.sleepHours) {
      let sleepScore = 100;
      if (log.sleepHours < 7) sleepScore = Math.max(0, 100 - (7 - log.sleepHours) * 12);
      else if (log.sleepHours > 9) sleepScore = Math.max(0, 100 - (log.sleepHours - 9) * 10);
      breakdown.push({ metric: "Sleep", score: sleepScore, ideal: "7-9 hours", current: `${log.sleepHours} hours` });
    }
    if (log.waterIntake) {
      let waterScore = Math.min(100, (log.waterIntake / 10) * 100);
      breakdown.push({ metric: "Hydration", score: waterScore, ideal: "8-10 glasses", current: `${log.waterIntake} glasses` });
    }
    
    return breakdown;
  };
  
  const detailedBreakdown = getDetailedBreakdown();

  // Rest of the existing helper functions
  const checkHealthAlerts = () => {
    const latest = logs[0];
    if (!latest) return;
    
    const newAlerts = [];
    // ... (keep existing alert logic from original)
    if (latest.systolic && latest.diastolic) {
      if (latest.systolic >= 140 || latest.diastolic >= 90) {
        newAlerts.push({
          type: "error",
          title: "Blood Pressure Alert",
          message: `Your BP is ${latest.systolic}/${latest.diastolic} - Above normal range`,
          icon: <Favorite />,
        });
      } else if (latest.systolic >= 130 || latest.diastolic >= 85) {
        newAlerts.push({
          type: "warning",
          title: "Elevated Blood Pressure",
          message: `Your BP is ${latest.systolic}/${latest.diastolic} - Slightly elevated`,
          icon: <Favorite />,
        });
      }
    }
    // ... add other alert checks
    setAlerts(newAlerts);
  };

  useEffect(() => {
    checkHealthAlerts();
  }, [logs]);

  const latestLog = logs.length > 0 ? logs[0] : null;

  const getVitalRiskDetails = (log) => {
    const risks = [];
    // ... (keep existing implementation)
    if (log.systolic && log.diastolic) {
      if (log.systolic >= 140 || log.diastolic >= 90) {
        risks.push({ vital: "BP", status: "High", color: "error" });
      } else if (log.systolic >= 130 || log.diastolic >= 85) {
        risks.push({ vital: "BP", status: "Elevated", color: "warning" });
      }
    }
    if (log.sugarLevel) {
      if (log.sugarLevel > 140) {
        risks.push({ vital: "Sugar", status: "High", color: "error" });
      } else if (log.sugarLevel < 70) {
        risks.push({ vital: "Sugar", status: "Low", color: "warning" });
      }
    }
    if (log.heartRate) {
      if (log.heartRate > 100) {
        risks.push({ vital: "Heart", status: "High", color: "warning" });
      } else if (log.heartRate < 60) {
        risks.push({ vital: "Heart", status: "Low", color: "info" });
      }
    }
    if (log.sleepHours && log.sleepHours < 7) {
      risks.push({ vital: "Sleep", status: "Low", color: "info" });
    }
    if (log.waterIntake && log.waterIntake < 6) {
      risks.push({ vital: "Water", status: "Low", color: "info" });
    }
    return risks;
  };

  const getMoodEmoji = (mood) => {
    const moods = {
      happy: "😊",
      calm: "😌",
      tired: "😴",
      anxious: "😰",
      excited: "🥰",
      stressed: "😫",
      "feeling good": "🌸",
    };
    return moods[mood?.toLowerCase()] || "😊";
  };

  const avgSleep = logs.length > 0 
    ? (logs.reduce((acc, log) => acc + (log.sleepHours || 0), 0) / logs.length).toFixed(1)
    : "—";

  // Custom Tooltip for wellness chart
  const CustomWellnessTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.95)', boxShadow: 3, borderRadius: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#ac4e7a', mb: 1 }}>
            {label}
          </Typography>
          <Typography variant="h6" sx={{ color: payload[0].color, fontWeight: 'bold' }}>
            Wellness Score: {data.score}
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', color: '#8b6b7a', mt: 1 }}>
            {data.mood && `Mood: ${data.mood} ${getMoodEmoji(data.mood)}`}
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', color: '#8b6b7a' }}>
            {data.sleep && `Sleep: ${data.sleep}h • Water: ${data.water} glasses`}
          </Typography>
          {data.bpStatus && (
            <Typography variant="caption" sx={{ display: 'block', color: '#8b6b7a' }}>
              BP: {data.bpStatus}
            </Typography>
          )}
        </Paper>
      );
    }
    return null;
  };

  // Floating blobs helper
  const softBlob = (color, left, top, size = "400px") => ({
    position: "absolute",
    width: size,
    height: size,
    background: `radial-gradient(circle at 30% 30%, ${color} 0%, ${color}80 70%, transparent 100%)`,
    borderRadius: "60% 40% 50% 50% / 40% 50% 60% 50%",
    filter: "blur(100px)",
    left: left,
    top: top,
    opacity: 0.4,
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
        pt: { xs: '80px', md: '90px' },
        pb: 4,
        px: { xs: 2, md: 4 },
      }}
    >
      {/* Floating Blobs */}
      <Box sx={softBlob("#fec8d8", "-150px", "-100px", "500px")} />
      <Box sx={softBlob("#d4b7e8", "70%", "-50px", "450px")} />
      <Box sx={softBlob("#b5d0e8", "20%", "70%", "550px")} />
      <Box sx={softBlob("#fbd5e0", "85%", "60%", "400px")} />
      
      {/* Floating Elements */}
      <Box sx={floatingElement("❤️", "5%", "20%", "4s")} />
      <Box sx={floatingElement("🌸", "90%", "15%", "5s")} />
      <Box sx={floatingElement("🤱", "15%", "85%", "6s")} />
      <Box sx={floatingElement("👶", "80%", "80%", "4.5s")} />

      {/* Main Content */}
      <Box sx={{ maxWidth: "1200px", mx: "auto", position: "relative", zIndex: 1 }}>
        {/* Welcome Header */}
        <Fade in timeout={1000}>
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontFamily: "'Playfair Display', serif",
                background: "linear-gradient(135deg, #ac4e7a, #7d4b7a, #5d6d9e)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 600,
                mb: 0.5,
              }}
            >
              Welcome back, {user?.name?.split(' ')[0] || "Mama"} 
            </Typography>
            <Typography variant="body1" sx={{ color: "#8b6b7a", fontSize: "1.1rem" }}>
              Here's a gentle look at your health today
            </Typography>
          </Box>
        </Fade>

        {/* Alerts Section */}
        {alerts.length > 0 && (
          <Fade in timeout={1200}>
            <Box sx={{ mb: 4 }}>
              <Collapse in={openAlerts}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    bgcolor: "rgba(255,255,255,0.6)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,158,181,0.2)",
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                    <Typography variant="h6" sx={{ fontFamily: "'Playfair Display', serif", color: "#ac4e7a", fontWeight: 500 }}>
                      Health Alerts
                    </Typography>
                    <IconButton size="small" onClick={() => setOpenAlerts(false)} sx={{ color: "#ac4e7a" }}>
                      <CloseIcon />
                    </IconButton>
                  </Box>
                  {alerts.map((alert, index) => (
                    <Alert 
                      key={index}
                      severity={alert.type}
                      icon={alert.icon}
                      sx={{ 
                        mb: index < alerts.length - 1 ? 1 : 0,
                        borderRadius: 2,
                        bgcolor: alert.type === 'error' ? 'rgba(255,107,149,0.1)' : 
                                alert.type === 'warning' ? 'rgba(255,182,193,0.1)' : 'rgba(180,200,255,0.1)',
                        backdropFilter: "blur(5px)",
                        border: alert.type === 'error' ? '1px solid #ff6b95' :
                                alert.type === 'warning' ? '1px solid #ffb6c1' : '1px solid #b5d0e8',
                        '& .MuiAlert-message': { color: '#5d4b6e' }
                      }}
                    >
                      <AlertTitle sx={{ color: '#ac4e7a', fontWeight: 500 }}>{alert.title}</AlertTitle>
                      {alert.message}
                    </Alert>
                  ))}
                </Paper>
              </Collapse>
            </Box>
          </Fade>
        )}

        {/* Stats Cards */}
        <Fade in timeout={1400}>
          <Grid container spacing={3} sx={{ mb: 5 }}>
            <Grid item xs={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  bgcolor: "rgba(255,255,255,0.6)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,158,181,0.2)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    bgcolor: "rgba(255,255,255,0.8)",
                  },
                }}
              >
                <Avatar sx={{ bgcolor: "#ffb6c1", width: 40, height: 40, mb: 1 }}>
                  <Spa sx={{ fontSize: 24, color: "white" }} />
                </Avatar>
                <Typography variant="body2" sx={{ color: "#8b6b7a", mb: 1, fontWeight: 500 }}>
                  Total Logs
                </Typography>
                <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", color: "#ac4e7a", fontWeight: 500 }}>
                  {logs.length}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  bgcolor: "rgba(255,255,255,0.6)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(158,183,212,0.2)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    bgcolor: "rgba(255,255,255,0.8)",
                  },
                }}
              >
                <Avatar sx={{ bgcolor: "#d4b7e8", width: 40, height: 40, mb: 1 }}>
                  <Favorite sx={{ fontSize: 24, color: "white" }} />
                </Avatar>
                <Typography variant="body2" sx={{ color: "#8b6b7a", mb: 1, fontWeight: 500 }}>
                  Latest BP
                </Typography>
                <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", color: "#7d4b7a", fontWeight: 500 }}>
                  {latestLog ? `${latestLog.systolic}/${latestLog.diastolic}` : "—"}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  bgcolor: "rgba(255,255,255,0.6)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(181,208,232,0.2)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    bgcolor: "rgba(255,255,255,0.8)",
                  },
                }}
              >
                <Avatar sx={{ bgcolor: "#b5d0e8", width: 40, height: 40, mb: 1 }}>
                  <Bedtime sx={{ fontSize: 24, color: "white" }} />
                </Avatar>
                <Typography variant="body2" sx={{ color: "#8b6b7a", mb: 1, fontWeight: 500 }}>
                  Avg Sleep
                </Typography>
                <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", color: "#5d6d9e", fontWeight: 500 }}>
                  {avgSleep}h
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  bgcolor: "rgba(255,255,255,0.6)",
                  backdropFilter: "blur(10px)",
                  border: latestLog?.riskScore >= 4 ? "1px solid #ff6b95" :
                          latestLog?.riskScore >= 2 ? "1px solid #ffb6c1" : "1px solid #b5d0e8",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    bgcolor: "rgba(255,255,255,0.8)",
                  },
                }}
              >
                <Avatar sx={{ bgcolor: latestLog?.riskScore >= 4 ? "#ff6b95" : 
                                    latestLog?.riskScore >= 2 ? "#ffb6c1" : "#b5d0e8", 
                          width: 40, height: 40, mb: 1 }}>
                  <Warning sx={{ fontSize: 24, color: "white" }} />
                </Avatar>
                <Typography variant="body2" sx={{ color: "#8b6b7a", mb: 1, fontWeight: 500 }}>
                  Risk Status
                </Typography>
                {latestLog ? (
                  <Box>
                    {getVitalRiskDetails(latestLog).length > 0 ? (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {getVitalRiskDetails(latestLog).map((risk, idx) => (
                          <Chip
                            key={idx}
                            label={`${risk.vital}: ${risk.status}`}
                            size="small"
                            sx={{
                              height: 24,
                              fontSize: "0.7rem",
                              bgcolor: risk.color === 'error' ? '#ff6b95' :
                                      risk.color === 'warning' ? '#ffb6c1' : '#b5d0e8',
                              color: 'white',
                            }}
                          />
                        ))}
                      </Box>
                    ) : (
                      <Chip
                        label="Normal"
                        size="small"
                        sx={{ height: 24, bgcolor: '#b5d0e8', color: 'white' }}
                      />
                    )}
                  </Box>
                ) : (
                  <Typography variant="body1" sx={{ color: "#8b6b7a" }}>
                    —
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Fade>

        {/* NEW: Overall Wellness Score Card */}
        {currentScore && (
          <Fade in timeout={1600}>
            <Paper
              elevation={0}
              sx={{
                mb: 5,
                p: 4,
                borderRadius: 3,
                bgcolor: "rgba(255,255,255,0.6)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,158,181,0.2)",
                background: `linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.8) 100%)`,
              }}
            >
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: "#8b6b7a", mb: 1, fontWeight: 500 }}>
                      Overall Wellness Score
                    </Typography>
                    <Typography 
                      variant="h1" 
                      sx={{ 
                        fontFamily: "'Playfair Display', serif",
                        color: wellnessLevel.color,
                        fontWeight: 700,
                        fontSize: { xs: '4rem', md: '5rem' },
                        lineHeight: 1,
                      }}
                    >
                      {currentScore}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1 }}>
                      <Typography variant="h6" sx={{ color: wellnessLevel.color, fontWeight: 500 }}>
                        {wellnessLevel.icon} {wellnessLevel.level}
                      </Typography>
                      <Tooltip title={`Trend: ${trend.text}`}>
                        <Box sx={{ color: trend.color, display: 'flex', alignItems: 'center' }}>
                          {trend.icon}
                        </Box>
                      </Tooltip>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={8}>
                  <Box>
                    <Typography variant="body1" sx={{ color: "#5d4b6e", mb: 2 }}>
                      {wellnessLevel.description}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#8b6b7a", mb: 1, fontWeight: 500 }}>
                      Score Breakdown:
                    </Typography>
                    <Grid container spacing={1}>
                      {detailedBreakdown.map((item, idx) => (
                        <Grid item xs={12} sm={6} key={idx}>
                          <Box sx={{ mb: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="caption" sx={{ color: "#8b6b7a" }}>
                                {item.metric}
                              </Typography>
                              <Typography variant="caption" sx={{ color: "#ac4e7a", fontWeight: 500 }}>
                                {Math.round(item.score)}%
                              </Typography>
                            </Box>
                            <LinearProgress 
                              variant="determinate" 
                              value={item.score} 
                              sx={{ 
                                height: 6, 
                                borderRadius: 3,
                                bgcolor: 'rgba(255,158,181,0.2)',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: item.score >= 70 ? '#4caf50' : item.score >= 50 ? '#ffc107' : '#f44336',
                                  borderRadius: 3,
                                }
                              }}
                            />
                            <Typography variant="caption" sx={{ color: "#b5d0e8", fontSize: '0.7rem' }}>
                              {item.current} (Ideal: {item.ideal})
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Fade>
        )}

        {/* Recent Health Logs Section */}
        <Fade in timeout={1700}>
          <Box sx={{ mb: 5 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontFamily: "'Playfair Display', serif",
                  background: "linear-gradient(135deg, #ac4e7a, #7d4b7a)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: 600,
                }}
              >
                Recent Health Logs
              </Typography>
              
              <Button
                variant="contained"
                sx={{
                  borderRadius: 40,
                  px: 3,
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
                onClick={() => navigate("/mother/add")}
                startIcon={<AddCircle />}
              >
                ADD NEW LOG
              </Button>
            </Box>

            {logs.length === 0 ? (
              <Paper
                elevation={0}
                sx={{
                  p: 6,
                  borderRadius: 4,
                  bgcolor: "rgba(255,255,255,0.6)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,158,181,0.2)",
                  textAlign: "center",
                }}
              >
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: "#ffb6c1",
                    margin: "0 auto 16px",
                  }}
                >
                  <Spa sx={{ fontSize: 48, color: "white" }} />
                </Avatar>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontFamily: "'Playfair Display', serif",
                    color: "#ac4e7a", 
                    mb: 1,
                    fontWeight: 500,
                  }}
                >
                  No health logs yet
                </Typography>
                <Typography sx={{ color: "#8b6b7a", mb: 3 }}>
                  Start tracking your wellness journey today
                </Typography>
                <Button
                  variant="outlined"
                  sx={{
                    borderRadius: 40,
                    px: 4,
                    py: 1,
                    borderColor: "#ff9eb5",
                    color: "#ac4e7a",
                    "&:hover": {
                      borderColor: "#ff6b95",
                      bgcolor: "rgba(255,158,181,0.1)",
                    },
                  }}
                  onClick={() => navigate("/mother/add")}
                >
                  Add Your First Log
                </Button>
              </Paper>
            ) : (
              <>
                {/* Wellness Trends Chart - MAIN VISUALIZATION */}
                <Paper
                  elevation={0}
                  sx={{
                    mb: 3,
                    p: 3,
                    borderRadius: 3,
                    bgcolor: "rgba(255,255,255,0.6)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,158,181,0.2)",
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                    <Typography variant="h6" sx={{ color: "#ac4e7a", fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Insights /> Wellness Journey Over Time
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#8b6b7a" }}>
                      Score Range: 0-100 (Higher is Better)
                    </Typography>
                  </Box>
                  
                  <ResponsiveContainer width="100%" height={400}>
                    <ComposedChart data={wellnessData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0c0d0" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#8b6b7a"
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        interval={Math.floor(wellnessData.length / 10)}
                      />
                      <YAxis 
                        stroke="#8b6b7a" 
                        domain={[0, 100]}
                        label={{ value: 'Wellness Score', angle: -90, position: 'insideLeft', style: { fill: '#8b6b7a' } }}
                      />
                      <ReTooltip content={<CustomWellnessTooltip />} />
                      
                      {/* Background areas for different wellness zones */}
                      <ReferenceLine y={85} stroke="#4caf50" strokeDasharray="5 5" label={{ value: "Excellent", position: "right", fill: "#4caf50" }} />
                      <ReferenceLine y={70} stroke="#8bc34a" strokeDasharray="5 5" label={{ value: "Good", position: "right", fill: "#8bc34a" }} />
                      <ReferenceLine y={55} stroke="#ffc107" strokeDasharray="5 5" label={{ value: "Fair", position: "right", fill: "#ffc107" }} />
                      <ReferenceLine y={40} stroke="#ff9800" strokeDasharray="5 5" label={{ value: "Concerning", position: "right", fill: "#ff9800" }} />
                      
                      {/* Area under the line for visual effect */}
                      <Area 
                        type="monotone" 
                        dataKey="score" 
                        stroke="none" 
                        fill="url(#colorGradient)" 
                        fillOpacity={0.3}
                      />
                      
                      {/* Main line */}
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#ac4e7a" 
                        strokeWidth={3} 
                        dot={{ fill: '#ac4e7a', r: 5, strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 8, fill: '#ff6b95' }}
                        name="Wellness Score"
                      />
                      
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ac4e7a" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#b5d0e8" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                    </ComposedChart>
                  </ResponsiveContainer>
                  
                  {/* Trend Summary */}
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(255,182,193,0.1)', borderRadius: 2 }}>
                    <Typography variant="body2" sx={{ color: "#5d4b6e", display: 'flex', alignItems: 'center', gap: 1 }}>
                      {trend.type === 'improving' && '📈 Your wellness is improving! Keep up the healthy habits.'}
                      {trend.type === 'declining' && '📉 Your wellness score is declining. Consider consulting a healthcare provider.'}
                      {trend.type === 'stable' && '➡️ Your wellness is stable. Small improvements can make a big difference!'}
                      {trend.type === 'stable' && wellnessData.length < 3 && '📊 Add more health logs to see your wellness trends!'}
                    </Typography>
                  </Box>
                </Paper>

                {/* Data Table */}
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    bgcolor: "rgba(255,255,255,0.6)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,158,181,0.2)",
                    overflow: "auto",
                    '& .MuiTableCell-root': {
                      whiteSpace: 'nowrap',
                      padding: '12px 16px',
                    }
                  }}
                >
                  <Table sx={{ minWidth: 900 }}>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "rgba(255,182,193,0.2)" }}>
                        <TableCell sx={{ color: "#ac4e7a", fontWeight: 600, fontFamily: "'Playfair Display', serif", borderBottom: "1px solid rgba(255,158,181,0.2)" }}>Date</TableCell>
                        <TableCell sx={{ color: "#ac4e7a", fontWeight: 600, fontFamily: "'Playfair Display', serif", borderBottom: "1px solid rgba(255,158,181,0.2)" }}>BP</TableCell>
                        <TableCell sx={{ color: "#ac4e7a", fontWeight: 600, fontFamily: "'Playfair Display', serif", borderBottom: "1px solid rgba(255,158,181,0.2)" }}>Weight</TableCell>
                        <TableCell sx={{ color: "#ac4e7a", fontWeight: 600, fontFamily: "'Playfair Display', serif", borderBottom: "1px solid rgba(255,158,181,0.2)" }}>Sugar</TableCell>
                        <TableCell sx={{ color: "#ac4e7a", fontWeight: 600, fontFamily: "'Playfair Display', serif", borderBottom: "1px solid rgba(255,158,181,0.2)" }}>Heart</TableCell>
                        <TableCell sx={{ color: "#ac4e7a", fontWeight: 600, fontFamily: "'Playfair Display', serif", borderBottom: "1px solid rgba(255,158,181,0.2)" }}>Sleep</TableCell>
                        <TableCell sx={{ color: "#ac4e7a", fontWeight: 600, fontFamily: "'Playfair Display', serif", borderBottom: "1px solid rgba(255,158,181,0.2)" }}>Mood</TableCell>
                        <TableCell sx={{ color: "#ac4e7a", fontWeight: 600, fontFamily: "'Playfair Display', serif", borderBottom: "1px solid rgba(255,158,181,0.2)" }}>Wellness</TableCell>
                        <TableCell sx={{ color: "#ac4e7a", fontWeight: 600, fontFamily: "'Playfair Display', serif", borderBottom: "1px solid rgba(255,158,181,0.2)" }}>Risk</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {logs.map((log, index) => {
                        const vitalRisks = getVitalRiskDetails(log);
                        const wellnessScore = calculateWellnessScore(log);
                        const wellnessInfo = getWellnessLevel(wellnessScore);
                        return (
                          <TableRow 
                            key={log._id} 
                            sx={{ 
                              "&:last-child td": { borderBottom: 0 },
                              "&:hover": { bgcolor: "rgba(255,182,193,0.1)" }
                            }}
                          >
                            <TableCell sx={{ color: "#5d4b6e", borderBottom: "1px solid rgba(255,158,181,0.1)" }}>
                              {new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </TableCell>
                            <TableCell sx={{ 
                              color: "#5d4b6e", 
                              borderBottom: "1px solid rgba(255,158,181,0.1)",
                              fontWeight: log.systolic >= 140 || log.diastolic >= 90 ? 600 : 400,
                            }}>
                              {log.systolic}/{log.diastolic}
                            </TableCell>
                            <TableCell sx={{ color: "#5d4b6e", borderBottom: "1px solid rgba(255,158,181,0.1)" }}>
                              {log.weight} kg
                            </TableCell>
                            <TableCell sx={{ 
                              color: "#5d4b6e", 
                              borderBottom: "1px solid rgba(255,158,181,0.1)",
                              fontWeight: log.sugarLevel > 140 || log.sugarLevel < 70 ? 600 : 400,
                            }}>
                              {log.sugarLevel}
                            </TableCell>
                            <TableCell sx={{ 
                              color: "#5d4b6e", 
                              borderBottom: "1px solid rgba(255,158,181,0.1)",
                              fontWeight: log.heartRate > 100 || log.heartRate < 60 ? 600 : 400,
                            }}>
                              {log.heartRate} bpm
                            </TableCell>
                            <TableCell sx={{ 
                              color: "#5d4b6e", 
                              borderBottom: "1px solid rgba(255,158,181,0.1)",
                              fontWeight: log.sleepHours < 7 ? 600 : 400,
                            }}>
                              {log.sleepHours}h
                            </TableCell>
                            <TableCell sx={{ color: "#5d4b6e", borderBottom: "1px solid rgba(255,158,181,0.1)" }}>
                              {getMoodEmoji(log.mood)} {log.mood || "—"}
                            </TableCell>
                            <TableCell sx={{ borderBottom: "1px solid rgba(255,158,181,0.1)" }}>
                              <Tooltip title={`${wellnessInfo.level} - ${wellnessInfo.description}`}>
                                <Chip
                                  label={`${wellnessScore} ${wellnessInfo.icon}`}
                                  size="small"
                                  sx={{
                                    height: 24,
                                    bgcolor: wellnessInfo.color,
                                    color: 'white',
                                    fontWeight: 500,
                                  }}
                                />
                              </Tooltip>
                            </TableCell>
                            <TableCell sx={{ borderBottom: "1px solid rgba(255,158,181,0.1)" }}>
                              {vitalRisks.length > 0 ? (
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                  {vitalRisks.map((risk, idx) => (
                                    <Chip
                                      key={idx}
                                      label={`${risk.vital} ${risk.status}`}
                                      size="small"
                                      sx={{
                                        height: 20,
                                        fontSize: "0.65rem",
                                        bgcolor: risk.color === 'error' ? '#ff6b95' :
                                                risk.color === 'warning' ? '#ffb6c1' : '#b5d0e8',
                                        color: 'white',
                                      }}
                                    />
                                  ))}
                                </Box>
                              ) : (
                                <Chip
                                  label="Normal"
                                  size="small"
                                  sx={{ height: 20, fontSize: "0.65rem", bgcolor: '#b5d0e8', color: 'white' }}
                                />
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Paper>
              </>
            )}
          </Box>
        </Fade>

        {/* Baby Redirect Card */}
        <Fade in timeout={1800}>
          <Paper
            elevation={0}
            sx={{
              mb: 4,
              p: 4,
              borderRadius: 3,
              bgcolor: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,158,181,0.2)",
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      background: "linear-gradient(45deg, #ff9eb5, #ff6b95)",
                    }}
                  >
                    <ChildCare sx={{ fontSize: 32, color: "white" }} />
                  </Avatar>
                  <Box>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontFamily: "'Playfair Display', serif",
                        background: "linear-gradient(135deg, #ac4e7a, #7d4b7a)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        mb: 0.5,
                        fontWeight: 600,
                      }}
                    >
                      Check on your little one 🌸
                    </Typography>
                    <Typography sx={{ color: "#8b6b7a" }}>
                      See how your baby is growing and track their milestones
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={4} sx={{ textAlign: { xs: "left", md: "right" } }}>
                <Button
                  variant="outlined"
                  sx={{
                    borderRadius: 40,
                    px: 3,
                    py: 1,
                    borderColor: "#ff9eb5",
                    color: "#ac4e7a",
                    "&:hover": {
                      borderColor: "#ff6b95",
                      bgcolor: "rgba(255,158,181,0.1)",
                      transform: "translateX(5px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                  onClick={() => navigate("/baby-dashboard")}
                  endIcon={<ChevronRight />}
                >
                  BABY'S DASHBOARD
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Fade>

        {/* Logout Button */}
        <Fade in timeout={2000}>
          <Box sx={{ textAlign: "right" }}>
            <Button
              onClick={logout}
              sx={{ 
                color: "#8b6b7a",
                "&:hover": { 
                  color: "#ac4e7a",
                  transform: "scale(1.05)",
                },
                transition: "all 0.3s ease",
              }}
            >
              LOGOUT
            </Button>
          </Box>
        </Fade>
      </Box>

      {/* Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
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

export default MotherDashboard;