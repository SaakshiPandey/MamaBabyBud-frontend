import {
  Container,
  Grid,
  Box,
  Avatar,
  Chip,
  Button,
  Typography,
  Fade,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Favorite,
  Spa,
  ChildCare,
  ArrowForward,
} from "@mui/icons-material";

function Landing() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(145deg, #fff5f8 0%, #f9f0f5 30%, #f0e9fa 70%, #e8f0fe 100%)",
        pt: { xs: '80px', md: '90px' }, // Add padding top to account for fixed navbar
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

      {/* HERO SECTION */}
      <Container sx={{ py: { xs: 6, md: 10 } }}>
        <Fade in timeout={1000}>
          <Grid container spacing={4} alignItems="center">
            {/* Left Content */}
            <Grid item xs={12} md={7}>
              <Box sx={{ position: "relative" }}>
                {/* Decorative Elements */}
                <Box
                  sx={{
                    position: "absolute",
                    top: -30,
                    left: -30,
                    width: 150,
                    height: 150,
                    background: "radial-gradient(circle, #ffd9e6 0%, transparent 70%)",
                    borderRadius: "50%",
                    opacity: 0.6,
                    zIndex: 0,
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: -20,
                    right: 20,
                    width: 120,
                    height: 120,
                    background: "radial-gradient(circle, #e3d0ff 0%, transparent 70%)",
                    borderRadius: "50%",
                    opacity: 0.6,
                    zIndex: 0,
                  }}
                />

                <Typography
                  variant="h1"
                  sx={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 700,
                    fontSize: { xs: "2.5rem", md: "3.8rem" },
                    lineHeight: 1.2,
                    background: "linear-gradient(135deg, #ac4e7a, #7d4b7a, #5d6d9e)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mb: 2,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  Gentle Care for
                  <br />
                  Every Mother & Baby
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    color: "#8b6b7a",
                    mb: 4,
                    maxWidth: "550px",
                    fontSize: { xs: "1.1rem", md: "1.3rem" },
                    lineHeight: 1.6,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  A beautifully designed health tracking experience, 
                  crafted with love for your motherhood journey.
                </Typography>

                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 4, position: "relative", zIndex: 1 }}>
                  <Button
                    size="large"
                    variant="contained"
                    sx={{
                      px: 5,
                      py: 1.8,
                      borderRadius: 40,
                      background: "linear-gradient(45deg, #ff9eb5, #ff6b95)",
                      boxShadow: "0 15px 35px rgba(255,107,149,0.4)",
                      fontSize: "1.1rem",
                      "&:hover": {
                        transform: "translateY(-5px) scale(1.02)",
                        boxShadow: "0 20px 40px rgba(255,107,149,0.5)",
                      },
                      transition: "all 0.3s ease",
                    }}
                    onClick={() => navigate("/register")}
                    endIcon={<ArrowForward />}
                  >
                    Begin Your Journey
                  </Button>
                  
                  <Button
                    size="large"
                    variant="outlined"
                    sx={{
                      px: 5,
                      py: 1.8,
                      borderRadius: 40,
                      borderColor: "#ff9eb5",
                      color: "#ac4e7a",
                      borderWidth: 2,
                      fontSize: "1.1rem",
                      "&:hover": {
                        borderColor: "#ff6b95",
                        background: "rgba(255,158,181,0.1)",
                        transform: "translateY(-5px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                    onClick={() => navigate("/learn-more")}
                  >
                    Learn More
                  </Button>
                </Box>

                {/* Trust Indicators */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 3,
                    flexWrap: "wrap",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <Chip
                    icon={<Favorite sx={{ color: "#ff6b95 !important", fontSize: 18 }} />}
                    label="10,000+ Happy Mothers"
                    sx={{
                      borderRadius: 20,
                      background: "rgba(255,255,255,0.6)",
                      backdropFilter: "blur(5px)",
                      color: "#ac4e7a",
                      height: 36,
                      "& .MuiChip-label": { px: 2 },
                    }}
                  />
                  <Chip
                    icon={<Spa sx={{ color: "#9b7cb6 !important", fontSize: 18 }} />}
                    label="Expert-Approved"
                    sx={{
                      borderRadius: 20,
                      background: "rgba(255,255,255,0.6)",
                      backdropFilter: "blur(5px)",
                      color: "#6b4e7a",
                      height: 36,
                      "& .MuiChip-label": { px: 2 },
                    }}
                  />
                  <Chip
                    icon={<ChildCare sx={{ color: "#7a9ec2 !important", fontSize: 18 }} />}
                    label="24/7 Support"
                    sx={{
                      borderRadius: 20,
                      background: "rgba(255,255,255,0.6)",
                      backdropFilter: "blur(5px)",
                      color: "#4f6b8a",
                      height: 36,
                      "& .MuiChip-label": { px: 2 },
                    }}
                  />
                </Box>
              </Box>
            </Grid>

            {/* Right Content - Illustration */}
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* Decorative Circles */}
                <Box
                  sx={{
                    width: { xs: 280, md: 380 },
                    height: { xs: 280, md: 380 },
                    borderRadius: "50%",
                    background: "radial-gradient(circle, #ffd4e4 0%, #ffe9f0 50%, transparent 70%)",
                    position: "relative",
                    animation: "float 6s infinite ease-in-out",
                  }}
                >
                  {/* Mother and Baby Illustration using Icons */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Avatar
                        sx={{
                          width: 70,
                          height: 70,
                          bgcolor: "#ffb6c1",
                          boxShadow: "0 10px 25px rgba(255,182,193,0.5)",
                        }}
                      >
                        <Spa sx={{ fontSize: 40, color: "white" }} />
                      </Avatar>
                      <Avatar
                        sx={{
                          width: 70,
                          height: 70,
                          bgcolor: "#d4b7e8",
                          boxShadow: "0 10px 25px rgba(212,183,232,0.5)",
                        }}
                      >
                        <ChildCare sx={{ fontSize: 40, color: "white" }} />
                      </Avatar>
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#ac4e7a",
                        fontFamily: "'Playfair Display', serif",
                        textAlign: "center",
                        mt: 2,
                      }}
                    >
                      Together in
                      <br />
                      every moment
                    </Typography>
                  </Box>
                </Box>

                {/* Floating Hearts */}
                <Box
                  sx={{
                    position: "absolute",
                    top: "10%",
                    right: "10%",
                    fontSize: "2rem",
                    animation: "float 5s infinite ease-in-out",
                  }}
                >
                  ❤️
                </Box>
                <Box
                  sx={{
                    position: "absolute",
                    bottom: "15%",
                    left: "5%",
                    fontSize: "2rem",
                    animation: "float 4s infinite ease-in-out reverse",
                  }}
                >
                  🌸
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Fade>
      </Container>

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

export default Landing;