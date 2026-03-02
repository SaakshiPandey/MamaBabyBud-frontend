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
  ArrowForward,
} from "@mui/icons-material";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

function MotherDashboard() {
  const { user, logout } = useContext(AuthContext);
  const [logs, setLogs] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [openAlerts, setOpenAlerts] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    if (logs.length > 0) {
      checkHealthAlerts();
    }
  }, [logs]);

  const fetchLogs = async () => {
    try {
      const { data } = await API.get("/mother");
      setLogs(data);
    } catch (error) {
      console.error(error);
    }
  };

  const checkHealthAlerts = () => {
    const latest = logs[0];
    if (!latest) return;

    const newAlerts = [];

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

    if (latest.sugarLevel) {
      if (latest.sugarLevel > 140) {
        newAlerts.push({
          type: "error",
          title: "Blood Sugar Alert",
          message: `Sugar level: ${latest.sugarLevel} - Above normal range`,
          icon: <MonitorHeart />,
        });
      } else if (latest.sugarLevel < 70) {
        newAlerts.push({
          type: "warning",
          title: "Low Blood Sugar",
          message: `Sugar level: ${latest.sugarLevel} - Below normal range`,
          icon: <MonitorHeart />,
        });
      }
    }

    if (latest.heartRate) {
      if (latest.heartRate > 100) {
        newAlerts.push({
          type: "warning",
          title: "Elevated Heart Rate",
          message: `Heart rate: ${latest.heartRate} bpm - Above normal range`,
          icon: <Speed />,
        });
      } else if (latest.heartRate < 60) {
        newAlerts.push({
          type: "info",
          title: "Low Heart Rate",
          message: `Heart rate: ${latest.heartRate} bpm - Below average`,
          icon: <Speed />,
        });
      }
    }

    if (latest.sleepHours && latest.sleepHours < 7) {
      newAlerts.push({
        type: "info",
        title: "Sleep Reminder",
        message: `Sleep: ${latest.sleepHours}h - Aim for 7-9 hours`,
        icon: <Bedtime />,
      });
    }

    if (latest.waterIntake && latest.waterIntake < 6) {
      newAlerts.push({
        type: "info",
        title: "Water Intake",
        message: `Water: ${latest.waterIntake} glasses - Try to reach 8-10 glasses`,
        icon: <WaterDrop />,
      });
    }

    setAlerts(newAlerts);
  };

  const latestLog = logs.length > 0 ? logs[0] : null;

  const getVitalRiskDetails = (log) => {
    const risks = [];
    
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

  // Calculate averages
  const avgSleep = logs.length > 0 
    ? (logs.reduce((acc, log) => acc + (log.sleepHours || 0), 0) / logs.length).toFixed(1)
    : "—";

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
      {/* Floating Blobs - Same as Landing */}
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

        {/* Alerts Section - Styled like landing page chips */}
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

        {/* Stats Cards - With landing page aesthetic */}
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

        {/* Recent Health Logs Section */}
        <Fade in timeout={1600}>
          <Box sx={{ mb: 5 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
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
              // Empty State with landing page aesthetic
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
              // Table with landing page styling
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
                      <TableCell sx={{ color: "#ac4e7a", fontWeight: 600, fontFamily: "'Playfair Display', serif", borderBottom: "1px solid rgba(255,158,181,0.2)" }}>Risk</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {logs.map((log) => {
                      const vitalRisks = getVitalRiskDetails(log);
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
            )}
          </Box>
        </Fade>

        {/* Baby Redirect Card - With landing page aesthetic */}
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

        {/* Logout Button - Styled consistently */}
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

// Helper function for floating elements (same as landing)
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

export default MotherDashboard;