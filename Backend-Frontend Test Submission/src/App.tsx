import { Routes, Route, Link } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Button, 
  Box,
  ThemeProvider,
  createTheme,
  CssBaseline
} from '@mui/material';
import { LinkRounded, BarChart } from '@mui/icons-material';
import URLShortenerPage from './pages/URLShortenerPage';
import StatisticsPage from './pages/StatisticsPage';
import RedirectPage from './pages/RedirectPage';
import './App.css';

// Create a modern theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb',
      light: '#60a5fa',
      dark: '#1d4ed8',
    },
    secondary: {
      main: '#7c3aed',
      light: '#a78bfa',
      dark: '#5b21b6',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          padding: '10px 24px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="static" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #e2e8f0' }}>
          <Container maxWidth="lg">
            <Toolbar sx={{ px: '0 !important' }}>
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                  flexGrow: 1, 
                  color: 'primary.main',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <LinkRounded />
                ShortLink Pro
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  component={Link}
                  to="/"
                  color="primary"
                  startIcon={<LinkRounded />}
                  sx={{ color: 'text.primary' }}
                >
                  Shorten URL
                </Button>
                <Button
                  component={Link}
                  to="/stats"
                  color="primary"
                  startIcon={<BarChart />}
                  sx={{ color: 'text.primary' }}
                >
                  Statistics
                </Button>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
        
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Routes>
            <Route path="/" element={<URLShortenerPage />} />
            <Route path="/stats" element={<StatisticsPage />} />
            <Route path="/:shortcode" element={<RedirectPage />} />
            <Route 
              path="/not-found" 
              element={
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h4" color="error" gutterBottom>
                    404: Link Not Found
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    The shortened URL you're looking for doesn't exist or has expired.
                  </Typography>
                  <Button 
                    component={Link} 
                    to="/" 
                    variant="contained" 
                    size="large"
                  >
                    Create New Link
                  </Button>
                </Box>
              } 
            />
          </Routes>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;