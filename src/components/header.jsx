// src/components/Header.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Header = () => {
  const navigate = useNavigate();
  const userL=localStorage.getItem('user')
  const user = JSON.parse(userL); // Assuming user info is stored here

  const handleLogout =  () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user'); // Clear user data
    toast.success('Logged out');
    window.location.href = "/login";
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">Admin Panel</Typography>

        {user ? (
          <Box display="flex" alignItems="center" gap={2}>
            <Typography>{user.name} ({user.email})</Typography>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        ) : (
          <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
