import React, { useState, useEffect, useRef } from 'react';
import {
  Container, Typography, Box, Button,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../components/header';
import API from '../api/api';
import useAuth from '../hooks/useAuth';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    start_date: '',
    end_date: '',
  });
  const [editId, setEditId] = useState(null);
  const token = localStorage.getItem('access_token');
  const {isAuthenticated}=useAuth()
  const hasFetched = useRef(false);

  useEffect(() => {
    if ( !token ) {
      toast.error("You are not authenticated!");
      navigate('/');
      return;
    }

    if (!hasFetched.current) {
      fetchEvents();
      hasFetched.current = true;
    }
  }, [navigate, token]);

  const fetchEvents = async () => {
    try {
      const response = await API.get('/get-events', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status) {
        setEvents(response.data.data);
        toast.success('Events fetched successfully.');
      } else {
        toast.error('Failed to fetch events.');
      }
    } catch (error) {
      toast.error('Failed to fetch events: ' + error.message);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editId) {
        await API.post(`/edit-event/${editId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!hasFetched.current) {
          toast.success('Event updated successfully!');
          hasFetched.current = true;
        }
      } else {
        await API.post('/create-event', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!hasFetched.current) {
          toast.success('Event created successfully!');
          hasFetched.current = true;
        }
      }
      setFormData({ name: '', description: '', type: '', start_date: '', end_date: '' });
      setEditId(null);
      setModalOpen(false);
      fetchEvents();
    } catch (error) {
      toast.error('Failed to save event.' + error);
    }
  };

  const handleEdit = (event) => {
    setFormData(event);
    setEditId(event.id);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/delete-event/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Event deleted successfully!');
      fetchEvents();
    } catch (error) {
      toast.error('Failed to delete event.');
    }
  };

  return (
    <>
      <Header />
      <Container>
        <ToastContainer />
        <Box my={4}>
          <Typography variant="h4" gutterBottom>
            Admin Panel - Event Management
          </Typography>

          <Button variant="contained" color="primary" onClick={() => {
            setFormData({ name: '', description: '', type: '', start_date: '', end_date: '' });
            setEditId(null);
            setModalOpen(true);
          }}>
            Create Event
          </Button>

          <TableContainer component={Paper} sx={{ marginTop: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>{event.name}</TableCell>
                    <TableCell>{event.description}</TableCell>
                    <TableCell>{event.type}</TableCell>
                    <TableCell>{event.start_date}</TableCell>
                    <TableCell>{event.end_date}</TableCell>
                    <TableCell >
                    <Container sx={{display:"flex", gap:"6px"}}>
                        <Button color="primary" variant="contained" onClick={() => handleEdit(event)}>Edit</Button>
                        <Button color="error" variant="contained" onClick={() => handleDelete(event.id)}>Delete</Button>
                      </Container>
                        </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
            <DialogTitle>{editId ? 'Edit Event' : 'Create Event'}</DialogTitle>
            <DialogContent>
              <TextField label="Name" fullWidth margin="normal" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              <TextField label="Description" fullWidth margin="normal" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              <TextField label="Type" fullWidth margin="normal" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} />
              <TextField label="Start Date" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} />
              <TextField label="End Date" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} variant="contained" color="primary">
                {editId ? 'Update' : 'Create'}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Container>
    </>
  );
};

export default AdminPanel;
