import { Box, Container, Grid, Typography, Button, IconButton, Divider } from "@mui/material";
import { Favorite, Spa, Facebook, Instagram, Pinterest, Twitter } from "@mui/icons-material";

function Footer() {
  return (
    <Box
      sx={{
        background: "rgba(245, 230, 240, 0.8)",
        backdropFilter: "blur(15px)",
        borderTop: "2px solid rgba(255,210,230,0.5)",
        width: "100%",
      }}
    >
      <Container sx={{ py: 6 }}>
        <Typography
          variant="body2"
          align="center"
          sx={{
            color: "#a57d92",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          Crafted with infinite care & love 
          <Favorite sx={{ fontSize: 16, color: "#ff6b95", mx: 0.5 }} /> 
          © 2026 MamaBabyBud. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;