import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Grid,
  Button,
  Alert,
  TextField,
  InputAdornment,
  Divider,
} from '@mui/material';
import { 
  Delete as DeleteIcon,
  Link as LinkIcon,
  OpenInNew as OpenInNewIcon,
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  Mouse as MouseIcon,
  FileCopy as FileCopyIcon,
} from '@mui/icons-material';
import { useUrlContext } from '../context/UrlContext';
import { useState } from 'react';

export default function StatisticsPage() {
  // Access the shortened URLs from the global context
  const { urls, deleteUrl } = useUrlContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedShortcode, setCopiedShortcode] = useState<string | null>(null);

  // Filter URLs based on search term
  const filteredUrls = urls.filter(url => 
    url.longURL.toLowerCase().includes(searchTerm.toLowerCase()) ||
    url.shortCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate statistics
  const totalUrls = urls.length;
  const totalClicks = urls.reduce((sum, url) => sum + url.clicks.length, 0);
  const activeUrls = urls.filter(url => new Date() <= url.expiresAt).length;
  const expiredUrls = totalUrls - activeUrls;

  const handleCopyShortcode = async (shortcode: string) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/${shortcode}`);
      setCopiedShortcode(shortcode);
      setTimeout(() => setCopiedShortcode(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleDeleteUrl = (urlId: string) => {
    if (window.confirm('Are you sure you want to delete this URL?')) {
      deleteUrl(urlId);
    }
  };

  const getStatusChip = (expiresAt: Date) => {
    const isExpired = new Date() > expiresAt;
    return (
      <Chip
        label={isExpired ? 'Expired' : 'Active'}
        color={isExpired ? 'error' : 'success'}
        variant="outlined"
        size="small"
      />
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
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
          URL Analytics
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Track performance and manage your shortened links
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <LinkIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {totalUrls}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total URLs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <MouseIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {totalClicks}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Clicks
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUpIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {activeUrls}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Links
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <ScheduleIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {expiredUrls}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Expired Links
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {urls.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <LinkIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No URLs shortened yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Start by creating your first short link to see analytics here.
          </Typography>
          <Button variant="contained" size="large" href="/">
            Create Short Link
          </Button>
        </Paper>
      ) : (
        <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
          {/* Search and Controls */}
          <Box sx={{ p: 3, bgcolor: 'grey.50' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search URLs or shortcodes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ bgcolor: 'white' }}
            />
          </Box>

          <Divider />

          {/* URLs Table */}
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Original URL</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Short Code</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Clicks</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Expires</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUrls.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography color="text.secondary">
                        {searchTerm ? 'No URLs match your search.' : 'No URLs found.'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUrls.map((url) => (
                    <TableRow
                      key={url.id}
                      sx={{ 
                        '&:hover': { bgcolor: 'grey.50' },
                        '&:last-child td, &:last-child th': { border: 0 }
                      }}
                    >
                      <TableCell
                        sx={{
                          maxWidth: '250px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <Tooltip title={url.longURL}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LinkIcon fontSize="small" color="action" />
                            {url.longURL}
                          </Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            {url.shortCode}
                          </Typography>
                          <Tooltip title={copiedShortcode === url.shortCode ? 'Copied!' : 'Copy link'}>
                            <IconButton
                              size="small"
                              onClick={() => handleCopyShortcode(url.shortCode)}
                              color={copiedShortcode === url.shortCode ? 'success' : 'default'}
                            >
                              <FileCopyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {getStatusChip(url.expiresAt)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={url.clicks.length}
                          variant="outlined"
                          size="small"
                          color={url.clicks.length > 0 ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(url.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(url.expiresAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Open original URL">
                            <IconButton
                              size="small"
                              onClick={() => window.open(url.longURL, '_blank')}
                              color="primary"
                            >
                              <OpenInNewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete URL">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteUrl(url.id)}
                              color="error"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredUrls.length > 0 && (
            <Box sx={{ p: 2, bgcolor: 'grey.50', textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Showing {filteredUrls.length} of {totalUrls} URLs
              </Typography>
            </Box>
          )}
        </Paper>
      )}

      {/* Info Alert */}
      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>Pro Tip:</strong> Click on the copy icon next to any short code to copy the full shortened URL to your clipboard.
        </Typography>
      </Alert>
    </Box>
  );
}