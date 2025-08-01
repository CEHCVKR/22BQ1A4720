import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert,
  Snackbar,
  InputAdornment,
} from '@mui/material';
import { 
  AddCircle as AddCircleIcon, 
  RemoveCircle as RemoveCircleIcon,
  Link as LinkIcon,
  Schedule as ScheduleIcon,
  Security as SecurityIcon
} from '@mui/icons-material';

// Import the context hook, data type, and utility functions
import { useUrlContext, type ShortenedUrl } from '../context/UrlContext';
import { generateShortcode } from '../utils/generateShortcode';
import { Log } from "../../../Logging Middleware/logger";

// Define the shape of a single input row
type UrlInput = {
  longURL: string;
  customShortcode: string;
  validity: string;
};

// URL validation function
const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return url.startsWith('http://') || url.startsWith('https://');
  } catch {
    return false;
  }
};

export default function URLShortenerPage() {
  const [inputs, setInputs] = useState<UrlInput[]>([
    { longURL: '', customShortcode: '', validity: '30' },
  ]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Get the 'addUrls' function from our global context
  const { addUrls, urls } = useUrlContext();

  const handleInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newInputs = [...inputs];
    newInputs[index][event.target.name as keyof UrlInput] = event.target.value;
    setInputs(newInputs);
  };

  const handleAddRow = () => {
    if (inputs.length < 5) {
      setInputs([...inputs, { longURL: '', customShortcode: '', validity: '30' }]);
    }
  };

  const handleRemoveRow = (index: number) => {
    if (inputs.length > 1) {
      const newInputs = [...inputs];
      newInputs.splice(index, 1);
      setInputs(newInputs);
    }
  };

  const checkShortcodeExists = (shortcode: string): boolean => {
    return urls.some(url => url.shortCode === shortcode);
  };

  // Updated submission logic
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    
    try {
      const newUrls: ShortenedUrl[] = [];
      const errors: string[] = [];

      for (const [index, input] of inputs.entries()) {
        // 1. Validation
        if (!input.longURL.trim()) {
          errors.push(`Row ${index + 1}: URL is required`);
          continue;
        }

        if (!isValidURL(input.longURL)) {
          errors.push(`Row ${index + 1}: Invalid URL format. Please include http:// or https://`);
          continue;
        }

        // 2. Generate or validate shortcode
        let shortCode = input.customShortcode?.trim();
        if (shortCode) {
          if (shortCode.length < 3) {
            errors.push(`Row ${index + 1}: Custom shortcode must be at least 3 characters`);
            continue;
          }
          if (checkShortcodeExists(shortCode)) {
            errors.push(`Row ${index + 1}: Shortcode '${shortCode}' already exists`);
            continue;
          }
        } else {
          // Generate unique shortcode
          do {
            shortCode = generateShortcode();
          } while (checkShortcodeExists(shortCode));
        }

        // 3. Calculate expiry date
        const validityMinutes = parseInt(input.validity, 10);
        if (isNaN(validityMinutes) || validityMinutes < 1) {
          errors.push(`Row ${index + 1}: Validity must be a positive number`);
          continue;
        }

        const now = new Date();
        const expiresAt = new Date(now.getTime() + validityMinutes * 60 * 1000);

        // 4. Construct the final data object
        newUrls.push({
          id: shortCode,
          longURL: input.longURL,
          shortCode,
          createdAt: now,
          expiresAt,
          clicks: [],
        });
      }

      if (errors.length > 0) {
        setSnackbar({
          open: true,
          message: errors.join('; '),
          severity: 'error'
        });
        Log('frontend', 'warn', 'component', `Validation errors: ${errors.join('; ')}`);
        return;
      }

      if (newUrls.length === 0) {
        setSnackbar({
          open: true,
          message: 'No valid URLs to shorten',
          severity: 'warning'
        });
        return;
      }

      // 5. Add the newly created URLs to the global state
      addUrls(newUrls);
      Log('frontend', 'info', 'component', `${newUrls.length} URLs successfully shortened.`);
      
      // 6. Clear the form for the next submission
      setInputs([{ longURL: '', customShortcode: '', validity: '30' }]);
      
      setSnackbar({
        open: true,
        message: `${newUrls.length} URL${newUrls.length > 1 ? 's' : ''} successfully shortened!`,
        severity: 'success'
      });

    } catch (error) {
      console.error('Error shortening URLs:', error);
      setSnackbar({
        open: true,
        message: 'An error occurred while shortening URLs',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ 
            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 800,
            mb: 2
          }}
        >
          Shorten Your URLs
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary"
          sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}
        >
          Create short, memorable links that are easy to share. Track clicks and manage your links with advanced analytics.
        </Typography>
      </Box>

      {/* Features Cards */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
            <CardContent>
              <LinkIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>Custom Short Links</Typography>
              <Typography variant="body2" color="text.secondary">
                Create branded short links with custom aliases
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
            <CardContent>
              <ScheduleIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>Expiration Control</Typography>
              <Typography variant="body2" color="text.secondary">
                Set custom expiration times for your links
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
            <CardContent>
              <SecurityIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>Click Analytics</Typography>
              <Typography variant="body2" color="text.secondary">
                Track clicks and analyze link performance
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* URL Shortening Form */}
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
          Create Short Links
        </Typography>

        <form onSubmit={handleSubmit}>
          {inputs.map((input, index) => (
            <Paper
              key={index}
              variant="outlined"
              sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: 'grey.50' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Chip 
                  label={`Link ${index + 1}`} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                />
                {inputs.length > 1 && (
                  <IconButton
                    onClick={() => handleRemoveRow(index)}
                    sx={{ ml: 'auto' }}
                    color="error"
                  >
                    <RemoveCircleIcon />
                  </IconButton>
                )}
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="longURL"
                    label="Original URL"
                    placeholder="https://example.com/very-long-url"
                    value={input.longURL}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange(index, e)
                    }
                    variant="outlined"
                    fullWidth
                    required
                    error={input.longURL && !isValidURL(input.longURL)}
                    helperText={
                      input.longURL && !isValidURL(input.longURL)
                        ? "Please enter a valid URL starting with http:// or https://"
                        : ""
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LinkIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="customShortcode"
                    label="Custom Shortcode (Optional)"
                    placeholder="my-link"
                    value={input.customShortcode}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange(index, e)
                    }
                    variant="outlined"
                    fullWidth
                    helperText="Leave empty for auto-generated code"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="validity"
                    label="Validity (minutes)"
                    value={input.validity}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange(index, e)
                    }
                    variant="outlined"
                    type="number"
                    fullWidth
                    InputProps={{
                      inputProps: { min: 1, max: 525600 } // Max 1 year
                    }}
                    helperText="Link expiration time in minutes"
                  />
                </Grid>
              </Grid>
            </Paper>
          ))}

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              startIcon={<AddCircleIcon />}
              onClick={handleAddRow}
              disabled={inputs.length >= 5}
              variant="outlined"
              size="large"
            >
              Add Another URL
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              size="large"
              disabled={loading}
              sx={{ minWidth: 120 }}
            >
              {loading ? 'Shortening...' : 'Shorten URLs'}
            </Button>
          </Box>
        </form>
      </Paper>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}