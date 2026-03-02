import { AppBar, Toolbar, Typography, Button, Box, Avatar } from "@mui/material";
import { Spa, Favorite } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Change navbar style on scroll
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <AppBar
      position="fixed"
      elevation={scrolled ? 4 : 0}
      sx={{
        background: scrolled 
          ? "rgba(255, 245, 250, 0.95)" 
          : "rgba(255, 245, 250, 0.7)",
        backdropFilter: "blur(20px)",
        borderBottom: "2px solid rgba(255,210,230,0.5)",
        transition: "all 0.3s ease",
      }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 6 }, py: 1 }}>
        {/* Logo and Brand */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flexGrow: 1,
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          <Avatar
            sx={{
              width: 48,
              height: 48,
              background: "linear-gradient(135deg, #ff9eb5, #ff6b95)",
              boxShadow: "0 4px 15px rgba(255,107,149,0.3)",
            }}
          >
            <Spa sx={{ fontSize: 28, color: "white" }} />
          </Avatar>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 600,
                background: "linear-gradient(45deg, #b3406c, #8b4c7c)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "0.5px",
              }}
            >
              MamaBabyBud
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "#a55d7e",
                display: { xs: "none", sm: "block" },
              }}
            >
              Nurturing Beginnings, Cherished Moments
            </Typography>
          </Box>
        </Box>

        {/* Navigation Links */}
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Button
            onClick={() => navigate("/")}
            sx={{
              color: location.pathname === "/" ? "#ff6b95" : "#7a4f6c",
              borderRadius: 20,
              px: 2,
              fontWeight: location.pathname === "/" ? 600 : 400,
              "&:hover": {
                background: "rgba(255,210,230,0.5)",
              },
            }}
          >
            Home
          </Button>
          
          <Button
            onClick={() => navigate("/login")}
            sx={{
                color: location.pathname === "/login" ? "#ff6b95" : "#7a4f6c",
                borderRadius: 20,
                px: 2,
                fontWeight: location.pathname === "/login" ? 600 : 400,
                "&:hover": {
                background: "rgba(255,210,230,0.5)",
                },
            }}
            >
            Login
            </Button>
          <Button
            variant="contained"
            sx={{
              borderRadius: 30,
              px: 3,
              py: 1,
              background: "linear-gradient(45deg, #ff8da1, #c45a7a)",
              boxShadow: "0 8px 20px rgba(255,141,161,0.3)",
              "&:hover": {
                background: "linear-gradient(45deg, #ff7a91, #b34b6b)",
                transform: "scale(1.02)",
              },
              transition: "all 0.3s ease",
            }}
            onClick={() => navigate("/register")}
            endIcon={<Favorite />}
          >
            Join Our Circle
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;