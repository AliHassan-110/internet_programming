import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Box, Typography } from '@mui/material';
import axios from 'axios';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import useAuth from '../hooks/useAuth';

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated,setIsAuthenticated } = useAuth();
  console.log(isAuthenticated);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      // navigate('/admin');
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/login', formData);
      if (response.data && response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response?.data?.user));
        console.log("Setting is Authenticated")
        setIsAuthenticated(true)
        toastr.success('Login successful!');
       
        navigate('/admin');
        window.location.reload();
      } else {
        toastr.error('Invalid login response.');
      }
    } catch (error) {
      toastr.error('Login failed. Please check your credentials.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={10} p={4} boxShadow={3}>
        <Typography variant="h5" gutterBottom>
          Admin Login
        </Typography>
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogin}
        >
          Login
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
