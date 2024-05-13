import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

const LoginPanel = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        onLogin(username, password);
    };

    return (
        <Box sx={{
            width: 300,
            position: 'fixed',
            right: 0,
            top: 0,
            height: '100vh',
            bgcolor: 'background.paper',
            p: 2,
            boxShadow: 3
        }}>
            <Typography variant="h6" sx={{ mb: 2 }}>User Login</Typography>
            <TextField
                label="Username"
                variant="outlined"
                fullWidth
                value={username}
                onChange={e => setUsername(e.target.value)}
                sx={{ mb: 2 }}
            />
            <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={e => setPassword(e.target.value)}
                sx={{ mb: 2 }}
            />
            <Button variant="contained" onClick={handleLogin} fullWidth>Login</Button>
        </Box>
    );
};

export default LoginPanel;
