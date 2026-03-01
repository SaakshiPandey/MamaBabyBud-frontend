import { useEffect, useState, useContext } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Box
} from "@mui/material";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function MotherDashboard() {
  const [logs, setLogs] = useState([]);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const { data } = await API.get("/mother");
      setLogs(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const latestLog = logs.length > 0 ? logs[0] : null;

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" mt={4}>
        <Typography variant="h4">Mother Dashboard</Typography>
        <Button variant="outlined" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} mt={2}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Entries</Typography>
              <Typography variant="h4">{logs.length}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Latest Risk Score</Typography>
              <Typography variant="h4">
                {latestLog ? latestLog.riskScore : "N/A"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Latest BP</Typography>
              <Typography variant="h6">
                {latestLog
                  ? `${latestLog.systolic}/${latestLog.diastolic}`
                  : "N/A"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Logs Table */}
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Recent Health Logs
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>BP</TableCell>
              <TableCell>Weight</TableCell>
              <TableCell>Sugar</TableCell>
              <TableCell>Sleep</TableCell>
              <TableCell>Risk Score</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {logs.map((log) => (
              <TableRow key={log._id}>
                <TableCell>
                  {new Date(log.date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {log.systolic}/{log.diastolic}
                </TableCell>
                <TableCell>{log.weight} kg</TableCell>
                <TableCell>{log.sugarLevel}</TableCell>
                <TableCell>{log.sleepHours} hrs</TableCell>
                <TableCell>{log.riskScore}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Container>
  );
}

export default MotherDashboard;