import React, { useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, TextField, Button, Box, Fade, Avatar, Divider } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const AdminLogin = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://192.168.2.179:5000/api/admin/login', { password });
      if (res.data.success) {
        onLogin();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Hata!');
    }
    setLoading(false);
  };

  return (
    <Fade in timeout={700}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '70vh' }}>
        <Card sx={{
          maxWidth: 420,
          width: '100%',
          borderRadius: 5,
          boxShadow: 8,
          background: 'linear-gradient(135deg, #1a237e 60%, #00bfae 100%)',
          color: '#fff',
          p: 2,
          mb: 4
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: '#fff', color: '#1a237e', width: 64, height: 64, mb: 1, boxShadow: 2 }}>
                <AdminPanelSettingsIcon sx={{ fontSize: 38 }} />
              </Avatar>
              <Typography variant="h4" fontWeight={700} gutterBottom sx={{ letterSpacing: 1 }}>
                Yönetici Girişi
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#e0f7fa', mb: 2, textAlign: 'center' }}>
                Sisteme erişmek için şifrenizi girin.<br />
                <span style={{ fontSize: 13, color: '#b2ebf2' }}>Yalnızca yetkililer için.</span>
              </Typography>
            </Box>
            <form onSubmit={handleSubmit} autoComplete="off">
              <TextField
                label="Şifre"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                fullWidth
                variant="filled"
                sx={{ mb: 2, background: 'rgba(255,255,255,0.95)', borderRadius: 2 }}
                InputProps={{ style: { color: '#1a237e', fontWeight: 600 } }}
                InputLabelProps={{ style: { color: '#1a237e' } }}
              />
              <Button
                type="submit"
                fullWidth
                size="large"
                variant="contained"
                sx={{
                  mt: 1,
                  py: 1.5,
                  fontWeight: 700,
                  fontSize: 18,
                  background: 'linear-gradient(90deg, #1a237e 0%, #00bfae 100%)',
                  boxShadow: 4,
                  borderRadius: 3,
                  transition: '0.2s',
                  '&:hover': { background: 'linear-gradient(90deg, #00bfae 0%, #1a237e 100%)' }
                }}
                disabled={loading}
                endIcon={<LockIcon />}
              >
                {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
              </Button>
            </form>
            {error && (
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ color: '#ffeb3b', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <ErrorOutlineIcon sx={{ fontSize: 28 }} /> {error}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Fade>
  );
};

export default AdminLogin; 