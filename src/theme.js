import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#e91e63", // soft pink
    },
    secondary: {
      main: "#f8bbd0", // pastel blush
    },
    background: {
      default: "#fff5f8",
    },
  },
  shape: {
    borderRadius: 20,
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
});

export default theme;