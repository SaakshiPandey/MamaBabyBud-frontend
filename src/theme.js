import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#d81b60" },
    secondary: { main: "#f8bbd0" },
    background: { default: "#fff8fb" }
  },
  shape: { borderRadius: 24 },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    h3: {
      fontFamily: "'Playfair Display', serif",
      fontWeight: 600,
    },
    h4: {
      fontFamily: "'Playfair Display', serif",
      fontWeight: 600,
    },
  }
});

export default theme;