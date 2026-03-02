import { Box } from "@mui/material";

function SoftBackground({ children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(135deg, #ffe4ec 0%, #f3e5f5 40%, #e3f2fd 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Floating Glow Blobs */}
      <Box sx={blob("#f8bbd0", "-120px", "-120px")} />
      <Box sx={blob("#e1bee7", "80%", "-100px")} />
      <Box sx={blob("#bbdefb", "50%", "80%")} />

      {children}
    </Box>
  );
}

const blob = (color, left, top) => ({
  position: "absolute",
  width: "400px",
  height: "400px",
  background: color,
  borderRadius: "50%",
  filter: "blur(140px)",
  left,
  top,
  opacity: 0.6,
});

export default SoftBackground;