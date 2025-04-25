import React, { useEffect, useState, useRef } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  CssBaseline,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Stack
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API from '../api/api';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [eventTypes, setEventTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const abortControllerRef = useRef(null);
  const debounceTimerRef = useRef(null);

  const fetchPublicEvents = async () => {
    try {
      setLoading(true);
      const response = await API.get('/get-events');
      if (response.data.status) {
        setEvents(response.data.data);
      } else {
        toast.error('Failed to load events.');
      }
    } catch (error) {
      toast.error('Error fetching events: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchEventTypes = async () => {
    try {
      const response = await API.get('/event-types');
      if (response.data.status) {
        setEventTypes(response.data.types);
      }
    } catch (error) {
      toast.error('Failed to fetch event types');
    }
  };

  const fetchEventsByType = async (type) => {
    try {
      setLoading(true);
      const response = await API.post('/search-events-by-type', { type });
      if (response.data.status) {
        setEvents(response.data.events);
      } else {
        setEvents([]);
        toast.info('No events found for selected type');
      }
    } catch (error) {
      toast.error('Error filtering events: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchEventsByDate = async (start, end) => {
    try {
      setLoading(true);
      const response = await API.post('/search-events-by-date', { start_date: start, end_date: end });
      if (response.data.status) {
        setEvents(response.data.events);
      } else {
        setEvents([]);
        toast.info('No events found in the selected date range');
      }
    } catch (error) {
      toast.error('Date filter error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchTerm(query);
    setSelectedType('');
    setStartDate('');
    setEndDate('');
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(() => {
      searchEvents(query);
    }, 500);
  };

  const searchEvents = async (query) => {
    if (!query) return fetchPublicEvents();

    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      const response = await API.post(
        '/search-events',
        { name: query },
        { signal: abortControllerRef.current.signal }
      );

      if (response.data.status) {
        setEvents(response.data.events || []);
      } else {
        setEvents([]);
        toast.info('No events found');
      }
    } catch (error) {
      if (error.name !== 'CanceledError') {
        toast.error('Search error: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
    if (type === '') {
      fetchPublicEvents();
    } else {
      fetchEventsByType(type);
    }
  };

  const handleDateFilter = () => {
    if (!startDate || !endDate) {
      toast.warn('Please select both start and end dates');
    } else if (new Date(endDate) < new Date(startDate)) {
      toast.warn('End date cannot be earlier than start date');
    } else {
      setSearchTerm('');
      setSelectedType('');
      fetchEventsByDate(startDate, endDate);
    }
  };

  useEffect(() => {
    fetchPublicEvents();
    fetchEventTypes();
  }, []);

  return (
    <>
      <CssBaseline />
      <ToastContainer />

      <Box sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', py: 8, color: 'white', textAlign: 'center' }}>
        <Container>
          <Typography variant="h3" gutterBottom>Welcome to Eventify!</Typography>
          <Typography variant="h6">Discover upcoming events and never miss a moment.</Typography>
        </Container>
      </Box>

      <Container sx={{ mt: 6, mb: 6 }}>
        <Typography variant="h4" gutterBottom textAlign="center">Upcoming Events</Typography>

        <Stack spacing={3} mb={5} alignItems="center">
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%', maxWidth: 800 }}>
            <TextField
              label="Search by name..."
              variant="outlined"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Event Type</InputLabel>
              <Select
                value={selectedType}
                label="Event Type"
                onChange={(e) => handleTypeChange(e.target.value)}
              >
                <MenuItem value="">
                  <em>All Types</em>
                </MenuItem>
                {eventTypes.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Stack spacing={2} alignItems="center" justifyContent="center" width="100%">
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" alignItems="center">
              <TextField
                type="date"
                label="Start Date"
                InputLabelProps={{ shrink: true }}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                sx={{ maxWidth: 200 }}
              />

              <TextField
                type="date"
                label="End Date"
                InputLabelProps={{ shrink: true }}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                sx={{ maxWidth: 200 }}
              />

              <Button variant="contained" onClick={handleDateFilter} sx={{ minWidth: 150, height: 'fit-content' }}>
                Filter by Date
              </Button>
            </Stack>
          </Stack>
        </Stack>

        {loading ? (
          <Box textAlign="center" mt={4}><CircularProgress /></Box>
        ) : (
          events.length > 0 ? (
            <Grid container spacing={4}>
              {events.map((event) => (
                <Grid item xs={12} sm={6} md={4} key={event.id}>
                  <Card elevation={6} sx={{ borderRadius: 3, p: 2, transition: '0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: 6 } }}>
                    <CardContent>
                      <Typography variant="h5" gutterBottom>🎉 {event.name}</Typography>
                      <Typography variant="body2" gutterBottom sx={{ fontStyle: 'italic' }}>{event.description}</Typography>
                      <Box mt={2}>
                        <Typography variant="body2"><strong>📌 Type:</strong> {event.type}</Typography>
                        <Typography variant="body2"><strong>📅 Start:</strong> {new Date(event.start_date).toLocaleDateString()}</Typography>
                        <Typography variant="body2"><strong>⏳ End:</strong> {new Date(event.end_date).toLocaleDateString()}</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box textAlign="center" mt={5}>
              <img
                src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
                alt="No events"
                style={{ maxWidth: '180px', marginBottom: '1rem' }}
              />
              <Typography variant="h6" color="textSecondary">Oops! No events match your criteria.</Typography>
            </Box>
          )
        )}
      </Container>
    </>
  );
};

export default Home;
